---
timestamp: 'Mon Oct 20 2025 17:43:52 GMT-0400 (Eastern Daylight Time)'
parent: '[[../20251020_174352.5d1857d6.md]]'
content_id: 76cdfc75e55991b2d67499534f0fa9bdf761809cd8711e3aa4cbccaf9155bb64
---

# API Specification: Annotate Concept

**Purpose:** persist reader reflections to encourage active reading

***

## API Endpoints

### POST /api/Annotate/saveAnnotation

**Description:** Saves an annotation with user, content, and key ideas.

**Requirements:**

* keyIdeas non-empty

**Effects:**

* saves annotation and returns annotationId

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

***

### POST /api/Annotate/\_getUserAnnotations

**Description:** Retrieves all annotations for a specific user and content.

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

***

### POST /api/Annotate/\_getAllUserAnnotations

**Description:** Retrieves all annotations by a specific user.

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

***
