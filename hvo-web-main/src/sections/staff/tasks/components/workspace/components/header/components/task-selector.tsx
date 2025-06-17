import { FlagEmoji } from "@/components/flag-emoji";
import SvgColor from "@/components/svg-color";
import { useStaffContext } from "@/sections/staff/tasks/contexts/staff-context";
import { Box, Chip, ListItemText, MenuItem, Select, Stack, Typography } from "@mui/material";
import { TaskStatus } from "hvo-shared";

export default function TaskSelector() {
    const { selectedVideo, taskId, handleVideoSelection } = useStaffContext();

    if (!selectedVideo) {
        return null;
    }

    const renderValue = (selected: any) => {
        if (selected !== null) {
            const task = selectedVideo.tasks.find((task) => task.taskId === selected);

            if (task) {
                return (
                    <Stack direction="row" alignItems="center" spacing={0.5} px={0.75} py={2} sx={{ maxWidth: '100%' }}>
                        <FlagEmoji countryCode={task.languageCode} size={24} maxHeight={16} />
                        <Typography
                            sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                flexGrow: 1
                            }}
                            fontSize={16}
                            fontWeight={600}
                        >
                            {task.languageName}
                        </Typography>
                        <Chip
                            label={selectedVideo.tasks.length}
                            size="small"
                            sx={{
                                borderRadius: "100px",
                                backgroundColor: "#F4F4F4",
                                color: "#1A1A1A",
                                fontWeight: 700,
                                flexShrink: 0,
                                "&:hover": {
                                    backgroundColor: "#F4F4F4",
                                },
                            }}
                        />
                        {/* {task.status === TaskStatus.IN_PROGRESS && (<Box sx={{
                            width: 12,
                            height: 12,
                            borderRadius: 100,
                            backgroundColor: "#4285F4",
                            mr: 1,
                        }} />
                        )} */}
                    </Stack>
                );
            }
        }
        return <Typography color="text.secondary">Select a language</Typography>;
    };

    return (
        <Select
            value={taskId || ""}
            onChange={(e) => handleVideoSelection(selectedVideo.id, Number(e.target.value))}
            size="small"
            sx={{
                minWidth: 188,
                border: "1px solid #E6E6E6",
                borderRadius: "100px",
            }}
            renderValue={renderValue}
            MenuProps={{
                anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "right",
                },
                transformOrigin: {
                    vertical: "top",
                    horizontal: "right",
                },
            }}
        >
            {selectedVideo.tasks.map((task) => (
                <MenuItem
                    key={task.taskId}
                    value={task.taskId}
                    sx={{
                        border: "1px solid #E6E6E6",
                    }}
                >
                    <Stack direction="row" spacing={1} alignItems="center" width="100%">
                        <FlagEmoji countryCode={task.languageCode} maxHeight={24} />
                        <ListItemText
                            primary={
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Typography sx={{ fontWeight: 600, fontSize: 16 }}>
                                        {task.languageName}
                                    </Typography>
                                </Stack>
                            }
                        />
                        {task.status === TaskStatus.IN_PROGRESS && (<Box sx={{
                            width: 12,
                            height: 12,
                            borderRadius: 100,
                            backgroundColor: "#2E7D32",
                            mr: 1,
                        }} />)}
                    </Stack>
                </MenuItem>
            ))}
        </Select>
    );
}   