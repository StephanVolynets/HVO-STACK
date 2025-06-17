import { Text } from "@react-email/components";
import { EmailWrapper } from "./shared/email-wrapper";

interface Props {
  title?: string;
  creatorName?: string;
  transcriptorName?: string;
  dueDate?: string;
}

const RawTranscriptReadyPAEmail: React.FC<Props> = ({ title, creatorName, transcriptorName, dueDate }) => {
  return (
    <EmailWrapper>
      <Text style={{ fontSize: "16px", color: "#333" }}>Hi,</Text>
      <Text style={{ fontSize: "16px", marginBottom: "10px" }}>
        The raw transcript for <strong>{title}</strong> from <strong>{creatorName}</strong> has been sent to{" "}
        <strong>{transcriptorName}</strong>.
      </Text>
      <Text style={{ fontSize: "16px", marginBottom: "20px" }}>
        Expected delivery: <strong>{dueDate}</strong>.
      </Text>
    </EmailWrapper>
  );
};

export default RawTranscriptReadyPAEmail;
