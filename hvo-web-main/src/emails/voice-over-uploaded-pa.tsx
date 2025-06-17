import { Text } from "@react-email/components";
import { EmailWrapper } from "./shared/email-wrapper";

interface Props {
  title?: string;
  creatorName?: string;
  language?: string;
  voiceActorName?: string;
  boxLink?: string;
}

const VoiceOverUploadedPAEmail: React.FC<Props> = ({ title, creatorName, language, voiceActorName, boxLink }) => {
  return (
    <EmailWrapper>
      <Text style={{ fontSize: "16px", color: "#333" }}>Hi,</Text>
      <Text style={{ fontSize: "16px", marginBottom: "10px" }}>
        The dubbed audio for: <strong>{title}</strong> from <strong>{creatorName}</strong> in{" "}
        <strong>{language}</strong> has been uploaded by <strong>{voiceActorName}</strong>.
      </Text>
      <Text style={{ fontSize: "16px", marginBottom: "20px" }}>
        You can access it here:{" "}
        <a href={boxLink} style={{ color: "#0F4C81", textDecoration: "underline" }}>
          {boxLink}
        </a>
      </Text>
    </EmailWrapper>
  );
};

export default VoiceOverUploadedPAEmail;
