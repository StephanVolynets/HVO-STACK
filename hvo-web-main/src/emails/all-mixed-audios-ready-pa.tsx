import { Text } from "@react-email/components";
import { EmailWrapper } from "./shared/email-wrapper";

interface Props {
  title?: string;
  creatorName?: string;
  languages?: string; // List of languages
  soundEngineerNames?: string;
  boxLink?: string;
}

const AllMixedAudiosReadyEmail: React.FC<Props> = ({ title, creatorName, languages, soundEngineerNames, boxLink }) => {
  return (
    <EmailWrapper>
      <Text style={{ fontSize: "16px", color: "#333" }}>Hi,</Text>
      <Text style={{ fontSize: "16px", marginBottom: "10px" }}>
        The mixed audio for <strong>{title}</strong> from <strong>{creatorName}</strong> in all languages:
      </Text>
      <Text style={{ fontSize: "16px", marginBottom: "10px" }}>
        <strong>Languages:</strong> {languages}
      </Text>
      <Text style={{ fontSize: "16px", marginBottom: "10px" }}>
        has been uploaded by <strong>{soundEngineerNames}</strong>.
      </Text>
      <Text style={{ fontSize: "16px", marginBottom: "10px" }}>
        You can access the files here:{" "}
        <a href={boxLink} style={{ color: "#0F4C81", textDecoration: "underline" }}>
          {boxLink}
        </a>
      </Text>
      <Text style={{ fontSize: "16px", marginBottom: "20px" }}>This video is now marked as complete.</Text>
    </EmailWrapper>
  );
};

export default AllMixedAudiosReadyEmail;
