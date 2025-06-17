import { Text } from "@react-email/components";
import { EmailWrapper } from "./shared/email-wrapper";

interface Props {
  title?: string;
  creatorName?: string;
  language?: string;
  soundEngineerName?: string;
  boxLink?: string;
}

const MixedAudioReadyPAEmail: React.FC<Props> = ({ title, creatorName, language, soundEngineerName, boxLink }) => {
  return (
    <EmailWrapper>
      <Text style={{ fontSize: "16px", color: "#333" }}>Hi,</Text>
      <Text style={{ fontSize: "16px", marginBottom: "10px" }}>
        The mixed audio for: <strong>{title}</strong> from <strong>{creatorName}</strong> in <strong>{language}</strong>{" "}
        has been uploaded by <strong>{soundEngineerName}</strong>.
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

export default MixedAudioReadyPAEmail;
