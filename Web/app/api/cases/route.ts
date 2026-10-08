import { db } from "@/server/db";
import { cases } from "@/Model/schema";

export async function POST(request: Request) {
  const body = await request.json();
  const [newCase] = await db
    .insert(cases)
    .values({
      plaintiff: body.plaintiff,
      defendant: body.defendant,
      court: body.court,
      caseNumber: body.caseNumber,
      jurisdiction: body.jurisdiction,
      causeOfAction: body.causeOfAction,
      status: body.status ?? "active",
      notes: body.notes,
    })
    .returning();

  return Response.json(newCase, { status: 201 });
}
