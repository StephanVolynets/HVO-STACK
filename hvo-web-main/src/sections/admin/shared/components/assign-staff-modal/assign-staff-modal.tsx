import { Modal } from "@/components/mui";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Stack, Typography } from "@mui/material";
import {
  CreateCreatorDTO,
  createCreatorDTOSchema,
  CreateStaffDTO,
  createStaffDTOSchema,
  SelectOption,
} from "hvo-shared";
import { useForm } from "react-hook-form";
import { formDefaultValues, staffOptions } from "./form-helpers";
import { RHFSelect, RHFTextField } from "@/components/hook-form";
import FormProvider from "@/components/hook-form/form-provider";
import { createCreator } from "@/apis/creator";
import { useSnackbar } from "notistack";
import { createStaff } from "@/apis/staff";
import { useGetAllLanguages } from "@/use-queries/common";
import { useMemo } from "react";
import { useGetAllCreatorsBasic } from "@/use-queries/creator";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function AddStaffModal({ open, onClose }: Props) {
  const { enqueueSnackbar } = useSnackbar();

  const { languages } = useGetAllLanguages();
  const languageOptions = useMemo(
    () =>
      languages?.map(
        (language) =>
          ({
            id: language.id,
            label: language.name,
            icon: language.flag_url || "",
          } as SelectOption)
      ) || [],
    [languages]
  );

  const { creatorsBasic } = useGetAllCreatorsBasic();
  const defaultCreatorOptions = useMemo(
    () =>
      creatorsBasic?.map(
        (creator) =>
          ({
            id: creator.id,
            label: creator.full_name,
            icon: creator.photo_url || "",
          } as SelectOption)
      ) || [],
    [creatorsBasic]
  );

  const methods = useForm<CreateStaffDTO>({
    resolver: zodResolver(createStaffDTOSchema),
    defaultValues: formDefaultValues,
  });
  const { handleSubmit, control, reset } = methods;

  const onSubmit = handleSubmit(async (data: CreateStaffDTO) => {
    try {
      await createStaff(data);

      enqueueSnackbar("Staff added successfully!", { variant: "success" });

      reset(formDefaultValues);
      onClose();
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Unable to create staff!", { variant: "error" });
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
            Assign Staff
          </Typography>

          <Stack spacing={1.5}>
            <RHFTextField
              name="full_name"
              label="Full Name"
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
            <RHFSelect
              name="staff_type"
              label="Role"
              required
              placeholder="Choose a role"
              options={staffOptions}
              variant="outlined"
              fullWidth
            />
            {/* <RHFSelect
              name="default_creator_id"
              label="Default creator"
              required
              placeholder="Choose a role"
              options={defaultCreatorOptions}
              variant="outlined"
              useIconAdornment
              fullWidth
            /> */}
            <RHFSelect
              name="language_id"
              label="Language"
              required
              placeholder="Choose a role"
              options={languageOptions}
              variant="outlined"
              useIconAdornment
              fullWidth
            />
          </Stack>

          <Stack spacing={1.25}>
            <Button variant="contained" color="secondary" size="large" type="submit">
              Confirm
            </Button>

            <Typography variant="caption" px={0.5} textAlign="center">
              By confirming, the staff member will receive credentials with which they could log in to their own
              task-slate
            </Typography>
          </Stack>
        </Stack>
      </FormProvider>
    </Modal>
  );
}
