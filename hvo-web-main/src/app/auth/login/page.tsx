import { LoginView } from "@/sections/auth";
import StaffLoginView from "@/sections/auth/staff-login/staff-login";

export const metadata = {
  title: "Login",
};

export default function LoginPage() {
  const appType = process.env.NEXT_PUBLIC_APP_TYPE;

  if (appType === "staff") {
    return <StaffLoginView />;
  }

  return <LoginView />;
}
