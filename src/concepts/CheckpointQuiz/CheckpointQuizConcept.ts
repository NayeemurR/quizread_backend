import { Collection, Db } from "mongodb";
import { ID } from "@utils/types.ts";
import { freshID } from "@utils/database.ts";
import { GeminiLLM } from "@utils/gemini-llm.ts";
import { extractTextFromPageRange } from "@utils/pdf-text-extractor.ts";

// Collection prefix to ensure namespace separation
const PREFIX = "CheckpointQuiz" + ".";

// Generic types for the concept's external dependencies
type User = ID;

// Internal entity types, represented as IDs
type Quiz = ID;
type QuizAttempt = ID;

/**
 * State: A set of Quizzes with content, question, answers, and correct index.
 */
interface QuizDoc {
  _id: Quiz;
  content: string;
  question: string;
  answers: string[]; // length = 4
  correctIndex: number; // 0-based
  createdAt: Date;
}

/**
 * State: A set of QuizAttempts with user, quiz, selected answer, and correctness.
 */
interface QuizAttemptDoc {
  _id: QuizAttempt;
  userId: User;
  quizId: Quiz;
  selectedIndex: number;
  isCorrect: boolean;
  createdAt: Date;
}

/**
 * @concept CheckpointQuiz
 * @purpose Generate and evaluate short multiple-choice quizzes to reinforce active reading
 */
export default class CheckpointQuizConcept {
  quizzes: Collection<QuizDoc>;
  quizAttempts: Collection<QuizAttemptDoc>;
  private llm: GeminiLLM;

  constructor(private readonly db: Db) {
    this.quizzes = this.db.collection(PREFIX + "quizzes");
    this.quizAttempts = this.db.collection(PREFIX + "quizAttempts");

    // Initialize Gemini LLM
    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    this.llm = new GeminiLLM({ apiKey });
  }

