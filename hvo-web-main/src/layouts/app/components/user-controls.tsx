import React, { memo, useEffect, useState } from "react";
import {
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Stack,
  Box,
  Typography,
} from "@mui/material";
import { AccountCircle, ExitToApp, Settings } from "@mui/icons-material";
import { useLayout } from "../context/layout-context";
import { useAuthContext } from "@/auth/hooks";
import SvgColor from "@/components/svg-color";
import { enqueueSnackbar } from "notistack";
import { paths } from "@/routes/paths";
import { useRouter } from "next/navigation";
function UserControlsComponent() {
  const router = useRouter();
  const { primaryAction, plainMode } = useLayout();
  const { user } = useAuthContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { logout } = useAuthContext();

  console.log("[Performance] NavigatorFooter rendered");

  const handleLogout = async () => {
    try {
      await logout();
      router.replace(paths.auth.login);
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Unable to logout!", { variant: "error" });
    }
  };

  useEffect(() => {
    console.log("[Performance] UserControls rendered");
  });

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <Stack
      direction="row-reverse"
      spacing={1.5}
      sx={{
        alignItems: "center",
        // height: "100px",
        // minHeight: "100px",
        // backgroundColor: "common.orange",
        // pt: !plainMode ? 3 : 0,
        //
        // pt: !plainMode ? "1rem" : 0,
        minWidth: "320px",
      }}
    >
      <>
        <IconButton
          onClick={handleOpenMenu}
          sx={{
            width: 56,
            height: 56,
          }}
        >
          <Avatar
            src={user?.photoURL}
            alt={`${user?.first_name || "User"} ${user?.last_name} || "`}
            sx={{
              width: 56,
              height: 56,
              border: (theme) =>
                `solid 2px ${theme.palette.background.default}`,
              backgroundColor: "#F0F0F3",
              fontWeight: 700,
            }}
          >
            {user?.displayName?.charAt(0).toUpperCase()}
          </Avatar>
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <Box sx={{ p: 1 }}>
            <Typography variant="bodyRegular" color="text.secondary">
              {user?.displayName}
            </Typography>
          </Box>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <SvgColor src="/assets/icons/logout.svg" sx={{ mr: 1 }} /> Logout
          </MenuItem>
        </Menu>
      </>

      {primaryAction}
    </Stack>
  );
}

export const UserControls = memo(UserControlsComponent);
