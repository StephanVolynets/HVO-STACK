import { CustomChip } from "@/components/custom-chip";
import {
  useCountCreators,
  useGetCreatorSummaries,
} from "@/use-queries/creator";
import { Divider, Stack, Typography } from "@mui/material";
import CompactHeader from "./components/header";
import CompactRow from "./components/row";

export default function CompactView() {
  const { creatorSummaries, isLoading, refetch } = useGetCreatorSummaries(
    1,
    100
  );
  const { creatorsCount } = useCountCreators();

  return (
    <Stack display="flex" flex={1}>
      {/* Header */}
      <CompactHeader creatorsCount={creatorsCount || 0} />
      <Stack divider={<Divider />}>
        {creatorSummaries?.map((creatorSummary) => (
          <CompactRow key={creatorSummary.id} creatorSummary={creatorSummary} />
        ))}
      </Stack>
    </Stack>
  );
}
