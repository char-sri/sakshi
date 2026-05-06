"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ─── Types ──────────────────────────────────────────────────

export type ActionResult = {
  success: boolean;
  message: string;
  data?: unknown;
};

// ─── Person Actions ─────────────────────────────────────────

export async function addPerson(formData: FormData): Promise<ActionResult> {
  const fullName = formData.get("fullName") as string;
  const role = formData.get("role") as string;
  const identifier = (formData.get("identifier") as string) || null;

  if (!fullName || fullName.trim().length === 0) {
    return { success: false, message: "Full name is required." };
  }

  if (!role || role.trim().length === 0) {
    return { success: false, message: "Role is required." };
  }

  try {
    const person = await prisma.person.create({
      data: {
        fullName: fullName.trim(),
        role: role.trim(),
        identifier: identifier?.trim() || null,
      },
    });

    revalidatePath("/people");
    revalidatePath("/log");
    revalidatePath("/");

    return {
      success: true,
      message: `${person.fullName} has been registered successfully.`,
      data: person,
    };
  } catch (error) {
    console.error("Error adding person:", error);
    return { success: false, message: "Failed to register person. Please try again." };
  }
}

export async function updatePerson(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  const fullName = formData.get("fullName") as string;
  const role = formData.get("role") as string;
  const identifier = (formData.get("identifier") as string) || null;

  if (!fullName || fullName.trim().length === 0) {
    return { success: false, message: "Full name is required." };
  }

  if (!role || role.trim().length === 0) {
    return { success: false, message: "Role is required." };
  }

  try {
    const person = await prisma.person.update({
      where: { id },
      data: {
        fullName: fullName.trim(),
        role: role.trim(),
        identifier: identifier?.trim() || null,
      },
    });

    revalidatePath("/people");
    revalidatePath("/log");
    revalidatePath("/");
    revalidatePath("/history");

    return {
      success: true,
      message: `${person.fullName} has been updated successfully.`,
      data: person,
    };
  } catch (error) {
    console.error("Error updating person:", error);
    return { success: false, message: "Failed to update person. Please try again." };
  }
}

export async function deletePerson(id: string): Promise<ActionResult> {
  try {
    const person = await prisma.person.delete({
      where: { id },
    });

    revalidatePath("/people");
    revalidatePath("/log");
    revalidatePath("/");
    revalidatePath("/history");

    return {
      success: true,
      message: `${person.fullName} has been deleted.`,
    };
  } catch (error) {
    console.error("Error deleting person:", error);
    return { success: false, message: "Failed to delete person. They may have existing log entries." };
  }
}

export async function getPeople(search?: string) {
  try {
    const people = await prisma.person.findMany({
      where: search
        ? {
            OR: [
              { fullName: { contains: search } },
              { identifier: { contains: search } },
              { role: { contains: search } },
            ],
          }
        : undefined,
      orderBy: { createdAt: "desc" },
      include: {
        logs: {
          orderBy: { timestamp: "desc" },
          take: 1,
        },
      },
    });
    return people;
  } catch (error) {
    console.error("Error fetching people:", error);
    return [];
  }
}

export async function getAllPeopleSimple() {
  try {
    const people = await prisma.person.findMany({
      orderBy: { fullName: "asc" },
      select: {
        id: true,
        fullName: true,
        role: true,
        identifier: true,
      },
    });
    return people;
  } catch (error) {
    console.error("Error fetching people:", error);
    return [];
  }
}

// ─── Log Entry Actions ──────────────────────────────────────

export async function createLogEntry(formData: FormData): Promise<ActionResult> {
  const personId = formData.get("personId") as string;
  const unregisteredName = formData.get("unregisteredName") as string;
  const unregisteredRole = formData.get("unregisteredRole") as string;
  const type = formData.get("type") as string;
  const notes = (formData.get("notes") as string) || null;

  if (!type || (type !== "ENTRY" && type !== "EXIT")) {
    return { success: false, message: "Invalid log type." };
  }

  // Validate that either a registered person is selected or unregistered details are provided
  if (!personId) {
    if (!unregisteredName || unregisteredName.trim().length === 0) {
      return { success: false, message: "Please select a person or provide a guest name." };
    }
    if (!unregisteredRole || unregisteredRole.trim().length === 0) {
      return { success: false, message: "Please specify a role for the unregistered guest." };
    }
  }

  try {
    let personName = unregisteredName?.trim();

    if (personId) {
      const person = await prisma.person.findUnique({
        where: { id: personId },
      });
      if (!person) {
        return { success: false, message: "Registered person not found." };
      }
      personName = person.fullName;
    }

    await prisma.logEntry.create({
      data: {
        personId: personId || null,
        unregisteredName: personId ? null : unregisteredName.trim(),
        unregisteredRole: personId ? null : unregisteredRole.trim(),
        type,
        notes: notes?.trim() || null,
      },
    });

    revalidatePath("/");
    revalidatePath("/log");
    revalidatePath("/history");

    const action = type === "ENTRY" ? "entry" : "exit";
    return {
      success: true,
      message: `${personName}'s ${action} has been recorded.`,
    };
  } catch (error) {
    console.error("Error creating log entry:", error);
    return { success: false, message: "Failed to record log entry. Please try again." };
  }
}

export async function getRecentLogs(limit: number = 5) {
  try {
    const logs = await prisma.logEntry.findMany({
      orderBy: { timestamp: "desc" },
      take: limit,
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
    return logs;
  } catch (error) {
    console.error("Error fetching recent logs:", error);
    return [];
  }
}

export async function getAllLogs(sortOrder: "asc" | "desc" = "desc") {
  try {
    const logs = await prisma.logEntry.findMany({
      orderBy: { timestamp: sortOrder },
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
    return logs;
  } catch (error) {
    console.error("Error fetching logs:", error);
    return [];
  }
}

// ─── Dashboard Stats ────────────────────────────────────────

export async function getDashboardStats() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalPeople, totalLogs, todayEntries, todayExits] = await Promise.all([
      prisma.person.count(),
      prisma.logEntry.count(),
      prisma.logEntry.count({
        where: {
          type: "ENTRY",
          timestamp: { gte: today },
        },
      }),
      prisma.logEntry.count({
        where: {
          type: "EXIT",
          timestamp: { gte: today },
        },
      }),
    ]);

    // Calculate Occupancy for Registered People
    const peopleWithLogs = await prisma.person.findMany({
      include: {
        logs: {
          orderBy: { timestamp: "desc" },
          take: 1,
        },
      },
    });

    let registeredInside = 0;
    for (const person of peopleWithLogs) {
      if (person.logs.length > 0 && person.logs[0].type === "ENTRY") {
        registeredInside++;
      }
    }

    // Calculate Occupancy for Unregistered People
    const unregisteredEntries = await prisma.logEntry.count({
      where: { personId: null, type: "ENTRY" },
    });
    const unregisteredExits = await prisma.logEntry.count({
      where: { personId: null, type: "EXIT" },
    });
    const unregisteredInside = Math.max(0, unregisteredEntries - unregisteredExits);

    return {
      totalPeople,
      totalLogs,
      todayEntries,
      todayExits,
      currentOccupancy: registeredInside + unregisteredInside,
    };
  } catch (error) {
    console.error("Error fetching stats:", error);
    return {
      totalPeople: 0,
      totalLogs: 0,
      todayEntries: 0,
      todayExits: 0,
      currentOccupancy: 0,
    };
  }
}
