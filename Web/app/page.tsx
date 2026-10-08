import { db } from "@/server/db";

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <section className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center">
          <div className="text-center p-6">
            <h2 className="text-2xl font-bold mb-2">Cases</h2>
            <p className="text-muted-foreground">Manage your legal cases</p>
          </div>
        </div>
        <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center">
          <div className="text-center p-6">
            <h2 className="text-2xl font-bold mb-2">Documents</h2>
            <p className="text-muted-foreground">Generate legal documents with AI</p>
          </div>
        </div>
        <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center">
          <div className="text-center p-6">
            <h2 className="text-2xl font-bold mb-2">Research</h2>
            <p className="text-muted-foreground">Legal research and precedents</p>
          </div>
        </div>
      </section>
      <section className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-6">
        <h1 className="text-3xl font-bold mb-4">Welcome to FreeLawGen</h1>
        <p className="text-muted-foreground mb-4">
          Open-source AI attorney platform providing equal access to the legal system.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <a
            href="/cases"
            className="p-4 rounded-lg border bg-card text-card-foreground hover:bg-accent transition-colors"
          >
            <h3 className="font-semibold mb-2">Case Manager</h3>
            <p className="text-sm text-muted-foreground">
              Create and manage your legal cases with structured templates.
            </p>
          </a>
          <a
            href="/documents"
            className="p-4 rounded-lg border bg-card text-card-foreground hover:bg-accent transition-colors"
          >
            <h3 className="font-semibold mb-2">Document Generator</h3>
            <p className="text-sm text-muted-foreground">
              Generate pleadings, motions, briefs, and other legal documents.
            </p>
          </a>
        </div>
      </section>
    </div>
  );
}
