[@api-extraction-from-spec](api-extraction-from-spec.md)

# Extracting from code

The following is an explanation of how concepts are implemented, for the purposes of understanding how to extract an API.

[@implementing-concepts](../background/implementing-concepts.md)

# prompt: 

Now, analyze the following Concept Implementation and generate the API documentation based on these instructions.

## Annotate

Specification:

[@Annotate](../specs/annotate.md)

Code:

[@AnnotateConcept.ts](../../src/concepts/annotate.ts)

## CheckpointQuiz

Specification:

[@CheckpointQuiz](../specs/checkpoint_quiz.md)

Code:

[@CheckpointQuizConcept.ts](../../src/concepts/checkpoint_quiz.ts)

## FocusTimer

Specification:

[@FocusTimer](../specs/focus_timer.md)

Code:

[@FocusTimerConcept.ts](../../src/concepts/focus_timer.ts)

## Library

Specification:

[@Library](../specs/library.md)

Code:

[@LibraryConcept.ts](../../src/concepts/library.ts)

## ReadingProgress

Specification:

[@ReadingProgress](../specs/reading_progress.md)

Code:

[@ReadingProgressConcept.ts](../../src/concepts/reading_progress.ts)

## UserAuthentication

Specification:

[@UserAuthentication](../specs/user_auth.md)

Code:

[@UserAuthenticationConcept.ts](../../src/concepts/user_auth.ts)
# response:

# API Specification: Annotate Concept

**Purpose:** persist reader reflections to encourage active reading

---

## API Endpoints

### POST /api/Annotate/saveAnnotation

**Description:** Saves an annotation with user, content, and key ideas.

**Requirements:**
- keyIdeas must be non-empty

**Effects:**
- A new annotation is created and its ID is returned

**Request Body:**
```json
{
  "userId": "string",
  "content": "string",
  "keyIdeas": "string"
}
```

**Success Response Body (Action):**
```json
{
  "annotationId": "string"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```
---

### POST /api/Annotate/_getUserAnnotations

**Description:** Retrieves all annotations for a specific user and content.

**Requirements:**
- None

**Effects:**
- None

**Request Body:**
```json
{
  "userId": "string",
  "content": "string"
}
```

**Success Response Body (Query):**
```json
[
  {
    "_id": "string",
    "userId": "string",
    "content": "string",
    "keyIdeas": "string",
    "createdAt": "string"
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
```
---

### POST /api/Annotate/_getAllUserAnnotations

**Description:** Retrieves all annotations by a specific user.

**Requirements:**
- None

**Effects:**
- None

**Request Body:**
```json
{
  "userId": "string"
}
```

**Success Response Body (Query):**
```json
[
  {
    "_id": "string",
    "userId": "string",
    "content": "string",
    "keyIdeas": "string",
    "createdAt": "string"
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
```
---

# API Specification: CheckpointQuiz Concept

**Purpose:** generate and evaluate short multiple-choice quizzes to reinforce active reading

---

## API Endpoints

### POST /api/CheckpointQuiz/createQuiz

**Description:** Creates a new quiz from content using Gemini LLM.

**Requirements:**
- content must not be empty

**Effects:**
- A new quiz is created and its ID is returned

**Request Body:**
```json
{
  "content": "string"
}
```

**Success Response Body (Action):**
```json
{
  "quizId": "string"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```
---

### POST /api/CheckpointQuiz/submitQuizAnswer

**Description:** Submits a quiz answer and records the attempt.

**Requirements:**
- The quiz must exist
- selectedIndex must be between 0 and 3

**Effects:**
- A new quiz attempt is recorded and correctness is returned

**Request Body:**
```json
{
  "userId": "string",
  "quizId": "string",
  "selectedIndex": "number"
}
```

**Success Response Body (Action):**
```json
{
  "attemptId": "string",
  "isCorrect": "boolean"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```
---

### POST /api/CheckpointQuiz/_getQuiz

**Description:** Retrieves a quiz by its ID.

**Requirements:**
- None

**Effects:**
- None

**Request Body:**
```json
{
  "quizId": "string"
}
```

**Success Response Body (Query):**
```json
[
  {
    "_id": "string",
    "content": "string",
    "question": "string",
    "answers": [
      "string",
      "string",
      "string",
      "string"
    ],
    "correctIndex": "number",
    "createdAt": "string"
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
```
---

### POST /api/CheckpointQuiz/_getQuizAttempts

**Description:** Retrieves all attempts for a specific quiz.

**Requirements:**
- None

**Effects:**
- None

**Request Body:**
```json
{
  "quizId": "string"
}
```

