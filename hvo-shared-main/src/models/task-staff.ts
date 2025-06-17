import { z } from "zod";
import { taskStaffSchema } from "../schemas";
import { Task } from "./task";
import { Staff } from "./staff";

export interface TaskStaff extends z.infer<typeof taskStaffSchema> {
  task: Task;
  staff: Staff;
}
