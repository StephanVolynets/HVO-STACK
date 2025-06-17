import { Text } from "@react-email/components";
import { EmailWrapper } from "./shared/email-wrapper";

interface Props {
  title?: string;
  creatorName?: string;
  scriptLanguage?: string;
  actorName?: string;
  dueDate?: string;
}

const TranslationReadyPAEmail: React.FC<Props> = ({ title, creatorName, scriptLanguage, actorName, dueDate }) => {
  return (
    <EmailWrapper>
      <Text style={{ fontSize: "16px", color: "#333" }}>Hi,</Text>
      <Text style={{ fontSize: "16px", marginBottom: "10px" }}>
        The <strong>{scriptLanguage}</strong> script for:
      </Text>
      <Text style={{ fontSize: "16px", marginBottom: "10px" }}>
        <strong>{title}</strong> from <strong>{creatorName}</strong>
      </Text>
      <Text style={{ fontSize: "16px", marginBottom: "10px" }}>
        has been sent to <strong>{actorName}</strong> for <strong>{scriptLanguage}</strong>.
      </Text>
      <Text style={{ fontSize: "16px", marginBottom: "20px" }}>
        Expected delivery: <strong>{dueDate}</strong>.
      </Text>
    </EmailWrapper>
  );
};

export default TranslationReadyPAEmail;
