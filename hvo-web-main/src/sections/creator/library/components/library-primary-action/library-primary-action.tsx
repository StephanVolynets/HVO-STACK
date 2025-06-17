import { Button, ButtonGroup, Box, Stack } from "@mui/material";
import { useState } from "react";
import SvgColor from "@/components/svg-color";
import { useBoolean } from "@/hooks/use-boolean";
import Iconify from "@/components/iconify";
import { AddVideoModal } from "./components/add-video-modal";
import { BulkUploadModal } from "./components/bulk-upload-modal";

interface Props {
  displayBulkButton?: boolean;
}

export default function LibraryPrimaryAction({ displayBulkButton }: Props) {
  const isAddVideoModalOpen = useBoolean();
  const isBulkUploadModalOpen = useBoolean();
  // const [showBulkButton, setShowBulkButton] = useState(false);

  // const handleClick = () => {
  //   setShowBulkButton(!showBulkButton);
  // };

  const handleBulkUpload = () => {
    // setShowBulkButton(false);
    isBulkUploadModalOpen.onTrue();
  };

  return (
    <Box>
      <Stack direction="row" spacing={1.5} alignItems="center">
        {displayBulkButton && (
          <Button
            variant="outlined"
            size="large"
            onClick={handleBulkUpload}
            startIcon={<SvgColor src="/assets/icons/bulk-upload.svg" />}
            sx={{
              whiteSpace: "nowrap",
              // boxShadow: "rgba(0, 0, 0, 0.08) 0px 4px 16px 0px",
            }}
          >
            Bulk Upload
          </Button>
        )}
        <Button
          variant="outlined"
          size="large"
          startIcon={<SvgColor src="/assets/icons/add.svg" />}
          onClick={isAddVideoModalOpen.onTrue}
          sx={{
            whiteSpace: "nowrap",
            // boxShadow: "rgba(0, 0, 0, 0.08) 0px 4px 16px 0px",
          }}
        >
          Add Video
        </Button>
      </Stack>

      <AddVideoModal
        open={isAddVideoModalOpen.value}
        onClose={isAddVideoModalOpen.onFalse}
      />
      <BulkUploadModal
        open={isBulkUploadModalOpen.value}
        onClose={isBulkUploadModalOpen.onFalse}
      />
    </Box>
  );
}
