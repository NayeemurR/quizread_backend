---
timestamp: 'Sun Oct 19 2025 17:54:03 GMT-0400 (Eastern Daylight Time)'
parent: '[[../20251019_175403.dd8705d4.md]]'
content_id: 2bbd10df1efe38edef968c96a3bac590aba3e44f7e30bef152bbe2af9bc24965
---

# API Specification: UserProfile Concept

**Concept Name and Type Parameters:** UserProfile \[User]
**Purpose:** Manage and provide access to non-authentication-related user profile information.

***

## API Endpoints

### POST /api/UserProfile/\_getUsername

**Description:** Retrieves the username for a given user.

**Requirements:**

* user exists

**Effects:**

* returns username of user

**Request Body:**

```json
{
  "user": "string"
}
```

**Success Response Body (Query):**

```json
[
  {
    "username": "string"
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

### POST /api/UserProfile/\_getPassword

**Description:** Retrieves the password for a given user.

**Requirements:**

* user exists

**Effects:**

* returns password of user

**Request Body:**

```json
{
  "user": "string"
}
```

**Success Response Body (Query):**

```json
[
  {
    "password": "string"
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
