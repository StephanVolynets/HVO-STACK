import { zodResolver } from "@hookform/resolvers/zod";
import { AddVideoDTO, addVideoDTOSchema, InitiateVideoUploadInputDTO } from "hvo-shared";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { formDefaultValues } from "./form-helpers";
import { addVideo, initiateVideoUpload } from "@/apis/video";
import { useAuthContext } from "@/auth/hooks";
import { useEffect, useState } from "react";
import FormProvider, { RHFTextField } from "@/components/hook-form";
import { Button, Stack, Typography } from "@mui/material";
import { UploadSingleFileGCS } from "@/components/upload/single-file-GCS";

type Props = {
  open: boolean;
  onSuccessfulSubmit: () => void;
};

export default function GoogleDriveUpload({ open, onSuccessfulSubmit }: Props) {
  const { enqueueSnackbar } = useSnackbar();

  return <Typography>Google Drive Uplaod</Typography>;
}
