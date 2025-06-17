// import { LibraryView } from "@/sections/creator/library";

import { getVideoTitleById } from "@/apis/video";
import { paths } from "@/routes/paths";
import { SharedVideoView } from "@/sections/creator/shared-video";
import { Metadata } from "next";

export async function generateMetadata({ params }): Promise<Metadata> {
  const title = await getVideoTitleById(params.id);

  return {
    title: title ?? "__",
    description: `Preview dubs for: ${title ?? "Untitled Video"}`,
    openGraph: {
      title: "Video",
      description: `Preview dubs for: ${title ?? "Untitled Video"}`,
      url: `${paths.preview(params.id, params.token)}`,
    },
  };
}

export default function VideoPage() {
  return <SharedVideoView />;
}
