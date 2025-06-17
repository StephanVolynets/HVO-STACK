import { Text } from "@react-email/components";
import { EmailWrapper } from "./shared/email-wrapper";

interface Props {
  title?: string;
  creatorName?: string;
  videoLink?: string;
  language?: string;
  rawAudioLink?: string;
  dueDate?: string;
  uploadLink?: string;
}

const VoiceOverReadyEmail: React.FC<Props> = ({
  title,
  creatorName,
  videoLink,
  language,
  rawAudioLink,
  dueDate,
  uploadLink,
}) => {
  return (
    <EmailWrapper>
      <Text style={{ fontSize: "16px", color: "#333" }}>Hi,</Text>
      <Text style={{ fontSize: "16px", marginBottom: "10px" }}>
        A new <strong>{creatorName}</strong> video arrived.
      </Text>
      <Text style={{ fontSize: "16px", marginBottom: "10px" }}>
        <strong>Title:</strong> {title}
      </Text>
      <Text style={{ fontSize: "16px", marginBottom: "10px" }}>
        Here is the video:{" "}
        <a href={videoLink} style={{ color: "#0F4C81", textDecoration: "underline" }}>
          {videoLink}
        </a>
      </Text>
      <Text style={{ fontSize: "16px", marginBottom: "10px" }}>
        Here is the <strong>{language}</strong> raw audio:{" "}
        <a href={rawAudioLink} style={{ color: "#0F4C81", textDecoration: "underline" }}>
          {rawAudioLink}
        </a>
      </Text>
      <Text style={{ fontSize: "16px", marginBottom: "10px" }}>
        We would need the final <strong>{language}</strong> mix by <strong>{dueDate}</strong>.
      </Text>
      <Text style={{ fontSize: "16px", marginBottom: "20px" }}>
        When completed, please upload here:{" "}
        <a href={uploadLink} style={{ color: "#0F4C81", textDecoration: "underline" }}>
          {uploadLink}
        </a>
      </Text>
    </EmailWrapper>
  );
};

export default VoiceOverReadyEmail;
