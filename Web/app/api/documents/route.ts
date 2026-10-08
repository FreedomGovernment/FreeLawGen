import { db } from "@/server/db";
import { documents } from "@/Model/schema";

export async function POST(request: Request) {
  const body = await request.json();
  const [newDoc] = await db
    .insert(documents)
    .values({
      name: body.name,
      documentType: body.documentType,
      caseId: body.caseId ?? null,
      content: body.content ?? "",
      status: body.status ?? "draft",
    })
    .returning();

  return Response.json(newDoc, { status: 201 });
}
