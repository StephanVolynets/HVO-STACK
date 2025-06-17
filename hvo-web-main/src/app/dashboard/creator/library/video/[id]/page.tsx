// import { LibraryView } from "@/sections/creator/library";

import { getVideoTitleById } from "@/apis/video";
import { paths } from "@/routes/paths";
import { VideoView } from "@/sections/creator/video";
import { Metadata } from "next";

// export const metadata = {
//   title: "Video",
// };

export async function generateMetadata({ params }): Promise<Metadata> {
  const title = await getVideoTitleById(params.id);

  return {
    title: title ?? "__",
    description: `Preview dubs for: ${title ?? "Untitled Video"}`,
    openGraph: {
      title: "Video",
      description: `Preview dubs for: ${title ?? "Untitled Video"}`,
      url: `${paths.dashboard.creator.video(params.id)}`,
    },
  };
}

export default function VideoPage() {
  return <VideoView />;
}
