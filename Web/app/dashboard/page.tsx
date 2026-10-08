import { db } from "@/server/db";
import { documents, cases } from "@/Model/schema";
import { desc } from "drizzle-orm";

// Dynamic: requires database at runtime
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  let caseCount = 0;
  let docCount = 0;
  let recentCases: Array<{
    id: string;
    plaintiff: string;
    defendant: string;
    court: string | null;
    status: string | null;
    createdAt: Date;
  }> = [];
  let recentDocs: Array<{
    id: string;
    name: string;
    documentType: string | null;
    createdAt: Date;
  }> = [];

  try {
    caseCount = await db.$count(cases);
    docCount = await db.$count(documents);
    recentCases = await db
      .select()
      .from(cases)
      .orderBy(desc(cases.createdAt))
      .limit(5);
    recentDocs = await db
      .select()
      .from(documents)
      .orderBy(desc(documents.createdAt))
      .limit(5);
  } catch {
    // DB not available
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center">
          <div className="text-center p-6">
            <p className="text-4xl font-bold">{caseCount}</p>
            <p className="text-muted-foreground">Active Cases</p>
          </div>
        </div>
        <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center">
          <div className="text-center p-6">
            <p className="text-4xl font-bold">{docCount}</p>
            <p className="text-muted-foreground">Documents</p>
          </div>
        </div>
        <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center">
          <div className="text-center p-6">
            <p className="text-4xl font-bold">
              {recentCases.filter((c) => c.status === "active").length}
            </p>
            <p className="text-muted-foreground">Open Cases</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-lg border p-4">
          <h2 className="font-semibold mb-3">Recent Cases</h2>
          {recentCases.length === 0 ? (
            <p className="text-muted-foreground text-sm">No cases yet.</p>
          ) : (
            <ul className="space-y-2">
              {recentCases.map((c) => (
                <li key={c.id}>
                  <a href={`/cases/${c.id}`} className="text-primary hover:underline text-sm">
                    {c.plaintiff} v {c.defendant}
                  </a>
                  <span className="text-muted-foreground text-xs ml-2">
                    {c.court}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="rounded-lg border p-4">
          <h2 className="font-semibold mb-3">Recent Documents</h2>
          {recentDocs.length === 0 ? (
            <p className="text-muted-foreground text-sm">No documents yet.</p>
          ) : (
            <ul className="space-y-2">
              {recentDocs.map((d) => (
                <li key={d.id}>
                  <a href={`/documents/${d.id}`} className="text-primary hover:underline text-sm">
                    {d.name}
                  </a>
                  <span className="text-muted-foreground text-xs ml-2">
                    {d.documentType}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
