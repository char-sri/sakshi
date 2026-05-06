const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

async function run() {
  const people = await prisma.person.findMany({
    include: { logs: { orderBy: { timestamp: 'desc' } } }
  });
  
  let insideCount = 0;
  for (const p of people) {
    if (p.logs.length > 0 && p.logs[0].type === 'ENTRY') {
      insideCount++;
      console.log(p.fullName, "is inside");
    }
  }
  console.log("Registered people inside:", insideCount);

  const allLogs = await prisma.logEntry.findMany({
    orderBy: { timestamp: 'desc' }
  });
  const entries = allLogs.filter(l => l.type === 'ENTRY').length;
  const exits = allLogs.filter(l => l.type === 'EXIT').length;
  console.log("Total Entries:", entries);
  console.log("Total Exits:", exits);
}
run();
