import { Body, Container, Html, Link, Section, Text } from "@react-email/components";
import { EmailWrapper } from "./shared/email-wrapper";

interface Props {
  title?: string;
  creatorName?: string;
  url?: string;
}

const NewVideoSubmissionPAEmail: React.FC<Props> = ({ title, creatorName, url }) => (
  <EmailWrapper>
    <Text style={{ fontSize: "16px", color: "#333" }}>Hi,</Text>
    <Text style={{ fontSize: "16px", marginBottom: "10px" }}>
      A new episode from <strong>{creatorName}</strong> has arrived.
    </Text>
    <Text style={{ fontSize: "16px", marginBottom: "10px" }}>
      <strong>Title:</strong> {title}
    </Text>
    <Text style={{ fontSize: "16px", marginTop: "20px", marginBottom: "20px" }}>
      Please assign staff & provide due dates for each stage.
    </Text>
    <a
      href={url}
      style={{
        display: "inline-block",
        padding: "10px 20px",
        backgroundColor: "#0F4C81",
        color: "#ffffff",
        textDecoration: "none",
        fontWeight: "bold",
        borderRadius: "4px",
      }}
    >
      Login here
    </a>
  </EmailWrapper>
);

export default NewVideoSubmissionPAEmail;
