---
timestamp: 'Mon Oct 20 2025 18:55:55 GMT-0400 (Eastern Daylight Time)'
parent: '[[../20251020_185555.78d4450e.md]]'
content_id: 52d0862da6dd46f039b1475213233e9861eea1d3965d77bb86a0bb6d1960e34e
---

# API Specification: UserAuthentication Concept

**Purpose:** authenticate users

***

## API Endpoints

### POST /api/UserAuthentication/register

**Description:** Registers a new user with email and password hash.

**Requirements:**

* email must contain "@" and be unique
* passwordHash must be non-empty

**Effects:**

* Inserts new user

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

***

### POST /api/UserAuthentication/login

**Description:** Logs in a user with email and password hash.

**Requirements:**

* user must exist
* passwordHash must match

**Effects:**

* Returns userId

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

***

### POST /api/UserAuthentication/\_getUser

**Description:** Retrieves a user by their ID.

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

***

### POST /api/UserAuthentication/\_getUserByEmail

**Description:** Retrieves a user by their email.

**Requirements:**

* None

**Effects:**

* None

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

***

### POST /api/UserAuthentication/\_getAllUsers

**Description:** Retrieves all users.

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

***
