import { z } from "zod";
import {
  createAssistantDTOSchema,
  createUserDTOSchema,
  updateUserDTOSchema,
  updateUserImageDTOSchema,
  userProfileSchema,
  userSchema,
} from "../schemas";
import { Staff } from "./staff";
import { Creator } from "./creator";
import { Vendor } from "./vendor";

export interface User extends z.infer<typeof userSchema> {
  creator?: Creator | null;
  staff?: Staff | null;
  vendor?: Vendor | null;
}

export interface UserProfileDTO extends z.infer<typeof userProfileSchema> {}

export interface CreateUserDTO extends z.infer<typeof createUserDTOSchema> {}

export interface CreateAssistantDTO extends z.infer<typeof createAssistantDTOSchema> {}

export interface UpdateUserDTO extends z.infer<typeof updateUserDTOSchema> {}

export interface UpdateUserImageDTO extends z.infer<typeof updateUserImageDTOSchema> {}
