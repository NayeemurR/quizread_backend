---
timestamp: 'Sun Oct 19 2025 17:54:03 GMT-0400 (Eastern Daylight Time)'
parent: '[[../20251019_175403.dd8705d4.md]]'
content_id: 9f94c220e7026a77245814bf346afe322fa92b22d92850cfe211c79e7c3c0666
---

# API Specification: Groups Concept

**Concept Name and Type Parameters:** Groups \[Group, User]
**Purpose:** Manage collections of users within groups.

***

## API Endpoints

### POST /api/Groups/\_getUsers

**Description:** Retrieves all users belonging to a specified group.

**Requirements:**

* group exists

**Effects:**

* returns set of all users in the group

**Request Body:**

```json
{
  "group": "string"
}
```

**Success Response Body (Query):**

```json
[
  {
    "user": "string"
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

### POST /api/Groups/\_getUsersWithUsernamesAndPasswords

**Description:** Retrieves all users in a group, including their usernames and passwords.

**Requirements:**

* group exists

**Effects:**

* returns set of all users in the group each with its username and password

**Request Body:**

```json
{
  "group": "string"
}
```

**Success Response Body (Query):**

```json
[
  {
    "username": "string",
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
