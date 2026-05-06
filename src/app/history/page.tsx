import { getAllLogs } from "@/app/actions";
import { LogHistoryTable } from "@/components/log-history-table";

export const dynamic = "force-dynamic";

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }>;
}) {
  const params = await searchParams;
  const sortOrder = params.sort === "asc" ? "asc" : "desc";
  const logs = await getAllLogs(sortOrder);

  return (
    <div className="max-w-5xl">
      {/* ── Header ───────────────────────────────────── */}
      <div className="mb-8 animate-fade-in">
        <h1
          className="text-2xl font-bold"
          style={{ color: "#18181b", letterSpacing: "-0.03em" }}
        >
          Log History
        </h1>
        <p className="text-sm mt-1" style={{ color: "#71717a" }}>
          Complete record of all building entries and exits
        </p>
      </div>

      <div className="animate-fade-in animate-delay-1">
        <LogHistoryTable logs={logs} currentSort={sortOrder} />
      </div>
    </div>
  );
}