**Success Response Body (Query):**
```json
[
  {
    "_id": "string",
    "userId": "string",
    "quizId": "string",
    "selectedIndex": "number",
    "isCorrect": "boolean",
    "createdAt": "string"
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
```
---

### POST /api/CheckpointQuiz/_getUserAttempts

**Description:** Retrieves all attempts by a specific user.

**Requirements:**
- None

**Effects:**
- None

**Request Body:**
```json
{
  "userId": "string"
}
```

**Success Response Body (Query):**
```json
[
  {
    "_id": "string",
    "userId": "string",
    "quizId": "string",
    "selectedIndex": "number",
    "isCorrect": "boolean",
    "createdAt": "string"
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
```
---

# API Specification: FocusTimer Concept

**Purpose:** generic countdown timer with phases

---

## API Endpoints

### POST /api/FocusTimer/start

**Description:** Starts a new timer with specified duration and phase.

**Requirements:**
- durationMs > 0
- phase must be "reading" or "break"

**Effects:**
- A new active timer is created and its ID is returned

**Request Body:**
```json
{
  "durationMs": "number",
  "phase": "string"
}
```

**Success Response Body (Action):**
```json
{
  "timerId": "string"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```
---

### POST /api/FocusTimer/pause

**Description:** Pauses an active timer.

**Requirements:**
- Timer must exist and be active

**Effects:**
- Sets isActive to false

**Request Body:**
```json
{
  "timerId": "string"
}
```

**Success Response Body (Action):**
```json
{}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```
---

### POST /api/FocusTimer/resume

**Description:** Resumes a paused timer.

**Requirements:**
- Timer must exist and be inactive

**Effects:**
- Sets isActive to true and updates startedAtMs to now

**Request Body:**
```json
{
  "timerId": "string"
}
```

**Success Response Body (Action):**
```json
{}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```
---

### POST /api/FocusTimer/expire

**Description:** Expires an active timer that has reached its duration.

**Requirements:**
- Timer must exist, be active, and have reached its duration

**Effects:**
- Flips phase (reading↔break) and resets startedAtMs to now

**Request Body:**
```json
{
  "timerId": "string"
}
```

**Success Response Body (Action):**
```json
{}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```
---

### POST /api/FocusTimer/_getTimer

**Description:** Retrieves a timer by its ID.

**Requirements:**
- None

**Effects:**
- None

**Request Body:**
```json
{
  "timerId": "string"
}
```

**Success Response Body (Query):**
```json
[
  {
    "_id": "string",
    "phase": "string",
    "startedAtMs": "number",
    "durationMs": "number",
    "isActive": "boolean"
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
```
---

### POST /api/FocusTimer/_getActiveTimers

**Description:** Retrieves all active timers.

**Requirements:**
- None

**Effects:**
- None

**Request Body:**
```json
{}
```

**Success Response Body (Query):**
```json
[
  {
    "_id": "string",
    "phase": "string",
    "startedAtMs": "number",
    "durationMs": "number",
    "isActive": "boolean"
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
```
---

### POST /api/FocusTimer/_getTimersByPhase

**Description:** Retrieves all timers with a specific phase.

**Requirements:**
- None

**Effects:**
- None

**Request Body:**
```json
{
  "phase": "string"
}
```

**Success Response Body (Query):**
```json
[
  {
    "_id": "string",
    "phase": "string",
    "startedAtMs": "number",
    "durationMs": "number",
    "isActive": "boolean"
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
```
---

# API Specification: Library Concept

**Purpose:** store metadata about books a user owns/reads with links to Google Cloud storage

---

## API Endpoints

### POST /api/Library/addBook

**Description:** Adds a new book to the user's library.

**Requirements:**
- title must be non-empty
- totalPages > 0
- storageUrl must be non-empty

**Effects:**
- Inserts a book with link to Google Cloud storage

**Request Body:**
```json
{
  "ownerId": "string",
  "title": "string",
  "totalPages": "number",
  "storageUrl": "string"
}
```

**Success Response Body (Action):**
```json
{
  "bookId": "string"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```
---

### POST /api/Library/getBook

**Description:** Checks if a book exists.

**Requirements:**
- Book must exist

**Effects:**
- Returns whether book exists (for tests)

**Request Body:**
```json
{
  "bookId": "string"
}
```

**Success Response Body (Action):**
```json
{
  "exists": "boolean"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```
---

### POST /api/Library/listBooks

**Description:** Lists all books owned by a user.

**Requirements:**
- User must exist

**Effects:**
- Returns books owned by user

**Request Body:**
```json
{
  "ownerId": "string"
}
```

**Success Response Body (Action):**
```json
{
  "bookIds": [
    "string"
  ]
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```
---

### POST /api/Library/removeBook

**Description:** Removes a book from the user's library.

