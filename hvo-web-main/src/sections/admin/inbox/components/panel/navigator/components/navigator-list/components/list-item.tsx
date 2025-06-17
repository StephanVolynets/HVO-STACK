import CreatorImage from "@/components/images/creator-image";
import ThumbnailImage from "@/components/images/thumbnail-image";
import { useSelectedInboxVideo } from "@/sections/admin/inbox/hooks/use-selected-inbox-video";
import { Box, Stack, Typography } from "@mui/material";
import { InboxVideoDTO, TaskDTO } from "hvo-shared";

// const colors = {
//   selectedNormal: "#F4F4F4",
//   selectedFeedback: "#FFF7E4",
//   notSelectedNormal: "#FFFFFF",
//   notSelectedFeedback: "#FFFAF2",
// };

type Props = {
  item: InboxVideoDTO;
  showProfileImage?: boolean;
};

export default function ListItem({ item, showProfileImage }: Props) {
  const { selectedVideo, setSelectedVideo } = useSelectedInboxVideo();

  const isSelected = selectedVideo?.id === item.id;

  const getBackgroundColor = () => {
    if (isSelected) {
      return "#F4F4F4";
    } else {
      return "#FFFFFF";
    }
  };

  const getBorderColor = () => {
    if (isSelected) {
      return "#E0E0E0";
    } else {
      return "transparent";
    }
  };

  return (
    <Box
      sx={{
        // borderTop: task.hasFeedback && isSelected ? `1px solid #FFDC98` : "none",
        // borderBottom: task.hasFeedback && isSelected ? `1px solid #FFDC98` : "none",
        borderTop: `1px solid ${getBorderColor()}`,
        borderBottom: `1px solid ${getBorderColor()}`,
        backgroundColor: getBackgroundColor(),
      }}
      onClick={() => setSelectedVideo(item)}
    >
      <Box
        sx={{
          cursor: "pointer",
          "&:hover": {
            transform: "scale(1.02)",
            transition: "250ms",
          },
        }}
      >
        <Stack
          direction="row"
          px={2}
          py={isSelected ? "4px" : "4px"}
          // py={isSelected && task.hasFeedback ? "4px" : "5px"}
          spacing={1.5}
          alignItems="center"
        >
          {showProfileImage && <CreatorImage src={item.creator.photo_url} />}

          {/* <ThumbnailImage src={item?.thumbnail_url} /> */}

          <Stack overflow="hidden">
            <Typography
              variant="bodyLargeStrong"
              sx={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {item?.title}
            </Typography>
            <Typography
              variant="bodySmall"
              sx={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {item?.description}
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}
