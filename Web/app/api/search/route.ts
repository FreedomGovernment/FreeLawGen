import { db } from "@/server/db";
import { cases, documents, researchItems } from "@/Model/schema";
import { eq, ilike } from "drizzle-orm";
import { desc } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const type = searchParams.get("type");

  if (type === "cases") {
    const results = await db
      .select()
      .from(cases)
      .where(ilike(cases.plaintiff, `%${q}%`))
      .orderBy(desc(cases.createdAt))
      .limit(50);
    return Response.json(results);
  }

  if (type === "documents") {
    const results = await db
      .select()
      .from(documents)
      .where(ilike(documents.name, `%${q}%`))
      .orderBy(desc(documents.createdAt))
      .limit(50);
    return Response.json(results);
  }

  if (type === "research") {
    const results = await db
      .select()
      .from(researchItems)
      .where(ilike(researchItems.title, `%${q}%`))
      .orderBy(desc(researchItems.relevance), desc(researchItems.createdAt))
      .limit(50);
    return Response.json(results);
  }

  // Default: search across all
  const caseResults = await db
    .select()
    .from(cases)
    .where(ilike(cases.plaintiff, `%${q}%`))
    .limit(10);
  const docResults = await db
    .select()
    .from(documents)
    .where(ilike(documents.name, `%${q}%`))
    .limit(10);
  const researchResults = await db
    .select()
    .from(researchItems)
    .where(ilike(researchItems.title, `%${q}%`))
    .limit(10);

  return Response.json({
    cases: caseResults,
    documents: docResults,
    research: researchResults,
  });
}
