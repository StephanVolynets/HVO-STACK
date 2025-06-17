import { TaskType } from "@prisma/client";
import { AudioDubPhase } from "@prisma/client";
import { PrismaService } from "src/prisma/src/prisma.service";

export const getCreatorLanguageIds = async (prisma: PrismaService, creatorId: number): Promise<number[]> => {
  const creator = await prisma.creator.findFirst({
    where: {
      id: creatorId,
      // user: {
      //   email: creatorId,
      // },
    },
    select: {
      languages: {
        select: {
          language_id: true,
        },
      },
    },
  });

  const languageIds = creator.languages.map((creatorLanguage) => creatorLanguage.language_id);
  return languageIds;
};

export const getTasksTypesForUpdate = (phase: AudioDubPhase): TaskType[] => {
  switch (phase) {
    case AudioDubPhase.TRANSCRIPTION:
      return [TaskType.TRANSCRIPTION, TaskType.TRANSLATION, TaskType.VOICE_OVER, TaskType.AUDIO_ENGINEERING];
    case AudioDubPhase.TRANSLATION:
      return [TaskType.TRANSLATION, TaskType.VOICE_OVER, TaskType.AUDIO_ENGINEERING];
    case AudioDubPhase.VOICE_OVER:
      return [TaskType.VOICE_OVER, TaskType.AUDIO_ENGINEERING];
    case AudioDubPhase.AUDIO_ENGINEERING:
      return [TaskType.AUDIO_ENGINEERING];
    default:
      return [];
  }
};
