"use client";

import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Link from "@mui/material/Link";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import InputAdornment from "@mui/material/InputAdornment";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import { useAuthContext } from "src/auth/hooks";

import Iconify from "src/components/iconify";
import FormProvider, { RHFTextField } from "src/components/hook-form";
import { Box, InputLabel } from "@mui/material";
import SvgColor from "@/components/svg-color";

export default function LoginView() {
  const { login } = useAuthContext();
  const [errorMsg, setErrorMsg] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = z.object({
    email: z
      .string()
      .email({ message: "Email must be a valid email address" })
      .min(1, { message: "Email is required" }),
    password: z
      .string()
      .min(1, { message: "Password is required" })
      .min(8, { message: "Password must be at least 8 characters" }),
  });

  const defaultValues = {
    email: "",
    password: "",
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
      await login?.(data.email, data.password);
    } catch (error) {
      console.error("Login: ", error);
      reset();
      setErrorMsg(typeof error === "string" ? error : error.message);
    }
  });

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        backgroundImage: "url(/assets/background/overlay_1.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
      }}
    >
      <Stack
        sx={{
          p: 6,
          pt: 3,
          width: "480px",
          position: "relative",
          backdropFilter: "blur(40px)",
          backgroundColor: "rgba(255, 255, 255, 0.25)",
          border: "2px solid rgba(255, 255, 255, 0.5)",
          borderRadius: "24px",
          boxShadow: "0px 20px 40px rgba(0, 0, 0, 0.06)",
          "&::before": {
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, " +
              "linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            pointerEvents: "none",
          },
        }}
        spacing={3}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SvgColor
            src="/assets/icons/logo.svg"
            sx={{ height: 64, width: 64 }}
          />
        </Box>

        <Typography variant="h2">Sign in to your account</Typography>

        {/* <form onSubmit={handleSubmit}> */}
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Stack spacing={3}>
            {/* Email Input */}
            <Stack spacing={0.5}>
              <InputLabel
                htmlFor="email"
                sx={{
                  fontSize: 16,
                  fontWeight: 400,
                  color: "primary.surface",
                  // "&:after": {
                  //   content: '" *"',
                  //   // color: "error.main",
                  // },
                }}
              >
                <Stack direction="row" alignItems="center" spacing={0.25}>
                  Email Address
                  {/* <SvgColor
                    src="/assets/icons/info-new.svg"
                    sx={{ width: 16, height: 16 }}
                  /> */}
                </Stack>
              </InputLabel>
              <RHFTextField
                name="email"
                id="email"
                fullWidth
                placeholder="your.email@example.com"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#F2F2F2",
                    borderRadius: "100px",
                    boxSizing: "border-box",
                    "& fieldset": {
                      borderColor: "common.mainBorder",
                      borderWidth: "1px",
                    },
                    "&:hover": {
                      backgroundColor: "common.white",
                      "& fieldset": {
                        borderColor: "primary.main",
                      },
                    },
                    "&.Mui-focused": {
                      backgroundColor: "common.white",
                      "& fieldset": {
                        borderColor: "primary.main",
                      },
                    },
                    "&.Mui-error": {
                      backgroundColor: "red.surface2",
                      "& fieldset": {
                        borderColor: "red.border",
                      },
                      "& .MuiInputBase-input": {
                        color: "red.surface",
                      },
                    },
                  },
                  "& .MuiInputBase-input": {
                    padding: 2,
                    fontSize: "18px",
                    fontWeight: 400,
                    color: "#333333",
                    // opacity: 0.5,
                    "&:focus": {
                      opacity: 1,
                    },
                    "&::placeholder": {
                      color: "#333333",
                      opacity: 0.5,
                    },
                  },
                }}
              />
            </Stack>

            {/* Password Input */}
            <Stack spacing={1.5}>
              <Stack spacing={0.5}>
                <InputLabel
                  htmlFor="password"
                  sx={{
                    fontSize: 16,
                    fontWeight: 400,
                    color: "primary.surface",
                    // "&:after": {
                    //   content: '" *"',
                    //   // color: "error.main",
                    // },
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={0.25}>
                    Password
                    {/* <SvgColor
                      src="/assets/icons/info-new.svg"
                      sx={{ width: 16, height: 16 }}
                    /> */}
                  </Stack>
                </InputLabel>
                <RHFTextField
                  name="password"
                  id="password"
                  fullWidth
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  // placeholder="*********************"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleTogglePassword}
                          edge="end"
                          sx={{ mr: 0.5 }}
                        >
                          <Iconify
                            icon={
                              showPassword ? "eva:eye-fill" : "eva:eye-off-fill"
                            }
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#F2F2F2",
                      borderRadius: "100px",
                      boxSizing: "border-box",
                      "& fieldset": {
                        borderColor: "common.mainBorder",
                        borderWidth: "1px",
                      },
                      "&:hover": {
                        backgroundColor: "common.white",
                        "& fieldset": {
                          borderColor: "primary.main",
                        },
                      },
                      "&.Mui-focused": {
                        backgroundColor: "common.white",
                        "& fieldset": {
                          borderColor: "primary.main",
                        },
                      },
                      "&.Mui-error": {
                        backgroundColor: "red.surface2",
                        "& fieldset": {
                          borderColor: "red.border",
                        },
                        "& .MuiInputBase-input": {
                          color: "red.surface",
                        },
                      },
                    },
                    "& .MuiInputBase-input": {
                      padding: 2,
                      fontSize: "18px",
                      fontWeight: 400,
                      color: "#333333",
                      // opacity: 0.5,
                      "&:focus": {
                        opacity: 1,
                      },
                      "&::placeholder": {
                        color: "#333333",
                        opacity: 0.5,
                      },
                    },
                  }}
                />
              </Stack>
              <Link
                component={RouterLink}
                href={paths.auth.login}
                // href={paths.auth.forgotPassword}
                sx={{
                  color: "primary.surface",
                  fontSize: 16,
                  fontWeight: 400,
                  "&:hover": {
                    textDecoration: "underline",
                  },
                  alignSelf: "flex-end",
                }}
              >
                Forgot password?
              </Link>
            </Stack>

            {errorMsg && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {errorMsg === "Firebase: Error (auth/invalid-credential)."
                  ? "Invalid email or password. Please try again."
                  : errorMsg}
              </Alert>
            )}

            {/* Sign In Button */}
            <LoadingButton
              variant="contained"
              size="extraLarge"
              fullWidth
              type="submit"
              loading={isSubmitting}
            >
              Sign In
            </LoadingButton>
          </Stack>
          {/* </form> */}
        </FormProvider>
      </Stack>
    </Box>
  );
}
