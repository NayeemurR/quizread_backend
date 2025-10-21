---
timestamp: 'Mon Oct 20 2025 18:55:55 GMT-0400 (Eastern Daylight Time)'
parent: '[[../20251020_185555.78d4450e.md]]'
content_id: 1127643823de55646178c1e8935498610956eb72c8ded466f59063bbc24ae9f3
---

# API Specification: Library Concept

**Purpose:** store metadata about books a user owns/reads with links to Google Cloud storage

***

## API Endpoints

### POST /api/Library/addBook

**Description:** Adds a new book to the user's library.

**Requirements:**

* title must be non-empty
* totalPages > 0
* storageUrl must be non-empty

**Effects:**

* Inserts a book with link to Google Cloud storage

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

* Returns whether book exists (for tests)

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

* Returns books owned by user

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

* Book must exist and ownerId must match

**Effects:**

* Deletes the book

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

**Requirements:**

* None

**Effects:**

* None

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
