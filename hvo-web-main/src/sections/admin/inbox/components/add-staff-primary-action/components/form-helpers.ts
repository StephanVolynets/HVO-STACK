// import { STAFF_TYPES } from "@/constants";
import { CreateStaffDTO, SelectOption, STAFF_TYPES, toDisplayName } from "hvo-shared";

export const formDefaultValues: CreateStaffDTO = {
  full_name: "",
  email: "",
  staff_type: null,
  language_id: 1,
};

export const staffOptions = STAFF_TYPES.map(
  (type) =>
    ({
      label: toDisplayName(type),
      id: type,
    } as SelectOption)
);
