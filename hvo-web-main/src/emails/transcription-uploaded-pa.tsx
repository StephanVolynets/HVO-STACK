import { Text } from "@react-email/components";
import { EmailWrapper } from "./shared/email-wrapper";

interface Props {
  title?: string;
  creatorName?: string;
  transcriptorName?: string;
  boxLink?: string;
}

const TranscriptionUploadedPAEmail: React.FC<Props> = ({ title, creatorName, transcriptorName, boxLink }) => {
  return (
    <EmailWrapper>
      <Text style={{ fontSize: "16px", color: "#333" }}>Hi,</Text>
      <Text style={{ fontSize: "16px", marginBottom: "10px" }}>
        The final English script for: <br /> <strong>{title}</strong> from <strong>{creatorName}</strong> <br />
        has been uploaded by <strong>{transcriptorName}</strong>.
      </Text>
      <Text style={{ fontSize: "16px", marginBottom: "20px" }}>
        You can access it here:{" "}
        <a href={boxLink} style={{ color: "#0F4C81", textDecoration: "underline" }}>
          {boxLink}
        </a>
      </Text>
    </EmailWrapper>
  );
};

export default TranscriptionUploadedPAEmail;
