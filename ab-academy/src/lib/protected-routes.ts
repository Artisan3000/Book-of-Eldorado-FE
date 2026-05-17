export const protectedRoutePrefixes = [
  "/admin",
  "/dashboard",
  "/instructor",
  "/member",
  "/student",
];

export function isProtectedRoute(pathname: string) {
  return protectedRoutePrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}
