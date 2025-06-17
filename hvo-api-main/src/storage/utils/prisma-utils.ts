import { PrismaService } from "src/prisma/src/prisma.service";

export const getCreatorRootFolderId = async (prisma: PrismaService, creatorId: string): Promise<string> => {
  const creator = await prisma.creator.findFirst({
    where: {
      user: {
        email: creatorId,
      },
    },
    select: {
      root_folder_id: true,
    },
  });

  console.log("FOUND: ", creator);

  return creator.root_folder_id;
};

export const getCreatorFolderIdAndLanguages = async (
  prisma: PrismaService,
  creatorId: string
): Promise<{ creatorFolderId: string; languages: any[] }> => {
  const creator = await prisma.creator.findFirst({
    where: {
      user: {
        email: creatorId,
      },
    },
    select: {
      root_folder_id: true,
      languages: {
        select: {
          language: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      },
    },
  });

  const creatorFolderId = creator.root_folder_id;
  const languages = creator.languages.map((creatorLanguage) => ({
    name: creatorLanguage.language.name,
    id: creatorLanguage.language.id,
  }));

  return {
    creatorFolderId,
    languages,
  };
};
