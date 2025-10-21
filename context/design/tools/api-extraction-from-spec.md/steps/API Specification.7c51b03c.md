---
timestamp: 'Sun Oct 19 2025 17:54:03 GMT-0400 (Eastern Daylight Time)'
parent: '[[../20251019_175403.dd8705d4.md]]'
content_id: 7c51b03c4f7bbb7f3c6bd4ca94e9bf89331f8bf7d886af6077e36c5fc6e08473
---

# API Specification: Labeling Concept

**Concept Name and Type Parameters:** Labeling \[Item]
**Purpose:** Enable associating labels with generic items and retrieving items based on labels.

***

## API Endpoints

### POST /api/Labeling/createLabel

**Description:** Creates a new label with the specified name.

**Requirements:**

* None specified.

**Effects:**

* A new Label entity with the given name is created and stored.

**Request Body:**

```json
{
  "name": "string"
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

### POST /api/Labeling/addLabel

**Description:** Associates a label with a specific item.

**Requirements:**

* None specified.

**Effects:**

* The specified `label` is associated with the `item`.

**Request Body:**

```json
{
  "item": "string",
  "label": "string"
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

### POST /api/Labeling/deleteLabel

**Description:** Removes the association of a label from a specific item.

**Requirements:**

* None specified.

**Effects:**

* The specified `label` is no longer associated with the `item`.

**Request Body:**

```json
{
  "item": "string",
  "label": "string"
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
