import { Text } from "@react-email/components";
import { EmailWrapper } from "./shared/email-wrapper";

interface Props {
  title?: string;
  creatorName?: string;
  videoLink?: string;
  transcriptLink?: string;
  dueDate?: string;
  taskLink?: string;
}

const RawTranscriptReadyEmail: React.FC<Props> = ({
  title,
  creatorName,
  videoLink,
  transcriptLink,
  dueDate,
  taskLink,
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
        Here is the raw transcript:{" "}
        <a href={transcriptLink} style={{ color: "#0F4C81", textDecoration: "underline" }}>
          {transcriptLink}
        </a>
      </Text>
      <Text style={{ fontSize: "16px", marginBottom: "10px" }}>
        We would need the final English script by <strong>{dueDate}</strong>.
      </Text>
      <Text style={{ fontSize: "16px", marginBottom: "20px" }}>
        When completed, please upload here:{" "}
        <a href={taskLink} style={{ color: "#0F4C81", textDecoration: "underline" }}>
          {taskLink}
        </a>
      </Text>
    </EmailWrapper>
  );
};

export default RawTranscriptReadyEmail;
