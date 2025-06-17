"use client";

import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";

import Iconify from "src/components/iconify";
import FormProvider, { RHFTextField } from "src/components/hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendSignInLinkToEmail } from "@/apis/common";

// ----------------------------------------------------------------------

export default function StaffLoginView() {
  const [linkSent, setLinkSent] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState("");

  const LoginSchema = z.object({
    email: z
      .string()
      .email({ message: "Email must be a valid email address" })
      .min(1, { message: "Email is required" }),
  });

  const defaultValues = {
    email: "",
  };

  const methods = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await sendSignInLinkToEmail(data.email);
      setLinkSent(true);
    } catch (error) {
      console.error("Login: ", error);
      reset();
      setErrorMsg(typeof error === "string" ? error : error.message);
    }
  });

  const renderLinkSent = (
    <Stack spacing={3} alignItems="center">
      <Iconify
        icon="bi:check-circle-fill"
        color="#00B280"
        width={96}
        height={96}
      />

      <Stack spacing={0.5} alignItems="center">
        <Typography variant="h2" textAlign="center">
          We’ve successfully sent you a login link to your e-mail
        </Typography>
        <Typography variant="bodyRegular">
          Please check your e-mail for your sign in link
        </Typography>
      </Stack>
    </Stack>
  );

  const renderForm = (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3} height="100vh" justifyContent="center" width={320}>
        <Typography variant="h3" textAlign="center">
          Enter your e-mail to receive sign in link
        </Typography>

        <RHFTextField name="email" label="Email address" required />

        {errorMsg && <Alert severity="error">{errorMsg}</Alert>}

        <LoadingButton
          fullWidth
          color="inherit"
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Request Sign In Link
        </LoadingButton>
      </Stack>
    </FormProvider>
  );

  return (
    <Stack display="flex" flex={1} alignItems="center" justifyContent="center">
      {linkSent ? renderLinkSent : renderForm}
    </Stack>
  );
}
