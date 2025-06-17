import { Text } from "@react-email/components";
import { EmailWrapper } from "./shared/email-wrapper";
interface Props {
  title?: string;
  creatorName?: string;
  boxLink?: string;
}

const Mp4CompletedEmail: React.FC<Props> = ({ title, creatorName, boxLink }) => {
  return (
    <EmailWrapper>
      <Text style={{ fontSize: "16px", color: "#333" }}>Hi,</Text>
      <Text style={{ fontSize: "16px", marginBottom: "10px" }}>
        The Optimized.mp4 for <strong>{title}</strong> from <strong>{creatorName}</strong> has been successfully
        uploaded to Box.
      </Text>
      <Text style={{ fontSize: "16px", marginBottom: "10px" }}>
        Access source files here:{" "}
        <a href={boxLink} style={{ color: "#0F4C81", textDecoration: "underline" }}>
          {boxLink}
        </a>
      </Text>
      <Text style={{ fontSize: "16px", marginBottom: "20px" }}>No action is required.</Text>
    </EmailWrapper>
  );
};

export default Mp4CompletedEmail;
