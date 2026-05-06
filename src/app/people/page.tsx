import { getPeople } from "@/app/actions";
import { AddPersonForm } from "@/components/add-person-form";
import { PeopleList } from "@/components/people-list";

export const dynamic = "force-dynamic";

export default async function PeoplePage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const params = await searchParams;
  const search = params.search || "";
  const people = await getPeople(search || undefined);

  return (
    <div className="max-w-5xl">
      {/* ── Header ───────────────────────────────────── */}
      <div className="mb-8 animate-fade-in">
        <h1
          className="text-2xl font-bold"
          style={{ color: "#18181b", letterSpacing: "-0.03em" }}
        >
          People Directory
        </h1>
        <p className="text-sm mt-1" style={{ color: "#71717a" }}>
          Manage registered individuals in the building
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Add Person Form */}
        <div className="lg:col-span-2 animate-fade-in animate-delay-1">
          <AddPersonForm />
        </div>

        {/* People List */}
        <div className="lg:col-span-3 animate-fade-in animate-delay-2">
          <PeopleList people={people} initialSearch={search} />
        </div>
      </div>
    </div>
  );
}
