---
timestamp: 'Mon Oct 20 2025 17:43:52 GMT-0400 (Eastern Daylight Time)'
parent: '[[../20251020_174352.5d1857d6.md]]'
content_id: 02be720e81615ea36beb05dc26c97d47afcbb9c512d8bee4065385dfc8483ff0
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

* creates a session with currentPage=1; isActive=true

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

* session exists
* newPage > currentPage
* newPage <= totalPages

**Effects:**

* sets currentPage=newPage

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

* session exists

**Effects:**

* sets lastQuizPage = currentPage

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

* session exists

**Effects:**

* sets lastAnnotationPage = currentPage

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

* isActive=true

**Effects:**

* sets isActive=false and increments totalReadingTimeMinutes by elapsed since startTime

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

* isActive=false

**Effects:**

* sets isActive=true and sets startTime=now

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
