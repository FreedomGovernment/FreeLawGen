import { db } from "@/server/db";
import { documents, cases } from "@/Model/schema";
import { eq } from "drizzle-orm";

// Dynamic: requires database at runtime
export const dynamic = "force-dynamic";

export default async function DocumentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;
  if (!id || id.length === 0) return <div>Document not found</div>;

  let doc: {
    id: string;
    caseId: string | null;
    name: string;
    documentType: string | null;
    content: string | null;
    status: string | null;
    version: number;
    wordCount: number | null;
    createdAt: Date;
    updatedAt: Date;
  } | undefined;
  try {
    const [result] = await db
      .select()
      .from(documents)
      .where(eq(documents.id, id))
      .limit(1);
    doc = result;
  } catch {
    return <div>Database error</div>;
  }

  if (!doc) return <div>Document not found</div>;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{doc.name}</h1>
        <div className="flex gap-2">
          <a
            href={`/documents/${id}/edit`}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            Edit
          </a>
          <a
            href={`/api/documents/${id}/export`}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            Download PDF
          </a>
          <a
            href="/documents"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            Back
          </a>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 rounded-lg border p-4 space-y-4">
          <div>
            <h2 className="font-semibold mb-2">Content</h2>
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                {doc.content ?? "No content yet."}
              </pre>
            </div>
          </div>
        </div>
        <div className="rounded-lg border p-4 space-y-3">
          <h2 className="font-semibold">Details</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Type</dt>
              <dd>{doc.documentType ?? "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Status</dt>
              <dd>{doc.status ?? "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Case</dt>
              <dd>{doc.caseId ?? "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Version</dt>
              <dd>{doc.version ?? 1}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Words</dt>
              <dd>{doc.wordCount ?? "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Created</dt>
              <dd>{doc.createdAt?.toLocaleDateString()}</dd>
            </div>
          </dl>
          <div className="pt-2 space-y-2">
            <a
              href={`/api/documents/${id}/export`}
              className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Export PDF
            </a>
            <button
              disabled
              title="DOCX export is not implemented yet"
              className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background opacity-50 cursor-not-allowed h-10 px-4 py-2"
            >
              Export DOCX (coming soon)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
