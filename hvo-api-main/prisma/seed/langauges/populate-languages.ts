import { PrismaClient } from "@prisma/client";
import { promises as fs } from "fs";

export default async function populateLanguages(prisma: PrismaClient) {
  const path = __dirname + "/languages.json";
  const data = await fs.readFile(path, "utf-8");
  const languages = JSON.parse(data);

  for (const language of languages) {
    await prisma.language.create({
      data: {
        code: language.code,
        name: language.name,
        flag_url: language.flag_url,
      },
    });
  }

  console.log("[Seed - Successful] Languages populated");
}
