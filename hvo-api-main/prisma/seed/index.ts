import { PrismaClient } from "@prisma/client";
import populateLanguages from "./langauges/populate-languages";
const prisma = new PrismaClient();

async function main() {
  populateLanguages(prisma);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
