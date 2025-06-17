import { PrismaService } from "src/prisma/src/prisma.service";

export const getCreatorDiscordData = async (prisma: PrismaService, creatorId: number) => {
  const creator = await prisma.creator.findUnique({
    where: { id: creatorId },
    select: { discordData: true },
  });

  if (!creator) {
    throw new Error("Creator not found");
  }

  return creator.discordData;
};
