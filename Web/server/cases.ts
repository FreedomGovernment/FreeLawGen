import { db } from "@/server/db";
import { cases } from "@/Model/schema";
import { eq } from "drizzle-orm";

export async function getCase(id: string) {
  const [result] = await db
    .select()
    .from(cases)
    .where(eq(cases.id, id))
    .limit(1);
  return result;
}

export async function listCases() {
  return await db
    .select()
    .from(cases)
    .orderBy((t) => t.createdAt);
}
