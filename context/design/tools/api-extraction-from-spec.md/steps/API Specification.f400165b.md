---
timestamp: 'Mon Oct 20 2025 17:43:52 GMT-0400 (Eastern Daylight Time)'
parent: '[[../20251020_174352.5d1857d6.md]]'
content_id: f400165bc69492eee006479ee95c53809e0f533194b30c773f4ee11d4d9e8a9c
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

* calls **Gemini** with `content` to produce a single MCQ (question, 4 answers, correct index)
* then persists Quizzes and returns quizId

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

* quiz exists
* 0 <= selectedIndex < 4

**Effects:**

* stores QuizAttempt and returns correctness

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
