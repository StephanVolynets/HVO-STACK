import Image from "@/components/image";
import ThumbnailImage from "@/components/images/thumbnail-image";
import SvgColor from "@/components/svg-color";
import {
  useGetVideoPreview,
  useGetVideoPreviewMedia,
} from "@/use-queries/video";
import { Box, CircularProgress, Skeleton } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useSelectedLanguage } from "../hooks/use-selected-language";

const PLAY_BUTTON_SIZE = 96;
const DEFAULT_ENGLISH_ID = -1;

export default function VideoPreview() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const { video } = useGetVideoPreview();
  const { selectedLanguage } = useSelectedLanguage();

  const { videoMedia } = useGetVideoPreviewMedia(); // Fetch video and audio tracks

  const [selectedAudioSrc, setSelectedAudioSrc] = useState<string | null>(null);
  const [isAudioLoading, setIsAudioLoading] = useState(false);

  // Update the selected audio source when the selected language changes
  useEffect(() => {
    // If English is selected, don't use a separate audio track
    if (selectedLanguage === DEFAULT_ENGLISH_ID) {
      setSelectedAudioSrc(null);
      if (videoRef.current) {
        videoRef.current.muted = false;
      }
      return;
    }

    // For other languages, find and use the corresponding audio track
    const selectedTrack = videoMedia?.audioTracks.find(
      (track) => track.languageId === selectedLanguage
    );
    setSelectedAudioSrc(selectedTrack?.src || null);

    // Mute video when using dubbed audio
    if (videoRef.current) {
      videoRef.current.muted = true;
    }
  }, [selectedLanguage, videoMedia?.audioTracks]);

  useEffect(() => {
    const video = videoRef.current;
    const audio = audioRef.current;

    if (!video || !audio) return;

    // Reset and cleanup previous audio
    audio.pause();
    audio.currentTime = 0;

    // Only setup audio sync if we're using a separate audio track
    if (selectedAudioSrc && selectedLanguage !== DEFAULT_ENGLISH_ID) {
      setIsAudioLoading(true); // Start loading state
      video.pause(); // Pause video while loading new audio

      audio.src = selectedAudioSrc;
      audio.load();

      let playPromise: Promise<void> | null = null;

      // Sync audio playback with video
      const syncAudio = () => {
        if (Math.abs(audio.currentTime - video.currentTime) > 0.1) {
          audio.currentTime = video.currentTime;
        }
      };

      const handlePlay = async () => {
        try {
          // Wait for any existing play promise to resolve
          if (playPromise) {
            await playPromise;
          }

          syncAudio(); // Sync before playing
          playPromise = audio.play();
          await playPromise;
        } catch (err) {
          console.error("Audio play error:", err);
        } finally {
          playPromise = null;
        }
      };

      const handlePause = async () => {
        try {
          // Wait for any existing play promise to resolve before pausing
          if (playPromise) {
            await playPromise;
          }
          audio.pause();
          syncAudio();
        } catch (err) {
          console.error("Audio pause error:", err);
        }
      };

      const handleVolumeChange = () => {
        audio.volume = video.volume;
        video.muted = true;
      };

      // Wait for audio to be ready before setting up initial state
      audio.addEventListener(
        "canplay",
        () => {
          setIsAudioLoading(false); // End loading state
          syncAudio();
          // Play video and audio together
          video
            .play()
            .then(() => {
              handlePlay();
            })
            .catch((err) => {
              console.error("Video play error:", err);
            });
        },
        { once: true }
      );

      // Add error handler
      audio.addEventListener(
        "error",
        () => {
          setIsAudioLoading(false);
          console.error("Audio failed to load");
        },
        { once: true }
      );

      video.addEventListener("play", handlePlay);
      video.addEventListener("pause", handlePause);
      video.addEventListener("timeupdate", syncAudio);
      video.addEventListener("seeked", syncAudio);
      video.addEventListener("volumechange", handleVolumeChange);

      return () => {
        video.removeEventListener("play", handlePlay);
        video.removeEventListener("pause", handlePause);
        video.removeEventListener("timeupdate", syncAudio);
        video.removeEventListener("seeked", syncAudio);
        video.removeEventListener("volumechange", handleVolumeChange);
      };
    }
  }, [selectedAudioSrc, selectedLanguage]);

  if (!videoMedia) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          aspectRatio: 16 / 9,
        }}
      >
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{
            width: "100%",
            height: "100%",
            borderRadius: "32px",
            bgcolor: "#333333",
          }}
        />
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      sx={{
        width: "100%",
        aspectRatio: 16 / 9,
        position: "relative",
        alignItems: "center",
        cursor: "pointer",
        maxWidth: "1920px",
        borderRadius: "32px",
        overflow: "hidden",
        boxShadow: "0px 4px 16px 0px rgba(0, 0, 0, 0.08)",
      }}
      alignSelf="center"
    >
      {videoMedia.videoSrc ? (
        <>
          <video
            ref={videoRef}
            controls
            muted={selectedLanguage !== DEFAULT_ENGLISH_ID}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 32,
            }}
            disableRemotePlayback
          >
            <source src={videoMedia.videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {selectedAudioSrc && selectedLanguage !== DEFAULT_ENGLISH_ID && (
            <audio ref={audioRef}>
              <source src={selectedAudioSrc} type="audio/wav" />
              Your browser does not support the audio tag.
            </audio>
          )}
          {isAudioLoading && (
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                borderRadius: "50%",
                padding: 2,
              }}
            >
              <CircularProgress
                sx={{
                  color: "white",
                }}
              />
            </Box>
          )}
        </>
      ) : (
        <ThumbnailImage
          src="/fallback-thumbnail.jpg"
          width="100%"
          height={635}
          borderRadius={32}
        />
      )}
    </Box>
  );
}
