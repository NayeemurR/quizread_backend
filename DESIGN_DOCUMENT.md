# Design Document: QuizRead Backend

This document summarizes how the final implementation differs from the initial concept design (Assignment 2) and the visual design integration (Assignment 4b).

## Overview

The QuizRead backend implements six independent concepts following the concept design methodology. Key changes from the initial design focused on simplifying concepts, improving modularity, and integrating with external services (Google Cloud Storage, Gemini LLM) while maintaining strict concept independence.

---

## Concept-Level Changes

### CheckpointQuiz

**Initial Design Issues:**
- Stored answer as a string, making validation inefficient
- Returned only `quizId` from `createQuiz`, requiring a separate fetch to get the quiz object

**Final Implementation:**
- Store `correctIndex` (0-based) instead of answer string for efficient validation
- Enforce `answers` array length of exactly 4
- Return full quiz object from `createQuiz` action for immediate frontend display
- Added `getQuizContext` and `createQuizFromPDF` actions to extract text from PDFs before quiz generation
- Integrated Gemini LLM API with injectable generator interface for testability

**Reference:** [@context/design/specs/checkpoint_quiz.md/20251016_191829.d139f8d7.md](context/design/specs/checkpoint_quiz.md/20251016_191829.d139f8d7.md)

### FocusTimer

**Initial Design Issues:**
- Included app-specific concerns (user, book, page references) when it all was unnecessary according to the feedback given on my assignment 2.
- Allowed user-configurable durations, adding unnecessary complexity

**Final Implementation:**
- Generalized to pure timer concept with no user/book knowledge
- State only includes: `phase`, `startedAtMs`, `durationMs`, `isActive`
- Fixed durations: 25 minutes for reading sessions, 5 minutes for breaks (Pomodoro technique)
- All app-specific logic moved to syncs

**Rationale:** Per Assignment 2 feedback, timer concept should be reusable and independent. Duration and user/book associations are handled by syncs.

**Reference:** [@context/design/specs/focus_timer.md/20251016_191845.5f81f9fd.md](context/design/specs/focus_timer.md/20251016_191845.5f81f9fd.md)

### Annotate

**Initial Design Issues:**
- Missing `bookId` field, making it impossible to retrieve annotations for specific books
- Included `promptAnnotation` action that was frontend-specific

**Final Implementation:**
- Added `bookId` field to associate annotations with specific books
- Removed `promptAnnotation` action (handled via syncs instead)
- Simplified to core persistence actions: `saveAnnotation` and `getAnnotationsForBook`

**Reference:** [@context/design/specs/annotate.md/20251016_191800.0b7f8c12.md](context/design/specs/annotate.md/20251016_191800.0b7f8c12.md)

### Library

**Initial Design Issues:**
- Missing upload workflow for Google Cloud Storage integration
- Included `totalPages` field that wasn't needed for basic library functionality

**Final Implementation:**
- Added `prepareUpload` action to generate signed URLs for direct GCS uploads
- Added `cleanupFailedUpload` action to handle upload failures gracefully
- Removed `totalPages` field (not required for adding books to library)
- Focus on storage URL management and metadata persistence

**Reference:** [@context/design/specs/library.md/20251016_191900.5cfed505.md](context/design/specs/library.md/20251016_191900.5cfed505.md)

### ReadingProgress

**Initial Design Issues:**
- Included `content` field that duplicated information available elsewhere
- Missing `bookId` for tracking progress per book

**Final Implementation:**
- Added `bookId` field to track reading progress for specific books
- Removed `content` field (content accessed via `bookId` reference)
- Maintains boolean-only triggers (`triggerQuiz`, `triggerAnnotation`) to keep concept focused on state tracking

**Reference:** [@context/design/specs/reading_progress.md/20251016_191916.6e7a1812.md](context/design/specs/reading_progress.md/20251016_191916.6e7a1812.md)

### UserAuthentication

**New Concept Added:**
- Not present in initial Assignment 2 design
- Added per feedback to handle user registration and login
- Minimal state: email, passwordHash, createdAt
- Actions: `register`, `login`

**Reference:** [@context/design/specs/user_auth.md/20251016_191935.d0a37a9e.md](context/design/specs/user_auth.md/20251016_191935.d0a37a9e.md)

---

## System-Level Changes

### Syncs

**Added syncs for:**
- Library: Authentication and authorization for book operations
- Annotate: User-specific access control
- CheckpointQuiz: User-specific quiz attempts
- FocusTimer: User session management

**Rationale:** Syncs ensure routes are only accessible to authenticated users while maintaining concept independence. Concepts themselves have no knowledge of authentication; syncs handle the orchestration.

### Infrastructure Integration

**Google Cloud Storage:**
- CORS configuration required for production frontend access
- Signed URL generation for secure uploads
- File cleanup on failed uploads

**Gemini LLM Integration:**
- Injectable quiz generator interface for testability
- Content sanitization (2000 character limit) for token management

### Frontend Integration (Assignment 4b)

**Loading States:**
- Added comprehensive loading indicators to handle async operations
- Prevents visual bugs when backend calls GCS, MongoDB, and Gemini
- Improved user experience during long-running operations

**CORS Configuration:**
- Configured GCS bucket CORS policy for production frontend access
- Resolved cross-origin issues when serving PDFs from Google Cloud Storage

---

## Key Takeaways

- **Simplification:** Removed app-specific details from generic concepts (FocusTimer)
- **Completeness:** Added missing fields (bookId) where needed for functionality
- **Integration:** Added actions for external service integration (GCS uploads, PDF extraction)
- **Testability:** Injectable interfaces for LLM calls enable deterministic testing
- **User Experience:** Return complete objects instead of IDs to reduce frontend round-trips