  /**
   * Action: Creates a new quiz from content using Gemini LLM.
   * @requires content must not be empty
   * @effects A new quiz is created and the full quiz object is returned
   */
  async createQuiz(
    { content }: { content: string },
  ): Promise<{ quiz: QuizDoc } | { error: string }> {
    if (!content || content.trim().length === 0) {
      return { error: "Content text cannot be empty" };
    }

    // Sanitize and limit content length
    const sanitizedContent = content.slice(0, 2000);

    const prompt =
      `Generate a multiple-choice quiz question based on this content. 
Return a JSON object with:
- "question": A clear, concise question
- "answers": An array of exactly 4 answer options
- "correctIndex": The 0-based index of the correct answer

Content: ${sanitizedContent}`;

    try {
      const response = await this.llm.executeLLM(prompt);

      // Extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return { error: "No valid JSON found in LLM response" };
      }

      const quizData = JSON.parse(jsonMatch[0]);

      // Validate the response structure
      if (!quizData.question) {
        return { error: "Question is required" };
      }
      if (!Array.isArray(quizData.answers)) {
        return { error: "Answers must be an array" };
      }
      if (quizData.answers.length !== 4) {
        return { error: "Exactly 4 answers are required" };
      }
      if (typeof quizData.correctIndex !== "number") {
        return { error: "Correct index must be a number" };
      }
      if (quizData.correctIndex < 0 || quizData.correctIndex >= 4) {
        return { error: "Correct index must be between 0 and 3" };
      }

      const quizId = freshID() as Quiz;
      const quizDoc: QuizDoc = {
        _id: quizId,
        content: sanitizedContent,
        question: quizData.question,
        answers: quizData.answers,
        correctIndex: quizData.correctIndex,
        createdAt: new Date(),
      };

      await this.quizzes.insertOne(quizDoc);

      return { quiz: quizDoc };
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : String(error);
      return { error: `Failed to generate quiz: ${errorMessage}` };
    }
  }

  /**
   * Action: Submits a quiz answer and records the attempt.
   * @requires The quiz must exist
   * @requires selectedIndex must be between 0 and 3
   * @effects A new quiz attempt is recorded and correctness is returned
   */
  async submitQuizAnswer(
    { userId, quizId, selectedIndex }: {
      userId: User;
      quizId: Quiz;
      selectedIndex: number;
    },
  ): Promise<
    { attemptId: QuizAttempt; isCorrect: boolean } | { error: string }
  > {
    const quiz = await this.quizzes.findOne({ _id: quizId });
    if (!quiz) {
      return { error: "Quiz not found" };
    }

    if (selectedIndex < 0 || selectedIndex >= 4) {
      return { error: "Selected index must be between 0 and 3" };
    }

    const isCorrect = selectedIndex === quiz.correctIndex;
    const attemptId = freshID() as QuizAttempt;

    await this.quizAttempts.insertOne({
      _id: attemptId,
      userId,
      quizId,
      selectedIndex,
      isCorrect,
      createdAt: new Date(),
    });

    return { attemptId, isCorrect };
  }

  /**
   * Query: Retrieves a quiz by its ID.
   */
  async _getQuiz(
    { quizId }: { quizId: Quiz },
  ): Promise<QuizDoc | null> {
    return await this.quizzes.findOne({ _id: quizId });
  }

  /**
   * Query: Retrieves all attempts for a specific quiz.
   */
  async _getQuizAttempts(
    { quizId }: { quizId: Quiz },
  ): Promise<QuizAttemptDoc[]> {
    return await this.quizAttempts.find({ quizId }).toArray();
  }

  /**
   * Query: Retrieves all attempts by a specific user.
   */
  async _getUserAttempts(
    { userId }: { userId: User },
  ): Promise<QuizAttemptDoc[]> {
    return await this.quizAttempts.find({ userId }).toArray();
  }

  /**
   * Action: Extracts text content from a PDF for quiz generation.
   * @requires bookId must exist and belong to userId
   * @requires currentPage must be valid
   * @effects Returns extracted text content from the specified page range
   */
  async getQuizContext(
    {
      userId,
      bookId,
      currentPage,
      pageRange = 2,
    }: {
      userId: User;
      bookId: ID; // LibraryBook ID
      currentPage: number;
      pageRange?: number;
    },
  ): Promise<{ content: string } | { error: string }> {
    try {
      // Get the book from the library to access the PDF file
      const libraryCollection = this.db.collection("Library.books");
      const book = await libraryCollection.findOne({ _id: bookId });

      if (!book) {
        return { error: "Book not found" };
      }

      if (book.ownerId !== userId) {
        return { error: "Book does not belong to user" };
      }

      // Extract fileName from storageUrl
      const storageUrl = book.storageUrl;
      // storageUrl format: https://storage.googleapis.com/bucket-name/books/userId/filename.pdf
      // We need to extract: books/userId/filename.pdf
      const urlParts = storageUrl.split("/");
      const bucketName = urlParts[3]; // Should be the bucket name
      const fileName = urlParts.slice(4).join("/"); // Everything after bucket name

      // Extract text from the specified page range
      const result = await extractTextFromPageRange(
        fileName,
        currentPage,
        pageRange,
      );

      if ("error" in result) {
        return result;
      }

      // Limit content length to prevent LLM token limits
      // const content = result.text.slice(0, 2000);

      return { content: result.text };
    } catch (error) {
      console.error("Error getting quiz context:", error);
      const errorMessage = error instanceof Error
        ? error.message
        : String(error);
      return { error: `Failed to get quiz context: ${errorMessage}` };
    }
  }

  /**
   * Action: Creates a quiz from PDF content at a specific page.
   * @requires bookId must exist and belong to userId
   * @requires currentPage must be valid
   * @effects A new quiz is created from PDF content and the full quiz object is returned
   */
  async createQuizFromPDF(
    {
      userId,
      bookId,
      currentPage,
      pageRange = 2,
    }: {
      userId: User;
      bookId: ID; // LibraryBook ID
      currentPage: number;
      pageRange?: number;
    },
  ): Promise<{ quiz: QuizDoc } | { error: string }> {
    // First, get the context from the PDF
    const contextResult = await this.getQuizContext({
      userId,
      bookId,
      currentPage,
      pageRange,
    });

    if ("error" in contextResult) {
      return contextResult;
    }

    // Then create the quiz using the extracted content
    return await this.createQuiz({ content: contextResult.content });
  }
}
