import { CustomSelect } from "@/components/custom-inputs/custom-select";
import { useInboxFilters } from "@/sections/admin/inbox/hooks/use-inbox-filters";
import { useGetAllCreatorsBasic } from "@/use-queries/creator";
import { SelectOption } from "hvo-shared";
import { useMemo } from "react";

export default function CreatorFilter() {
  const { creatorId, setCreatorId } = useInboxFilters();

  const { creatorsBasic } = useGetAllCreatorsBasic();
  const creatorOptions = useMemo(
    () =>
      creatorsBasic?.map(
        (creator) =>
          ({
            id: creator.id,
            label: creator.full_name,
            icon: creator.photo_url || "",
          } as SelectOption)
      ) || [],
    [creatorsBasic]
  );

  const handleCreatorChange = (_creatorId: number) => {
    if (_creatorId == -1) {
      setCreatorId(null);
    } else {
      setCreatorId(_creatorId);
    }
  };

  return (
    <CustomSelect<number>
      size="small"
      value={creatorId || -1} // when in CustomSelect is -1, its null in the filter.
      noOptionSelectedValue="All creators"
      onChange={(value) => handleCreatorChange(value)}
      options={creatorOptions}
      useIconAdornment
      // label="Filter by creator"
    />
  );
}
