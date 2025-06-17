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
import RHFDatePicker from "@/components/hook-form/rhf-date-picker";

type Props = {
  open: boolean;
  onSuccessfulSubmit: () => void;
};

export default function LocalUpload({ open, onSuccessfulSubmit }: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();

  const [signedUrls, setSignedUrls] = useState<{ video: string; meAudio: string } | null>(null);

  const methods = useForm<AddVideoDTO>({
    resolver: zodResolver(addVideoDTOSchema),
    defaultValues: formDefaultValues,
  });
  const { handleSubmit, control, reset, setValue } = methods;

  const onSubmit = handleSubmit(async (data: AddVideoDTO) => {
    try {
      addVideo(data, user?.email);

      enqueueSnackbar("Video added successfully!", { variant: "success" });

      reset(formDefaultValues);
      onSuccessfulSubmit();
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Unable to add video!", { variant: "error" });
    }
  });

  useEffect(() => {
    const fetchUploadUrls = async () => {
      const creatorId = user?.email; // TODO: Change to creatorId

      try {
        // Define input data for initializeVideoUpload
        const inputData: InitiateVideoUploadInputDTO = {
          creatorId: creatorId,
        };

        // Call initializeVideoUpload to get the upload URLs
        const {
          sessionId,
          uploadUrls: { video, meAudio },
        } = await initiateVideoUpload(inputData);
        // setFolderId(folderId);
        // setValue("session_folder_id", folderId);
        setSignedUrls({ video, meAudio });
        // setSessionId(sessionId);
        setValue("session_id", sessionId);
      } catch (error) {
        console.error("Failed to get upload URLs:", error);
        enqueueSnackbar("Failed to initialize upload URLs.", { variant: "error" });
      }
    };

    if (open) {
      fetchUploadUrls();
    }
  }, [open]);

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={1.5}>
        <RHFTextField
          name="title"
          label="Video Title"
          required
          placeholder="Title of the video goes here"
          variant="filled"
          type="text"
          fullWidth
        />
        <RHFTextField
          name="description"
          label="Description"
          placeholder="Description of the video goes here"
          variant="filled"
          type="text"
          fullWidth
          multiline
          rows={4}
        />
        <RHFDatePicker name="dueDate" label="Due Date" required />
        {/* <RHFTextField
          name="youtube_url"
          label="Youtube URL"
          placeholder="Youtube URL goes here"
          variant="filled"
          type="text"
          fullWidth
        /> */}
        <UploadSingleFileGCS
          key="upload-video"
          label="Upload Video"
          type="video"
          signedUrl={signedUrls?.video}
          onUploadChange={(fileId) => setValue("video_file_id", fileId)}
          formErrorMessage={methods.formState.errors.video_file_id?.message}
        />
        <UploadSingleFileGCS
          key="upload-soundtrack"
          label="Upload M&E Soundtrack"
          type="audio"
          signedUrl={signedUrls?.meAudio}
          onUploadChange={(fileId) => setValue("soundtrack_file_id", fileId)}
          formErrorMessage={methods.formState.errors.soundtrack_file_id?.message}
        />
      </Stack>

      <Stack spacing={1.25} pt={2}>
        <Button variant="contained" color="secondary" size="large" type="submit">
          Confirm
        </Button>

        <Typography variant="caption" px={0.5} textAlign="center">
          By confirming, the video will be uploaded to the hvo platform.
        </Typography>
      </Stack>
    </FormProvider>
  );
}
