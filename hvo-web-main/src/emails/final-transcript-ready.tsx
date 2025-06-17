import { Text } from "@react-email/components";
import { EmailWrapper } from "./shared/email-wrapper";

interface Props {
  title?: string;
  creatorName?: string;
  videoLink?: string;
  englishScriptLink?: string;
  language?: string;
  dueDate?: string;
  uploadLink?: string;
}

const FinalTranscriptReadyEmail: React.FC<Props> = ({
  title,
  creatorName,
  videoLink,
  englishScriptLink,
  language,
  dueDate,
  uploadLink,
}) => {
  return (
    <EmailWrapper>
      <Text style={{ fontSize: "16px", color: "#333" }}>Hi,</Text>
      <Text style={{ fontSize: "16px", marginBottom: "10px" }}>
        A new <strong>{creatorName}</strong> video arrived.
      </Text>
      <Text style={{ fontSize: "16px", marginBottom: "10px" }}>
        <strong>Title:</strong> {title}
      </Text>
      <Text style={{ fontSize: "16px", marginBottom: "10px" }}>
        Here is the video:{" "}
        <a href={videoLink} style={{ color: "#0F4C81", textDecoration: "underline" }}>
          {videoLink}
        </a>
      </Text>
      <Text style={{ fontSize: "16px", marginBottom: "10px" }}>
        Here is the English script:{" "}
        <a href={englishScriptLink} style={{ color: "#0F4C81", textDecoration: "underline" }}>
          {englishScriptLink}
        </a>
      </Text>
      <Text style={{ fontSize: "16px", marginBottom: "10px" }}>
        We would need the final <strong>{language}</strong> script by <strong>{dueDate}</strong>.
      </Text>
      <Text style={{ fontSize: "16px", marginBottom: "20px" }}>
        When completed, please upload here:{" "}
        <a href={uploadLink} style={{ color: "#0F4C81", textDecoration: "underline" }}>
          {uploadLink}
        </a>
      </Text>
    </EmailWrapper>
  );
};

export default FinalTranscriptReadyEmail;
