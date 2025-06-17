import { useMemo } from "react";

import { paths } from "src/routes/paths";

// import { useTranslate } from 'src/locales';

import Label from "src/components/label";
import Iconify from "src/components/iconify";
import SvgColor from "src/components/svg-color";
import { useAuthContext } from "@/auth/hooks";
import { todo } from "node:test";
import comingSoonIllustration from "@/assets/illustrations/coming-soon-illustration";

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor
    src={`/assets/icons/navbar/${name}.svg`}
    sx={{ width: 1, height: 1 }}
  />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  // job: icon("ic_job"),
  // blog: icon("ic_blog"),
  // chat: icon("ic_chat"),
  // mail: icon("ic_mail"),
  user: icon("ic_user"),
  // file: icon("ic_file"),
  lock: icon("ic_lock"),
  // tour: icon("ic_tour"),
  // order: icon("ic_order"),
  // label: icon("ic_label"),
  // blank: icon("ic_blank"),
  // kanban: icon("ic_kanban"),
  // folder: icon("ic_folder"),
  // banking: icon("ic_banking"),
  // booking: icon("ic_booking"),
  // invoice: icon("ic_invoice"),
  product: icon("ic_product"),
  // calendar: icon("ic_calendar"),
  // disabled: icon("ic_disabled"),
  // external: icon("ic_external"),
  // menuItem: icon("ic_menu_item"),
  // ecommerce: icon("ic_ecommerce"),
  // analytics: icon("ic_analytics"),
  // dashboard: icon("ic_dashboard"),
  overview: icon("ic_overview"),
  creators: icon("ic_creators"),
  inbox: icon("ic_inbox"),
  staff: icon("ic_staff"),
  library: icon("ic_library"),
  todo: icon("ic_todo"),
  completed: icon("ic_completed"),
  settings: icon("ic_settings"),
};

// ----------------------------------------------------------------------

export function useNavData(mini: boolean = false) {
  // const { t } = useTranslate();
  const { role } = useAuthContext();

  // const data = useMemo(
  //   () => [
  //     // OVERVIEW
  //     // ----------------------------------------------------------------------
  //     {
  //       subheader: "Management",
  //       items: [
  //         {
  //           title: "Users",
  //           path: paths.dashboard.user.root,
  //           icon: ICONS.user,
  //           children: [
  //             { title: "List", path: paths.dashboard.user.list },
  //             { title: "Verification Approval", path: paths.dashboard.user.approval },
  //           ],
  //         },
  //         {
  //           title: "Listings",
  //           path: paths.dashboard.listing.root,
  //           icon: ICONS.product,
  //           children: [{ title: "Pending Approval", path: paths.dashboard.listing.approval }],
  //         },
  //       ],
  //     },
  //   ],
  //   []
  // );
  const data = useMemo(() => {
    let navItems: any[] = [];
    switch (role) {
      case "ADMIN":
        navItems.push(adminSection);
        break;

      case "ADMIN_ASSISTANT":
        navItems.push(adminSection);
        break;

      case "CREATOR":
        navItems.push(creatorSection);
        break;

      case "CREATOR_ASSISTANT":
        navItems.push(creatorSection);
        break;

      case "VENDOR":
        navItems.push(vendorSection);
        break;

      case "VENDOR_ASSISTANT":
        navItems.push(vendorSection);
        break;

      case "STAFF":
        navItems.push(staffSection);
        break;

      default:
        break; // No navigation if role is undefined or unknown. This should never happen.
    }

    return navItems;
  }, []);

  return data;
}

const adminSection = {
  subheader: "Admin",
  items: [
    // {
    //   title: "Overview",
    //   path: paths.dashboard.admin.root,
    //   icon: ICONS.overview,
    // },
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
    {
      title: "Settings",
      path: paths.dashboard.admin.settings,
      icon: ICONS.settings,
    },
  ],
};

const creatorSection = {
  subheader: "Creator Overview",
  items: [
    // {
    //   title: "Overview",
    //   path: paths.dashboard.creator.overview,
    //   icon: ICONS.overview,
    // },
    {
      title: "Library",
      path: paths.dashboard.creator.library,
      icon: ICONS.library,
    },
    {
      title: "Settings",
      path: paths.dashboard.creator.settings,
      icon: ICONS.settings,
    },
    {
      title: "YouTube Tracker",
      path: "#",
      icon: ICONS.lock,
      disabled: true,
    },
    {
      title: "Posting Schedule",
      path: "#",
      icon: ICONS.lock,
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
    {
      title: "Settings",
      path: paths.dashboard.vendor.settings,
      icon: ICONS.settings,
    },
  ],
};

const staffSection = {
  subheader: "Staff Dashboard",
  items: [
    {
      title: "To do",
      path: paths.dashboard.staff.todo,
      icon: ICONS.todo,
    },
    {
      title: "Completed",
      path: paths.dashboard.staff.completed,
      icon: ICONS.completed,
    },
  ],
};
