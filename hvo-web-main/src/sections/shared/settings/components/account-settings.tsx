// AccountSettings.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Stack,
  Typography,
  Button,
  Box,
  TextField,
  IconButton,
  Link,
  Alert,
  FormControl,
  FormLabel,
  Divider,
} from "@mui/material";
import { useSnackbar } from "notistack";
import Iconify from "@/components/iconify";
import { LoadingButton } from "@mui/lab";
import { useAuthContext } from "@/auth/hooks";
import { UpdateUserDTO, updateUserDTOSchema } from "hvo-shared";
import { removeUserImage, updateUser, uploadProfileImage } from "@/apis/user";

// Add the constant at the top of the file, after imports
const TEXTFIELD_SX = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "100px",
    backgroundColor: "#F2F2F2",
    border: "none",
    "& .MuiInputBase-input": {
      typography: "bodyLarge",
      padding: "16px",
      "&::placeholder": {
        color: "common.surfaceVariant",
        opacity: 0.5,
      },
    },
    "&:hover": {
      backgroundColor: "common.white",
      boxShadow: "0 0 16px rgba(38, 38, 38, 0.05)",
      "& fieldset": {
        border: (theme) => `1px solid ${theme.palette.common.mainBorder}`,
      },
    },
    "&.Mui-focused": {
      backgroundColor: "common.white",
      "& fieldset": {
        border: "1px solid #262626",
      },
    },
    "& fieldset": {
      border: (theme) => `1px solid ${theme.palette.common.mainBorder}`,
    },
  },
};

