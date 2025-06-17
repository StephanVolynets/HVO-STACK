import { Box, Typography } from "@mui/material";

import { Stack } from "@mui/material";
import { useStaffContext } from "@/sections/staff/tasks/contexts/staff-context";
import BulkStep from "./components/step";
import { Step1SelectVideos } from "./components/step-1";
import { Step2ChooseLangauge } from "./components/step-2";
import { Step3Download } from "./components/step-3-download";
import { Step3Upload } from "./components/step-3-upload";
import { useAuthContext } from "@/auth/hooks/use-auth-context";
import { StaffType } from "hvo-shared";

export default function BulkView() {
  const {
    checkedVideos,
    bulkMethod,
    bulkActionsStep,
    setBulkActionsStep,
    setChosenLanguage,
  } = useStaffContext();
  const { profile } = useAuthContext();

  //   const [chosenLanguage, setChosenLanguage] = useState<{
  //     id: number;
  //     name: string;
  //     code: string;
  //   } | null>(null);

  //   const handleLanguageChange = (language: {
  //     id: number;
  //     name: string;
  //     code: string;
  //   }) => {
  //     setChosenLanguage(language);
  //     setBulkActionsStep(2);
  //   };

  const onStep1Complete = () => {
    if (profile?.staffType === StaffType.TRANSCRIPTOR) {
      setBulkActionsStep(2);
      setChosenLanguage({
        id: -1,
        name: "English",
        code: "US",
      });
    } else {
      setBulkActionsStep(1);
    }
  };

  return (
    <Stack sx={{ flex: 1, pb: 1.5, pt: 2.5, px: 4.5 }} spacing={4}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <BulkStep
          state={bulkActionsStep === 0 ? "active" : "completed"}
          title="Step 1: Select Videos & Method"
        />
        <BulkStep
          state={
            bulkActionsStep === 1
              ? "active"
              : bulkActionsStep > 1
              ? "completed"
              : "pending"
          }
          title="Step 2: Select Language"
        />
        <BulkStep
          state={
            bulkActionsStep === 2
              ? "active"
              : bulkActionsStep > 2
              ? "completed"
              : "pending"
          }
          title={
            "Step 3: " +
            (bulkMethod === "none"
              ? "X"
              : bulkMethod === "download"
              ? "Download resources"
              : "Upload all files and submit")
          }
        />
      </Stack>
      {bulkActionsStep === 0 && (
        <Step1SelectVideos onStepComplete={onStep1Complete} />
      )}
      {bulkActionsStep === 1 && <Step2ChooseLangauge />}
      {bulkActionsStep === 2 && bulkMethod === "download" && <Step3Download />}
      {bulkActionsStep === 2 && bulkMethod === "upload" && (
        <Step3Upload handleNextStep={() => setBulkActionsStep(3)} />
      )}
    </Stack>
  );
}
