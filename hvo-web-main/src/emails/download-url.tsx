import { Text } from "@react-email/components";
import { EmailWrapper } from "./shared/email-wrapper";

interface Props {
  title?: string;
  url?: string;
}

const DownloadUrlGeneratedEmail: React.FC<Props> = ({ title, url }) => {
  return (
    <EmailWrapper>
      <Text style={{ fontSize: "16px", color: "#333" }}>Hi,</Text>
      <Text style={{ fontSize: "16px", marginBottom: "10px" }}>Your resources are ready to download.</Text>
      <Text style={{ fontSize: "16px", marginBottom: "10px" }}>
        <a href={url} style={{ color: "#0F4C81", textDecoration: "underline" }}>
          {url}
        </a>
      </Text>
    </EmailWrapper>
  );
};

export default DownloadUrlGeneratedEmail;
