import { Text } from "@react-email/components";
import { EmailWrapper } from "./shared/email-wrapper";

interface Props {
  title?: string;
  creatorName?: string;
  translatorName?: string;
  language?: string;
  dueDate?: string;
}

const FinalTranscriptReadyPAEmail: React.FC<Props> = ({ title, creatorName, translatorName, language, dueDate }) => {
  return (
    <EmailWrapper>
      <Text style={{ fontSize: "16px", color: "#333" }}>Hi,</Text>
      <Text style={{ fontSize: "16px", marginBottom: "10px" }}>
        The English script for <strong>{title}</strong> from <strong>{creatorName}</strong> has been sent to{" "}
        <strong>{translatorName}</strong> for <strong>{language}</strong>.
      </Text>
      <Text style={{ fontSize: "16px", marginBottom: "20px" }}>
        Expected delivery: <strong>{dueDate}</strong>.
      </Text>
    </EmailWrapper>
  );
};

export default FinalTranscriptReadyPAEmail;
