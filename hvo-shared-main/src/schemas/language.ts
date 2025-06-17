import { z } from "zod";

export const languageSchema = z.object({
  id: z.number().int(),
  code: z.string(),
  name: z.string(),
  flag_url: z.string().nullish(),
});

export const languageDTOSchema = languageSchema.pick({
  id: true,
  code: true,
  name: true,
  flag_url: true,
});

export const creatorAddLanguageDTOSchema = z.object({
  languageId: z.number().int(),
  creatorId: z.string(),
});
