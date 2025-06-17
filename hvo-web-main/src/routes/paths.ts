// ----------------------------------------------------------------------

import { set } from "lodash";

const ROOTS = {
  AUTH: "/auth",
  DASHBOARD: "/dashboard",
};

// ----------------------------------------------------------------------

export const paths = {
  maintenance: "/maintenance",
  page403: "/error/403",
  page404: "/error/404",
  page500: "/error/500",
  // AUTH
  auth: {
    login: `${ROOTS.AUTH}/login`,
    // verify: `${ROOTS.AUTH}/verify`,
    // register: `${ROOTS.AUTH}/register`,
    forgotPassword: `${ROOTS.AUTH}/forgot-password`,
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    settings: `${ROOTS.DASHBOARD}/settings`,
    admin: {
      // root: `${ROOTS.DASHBOARD}/admin`,
      root: `${ROOTS.DASHBOARD}/admin/creators`,
      // users: `${ROOTS.DASHBOARD}/admin/users`,
      creators: `${ROOTS.DASHBOARD}/admin/creators`,
      inbox: `${ROOTS.DASHBOARD}/admin/inbox`,
      staff: `${ROOTS.DASHBOARD}/admin/staff`,
      settings: `${ROOTS.DASHBOARD}/admin/settings`,
    },
    vendor: {
      // root: `${ROOTS.DASHBOARD}/vendor`,
      root: `${ROOTS.DASHBOARD}/vendor/inbox`,
      inboxOld: `${ROOTS.DASHBOARD}/vendor/inbox-old`,
      inbox: `${ROOTS.DASHBOARD}/vendor/inbox`,
      staff: `${ROOTS.DASHBOARD}/vendor/staff`,
      settings: `${ROOTS.DASHBOARD}/vendor/settings`,
    },
    staff: {
      // root: `${ROOTS.DASHBOARD}/staff`,
      root: `${ROOTS.DASHBOARD}/staff/tasks`,
      todo: `${ROOTS.DASHBOARD}/staff/to-do`,
      completed: `${ROOTS.DASHBOARD}/staff/completed`,
      tasks: `${ROOTS.DASHBOARD}/staff/tasks`,
      tasksNew: (videoId: number, taskId: number) => `${ROOTS.DASHBOARD}/staff/tasks?videoId=${videoId}&taskId=${taskId}`,
      bulkUpload: `${ROOTS.DASHBOARD}/staff/bulk-upload`,
    },
    creator: {
      root: `${ROOTS.DASHBOARD}/creator/library`,
      // overview: `${ROOTS.DASHBOARD}/creator/overview`,
      library: `${ROOTS.DASHBOARD}/creator/library`,
      youtubeTracker: `${ROOTS.DASHBOARD}/creator/youtube-tracker`,
      postingSchedule: `${ROOTS.DASHBOARD}/creator/posting-schedule`,
      video: (id: number) => `${ROOTS.DASHBOARD}/creator/library/video/${id}`,
      settings: `${ROOTS.DASHBOARD}/creator/settings`,
    },
    // user: {
    //   root: `${ROOTS.DASHBOARD}/users`,
    //   // new: `${ROOTS.DASHBOARD}/user/new`,
    //   // list: `${ROOTS.DASHBOARD}/user/list`,
    //   // cards: `${ROOTS.DASHBOARD}/user/cards`,
    //   // account: `${ROOTS.DASHBOARD}/user/account`,
    //   // edit: (id: string) => `${ROOTS.DASHBOARD}/user/${id}/edit`,
    //   profile: (id: string) => `${ROOTS.DASHBOARD}/users/${id}`,
    //   approval: `${ROOTS.DASHBOARD}/users/approval`,
    //   list: `${ROOTS.DASHBOARD}/users/list`,
    // },
    // listing: {
    //   root: `${ROOTS.DASHBOARD}/listings`,
    //   // new: `${ROOTS.DASHBOARD}/listing/new`,
    //   // details: (id: string) => `${ROOTS.DASHBOARD}/listing/${id}`,
    //   // edit: (id: string) => `${ROOTS.DASHBOARD}/listing/${id}/edit`,
    //   details: (id: string) => `${ROOTS.DASHBOARD}/listings/${id}`,
    //   approval: `${ROOTS.DASHBOARD}/listings/approval`,
    // },
  },
  preview: (id: number, token: string) => `${process.env.NEXT_PUBLIC_CLIENT_URL}/preview/${id}?token=${token}`,
};
