import { render } from "@react-email/components";
import { HttpStatusCode } from "axios";
import SonixGeneratingEmail from "src/emails/sonix-generating";
import SonixCompletedEmail from "src/emails/sonix-completed";
import React from "react";
import { NextRequest } from "next/server";
import Mp4GeneratingEmail from "@/emails/mp4-generating";
import Mp4CompletedEmail from "@/emails/mp4-completed";
import RawTranscriptReadyEmail from "@/emails/raw-transcript-ready";
import RawTranscriptReadyPAEmail from "@/emails/raw-transcript-ready-pa";
import FinalTranscriptReadyEmail from "@/emails/final-transcript-ready";
import FinalTranscriptReadyPAEmail from "@/emails/final-transcript-ready-pa";
import TranslationUploadedPAEmail from "@/emails/translation-uploaded-pa";
import TranslationReadyEmail from "@/emails/translation-ready";
import TranslationReadyPAEmail from "@/emails/translation-ready-pa";
import VoiceOverUploadedPAEmail from "@/emails/voice-over-uploaded-pa";
import VoiceOverReadyEmail from "@/emails/voice-over-ready";
import VoiceOverReadyPAEmail from "@/emails/voice-over-ready-pa";
import MixedAudioReadyPAEmail from "@/emails/mixed-audio-ready-pa";
import AllMixedAudiosReadyEmail from "@/emails/all-mixed-audios-ready-pa";
import AdminSubmittedTranslationsEmail from "@/emails/admin-submitted-translations";
import NewVideoSubmissionPAEmail from "@/emails/new-video-submission-pa";
import StaffAssignedPAEmail from "@/emails/staff-assigned-pa";
import TranscriptionUploadedPAEmail from "@/emails/transcription-uploaded-pa";
import DownloadUrlGeneratedEmail from "@/emails/download-url";
const EMAIL_TEMPLATES: Record<string, React.FC> = {
  NEW_VIDEO_SUBMISSION_PA: NewVideoSubmissionPAEmail,
  STAFF_ASSIGNED_PA: StaffAssignedPAEmail,
  SONIX_GENERATING: SonixGeneratingEmail,
  SONIX_COMPLETED: SonixCompletedEmail,
  MP4_GENERATING: Mp4GeneratingEmail,
  MP4_COMPLETED: Mp4CompletedEmail,
  // Transcribers
  RAW_TRANSCRIPT_READY: RawTranscriptReadyEmail,
  RAW_TRANSCRIPT_READY_PA: RawTranscriptReadyPAEmail,
  TRANSCRIPTION_UPLOADED_PA: TranscriptionUploadedPAEmail,
  // Translators
  FINAL_TRANSCRIPT_READY: FinalTranscriptReadyEmail,
  FINAL_TRANSCRIPT_READY_PA: FinalTranscriptReadyPAEmail,
  TRANSLATION_UPLOADED_PA: TranslationUploadedPAEmail,
  // Voice actors
  TRANSLATION_READY: TranslationReadyEmail,
  TRANSLATION_READY_PA: TranslationReadyPAEmail,
  VOICE_OVER_UPLOADED_PA: VoiceOverUploadedPAEmail,
  // Audio Engineers
  VOICE_OVER_READY: VoiceOverReadyEmail,
  VOICE_OVER_READY_PA: VoiceOverReadyPAEmail,
  MIXED_AUDIO_READY_PA: MixedAudioReadyPAEmail,
  // Other
  ALL_MIXED_AUDIOS_READY_PA: AllMixedAudiosReadyEmail,
  ADMIN_SUBMITTED_TRANSLATIONS: AdminSubmittedTranslationsEmail,
  DOWNLOAD_URL_GENERATED: DownloadUrlGeneratedEmail,
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const template = searchParams.get("template");
  const accessToken = req.headers.get("email-render-access-token");

  // if (accessToken !== process.env.EMAIL_RENDER_ACCESS_TOKEN) {
  //   return new Response(JSON.stringify({ error: "Unauthorized access: Invalid access token provided." }), {
  //     status: HttpStatusCode.Unauthorized,
  //   });
  // }

  if (!template) {
    return new Response(JSON.stringify({ error: "Template not provided" }), { status: HttpStatusCode.BadRequest });
  }

  const TemplateComponent = EMAIL_TEMPLATES[template];

  if (!TemplateComponent) {
    return new Response(JSON.stringify({ error: "Template not found" }), { status: HttpStatusCode.NotFound });
  }

  // Extract query parameters as props
  const props = Object.fromEntries(searchParams.entries());

  try {
    // Render the template with the passed props
    const html = await render(React.createElement(TemplateComponent, props));
    return new Response(html, { status: HttpStatusCode.Ok });
  } catch (error) {
    console.error("Error rendering template:", error);
    return new Response(JSON.stringify({ error: "An error occurred while generating the email content." }), {
      status: HttpStatusCode.InternalServerError,
    });
  }
}
