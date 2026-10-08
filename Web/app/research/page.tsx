import { db } from "@/server/db";

export default function ResearchPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <h1 className="text-3xl font-bold">Legal Research</h1>
      <div className="rounded-lg border p-6 text-center">
        <h2 className="text-xl font-semibold mb-2">Search Precedents & Statutes</h2>
        <p className="text-muted-foreground mb-4">
          Search Free Law API, case law, statutes, and regulations.
        </p>
        <div className="max-w-lg mx-auto space-y-3">
          <input
            type="text"
            placeholder="Search for legal precedents..."
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6">
            Search
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          Powered by Free Law API (Free Law Project)
        </p>
      </div>
    </div>
  );
}
