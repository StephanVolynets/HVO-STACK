import { Stack } from "@mui/material";
import { TaskDetails } from "./components/task-details";
import { Feedbacks } from "../feedbacks";
import { useStaffContext } from "@/sections/staff/tasks/contexts/staff-context";

export default function TaskArea() {
    const { isMultiSelectActive } = useStaffContext();

    return (
        <Stack
            sx={{
                flex: 1,
                flexDirection: 'row',
                gap: 1.5,
                paddingRight: isMultiSelectActive ? 1.5 : 3,
                transition: 'padding-right 0.1s cubic-bezier(0.4, 0, 0.2, 1)',
                overflow: 'hidden', // Important to contain the animation
            }}
        >
            <TaskDetails
                sx={{
                    flex: isMultiSelectActive ? '100%' : 1,
                    minWidth: 0,
                    transition: 'flex 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
            />

            <Feedbacks
                sx={{
                    width: isMultiSelectActive ? '0px' : '320px',
                    minWidth: isMultiSelectActive ? '0px' : '320px',
                    flexShrink: 0,
                    opacity: isMultiSelectActive ? 0 : 1,
                    visibility: isMultiSelectActive ? 'hidden' : 'visible',
                    px: isMultiSelectActive ? 0 : 1.5,
                    // transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    transition: theme => `
                    width 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                    min-width 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                    opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1) ${isMultiSelectActive ? '0s' : '0.2s'},
                    visibility 0.4s cubic-bezier(0.4, 0, 0.2, 1)
                    // px 0.4s cubic-bezier(0.4, 0, 0.2, 1)
                `,
                }}
            />
        </Stack>
    );
}