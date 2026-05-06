import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const logs = await prisma.logEntry.findMany({
      orderBy: { timestamp: "desc" },
      include: {
        person: {
          select: {
            fullName: true,
            role: true,
            identifier: true,
          },
        },
      },
    });

    // Define CSV Headers
    const headers = ["Date/Time", "Name", "Role", "Identifier", "Event Type", "Notes"];

    // Build CSV Rows
    const rows = logs.map((log) => {
      const name = log.person ? log.person.fullName : log.unregisteredName || "Unknown";
      const role = log.person ? log.person.role : log.unregisteredRole || "Unknown";
      const identifier = log.person?.identifier || "";
      const notes = log.notes || "";

      return [
        `"${formatDateTime(log.timestamp)}"`,
        `"${name}"`,
        `"${role}"`,
        `"${identifier}"`,
        `"${log.type}"`,
        `"${notes.replace(/"/g, '""')}"`, // Escape quotes in notes
      ].join(",");
    });

    // Combine headers and rows
    const csvContent = [headers.join(","), ...rows].join("\n");

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="sakshi_logs.csv"',
      },
    });
  } catch (error) {
    console.error("Error exporting logs:", error);
    return new NextResponse("Failed to generate CSV export", { status: 500 });
  }
}
