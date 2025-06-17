import { Stack } from "@mui/material";
import { useCountCreators, useGetCreatorSummaries } from "@/use-queries/creator";
import { CreatorCard } from "./components/creator-card";

export default function CreatorsCardsView() {
  const { creatorSummaries, isLoading, refetch } = useGetCreatorSummaries(1, 100);

  return (
    <Stack spacing={3}>
      {creatorSummaries?.map((creatorSummary, index) => (
        <CreatorCard key={creatorSummary.id} creatorSummary={creatorSummary} />
      ))}
    </Stack>
  );
}
