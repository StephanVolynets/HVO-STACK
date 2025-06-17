import { Text } from "@react-email/components";
import { EmailWrapper } from "./shared/email-wrapper";

interface Props {
  title?: string;
  creatorName?: string;
}

const Mp4GeneratingEmail: React.FC<Props> = ({ title, creatorName }) => {
  return (
    <EmailWrapper>
      <Text style={{ fontSize: "16px", color: "#333" }}>Hi,</Text>
      <Text style={{ fontSize: "16px", marginBottom: "10px" }}>
        The MP4 for <strong>{title}</strong> from <strong>{creatorName}</strong> is currently being optimized.
      </Text>
      <Text style={{ fontSize: "16px", marginBottom: "20px" }}>No action is required.</Text>
    </EmailWrapper>
  );
};

export default Mp4GeneratingEmail;
