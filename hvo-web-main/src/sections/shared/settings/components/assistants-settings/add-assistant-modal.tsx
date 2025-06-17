import { Modal } from "@/components/mui";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, InputAdornment, Stack, Typography } from "@mui/material";
import {
  CreateAssistantDTO,
  createAssistantDTOSchema,
  CreateCreatorDTO,
  createCreatorDTOSchema,
  Role,
  SelectOption,
} from "hvo-shared";
import { FieldErrors, useForm } from "react-hook-form";
import {
  RHFCheckbox,
  RHFMultiSelect,
  RHFTextField,
} from "@/components/hook-form";
import FormProvider from "@/components/hook-form/form-provider";
import { scroller } from "react-scroll";
import Iconify from "@/components/iconify";
import { createCreator } from "@/apis/creator";
import { useSnackbar } from "notistack";
import SvgColor from "@/components/svg-color";
import { useMemo, useState } from "react";
import FormError from "@/components/form/form-error/form-error";
import { useGetAllLanguages } from "@/use-queries/common";
import { FlagEmoji } from "@/components/flag-emoji";
import { formDefaultValues } from "@/sections/creator/library/components/library-primary-action/components/add-video-modal/components/form-helpers";
import { createAssistant } from "@/apis/user";
import { useAuthContext } from "@/auth/hooks";

const getAssistantRole = (role: Role) => {
  switch (role) {
    case Role.ADMIN:
      return Role.ADMIN_ASSISTANT;
    case Role.CREATOR:
      return Role.CREATOR_ASSISTANT;
    case Role.VENDOR:
      return Role.VENDOR_ASSISTANT;
    default:
      throw new Error(`User with role ${role} cannot create assistants`);
  }
};

type Props = {
  open: boolean;
  onClose: () => void;
  onCreateSuccess: () => void;
};

export default function AddAssistantModal({
  open,
  onClose,
  onCreateSuccess,
}: Props) {
  const { profile } = useAuthContext();
  const [errorMessage, setErrorMessage] = useState<string>();
  const { enqueueSnackbar } = useSnackbar();

  const defaultValues: CreateAssistantDTO = {
    firstName: "",
    lastName: "",
    email: "",
    role: getAssistantRole(profile!.role),
  };

  const methods = useForm<CreateAssistantDTO>({
    resolver: zodResolver(createAssistantDTOSchema),
    defaultValues,
  });
  const { handleSubmit, control, reset } = methods;

  const onSubmit = handleSubmit(async (data: CreateAssistantDTO) => {
    try {
      await createAssistant(profile!.id, data);

      enqueueSnackbar("Assistant created successfully!", {
        variant: "success",
      });

      onCreateSuccess();
      reset(defaultValues);
      onClose();
    } catch (error) {
      // setErrorMessage(error.AxiosError?.response?.data?.message);
      setErrorMessage(error.message);
      console.error(error);
      enqueueSnackbar("Unable to create assistant!", { variant: "error" });
    }
  });

  return (
    <Modal open={open} onClose={onClose}>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Stack
          sx={{
            width: { xs: "90vw", sm: "70vw", md: 425 },
            display: "flex",
          }}
          p={4}
          spacing={3}
        >
          <Typography variant="h3" alignSelf="center">
            Add Assistant
          </Typography>

          <Stack spacing={1.5}>
            <RHFTextField
              name="firstName"
              label="First Name"
              required
              placeholder="John Doe"
              variant="outlined"
              type="text"
              fullWidth
            />
            <RHFTextField
              name="lastName"
              label="Last Name"
              required
              placeholder="John Doe"
              variant="outlined"
              type="text"
              fullWidth
            />
            <RHFTextField
              name="email"
              label="Email"
              required
              placeholder="john.doe@gmail.com"
              variant="outlined"
              type="text"
              fullWidth
            />

            <FormError error={errorMessage} />
          </Stack>

          <Stack spacing={1.25}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              type="submit"
            >
              Confirm
            </Button>

            <Typography variant="caption" px={0.5} textAlign="center">
              By confirming, the assitant will receive credentials with which
              they can log in to the HVO platform
            </Typography>
          </Stack>
        </Stack>
      </FormProvider>
    </Modal>
  );
}
