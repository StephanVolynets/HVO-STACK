export const excludedRoutes = [
  '/preview',
];

/**
 * Checks if the current path should be excluded from desktop-only guard
 */
export const isExcludedRoute = (pathname: string): boolean => {
  return excludedRoutes.some(route => pathname.startsWith(route));
}; 