---
timestamp: 'Mon Oct 20 2025 17:43:52 GMT-0400 (Eastern Daylight Time)'
parent: '[[../20251020_174352.5d1857d6.md]]'
content_id: c5f9ef56f5c159d06ca244d51f8aaf3fc30cb215a01a73dc6c6078b9b421ebea
---

# API Specification: Library Concept

**Purpose:** store metadata about books a user owns/reads with links to Google Cloud storage

***

## API Endpoints

### POST /api/Library/addBook

**Description:** Adds a new book to the user's library.

**Requirements:**

* title non-empty
* totalPages > 0
* storageUrl non-empty

**Effects:**

* inserts a book with link to Google Cloud storage

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

***

### POST /api/Library/getBook

**Description:** Checks if a book exists.

**Requirements:**

* Book must exist

**Effects:**

* returns whether book exists (for tests)

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

***

### POST /api/Library/listBooks

**Description:** Lists all books owned by a user.

**Requirements:**

* User must exist

**Effects:**

* returns books owned by user

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

***

### POST /api/Library/removeBook

**Description:** Removes a book from the user's library.

**Requirements:**

* book exists and ownerId matches

**Effects:**

* deletes the book

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

***

### POST /api/Library/\_getBook

**Description:** Retrieves a book by its ID.

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

***

### POST /api/Library/\_getUserBooks

**Description:** Retrieves all books owned by a specific user.

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

***

### POST /api/Library/\_getAllBooks

**Description:** Retrieves all books in the library.

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

***
