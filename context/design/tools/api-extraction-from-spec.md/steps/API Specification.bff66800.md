---
timestamp: 'Mon Oct 20 2025 17:43:52 GMT-0400 (Eastern Daylight Time)'
parent: '[[../20251020_174352.5d1857d6.md]]'
content_id: bff6680066f9b74bbb40ecc6455d8e47d0167ea9cd1b854821f2fbf238ea206d
---

# API Specification: FocusTimer Concept

**Purpose:** generic countdown timer with phases

***

## API Endpoints

### POST /api/FocusTimer/start

**Description:** Starts a new timer with specified duration and phase.

**Requirements:**

* durationMs > 0
* phase in {"reading","break"}

**Effects:**

* creates active timer

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

* isActive=true

**Effects:**

* sets isActive=false

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

* isActive=false

**Effects:**

* sets isActive=true and startedAtMs=now

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

* isActive=true and (now - startedAtMs) >= durationMs

**Effects:**

* flips phase (reading↔break) and sets startedAtMs=now

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
