import { useParams } from "next/navigation";

export function useCurrentLocale() {
  const params = useParams();
  const locale = params.locale as string;
  return locale;
}
