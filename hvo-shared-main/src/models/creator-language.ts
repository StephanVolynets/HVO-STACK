import { z } from "zod";
import { creatorLanguageSchema } from "../schemas";
import { Creator } from "./creator";
import { Language } from "./language";

export interface CreatorLanguage extends z.infer<typeof creatorLanguageSchema> {
  creator: Creator;
  language: Language;
}
