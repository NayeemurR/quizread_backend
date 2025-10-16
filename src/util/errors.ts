export class DomainError extends Error {
  constructor(msg: string) {
    super(msg);
  }
}
export function requireThat(cond: boolean, msg: string): asserts cond {
  if (!cond) throw new DomainError(msg);
}
