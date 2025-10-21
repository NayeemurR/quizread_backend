---
timestamp: 'Mon Oct 20 2025 18:55:55 GMT-0400 (Eastern Daylight Time)'
parent: '[[../20251020_185555.78d4450e.md]]'
content_id: eaeab384665781bc7ba69fb955c11c99f5a9a4bfd0a10926c8bfc71db5c0c839
---

# API Specification: Annotate Concept

**Purpose:** persist reader reflections to encourage active reading

***

## API Endpoints

### POST /api/Annotate/saveAnnotation

**Description:** Saves an annotation with user, content, and key ideas.

**Requirements:**

* keyIdeas must be non-empty

**Effects:**

* A new annotation is created and its ID is returned

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

**Requirements:**

* None

**Effects:**

* None

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
