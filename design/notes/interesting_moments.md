# Interesting Moments

## Moment 1 — Generalized FocusTimer
Realized timer leaked app concerns; removed user/book and kept only phase/duration. Cleaner modularity.
@/context/2025-10-16T12-00-00/specs/focus_timer.md

## Moment 2 — Injectable Quiz Generator
Discovered need for testable quiz generation; created IQuizGenerator interface allowing deterministic stubs for testing while supporting real Gemini API in production.
@/context/2025-10-16T12-00-00/src/concepts/checkpoint_quiz.ts

## Moment 3 — Type Branding System
Implemented branded types for IDs to prevent mixing UserId with BookId, but discovered TypeScript complexity with the asId function. Simplified to direct type definitions.
@/context/2025-10-16T12-00-00/src/types/ids.ts

## Moment 4 — Database Abstraction
Realized concepts needed database abstraction for testing; created collection helpers but discovered need for better test isolation.
@/context/2025-10-16T12-00-00/src/db/collections.ts

## Moment 5 — Reading Progress Triggers
Designed boolean-only triggers for quiz/annotation to keep concept focused on state tracking rather than business logic.
@/context/2025-10-16T12-00-00/design/specs/reading_progress.md

## Moment 6 — Modular Concept Design
Each concept operates independently with no cross-references, using only IDs and primitives for communication. This ensures true modularity.
@/context/2025-10-16T12-00-00/design/specs/

## Moment 7 — Error Handling Strategy
Implemented DomainError for all business logic errors, providing clear error messages while maintaining type safety.
@/context/2025-10-16T12-00-00/src/util/errors.ts

## Moment 8 — Test Database Isolation
Discovered need for proper test database isolation; testDb() function creates separate test database but needs better collection management.
@/context/2025-10-16T12-00-00/src/utils/database.ts

## Moment 9 — Gemini API Integration
Successfully integrated Google Gemini API for quiz generation with proper error handling and content sanitization.
@/context/2025-10-16T12-00-00/src/concepts/checkpoint_quiz.ts

## Moment 10 — Specification-Driven Development
Followed the specification templates exactly, ensuring each concept matches its spec precisely with proper state management and action definitions.
@/context/2025-10-16T12-00-00/design/specs/
