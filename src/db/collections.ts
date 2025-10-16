import { getDb } from "./client.ts";
export async function users() {
  return (await getDb()).collection("users");
}
export async function books() {
  return (await getDb()).collection("books");
}
export async function sessions() {
  return (await getDb()).collection("reading_sessions");
}
export async function timers() {
  return (await getDb()).collection("timers");
}
export async function quizzes() {
  return (await getDb()).collection("quizzes");
}
export async function attempts() {
  return (await getDb()).collection("quiz_attempts");
}
export async function annotations() {
  return (await getDb()).collection("annotations");
}
