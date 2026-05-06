import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await prisma.logEntry.deleteMany();
  await prisma.person.deleteMany();

  // Create people
  const people = await Promise.all([
    prisma.person.create({
      data: { fullName: "Arjun Mehta", role: "Resident", identifier: "Apt 302" },
    }),
    prisma.person.create({
      data: { fullName: "Priya Sharma", role: "Resident", identifier: "Apt 105" },
    }),
    prisma.person.create({
      data: { fullName: "Rajesh Kumar", role: "Staff", identifier: "Badge #S12" },
    }),
    prisma.person.create({
      data: { fullName: "Ananya Reddy", role: "Resident", identifier: "Apt 410" },
    }),
    prisma.person.create({
      data: { fullName: "Vikram Singh", role: "Staff", identifier: "Badge #S07" },
    }),
    prisma.person.create({
      data: { fullName: "Deepika Patel", role: "Guest", identifier: null },
    }),
    prisma.person.create({
      data: { fullName: "Karthik Nair", role: "Resident", identifier: "Apt 208" },
    }),
    prisma.person.create({
      data: { fullName: "Sunita Joshi", role: "Guest", identifier: null },
    }),
  ]);

  console.log(`✅ Created ${people.length} people`);

  // Create log entries with staggered timestamps
  const now = new Date();
  const logs = [
    { person: people[0], type: "ENTRY", minutesAgo: 5, notes: "Returned from work" },
    { person: people[2], type: "ENTRY", minutesAgo: 12, notes: "Morning shift start" },
    { person: people[1], type: "EXIT", minutesAgo: 25, notes: null },
    { person: people[5], type: "ENTRY", minutesAgo: 40, notes: "Visiting Apt 302" },
    { person: people[3], type: "ENTRY", minutesAgo: 55, notes: null },
    { person: people[4], type: "ENTRY", minutesAgo: 120, notes: "Maintenance check" },
    { person: people[6], type: "EXIT", minutesAgo: 180, notes: "Gym" },
    { person: people[0], type: "EXIT", minutesAgo: 300, notes: "Left for work" },
    { person: people[7], type: "ENTRY", minutesAgo: 350, notes: "Delivery pickup" },
    { person: people[7], type: "EXIT", minutesAgo: 320, notes: null },
    { person: people[2], type: "EXIT", minutesAgo: 1440, notes: "End of shift" },
    { person: people[1], type: "ENTRY", minutesAgo: 1500, notes: null },
  ];

  for (const log of logs) {
    const timestamp = new Date(now.getTime() - log.minutesAgo * 60 * 1000);
    await prisma.logEntry.create({
      data: {
        personId: log.person.id,
        type: log.type,
        timestamp,
        notes: log.notes,
      },
    });
  }

  console.log(`✅ Created ${logs.length} log entries`);
  console.log("🎉 Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
