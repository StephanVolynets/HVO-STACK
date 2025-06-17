import View404 from "@/sections/error/404-view";
import { NotFoundView } from "src/sections/error";

// ----------------------------------------------------------------------

export const metadata = {
  title: "404 Page Not Found!",
};

export default function NotFoundPage() {
  // return <NotFoundView />;
  return <View404 />;
}
