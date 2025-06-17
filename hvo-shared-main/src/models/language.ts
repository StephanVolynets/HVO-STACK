import { z } from "zod";
import { creatorAddLanguageDTOSchema, languageDTOSchema, languageSchema } from "../schemas";
import { CreatorLanguage } from "./creator-language";
import { Staff } from "./staff";
import { AudioDub } from "./audio-dub";

export interface Language extends z.infer<typeof languageSchema> {
  creators: CreatorLanguage[];
  staffs: Staff[];
  AudioDub: AudioDub[];
}

export interface LanguageDTO extends z.infer<typeof languageDTOSchema> {}

export interface CreatorAddLanguageDTO extends z.infer<typeof creatorAddLanguageDTOSchema> {}
