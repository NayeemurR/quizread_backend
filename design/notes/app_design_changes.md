# App Design Changes

## Summary of Changes Made

### Added Concepts
- **UserAuthentication**: Added per feedback to handle user registration and login
- **Library**: Added per feedback to manage user's book collection
- **ReadingProgress**: Tracks reading state and computes engagement triggers
- **FocusTimer**: Generalized generic timer (no user/book knowledge)
- **CheckpointQuiz**: Uses Gemini API for quiz generation with injectable interface
- **Annotate**: Manages user annotations for content sections

### Key Design Decisions

1. **Modular Architecture**: Each concept is implemented independently with no cross-concept dependencies
2. **ID-based Communication**: Concepts communicate only through IDs and primitives
3. **Generic FocusTimer**: Removed user/book knowledge to keep it truly generic
4. **Injectable Quiz Generator**: CheckpointQuiz uses an interface for quiz generation, allowing for test stubs
5. **Type Safety**: Implemented branded types for all ID types to prevent mixing

### Implementation Notes

- All concepts follow the specification templates exactly
- Database operations are abstracted through collection helpers
- Error handling uses DomainError for clear error messages
- Tests use deterministic stubs for CheckpointQuiz to avoid API costs
- FocusTimer is completely generic and can be used for any timing needs

### Technical Implementation

- Used Deno with MongoDB for backend
- Implemented proper TypeScript types with branding
- Created comprehensive test suites for each concept
- Added proper error handling and validation
- Integrated Gemini API for quiz generation with fallback to stubs
