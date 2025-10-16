export type UserId = string & { __brand: "UserId" };
export type BookId = string & { __brand: "BookId" };
export type SessionId = string & { __brand: "SessionId" };
export type TimerId = string & { __brand: "TimerId" };
export type QuizId = string & { __brand: "QuizId" };
export type AttemptId = string & { __brand: "AttemptId" };
export type AnnotationId = string & { __brand: "AnnotationId" };
export const asId = <T extends string>(s: string) => s as T;
