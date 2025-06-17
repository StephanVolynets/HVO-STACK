import { Stack, SxProps, Box } from "@mui/material";
import { TaskResources } from "./components/task-resources";
// import { FileManager } from "./components/file-manager";
import { useSnackbar } from "notistack";
import { TaskDTO, TaskStatus } from "hvo-shared";
import FileManager from "./components/file-manager/file-manager";
import { useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { completeTask } from "@/apis/task";
import { useStaffContext } from "@/sections/staff/tasks/contexts/staff-context";
import { BulkView } from "./components/bulk-view";
// export default function ResourcesTab() {
//   const { selectedTask } = useSelectedTask();

//   return (
//     <Stack flex={1}>
//       <TaskResources />

//       <FileManager key={selectedTask} />
//     </Stack>
//   );
// }

export default function TaskDetails({ sx }: { sx?: SxProps }) {
  const { enqueueSnackbar } = useSnackbar(); // For showing error messages
  const queryClient = useQueryClient();
  // const { filter, searchTerm } = useTasksFilters();

  // const { tasks } = useGetTasks();
  // const selectedTask = useMemo(() => {
  //   if (tasks && selectedTaskId) {
  //     return tasks.find((task) => task.id === selectedTaskId);
  //   }
  // }, [tasks, selectedTaskId]);

  const { selectedTask, isMultiSelectActive } = useStaffContext();

  // Handle any errors that occur during file operations
  const handleError = (error: Error) => {
    enqueueSnackbar(error.message, { variant: "error" });
  };

  // Handle task completion
  const handleTaskComplete = async () => {
    if (!selectedTask) return;

    try {
      // Optimistically update the tasks cache
      queryClient.setQueryData<TaskDTO[] | undefined>(
        ["tasks/tasks"],
        (oldTasks) => {
          // queryClient.setQueryData<TaskDTO[] | undefined>(["tasks/tasks", filter, searchTerm], (oldTasks) => {
          if (!oldTasks) return oldTasks;

          return oldTasks.map((task) =>
            task.id === selectedTask.id
              ? { ...task, status: TaskStatus.COMPLETED }
              : task
          );
        }
      );

      // Actually complete the task
      await completeTask(selectedTask.id);

      // Show success message
      enqueueSnackbar("Task completed successfully", { variant: "success" });
    } catch (error) {
      // Revert the optimistic update
      queryClient.invalidateQueries({
        // queryKey: ["tasks/tasks", filter, searchTerm],
        queryKey: ["tasks/tasks"],
      });

      // Show error message
      enqueueSnackbar("Failed to complete task", { variant: "error" });
      // throw error; // Propagate error to trigger animation reset
    }
  };

  console.log("Selected task:", selectedTask);

  return (
    <Stack
      flex={1}
      sx={{
        backgroundColor: "common.background",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        ...sx,
      }}
      px={3}
      py={1.5}
      position="relative"
    >
      <Stack
        sx={{
          opacity: isMultiSelectActive ? 0 : 1,
          visibility: isMultiSelectActive ? "hidden" : "visible",
          height: isMultiSelectActive ? 0 : "auto",
          transition: `
            opacity ${
              isMultiSelectActive ? "0.25s" : "0.5s"
            } cubic-bezier(0.4, 0, 0.2, 1),
            visibility 0.5s cubic-bezier(0.4, 0, 0.2, 1),
            height 0.4s cubic-bezier(0.4, 0, 0.2, 1)
        `,
          overflow: "hidden",
          flex: 1,
        }}
      >
        <TaskResources />

        {selectedTask && (
          <FileManager
            key={selectedTask.id}
            taskId={selectedTask.id}
            folderId={selectedTask.uploaded_files_folder_id!}
            isTaskInProgress={selectedTask.status === TaskStatus.IN_PROGRESS}
            onTaskComplete={handleTaskComplete}
            onError={handleError}
            taskStatus={selectedTask.status}
          />
        )}
      </Stack>

      <Stack
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        sx={{
          opacity: isMultiSelectActive ? 1 : 0,
          visibility: isMultiSelectActive ? "visible" : "hidden",
          height: isMultiSelectActive ? "auto" : 0,
          transition:
            "opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.5s cubic-bezier(0.4, 0, 0.2, 1), height 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          overflow: "hidden",
          flex: 1,
        }}
      >
        <BulkView />
      </Stack>
    </Stack>
  );
}
