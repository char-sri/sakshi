const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    const person = await prisma.person.findFirst();
    if (!person) { console.log("No person"); return; }
    
    console.log("Found person", person.id);
    
    const log = await prisma.logEntry.create({
      data: {
        personId: person.id,
        unregisteredName: null,
        unregisteredRole: null,
        type: "ENTRY",
        notes: null
      }
    });
    console.log("Success registered log", log.id);

    const log2 = await prisma.logEntry.create({
      data: {
        personId: null,
        unregisteredName: "Guest",
        unregisteredRole: "Visitor",
        type: "ENTRY",
        notes: null
      }
    });
    console.log("Success unregistered log", log2.id);

  } catch(e) {
    console.error(e);
  }
}
test();
