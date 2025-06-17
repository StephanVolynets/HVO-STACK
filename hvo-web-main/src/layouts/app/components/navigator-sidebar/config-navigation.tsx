import { useMemo } from "react";

import SvgColor from "src/components/svg-color";
import { paths } from "src/routes/paths";
import { useAuthContext } from "@/auth/hooks";

// ----------------------------------------------------------------------

export const icon = (name: string) => (
  <SvgColor
    src={`/assets/icons/nav/${name}.svg`}
    // sx={{ width: 1, height: 1 }}
  />
);

const ICONS = {
  // All
  settings: icon("settings"),
  logOut: icon("log-out"),
  // Creator
  library: icon("logo"),
  youtubeTracker: icon("youtube-tracker"),
  postingSchedule: icon("posting-schedule"),
  // Admin
  creators: icon("movie"),
  // Admin, Vendor
  inbox: icon("inbox"),
  staff: icon("group"),
};

export interface NavItem {
  title: string;
  path: string;
  icon: React.ReactNode;
  disabled?: boolean;
}

// ----------------------------------------------------------------------

export function useNavData() {
  const { role } = useAuthContext();

  const data: {
    subheader: string;
    items: NavItem[];
  } = useMemo(() => {
    switch (role) {
      case "ADMIN":
        return adminSection;

      case "ADMIN_ASSISTANT":
        return adminSection;

      case "CREATOR":
        return creatorSection;

      case "CREATOR_ASSISTANT":
        return creatorSection;

      case "VENDOR":
        return vendorSection;

      case "VENDOR_ASSISTANT":
        return vendorSection;

      default:
        return {
          subheader: "Navigation",
          items: [],
        };
    }
  }, [role]);

  return data;
}

const adminSection = {
  subheader: "Admin",
  items: [
    {
      title: "Creators",
      path: paths.dashboard.admin.creators,
      icon: ICONS.creators,
    },
    {
      title: "Inbox",
      path: paths.dashboard.admin.inbox,
      icon: ICONS.inbox,
    },
    {
      title: "Staff",
      path: paths.dashboard.admin.staff,
      icon: ICONS.staff,
    },
  ],
};

const creatorSection = {
  subheader: "Creator Overview",
  items: [
    {
      title: "Library",
      path: paths.dashboard.creator.library,
      icon: ICONS.library,
    },
    {
      title: "YouTube Tracker",
      path: paths.dashboard.creator.youtubeTracker,
      icon: ICONS.youtubeTracker,
      disabled: true,
    },
    {
      title: "Posting Schedule",
      path: paths.dashboard.creator.postingSchedule,
      icon: ICONS.postingSchedule,
      disabled: true,
    },
  ],
};

const vendorSection = {
  subheader: "Vendor Tools",
  items: [
    {
      title: "Inbox",
      path: paths.dashboard.vendor.inbox,
      icon: ICONS.inbox,
    },
    {
      title: "Staff",
      path: paths.dashboard.vendor.staff,
      icon: ICONS.staff,
    },
  ],
};
