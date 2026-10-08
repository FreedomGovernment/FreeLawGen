// Copyright AStarship <https://astarship.net>.
import { db } from "@/server/db";
import { documents } from "@/Model/schema";
import { eq } from "drizzle-orm";
import { exportToPleadingPdf } from "@freelawgen/court/pleading-pdf";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

// Renders a document's stored Markdown to a court-formatted PDF and streams it
// back as an attachment. The exporter is the shared @freelawgen/court Kit
// function (deterministic DOCX -> LibreOffice PDF); this route only adapts it to
// the Web app: it never writes into the case's storage, only a temp scratch dir.
export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const id = params?.id;
  if (!id) return Response.json({ error: "Missing document ID" }, { status: 400 });

  const [doc] = await db.select().from(documents).where(eq(documents.id, id)).limit(1);
  if (!doc) return Response.json({ error: "Document not found" }, { status: 404 });
  if (!doc.content || doc.content.trim().length === 0) {
    return Response.json({ error: "Document has no content to export" }, { status: 400 });
  }

  const scratch = mkdtempSync(path.join(tmpdir(), "freelawgen-export-"));
  const source = path.join(scratch, "Document.md");
  const out = path.join(scratch, "Document.pdf");
  try {
    // Write-only into the scratch dir; the DB content is read, never mutated.
    const { writeFileSync } = await import("node:fs");
    writeFileSync(source, doc.content, "utf8");
    await exportToPleadingPdf(source, out);
    const { readFileSync, existsSync } = await import("node:fs");
    if (!existsSync(out)) return Response.json({ error: "PDF generation failed" }, { status: 500 });
    const pdf = readFileSync(out);
    const safeName = (doc.name || "document").replace(/[^a-zA-Z0-9._-]+/g, "_") || "document";
    return new Response(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${safeName}.pdf"`,
        "Content-Length": String(pdf.length),
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    return Response.json(
      { error: `Export failed: ${e instanceof Error ? e.message : String(e)}` },
      { status: 500 },
    );
  } finally {
    // Scratch PDF/MD are never deliverables; remove them on every path.
    rmSync(scratch, { recursive: true, force: true });
  }
}