// interface ProfileFormData {
//   firstName: string;
//   lastName: string;
// }

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function AccountSettings() {
  const {
    user,
    updatePassword,
    verifyCurrentPassword,
    profile,
    refreshProfile,
  } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isVerifyingPassword, setIsVerifyingPassword] = useState(false);
  const [isPasswordUnlocked, setIsPasswordUnlocked] = useState(false);
  const [imageUrl, setImageUrl] = useState(profile?.photo_url || "");
  const [isUploading, setIsUploading] = useState(false);

  // Profile form
  const profileForm = useForm<UpdateUserDTO>({
    defaultValues: {
      firstName: profile?.firstName, //user?.displayName?.split(" ")[0] || "",
      lastName: profile?.lastName, //user?.displayName?.split(" ")[1] || "",
    },
    resolver: zodResolver(updateUserDTOSchema),
  });

  // Password form
  const passwordForm = useForm<PasswordFormData>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Profile image handlers
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    const validTypes = ["image/png", "image/jpeg", "image/webp"];
    if (!validTypes.includes(file.type)) {
      enqueueSnackbar("Please upload a PNG, JPG or WEBP file", {
        variant: "error",
      });
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      enqueueSnackbar("File size should be less than 8MB", {
        variant: "error",
      });
      return;
    }

    try {
      setIsUploading(true);
      // TODO: Implement file upload logic
      const url = await uploadProfileImage(user!.email, file);
      setImageUrl(url);
      refreshProfile();
      enqueueSnackbar("Profile picture updated successfully", {
        variant: "success",
      });
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Failed to upload image", { variant: "error" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    try {
      setIsUploading(true);
      await removeUserImage(user!.email);
      setImageUrl("");
      refreshProfile();
      enqueueSnackbar("Profile picture removed", { variant: "success" });
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Failed to remove image", { variant: "error" });
    } finally {
      setIsUploading(false);
    }
  };

  // Profile update handler
  const handleProfileUpdate = async (data: UpdateUserDTO) => {
    try {
      await updateUser(user?.email, data);
      profileForm.reset(data);
      refreshProfile();
      enqueueSnackbar("Profile updated successfully", { variant: "success" });
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Failed to update profile", { variant: "error" });
    }
  };

  // Password handlers
  const handlePasswordVerify = async () => {
    const currentPassword = passwordForm.getValues("currentPassword");
    if (!currentPassword) return;

    try {
      setIsVerifyingPassword(true);
      // TODO: Implement password verification
      // await verifyPassword(currentPassword);
      await verifyCurrentPassword(currentPassword);
      setIsPasswordUnlocked(true);
      enqueueSnackbar("Password verified", { variant: "success" });
    } catch (error) {
      console.error(error);
      setIsPasswordUnlocked(false);
      enqueueSnackbar("Invalid password", { variant: "error" });
    } finally {
      setIsVerifyingPassword(false);
    }
  };

  const handlePasswordChange = async (data: PasswordFormData) => {
    if (data.newPassword !== data.confirmPassword) {
      enqueueSnackbar("Passwords do not match", { variant: "error" });
      return;
    }

    try {
      setIsChangingPassword(true);
      await updatePassword(data.newPassword);
      setIsPasswordUnlocked(false);
      passwordForm.reset();
      enqueueSnackbar("Password updated successfully", { variant: "success" });
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Failed to update password", { variant: "error" });
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <Stack
      spacing={3}
      p={5}
      sx={{
        height: "100%",
        overflow: "auto",
        pb: 17, // Add extra padding at the bottom to ensure the last button is visible
      }}
    >
      {/* Profile Picture Section */}
      <Stack direction="row" spacing={1.25}>
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: 2,
            overflow: "hidden",
            position: "relative",
            bgcolor: "grey.100",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Profile"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <Iconify
              icon="ix:user-profile-filled"
              width={80}
              sx={{ color: "text.secondary" }}
            />
          )}
        </Box>

        <Stack spacing={1.25}>
          <Typography variant="bodyLargeStrong" color="common.black">
            Profile Picture
          </Typography>
          <Stack direction="row" spacing={1.25}>
            {/* <Button
              variant="contained"
              startIcon={<Iconify icon="material-symbols:upload" width={24} />}
              disabled={isUploading}
            >
              <Typography variant="labelLarge">Upload Image</Typography>
              <input type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={handleImageUpload} />
            </Button> */}
            <label htmlFor="profile-image-upload">
              <input
                id="profile-image-upload"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />
              <Button
                variant="contained"
                startIcon={
                  <Iconify icon="material-symbols:upload" width={24} />
                }
                disabled={isUploading}
                component="span" // This is important!
              >
                <Typography variant="labelLarge">Upload Image</Typography>
              </Button>
            </label>
            {imageUrl && (
              <Button
                variant="outlined"
                onClick={handleRemoveImage}
                disabled={isUploading}
              >
                <Typography variant="labelLarge">Remove</Typography>
              </Button>
            )}
          </Stack>

          <Typography variant="labelRegular" color="common.black">
            We support PNG, JPG, or WEBP, max 8MB
          </Typography>
        </Stack>
      </Stack>

      <Divider />
      {/* Profile Information Section */}
      <Stack
        spacing={2}
        component="form"
        onSubmit={profileForm.handleSubmit(handleProfileUpdate)}
        maxWidth={768}
      >
        <Stack spacing={2}>
          <FormControl>
            <FormLabel htmlFor="firstName" sx={{ mb: 0.5 }}>
              <Typography variant="labelLarge" color="primary.main">
                First Name
              </Typography>
            </FormLabel>
            <TextField
              id="firstName"
              {...profileForm.register("firstName")}
              error={!!profileForm.formState.errors.firstName}
              helperText={profileForm.formState.errors.firstName?.message}
              variant="outlined"
              fullWidth
              placeholder="Enter your first name"
              InputLabelProps={{ shrink: true }}
              sx={TEXTFIELD_SX}
            />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="lastName" sx={{ mb: 0.5 }}>
              <Typography variant="labelLarge" color="primary.main">
                Last Name
              </Typography>
            </FormLabel>
            <TextField
              id="lastName"
              {...profileForm.register("lastName")}
              error={!!profileForm.formState.errors.lastName}
              helperText={profileForm.formState.errors.lastName?.message}
              variant="outlined"
              fullWidth
              placeholder="Enter your last name"
              InputLabelProps={{ shrink: true }}
              sx={TEXTFIELD_SX}
            />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="email" sx={{ mb: 0.5 }}>
              <Typography variant="labelLarge" color="primary.main">
                Email
              </Typography>
            </FormLabel>
            <TextField
              id="email"
              value={user?.email}
              disabled
              variant="outlined"
              fullWidth
              placeholder="Your email address"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                endAdornment: (
                  <Iconify
                    icon="solar:lock-bold"
                    sx={{ color: "text.disabled" }}
                  />
                ),
              }}
              sx={TEXTFIELD_SX}
            />
          </FormControl>

          {/* Save/Discard Buttons - Only show when form is dirty */}
          {profileForm.formState.isDirty && (
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                size="medium"
                variant="outlined"
                onClick={() => profileForm.reset()}
                disabled={profileForm.formState.isSubmitting}
              >
                Discard Changes
              </Button>
              <LoadingButton
                size="medium"
                variant="contained"
                type="submit"
                loading={profileForm.formState.isSubmitting}
              >
                Save Changes
              </LoadingButton>
            </Stack>
          )}
        </Stack>
      </Stack>

      <Divider />
      {/* Password Section */}
      <Stack
        spacing={2}
        component="form"
        onSubmit={passwordForm.handleSubmit(handlePasswordChange)}
        maxWidth={768}
      >
        <Stack spacing={2}>
          {/* Current Password Field */}
          <FormControl>
            <FormLabel htmlFor="currentPassword" sx={{ mb: 0.5 }}>
              <Typography variant="labelLarge" color="primary.main">
                Current Password
              </Typography>
            </FormLabel>
            <TextField
              id="currentPassword"
              type="password"
              {...passwordForm.register("currentPassword")}
              error={!!passwordForm.formState.errors.currentPassword}
              helperText={
                passwordForm.formState.errors.currentPassword?.message
              }
              variant="outlined"
              fullWidth
              placeholder="Enter your current password"
              InputLabelProps={{ shrink: true }}
              sx={TEXTFIELD_SX}
            />
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Typography variant="bodySmall" color="primary.surface">
                Insert your current password to unlock the ability to change
                your password.{" "}
                <Link
                  href="/auth/forgot-password"
                  underline="always"
                  sx={{ fontWeight: 600, display: "inline-block" }}
                >
                  Forgot password?
                </Link>
              </Typography>
              <Button
                variant="outlined"
                onClick={handlePasswordVerify}
                disabled={
                  !passwordForm.watch("currentPassword") || isVerifyingPassword
                }
                startIcon={<Iconify icon="material-symbols:key" />}
                sx={{ alignSelf: "flex-start", height: 40 }}
              >
                <Typography variant="labelLarge" color="primary.surface">
                  Unlock password edit
                </Typography>
              </Button>
            </Stack>
          </FormControl>

          {/* New Password Section - Disabled until unlocked */}
          <Stack
            spacing={2}
            sx={{
              opacity: isPasswordUnlocked ? 1 : 0.5,
              pointerEvents: isPasswordUnlocked ? "auto" : "none",
              transition: "opacity 0.2s",
            }}
            // mb={5}
          >
            <FormControl>
              <FormLabel htmlFor="newPassword" sx={{ mb: 0.5 }}>
                <Typography variant="labelLarge" color="primary.main">
                  New Password
                </Typography>
              </FormLabel>
              <TextField
                id="newPassword"
                type="password"
                {...passwordForm.register("newPassword")}
                error={!!passwordForm.formState.errors.newPassword}
                helperText={passwordForm.formState.errors.newPassword?.message}
                variant="outlined"
                fullWidth
                placeholder="Enter new password"
                InputLabelProps={{ shrink: true }}
                disabled={!isPasswordUnlocked}
                sx={TEXTFIELD_SX}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="confirmPassword" sx={{ mb: 0.5 }}>
                <Typography variant="labelLarge" color="primary.main">
                  Confirm New Password
                </Typography>
              </FormLabel>
              <TextField
                id="confirmPassword"
                type="password"
                {...passwordForm.register("confirmPassword")}
                error={!!passwordForm.formState.errors.confirmPassword}
                helperText={
                  passwordForm.formState.errors.confirmPassword?.message
                }
                variant="outlined"
                fullWidth
                placeholder="Confirm your new password"
                InputLabelProps={{ shrink: true }}
                disabled={!isPasswordUnlocked}
                sx={TEXTFIELD_SX}
              />
            </FormControl>

            <Box>
              <LoadingButton
                variant="contained"
                type="submit"
                loading={isChangingPassword}
                disabled={!isPasswordUnlocked}
              >
                Change Password
              </LoadingButton>
            </Box>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
