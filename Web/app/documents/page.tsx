import { db } from "@/server/db";
import { documents, cases } from "@/Model/schema";
import { eq } from "drizzle-orm";

// Dynamic: requires database at runtime
export const dynamic = "force-dynamic";

export default async function DocumentsPage({
  searchParams,
}: {
  searchParams: Promise<{ caseId?: string }>;
}) {
  const params = await searchParams;
  const caseId = params.caseId ?? null;

  let docList: Array<{
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
  }> = [];
  try {
    if (caseId) {
      docList = await db
        .select()
        .from(documents)
        .where(eq(documents.caseId, caseId))
        .orderBy((t) => t.createdAt);
    }
  } catch {
    // DB not available
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Documents</h1>
        <a
          href="/documents/new"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          New Document
        </a>
      </div>
      <div className="rounded-md border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="h-12 px-4 text-left align-middle font-medium">Name</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Type</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Case</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {docList.map((d) => (
              <tr key={d.id} className="border-b">
                <td className="p-4">
                  <a href={`/documents/${d.id}`} className="text-primary hover:underline">
                    {d.name}
                  </a>
                </td>
                <td className="p-4">{d.documentType ?? "—"}</td>
                <td className="p-4">{d.caseId ?? "—"}</td>
                <td className="p-4">{d.status ?? "—"}</td>
                <td className="p-4 text-muted-foreground">
                  {d.createdAt?.toLocaleDateString()}
                </td>
              </tr>
            ))}
            {docList.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted-foreground">
                  No documents yet. Create your first document to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