**Requirements:**
- Book must exist and ownerId must match

**Effects:**
- Deletes the book

**Request Body:**
```json
{
  "ownerId": "string",
  "bookId": "string"
}
```

**Success Response Body (Action):**
```json
{}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```
---

### POST /api/Library/_getBook

**Description:** Retrieves a book by its ID.

**Requirements:**
- None

**Effects:**
- None

**Request Body:**
```json
{
  "bookId": "string"
}
```

**Success Response Body (Query):**
```json
[
  {
    "_id": "string",
    "ownerId": "string",
    "title": "string",
    "totalPages": "number",
    "storageUrl": "string",
    "createdAt": "string"
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
```
---

### POST /api/Library/_getUserBooks

**Description:** Retrieves all books owned by a specific user.

**Requirements:**
- None

**Effects:**
- None

**Request Body:**
```json
{
  "ownerId": "string"
}
```

**Success Response Body (Query):**
```json
[
  {
    "_id": "string",
    "ownerId": "string",
    "title": "string",
    "totalPages": "number",
    "storageUrl": "string",
    "createdAt": "string"
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
```
---

### POST /api/Library/_getAllBooks

**Description:** Retrieves all books in the library.

**Requirements:**
- None

**Effects:**
- None

**Request Body:**
```json
{}
```

**Success Response Body (Query):**
```json
[
  {
    "_id": "string",
    "ownerId": "string",
    "title": "string",
    "totalPages": "number",
    "storageUrl": "string",
    "createdAt": "string"
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
```
---

# API Specification: ReadingProgress Concept

**Purpose:** track reading state and compute engagement triggers

---

## API Endpoints

### POST /api/ReadingProgress/initializeProgress

**Description:** Initializes a new reading session.

**Requirements:**
- totalPages > 0
- quizInterval > 0
- annotationInterval > 0

**Effects:**
- Creates a session with currentPage=1 and isActive=true

**Request Body:**
```json
{
  "userId": "string",
  "bookId": "string",
  "totalPages": "number",
  "quizInterval": "number",
  "annotationInterval": "number"
}
```

**Success Response Body (Action):**
```json
{
  "sessionId": "string"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```
---

### POST /api/ReadingProgress/updateProgress

**Description:** Updates the current page in a reading session.

**Requirements:**
- Session must exist
- newPage > currentPage
- newPage <= totalPages

**Effects:**
- Sets currentPage to newPage

**Request Body:**
```json
{
  "sessionId": "string",
  "newPage": "number"
}
```

**Success Response Body (Action):**
```json
{}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```
---

### POST /api/ReadingProgress/triggerQuiz

**Description:** Determines if a quiz should be triggered based on page progress.

**Requirements:**
- Session must exist

**Effects:**
- Returns whether (currentPage - lastQuizPage) >= quizInterval

**Request Body:**
```json
{
  "sessionId": "string"
}
```

**Success Response Body (Action):**
```json
{
  "shouldTrigger": "boolean"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```
---

### POST /api/ReadingProgress/triggerAnnotation

**Description:** Determines if an annotation should be triggered based on page progress.

**Requirements:**
- Session must exist

**Effects:**
- Returns whether (currentPage - lastAnnotationPage) >= annotationInterval

**Request Body:**
```json
{
  "sessionId": "string"
}
```

**Success Response Body (Action):**
```json
{
  "shouldTrigger": "boolean"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```
---

### POST /api/ReadingProgress/recordQuizTriggered

**Description:** Records that a quiz was triggered at the current page.

**Requirements:**
- Session must exist

**Effects:**
- Sets lastQuizPage to currentPage

**Request Body:**
```json
{
  "sessionId": "string"
}
```

**Success Response Body (Action):**
```json
{}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```
---

### POST /api/ReadingProgress/recordAnnotationTriggered

**Description:** Records that an annotation was triggered at the current page.

**Requirements:**
- Session must exist

**Effects:**
- Sets lastAnnotationPage to currentPage

**Request Body:**
```json
{
  "sessionId": "string"
}
```

**Success Response Body (Action):**
```json
{}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```
---

### POST /api/ReadingProgress/pauseReading

**Description:** Pauses a reading session and records elapsed time.

**Requirements:**
- Session must exist and be active

**Effects:**
- Sets isActive=false and increments totalReadingTimeMinutes by elapsed time

**Request Body:**
```json
{
  "sessionId": "string"
}
```

**Success Response Body (Action):**
```json
{}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```
---

### POST /api/ReadingProgress/resumeReading

**Description:** Resumes a reading session and resets the start time.

**Requirements:**
- Session must exist and be inactive

**Effects:**
- Sets isActive=true and sets startTime to now

