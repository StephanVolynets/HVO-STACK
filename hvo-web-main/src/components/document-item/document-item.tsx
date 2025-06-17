import { fData } from "@/utils/format-number";
import { Box, ListItemText, Paper, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { getFileNameFromUrl } from "./utils";
import Iconify from "../iconify";

type Props = {
  src: string;
};

export default function DocumentItem({ src }: Props) {
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number | null }>({
    name: "",
    size: null,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFile = async () => {
      try {
        console.log("Fetching:", src);
        const response = await fetch(src);
        const blob = await response.blob();

        // Extract the file name from the URL or provide a default name
        const fileName = getFileNameFromUrl(src) || "document.pdf";

        // Create a File object from the blob
        const file = new File([blob], fileName, {
          type: blob.type,
        });

        setFileInfo({
          name: file.name,
          size: file.size,
        });
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching the file:", error);
      }
    };

    fetchFile();
  }, [src]);

  const renderText = (
    <ListItemText
      // onClick={details.onTrue}
      primary={fileInfo.name}
      secondary={<>{fData(fileInfo.size)}</>}
      primaryTypographyProps={{
        noWrap: true,
        typography: "subtitle2",
      }}
      secondaryTypographyProps={{
        mt: 0.5,
        component: "span",
        alignItems: "center",
        typography: "caption",
        color: "text.disabled",
        display: "inline-flex",
      }}
    />
  );

  if (isLoading) {
    return null;
  }

  return (
    <Box
      component="a"
      href={src}
      download={fileInfo.name}
      sx={{ textDecoration: "none", color: "inherit" }}
      target="_blank"
    >
      <Stack
        component={Paper}
        variant="outlined"
        spacing={1.5}
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "unset", sm: "center" }}
        sx={{
          borderRadius: 2,
          bgcolor: "unset",
          cursor: "pointer",
          position: "relative",
          p: { xs: 2.5, sm: 2 },
          "&:hover": {
            bgcolor: "background.paper",
            boxShadow: (theme) => theme.customShadows.z20,
          },
        }}
      >
        <Box
          component="img"
          src="/assets/icons/files/ic_pdf.svg"
          sx={{
            width: 32,
            height: 32,
            flexShrink: 0,
          }}
        />

        {renderText}

        <Iconify icon="eva:arrow-circle-down-fill" width={24} />
      </Stack>
    </Box>
  );
}
