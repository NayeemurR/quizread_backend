---
timestamp: 'Mon Oct 20 2025 17:43:52 GMT-0400 (Eastern Daylight Time)'
parent: '[[../20251020_174352.5d1857d6.md]]'
content_id: 1bd54720d739715ad3e45e13ee3d5a82433b877e0f793e5e2e73f6685e98d183
---

# API Specification: UserAuthentication Concept

**Purpose:** authenticate users

***

## API Endpoints

### POST /api/UserAuthentication/register

**Description:** Registers a new user with email and password hash.

**Requirements:**

* email contains "@" and is unique
* passwordHash non-empty

**Effects:**

* inserts new user

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

* user exists and passwordHash matches

**Effects:**

* returns userId

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
