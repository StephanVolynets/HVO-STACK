import { z } from "zod";

export const assistantSchema = z.object({
  id: z.number().int(),
  managerId: z.number().int(),
});

export const assistantDTOSchema = z.object({
  id: z.number().int(),
  displayName: z.string(),
  email: z.string(),
  totalPermissions: z.number().int(),
  assistantPermissionsCount: z.number().int(),
});
