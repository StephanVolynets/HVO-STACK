import SvgColor from "@/components/svg-color";
import { Box, Typography } from "@mui/material";
import { Stack } from "@mui/material";

export default function FeedbacksEmpty() {
  return (
    <Stack
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <Box
        component="img"
        src="/assets/images/comment-bubble.png"
        width={92}
        height={92}
      />
      <Typography variant="bodySmall">All quiet for now.</Typography>
      <Typography variant="bodySmall">Feedback will show here</Typography>
    </Stack>
    // <Stack
    //     direction="column"
    //     justifyContent="center"
    //     alignItems="center"
    //     spacing={2}
    //     sx={{
    //         height: '100%',
    //         px: 4,
    //         pb: 8,
    //         pt: 2
    //     }}
    // >
    //     <Box
    //         sx={{
    //             width: 80,
    //             height: 80,
    //             borderRadius: '50%',
    //             // backgroundColor: 'rgba(0, 102, 204, 0.06)',
    //             backgroundColor: "common.surface2",
    //             display: 'flex',
    //             alignItems: 'center',
    //             justifyContent: 'center',
    //             mb: 1
    //         }}
    //     >
    //         <SvgColor
    //             src="/assets/icons/feedback.svg"
    //             sx={{
    //                 width: 32,
    //                 height: 32,
    //                 color: 'secondary.main'
    //             }}
    //         />
    //     </Box>

    //     <Typography
    //         variant="h6"
    //         sx={{
    //             fontWeight: 600,
    //             color: 'text.primary',
    //             textAlign: 'center'
    //         }}
    //     >
    //         No feedback yet
    //     </Typography>

    //     <Typography
    //         sx={{
    //             color: 'text.secondary',
    //             textAlign: 'center',
    //             fontSize: 14,
    //             lineHeight: 1.5
    //         }}
    //     >
    //         Feedback will appear here once provided by creators
    //     </Typography>
    // </Stack>
  );
}
