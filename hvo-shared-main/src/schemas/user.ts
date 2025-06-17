import { z } from "zod";
import { Role, StaffType } from "./enums";

export const userSchema = z.object({
  id: z.number().int(),
  firstName: z.string().nullish(),
  lastName: z.string().nullish(),
  full_name: z.string(),
  email: z.string(),
  role: z.nativeEnum(Role),
  photo_url: z.string().nullish(),
  created_at: z.date(),
  updated_at: z.date(),
});

export const userProfileSchema = userSchema.pick({
  id: true,
  firstName: true,
  lastName: true,
  full_name: true,
  email: true,
  role: true,
  photo_url: true,
}).extend({
  staffType: z.nativeEnum(StaffType).nullish(),
});

export const createUserDTOSchema = userSchema.pick({
  full_name: true,
  email: true,
  role: true,
});

export const createAssistantDTOSchema = userSchema.pick({
  firstName: true,
  lastName: true,
  email: true,
  role: true,
});

export const updateUserDTOSchema = userSchema.pick({
  firstName: true,
  lastName: true,
});

export const updateUserImageDTOSchema = z.object({
  imageUrl: z.string().url("Invalid image URL"),
});
