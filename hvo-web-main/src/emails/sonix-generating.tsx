import { Text } from "@react-email/components";
import { EmailWrapper } from "./shared/email-wrapper";

interface Props {
  title?: string;
  creatorName?: string;
}

const SonixGeneratingEmail: React.FC<Props> = ({ title, creatorName }) => {
  return (
    <EmailWrapper>
      <Text style={{ fontSize: "16px", color: "#333" }}>Hi,</Text>
      <Text style={{ fontSize: "16px", marginBottom: "10px" }}>
        The raw transcript for <strong>{title}</strong> from <strong>{creatorName}</strong> is currently being
        generated.
      </Text>
      <Text style={{ fontSize: "16px", marginBottom: "20px" }}>No action is required.</Text>
    </EmailWrapper>
  );
};

export default SonixGeneratingEmail;
