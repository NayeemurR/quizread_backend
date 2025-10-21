---
timestamp: 'Mon Oct 20 2025 18:55:55 GMT-0400 (Eastern Daylight Time)'
parent: '[[../20251020_185555.78d4450e.md]]'
content_id: 36ee0f7954f1a8ecd7445b282cdf2a4769c556493bd6127d7fe4b6bf04e22ee7
---

# API Specification: ReadingProgress Concept

**Purpose:** track reading state and compute engagement triggers

***

## API Endpoints

### POST /api/ReadingProgress/initializeProgress

**Description:** Initializes a new reading session.

**Requirements:**

* totalPages > 0
* quizInterval > 0
* annotationInterval > 0

**Effects:**

* Creates a session with currentPage=1 and isActive=true

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

***

### POST /api/ReadingProgress/updateProgress

**Description:** Updates the current page in a reading session.

**Requirements:**

* Session must exist
* newPage > currentPage
* newPage <= totalPages

**Effects:**

* Sets currentPage to newPage

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

***

### POST /api/ReadingProgress/triggerQuiz

**Description:** Determines if a quiz should be triggered based on page progress.

**Requirements:**

* Session must exist

**Effects:**

* Returns whether (currentPage - lastQuizPage) >= quizInterval

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

***

### POST /api/ReadingProgress/triggerAnnotation

**Description:** Determines if an annotation should be triggered based on page progress.

**Requirements:**

* Session must exist

**Effects:**

* Returns whether (currentPage - lastAnnotationPage) >= annotationInterval

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

***

### POST /api/ReadingProgress/recordQuizTriggered

**Description:** Records that a quiz was triggered at the current page.

**Requirements:**

* Session must exist

**Effects:**

* Sets lastQuizPage to currentPage

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

***

### POST /api/ReadingProgress/recordAnnotationTriggered

**Description:** Records that an annotation was triggered at the current page.

**Requirements:**

* Session must exist

**Effects:**

* Sets lastAnnotationPage to currentPage

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

***

### POST /api/ReadingProgress/pauseReading

**Description:** Pauses a reading session and records elapsed time.

**Requirements:**

* Session must exist and be active

**Effects:**

* Sets isActive=false and increments totalReadingTimeMinutes by elapsed time

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

***

### POST /api/ReadingProgress/resumeReading

**Description:** Resumes a reading session and resets the start time.

**Requirements:**

* Session must exist and be inactive

**Effects:**

* Sets isActive=true and sets startTime to now

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

***

### POST /api/ReadingProgress/\_getReadingSession

**Description:** Retrieves a reading session by its ID.

**Requirements:**

* None

**Effects:**

* None

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

***

### POST /api/ReadingProgress/\_getUserSessions

**Description:** Retrieves all reading sessions for a specific user.

**Requirements:**

* None

**Effects:**

* None

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

***

### POST /api/ReadingProgress/\_getBookSessions

**Description:** Retrieves all reading sessions for a specific book.

**Requirements:**

* None

**Effects:**

* None

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

***

### POST /api/ReadingProgress/\_getActiveSessions

**Description:** Retrieves all active reading sessions.

**Requirements:**

* None

**Effects:**

* None

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

***
