import { PrismaService } from "src/prisma/src/prisma.service";

export const getCreatorUsername = async (prisma: PrismaService, creatorId: string): Promise<string> => {
  const creator = await prisma.creator.findFirst({
    where: {
      user: {
        email: creatorId,
      },
    },
    select: {
      username: true,
    },
  });

  return creator.username;
};
