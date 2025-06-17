import { Text } from "@react-email/components";
import { EmailWrapper } from "./shared/email-wrapper";

interface Props {
  title?: string;
  creatorName?: string;
  language?: string;
  soundEngineerName?: string;
  dueDate?: string;
}

const VoiceOverReadyPAEmail: React.FC<Props> = ({ title, creatorName, language, soundEngineerName, dueDate }) => {
  return (
    <EmailWrapper>
      <Text style={{ fontSize: "16px", color: "#333" }}>Hi,</Text>
      <Text style={{ fontSize: "16px", marginBottom: "10px" }}>
        The <strong>{language}</strong> raw audio for:
      </Text>
      <Text style={{ fontSize: "16px", marginBottom: "10px" }}>
        <strong>{title}</strong> from <strong>{creatorName}</strong>
      </Text>
      <Text style={{ fontSize: "16px", marginBottom: "10px" }}>
        has been sent to <strong>{soundEngineerName}</strong> for <strong>{language}</strong>.
      </Text>
      <Text style={{ fontSize: "16px", marginBottom: "20px" }}>
        Expected delivery: <strong>{dueDate}</strong>.
      </Text>
    </EmailWrapper>
  );
};

export default VoiceOverReadyPAEmail;
