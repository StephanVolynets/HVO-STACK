import { Divider, Stack } from "@mui/material";
import NavigatorHeader from "./components/navigator-header";
import { SearchAndFilters } from "./components/search-and-filters";
import { NavigatorList } from "./components/navigator-list";

export default function Navigator() {
  return (
    <Stack width={320}>
      <NavigatorHeader />
      <Divider />
      <SearchAndFilters />
      <Divider />
      <NavigatorList />
    </Stack>
  );
}
