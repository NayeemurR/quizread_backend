---
timestamp: 'Mon Oct 20 2025 18:55:55 GMT-0400 (Eastern Daylight Time)'
parent: '[[../20251020_185555.78d4450e.md]]'
content_id: 2c39c7205859cb2e7784f65b3d3767e3b417e489231c72261ad7110ee4ae6547
---

# API Specification: CheckpointQuiz Concept

**Purpose:** generate and evaluate short multiple-choice quizzes to reinforce active reading

***

## API Endpoints

### POST /api/CheckpointQuiz/createQuiz

**Description:** Creates a new quiz from content using Gemini LLM.

**Requirements:**

* content must not be empty

**Effects:**

* A new quiz is created and its ID is returned

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

***

### POST /api/CheckpointQuiz/submitQuizAnswer

**Description:** Submits a quiz answer and records the attempt.

**Requirements:**

* The quiz must exist
* selectedIndex must be between 0 and 3

**Effects:**

* A new quiz attempt is recorded and correctness is returned

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

***

### POST /api/CheckpointQuiz/\_getQuiz

**Description:** Retrieves a quiz by its ID.

**Requirements:**

* None

**Effects:**

* None

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

***

### POST /api/CheckpointQuiz/\_getQuizAttempts

**Description:** Retrieves all attempts for a specific quiz.

**Requirements:**

* None

**Effects:**

* None

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

***

### POST /api/CheckpointQuiz/\_getUserAttempts

**Description:** Retrieves all attempts by a specific user.

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

***
