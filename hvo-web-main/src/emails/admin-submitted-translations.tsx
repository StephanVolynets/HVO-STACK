import { Text } from "@react-email/components";
import { EmailWrapper } from "./shared/email-wrapper";

interface Props {
  title?: string;
  url?: string;
}

const AdminSubmittedTranslationsEmail: React.FC<Props> = ({ title, url }) => {
  return (
    <EmailWrapper>
      <Text style={{ fontSize: "16px", color: "#333" }}>Hi,</Text>
      <Text style={{ fontSize: "16px", marginBottom: "10px" }}>
        Video: <strong>{title}</strong>
      </Text>
      <Text style={{ fontSize: "16px", marginBottom: "10px" }}>
        This message is to inform you that the dubs are ready for YouTube.
      </Text>
      <Text style={{ fontSize: "16px", marginBottom: "20px" }}>
        Please{" "}
        <a href={url} style={{ color: "#0F4C81", textDecoration: "underline" }}>
          login here
        </a>{" "}
        to preview and download.
      </Text>
    </EmailWrapper>
  );
};

export default AdminSubmittedTranslationsEmail;
