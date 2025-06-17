import { z } from "zod";
import { vendorSchema } from "../schemas";
import { User } from "./user";

export interface Vendor extends z.infer<typeof vendorSchema> {
  user: User;
}
