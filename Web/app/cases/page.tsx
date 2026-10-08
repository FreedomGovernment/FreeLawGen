import { db } from "@/server/db";
import { cases } from "@/Model/schema";
import { desc } from "drizzle-orm";

// Dynamic: requires database at runtime
export const dynamic = "force-dynamic";

export default async function CasesPage() {
  let caseList: Array<{
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
  }> = [];
  try {
    caseList = await db
      .select()
      .from(cases)
      .orderBy(desc(cases.createdAt))
      .limit(50);
  } catch {
    // DB not available — show empty state
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Cases</h1>
        <a
          href="/cases/new"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          New Case
        </a>
      </div>
      <div className="rounded-md border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="h-12 px-4 text-left align-middle font-medium">Case Name</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Court</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {caseList.map((c) => (
              <tr key={c.id} className="border-b">
                <td className="p-4">
                  <a href={`/cases/${c.id}`} className="text-primary hover:underline">
                    {c.plaintiff} v {c.defendant}
                  </a>
                </td>
                <td className="p-4">{c.court ?? "—"}</td>
                <td className="p-4">{c.status ?? "—"}</td>
                <td className="p-4 text-muted-foreground">
                  {c.createdAt?.toLocaleDateString()}
                </td>
              </tr>
            ))}
            {caseList.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-muted-foreground">
                  No cases yet. Create your first case to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
