import { getAllPeopleSimple } from "@/app/actions";
import { QuickLogForm } from "@/components/quick-log-form";

export const dynamic = "force-dynamic";

export default async function LogPage() {
  const people = await getAllPeopleSimple();

  return (
    <div className="max-w-2xl mx-auto">
      {/* ── Header ───────────────────────────────────── */}
      <div className="mb-10 text-center animate-fade-in">
        <h1
          className="text-3xl font-bold"
          style={{ color: "#18181b", letterSpacing: "-0.03em" }}
        >
          Quick Log
        </h1>
        <p className="text-base mt-2" style={{ color: "#71717a" }}>
          Select a person and record their entry or exit
        </p>
      </div>

      <div className="animate-fade-in animate-delay-1">
        <QuickLogForm people={people} />
      </div>
    </div>
  );
}
