import { db } from "@/server/db";
import { cases } from "@/Model/schema";
import { eq } from "drizzle-orm";

// Dynamic: requires database at runtime
export const dynamic = "force-dynamic";

export default async function CaseDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;
  if (!id || id.length === 0) return <div>Case not found</div>;

  let caseData: {
    id: string;
    plaintiff: string;
    defendant: string;
    court: string | null;
    caseNumber: string | null;
    jurisdiction: string | null;
    causeOfAction: string | null;
    status: string | null;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
  } | undefined;
  try {
    const [result] = await db
      .select()
      .from(cases)
      .where(eq(cases.id, id))
      .limit(1);
    caseData = result;
  } catch {
    return <div>Database error</div>;
  }

  if (!caseData) return <div>Case not found</div>;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {caseData.plaintiff} v {caseData.defendant}
        </h1>
        <a
          href="/cases"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
        >
          Back to Cases
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-lg border p-4 space-y-3">
          <h2 className="font-semibold">Case Details</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Court</dt>
              <dd>{caseData.court ?? "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Case Number</dt>
              <dd>{caseData.caseNumber ?? "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Jurisdiction</dt>
              <dd>{caseData.jurisdiction ?? "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Cause of Action</dt>
              <dd>{caseData.causeOfAction ?? "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Status</dt>
              <dd>{caseData.status ?? "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Created</dt>
              <dd>{caseData.createdAt?.toLocaleDateString()}</dd>
            </div>
          </dl>
          {caseData.notes && (
            <div className="pt-2">
              <h3 className="font-medium text-sm mb-1">Notes</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {caseData.notes}
              </p>
            </div>
          )}
        </div>
        <div className="rounded-lg border p-4">
          <h2 className="font-semibold mb-3">Actions</h2>
          <div className="space-y-2">
            <a
              href={`/documents?caseId=${caseData.id}`}
              className="block w-full text-left rounded-md border p-3 hover:bg-accent transition-colors"
            >
              <span className="font-medium">Generate Documents</span>
              <p className="text-sm text-muted-foreground">
                Create pleadings, motions, and briefs
              </p>
            </a>
            <a
              href={`/research?caseId=${caseData.id}`}
              className="block w-full text-left rounded-md border p-3 hover:bg-accent transition-colors"
            >
              <span className="font-medium">Legal Research</span>
              <p className="text-sm text-muted-foreground">
                Search precedents and statutes
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
