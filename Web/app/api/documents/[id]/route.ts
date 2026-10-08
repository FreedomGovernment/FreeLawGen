import { db } from "@/server/db";
import { documents } from "@/Model/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  const { pathname } = new URL(request.url);
  const idStr = pathname.split("/api/documents/")[1];
  if (!idStr) return Response.json({ error: "Missing document ID" }, { status: 400 });

  const body = await request.json();
  const [updatedDoc] = await db
    .update(documents)
    .set({
      name: body.name,
      documentType: body.documentType,
      caseId: body.caseId ?? null,
      content: body.content,
      status: body.status,
    })
    .where(eq(documents.id, idStr))
    .returning();

  if (!updatedDoc) return Response.json({ error: "Document not found" }, { status: 404 });

  return Response.json(updatedDoc);
}
