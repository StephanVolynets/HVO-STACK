/**
 * Route-specific layout configuration
 * This file contains configuration for different route layouts across the app
 */

// Routes that should hide the side panel
export const ROUTES_WITHOUT_SIDE_PANEL = [
  "/library",
  "/youtube-tracker",
  "/posting-schedule",
  "/creators",
  "/inbox",
  "/staff",
];

// Function to check if the current path should hide side panel
export const shouldHideSidePanel = (pathname: string | null): boolean => {
  if (!pathname) return false;
  
  return ROUTES_WITHOUT_SIDE_PANEL.some((route) => pathname.includes(route));
};

// You can add more route-specific configuration functions here
// For example:
// export const shouldUsePlainMode = (pathname: string | null): boolean => { ... }; 