import { Divider, Stack } from "@mui/material";
import { useInboxContext } from "../../../contexts/inbox-context";
import FilterChip from "./filter-chip";

export default function ActiveFiltersChips() {
  const { staffNotAssigned, setStaffNotAssigned, hasFeedback, setHasFeedback } =
    useInboxContext();

  return (
    <Stack direction="row" spacing={1}>
      {(staffNotAssigned || hasFeedback) && (
        <Divider orientation="vertical" flexItem />
      )}

      {staffNotAssigned && (
        <FilterChip
          type="staffNotAssigned"
          label="Staff not assigned"
          onRemove={() => setStaffNotAssigned(false)}
          count={5}
        />
      )}

      {hasFeedback && (
        <FilterChip
          type="hasFeedback"
          label="Creator Feedbacks"
          onRemove={() => setHasFeedback(false)}
          count={7}
        />
      )}
    </Stack>
  );
}
