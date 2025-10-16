import { MongoClient } from "npm:mongodb";
let db: any | null = null;
export async function getDb() {
  if (db) return db;
  const url = Deno.env.get("MONGODB_URL");
  const name = Deno.env.get("DB_NAME");
  if (!url || !name) throw new Error("Missing MONGODB_URL or DB_NAME");
  const client = new MongoClient(url);
  await client.connect();
  db = client.db(name);
  return db;
}
