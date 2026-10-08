import { db } from "@/server/db";
import { documents, templates, cases } from "@/Model/schema";
import { eq } from "drizzle-orm";

// Dynamic: requires database at runtime
export const dynamic = "force-dynamic";

export default async function NewDocumentPage({
  searchParams,
}: {
  searchParams: Promise<{ caseId?: string }>;
}) {
  const params = await searchParams;
  const caseId = params.caseId ?? null;

  let allCases: Array<{ id: string; plaintiff: string; defendant: string }> = [];
  let templates_list: Array<{ id: string; name: string; documentType: string }> = [];

  try {
    allCases = await db.select().from(cases).orderBy((t) => t.plaintiff);
    templates_list = await db
      .select()
      .from(templates)
      .where(eq(templates.isActive, true))
      .orderBy((t) => t.name);
  } catch {
    // DB not available
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">New Document</h1>
        <a
          href="/documents"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
        >
          Cancel
        </a>
      </div>
      <form action="/api/documents" method="POST" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="name">
              Document Name
            </label>
            <input
              id="name"
              name="name"
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="e.g., First Amended Complaint"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="documentType">
              Document Type
            </label>
            <select
              id="documentType"
              name="documentType"
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">Select type...</option>
              <option value="complaint">Complaint</option>
              <option value="answer">Answer</option>
              <option value="motion">Motion</option>
              <option value="brief">Brief</option>
              <option value="appeal">Appeal</option>
              <option value="order">Order</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="caseId">
            Case
          </label>
          <select
            id="caseId"
            name="caseId"
            defaultValue={caseId ?? ""}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="">Select case...</option>
            {allCases.map((c) => (
              <option key={c.id} value={c.id}>
                {c.plaintiff} v {c.defendant}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="template">
            Use Template (optional)
          </label>
          <select
            id="template"
            name="template"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="">No template</option>
            {templates_list.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.documentType})
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="content">
            Content (Markdown)
          </label>
          <textarea
            id="content"
            name="content"
            rows={12}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 font-mono"
            placeholder="# Document content in Markdown..."
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          Create Document
        </button>
      </form>
    </div>
  );
}