**Request Body:**
```json
{
  "sessionId": "string"
}
```

**Success Response Body (Action):**
```json
{}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```
---

### POST /api/ReadingProgress/_getReadingSession

**Description:** Retrieves a reading session by its ID.

**Requirements:**
- None

**Effects:**
- None

**Request Body:**
```json
{
  "sessionId": "string"
}
```

**Success Response Body (Query):**
```json
[
  {
    "_id": "string",
    "userId": "string",
    "bookId": "string",
    "currentPage": "number",
    "totalPages": "number",
    "lastQuizPage": "number",
    "lastAnnotationPage": "number",
    "quizInterval": "number",
    "annotationInterval": "number",
    "startTime": "string",
    "totalReadingTimeMinutes": "number",
    "isActive": "boolean"
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
```
---

### POST /api/ReadingProgress/_getUserSessions

**Description:** Retrieves all reading sessions for a specific user.

**Requirements:**
- None

**Effects:**
- None

**Request Body:**
```json
{
  "userId": "string"
}
```

**Success Response Body (Query):**
```json
[
  {
    "_id": "string",
    "userId": "string",
    "bookId": "string",
    "currentPage": "number",
    "totalPages": "number",
    "lastQuizPage": "number",
    "lastAnnotationPage": "number",
    "quizInterval": "number",
    "annotationInterval": "number",
    "startTime": "string",
    "totalReadingTimeMinutes": "number",
    "isActive": "boolean"
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
```
---

### POST /api/ReadingProgress/_getBookSessions

**Description:** Retrieves all reading sessions for a specific book.

**Requirements:**
- None

**Effects:**
- None

**Request Body:**
```json
{
  "bookId": "string"
}
```

**Success Response Body (Query):**
```json
[
  {
    "_id": "string",
    "userId": "string",
    "bookId": "string",
    "currentPage": "number",
    "totalPages": "number",
    "lastQuizPage": "number",
    "lastAnnotationPage": "number",
    "quizInterval": "number",
    "annotationInterval": "number",
    "startTime": "string",
    "totalReadingTimeMinutes": "number",
    "isActive": "boolean"
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
```
---

### POST /api/ReadingProgress/_getActiveSessions

**Description:** Retrieves all active reading sessions.

**Requirements:**
- None

**Effects:**
- None

**Request Body:**
```json
{}
```

**Success Response Body (Query):**
```json
[
  {
    "_id": "string",
    "userId": "string",
    "bookId": "string",
    "currentPage": "number",
    "totalPages": "number",
    "lastQuizPage": "number",
    "lastAnnotationPage": "number",
    "quizInterval": "number",
    "annotationInterval": "number",
    "startTime": "string",
    "totalReadingTimeMinutes": "number",
    "isActive": "boolean"
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
```
---

# API Specification: UserAuthentication Concept

**Purpose:** authenticate users

---

## API Endpoints

### POST /api/UserAuthentication/register

**Description:** Registers a new user with email and password hash.

**Requirements:**
- email must contain "@" and be unique
- passwordHash must be non-empty

**Effects:**
- Inserts new user

**Request Body:**
```json
{
  "email": "string",
  "passwordHash": "string"
}
```

**Success Response Body (Action):**
```json
{
  "userId": "string"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```
---

### POST /api/UserAuthentication/login

**Description:** Logs in a user with email and password hash.

**Requirements:**
- user must exist
- passwordHash must match

**Effects:**
- Returns userId

**Request Body:**
```json
{
  "email": "string",
  "passwordHash": "string"
}
```

**Success Response Body (Action):**
```json
{
  "userId": "string"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```
---

### POST /api/UserAuthentication/_getUser

**Description:** Retrieves a user by their ID.

**Requirements:**
- None

**Effects:**
- None

**Request Body:**
```json
{
  "userId": "string"
}
```

**Success Response Body (Query):**
```json
[
  {
    "_id": "string",
    "email": "string",
    "passwordHash": "string",
    "createdAt": "string"
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
```
---

### POST /api/UserAuthentication/_getUserByEmail

**Description:** Retrieves a user by their email.

**Requirements:**
- None

**Effects:**
- None

**Request Body:**
```json
{
  "email": "string"
}
```

**Success Response Body (Query):**
```json
[
  {
    "_id": "string",
    "email": "string",
    "passwordHash": "string",
    "createdAt": "string"
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
```
---

### POST /api/UserAuthentication/_getAllUsers

**Description:** Retrieves all users.

**Requirements:**
- None

**Effects:**
- None

**Request Body:**
```json
{}
```

**Success Response Body (Query):**
```json
[
  {
    "_id": "string",
    "email": "string",
    "passwordHash": "string",
    "createdAt": "string"
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
```
---