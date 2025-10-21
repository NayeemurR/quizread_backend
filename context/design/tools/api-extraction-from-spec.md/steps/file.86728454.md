---
timestamp: 'Mon Oct 20 2025 17:43:16 GMT-0400 (Eastern Daylight Time)'
parent: '[[../20251020_174316.ec5a3239.md]]'
content_id: 867284548320fd128030480317f55c28b28ac1987781d60485fc23b4b02b7c6b
---

# file: src/concepts/reading\_progress.ts

```typescript
import { Collection, Db } from "mongodb";
import { Empty, ID } from "@utils/types.ts";
import { freshID } from "@utils/database.ts";

// Collection prefix to ensure namespace separation
const PREFIX = "ReadingProgress" + ".";

// Generic types for the concept's external dependencies
type User = ID;
type Book = ID;

// Internal entity types, represented as IDs
type ReadingSession = ID;

/**
 * State: A set of ReadingSessions with user, book, progress, and timing information.
 */
interface ReadingSessionDoc {
  _id: ReadingSession;
  userId: User;
  bookId: Book;
  currentPage: number;
  totalPages: number;
  lastQuizPage: number;
  lastAnnotationPage: number;
  quizInterval: number;
  annotationInterval: number;
  startTime: Date;
  totalReadingTimeMinutes: number;
  isActive: boolean;
}

/**
 * @concept ReadingProgress
 * @purpose Track reading state and compute engagement triggers
 */
export default class ReadingProgressConcept {
  readingSessions: Collection<ReadingSessionDoc>;

  constructor(private readonly db: Db) {
    this.readingSessions = this.db.collection(PREFIX + "readingSessions");
  }

  /**
   * Action: Initializes a new reading session.
   * @requires totalPages > 0
   * @requires quizInterval > 0
   * @requires annotationInterval > 0
   * @effects Creates a session with currentPage=1 and isActive=true
   */
  async initializeProgress(
    {
      userId,
      bookId,
      totalPages,
      quizInterval,
      annotationInterval,
    }: {
      userId: User;
      bookId: Book;
      totalPages: number;
      quizInterval: number;
      annotationInterval: number;
    },
  ): Promise<{ sessionId: ReadingSession } | { error: string }> {
    if (totalPages <= 0) {
      return { error: "totalPages must be greater than 0" };
    }
    if (quizInterval <= 0) {
      return { error: "quizInterval must be greater than 0" };
    }
    if (annotationInterval <= 0) {
      return { error: "annotationInterval must be greater than 0" };
    }

    const sessionId = freshID() as ReadingSession;
    await this.readingSessions.insertOne({
      _id: sessionId,
      userId,
      bookId,
      currentPage: 1,
      totalPages,
      lastQuizPage: 0,
      lastAnnotationPage: 0,
      quizInterval,
      annotationInterval,
      startTime: new Date(),
      totalReadingTimeMinutes: 0,
      isActive: true,
    });

    return { sessionId };
  }

  /**
   * Action: Updates the current page in a reading session.
   * @requires Session must exist
   * @requires newPage > currentPage
   * @requires newPage <= totalPages
   * @effects Sets currentPage to newPage
   */
  async updateProgress(
    { sessionId, newPage }: { sessionId: ReadingSession; newPage: number },
  ): Promise<Empty | { error: string }> {
    const session = await this.readingSessions.findOne({ _id: sessionId });
    if (!session) {
      return { error: "Session not found" };
    }

    if (newPage <= session.currentPage) {
      return { error: "newPage must be greater than currentPage" };
    }
    if (newPage > session.totalPages) {
      return { error: "newPage cannot exceed totalPages" };
    }

    await this.readingSessions.updateOne(
      { _id: sessionId },
      { $set: { currentPage: newPage } },
    );

    return {};
  }

  /**
   * Action: Determines if a quiz should be triggered based on page progress.
   * @requires Session must exist
   * @effects Returns whether (currentPage - lastQuizPage) >= quizInterval
   */
  async triggerQuiz(
    { sessionId }: { sessionId: ReadingSession },
  ): Promise<{ shouldTrigger: boolean } | { error: string }> {
    const session = await this.readingSessions.findOne({ _id: sessionId });
    if (!session) {
      return { error: "Session not found" };
    }

    const shouldTrigger =
      (session.currentPage - session.lastQuizPage) >= session.quizInterval;
    return { shouldTrigger };
  }

  /**
   * Action: Determines if an annotation should be triggered based on page progress.
   * @requires Session must exist
   * @effects Returns whether (currentPage - lastAnnotationPage) >= annotationInterval
   */
  async triggerAnnotation(
    { sessionId }: { sessionId: ReadingSession },
  ): Promise<{ shouldTrigger: boolean } | { error: string }> {
    const session = await this.readingSessions.findOne({ _id: sessionId });
    if (!session) {
      return { error: "Session not found" };
    }

    const shouldTrigger = (session.currentPage - session.lastAnnotationPage) >=
      session.annotationInterval;
    return { shouldTrigger };
  }

  /**
   * Action: Records that a quiz was triggered at the current page.
   * @requires Session must exist
   * @effects Sets lastQuizPage to currentPage
   */
  async recordQuizTriggered(
    { sessionId }: { sessionId: ReadingSession },
  ): Promise<Empty | { error: string }> {
    const session = await this.readingSessions.findOne({ _id: sessionId });
    if (!session) {
      return { error: "Session not found" };
    }

    await this.readingSessions.updateOne(
      { _id: sessionId },
      { $set: { lastQuizPage: session.currentPage } },
    );

    return {};
  }

  /**
   * Action: Records that an annotation was triggered at the current page.
   * @requires Session must exist
   * @effects Sets lastAnnotationPage to currentPage
   */
  async recordAnnotationTriggered(
    { sessionId }: { sessionId: ReadingSession },
  ): Promise<Empty | { error: string }> {
    const session = await this.readingSessions.findOne({ _id: sessionId });
    if (!session) {
      return { error: "Session not found" };
    }

    await this.readingSessions.updateOne(
      { _id: sessionId },
      { $set: { lastAnnotationPage: session.currentPage } },
    );

    return {};
  }

  /**
   * Action: Pauses a reading session and records elapsed time.
   * @requires Session must exist and be active
   * @effects Sets isActive=false and increments totalReadingTimeMinutes by elapsed time
   */
  async pauseReading(
    { sessionId }: { sessionId: ReadingSession },
  ): Promise<Empty | { error: string }> {
    const session = await this.readingSessions.findOne({ _id: sessionId });
    if (!session) {
      return { error: "Session not found" };
    }

    if (!session.isActive) {
      return { error: "Session is not active" };
    }

    const elapsedMinutes = (Date.now() - session.startTime.getTime()) /
      (1000 * 60);
    const newTotalTime = session.totalReadingTimeMinutes + elapsedMinutes;

    await this.readingSessions.updateOne(
      { _id: sessionId },
      {
        $set: {
          isActive: false,
          totalReadingTimeMinutes: newTotalTime,
        },
      },
    );

    return {};
  }

  /**
   * Action: Resumes a reading session and resets the start time.
   * @requires Session must exist and be inactive
   * @effects Sets isActive=true and sets startTime to now
   */
  async resumeReading(
    { sessionId }: { sessionId: ReadingSession },
  ): Promise<Empty | { error: string }> {
    const session = await this.readingSessions.findOne({ _id: sessionId });
    if (!session) {
      return { error: "Session not found" };
    }

    if (session.isActive) {
      return { error: "Session is already active" };
    }

    await this.readingSessions.updateOne(
      { _id: sessionId },
      {
        $set: {
          isActive: true,
          startTime: new Date(),
        },
      },
    );

    return {};
  }

  /**
   * Query: Retrieves a reading session by its ID.
   */
  async _getReadingSession(
    { sessionId }: { sessionId: ReadingSession },
  ): Promise<ReadingSessionDoc | null> {
    return await this.readingSessions.findOne({ _id: sessionId });
  }

  /**
   * Query: Retrieves all reading sessions for a specific user.
   */
  async _getUserSessions(
    { userId }: { userId: User },
  ): Promise<ReadingSessionDoc[]> {
    return await this.readingSessions.find({ userId }).toArray();
  }

  /**
   * Query: Retrieves all reading sessions for a specific book.
   */
  async _getBookSessions(
    { bookId }: { bookId: Book },
  ): Promise<ReadingSessionDoc[]> {
    return await this.readingSessions.find({ bookId }).toArray();
  }

  /**
   * Query: Retrieves all active reading sessions.
   */
  async _getActiveSessions(): Promise<ReadingSessionDoc[]> {
    return await this.readingSessions.find({ isActive: true }).toArray();
  }
}

```

## UserAuthentication

Specification:
