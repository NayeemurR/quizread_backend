import { assertEquals } from "https://deno.land/std/assert/mod.ts";

Deno.test("Simple test to verify setup", () => {
  console.log("Testing basic functionality...");
  assertEquals(1 + 1, 2);
  console.log("Basic test passed!");
});
