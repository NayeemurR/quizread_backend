---
timestamp: 'Mon Oct 20 2025 18:55:55 GMT-0400 (Eastern Daylight Time)'
parent: '[[../20251020_185555.78d4450e.md]]'
content_id: 9e5948f76e089db54bfcaa9f2050ad159e0c8ccd2b9dc261e1811f4dcb1c4310
---

# API Specification: FocusTimer Concept

**Purpose:** generic countdown timer with phases

***

## API Endpoints

### POST /api/FocusTimer/start

**Description:** Starts a new timer with specified duration and phase.

**Requirements:**

* durationMs > 0
* phase must be "reading" or "break"

**Effects:**

* A new active timer is created and its ID is returned

**Request Body:**

```json
{
  "durationMs": "number",
  "phase": "string"
}
```

**Success Response Body (Action):**

```json
{
  "timerId": "string"
}
```

**Error Response Body:**

```json
{
  "error": "string"
}
```

***

### POST /api/FocusTimer/pause

**Description:** Pauses an active timer.

**Requirements:**

* Timer must exist and be active

**Effects:**

* Sets isActive to false

**Request Body:**

```json
{
  "timerId": "string"
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

### POST /api/FocusTimer/resume

**Description:** Resumes a paused timer.

**Requirements:**

* Timer must exist and be inactive

**Effects:**

* Sets isActive to true and updates startedAtMs to now

**Request Body:**

```json
{
  "timerId": "string"
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

### POST /api/FocusTimer/expire

**Description:** Expires an active timer that has reached its duration.

**Requirements:**

* Timer must exist, be active, and have reached its duration

**Effects:**

* Flips phase (reading↔break) and resets startedAtMs to now

**Request Body:**

```json
{
  "timerId": "string"
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

### POST /api/FocusTimer/\_getTimer

**Description:** Retrieves a timer by its ID.

**Requirements:**

* None

**Effects:**

* None

**Request Body:**

```json
{
  "timerId": "string"
}
```

**Success Response Body (Query):**

```json
[
  {
    "_id": "string",
    "phase": "string",
    "startedAtMs": "number",
    "durationMs": "number",
    "isActive": "boolean"
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

### POST /api/FocusTimer/\_getActiveTimers

**Description:** Retrieves all active timers.

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
    "phase": "string",
    "startedAtMs": "number",
    "durationMs": "number",
    "isActive": "boolean"
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

### POST /api/FocusTimer/\_getTimersByPhase

**Description:** Retrieves all timers with a specific phase.

**Requirements:**

* None

**Effects:**

* None

**Request Body:**

```json
{
  "phase": "string"
}
```

**Success Response Body (Query):**

```json
[
  {
    "_id": "string",
    "phase": "string",
    "startedAtMs": "number",
    "durationMs": "number",
    "isActive": "boolean"
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
