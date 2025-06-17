import { Text } from "@react-email/components";
import { EmailWrapper } from "./shared/email-wrapper";

interface Props {
  title?: string;
  language?: string;
  transcriptorName?: string;
  transcriptionDueDate?: string;
  translatorName?: string;
  translationDueDate?: string;
  voiceActors?: string;
  recordingDueDate?: string;
  soundEngineerName?: string;
  soundEngineeringDueDate?: string;
  assignedBy?: string;
}

const StaffAssignedPAEmail: React.FC<Props> = ({
  title,
  language,
  transcriptorName,
  transcriptionDueDate,
  translatorName,
  translationDueDate,
  voiceActors,
  recordingDueDate,
  soundEngineerName,
  soundEngineeringDueDate,
  assignedBy,
}) => {
  const voiceActorsArray = voiceActors ? voiceActors.split(",") : [];

  const listItemStyle = {
    marginBottom: "5px",
  };

  return (
    <EmailWrapper>
      <Text style={{ fontSize: "16px", color: "#333" }}>Hi,</Text>
      <Text style={{ fontSize: "16px", marginBottom: "10px" }}>
        Staff has been assigned for: <strong>{title}</strong>
      </Text>
      <ul style={{ fontSize: "16px", color: "#333", marginLeft: "20px", paddingLeft: "20px" }}>
        {language && (
          <li style={listItemStyle}>
            <strong>Language:</strong> {language}
          </li>
        )}
        {transcriptorName && transcriptionDueDate && (
          <li style={listItemStyle}>
            <strong>Transcriptor:</strong> {transcriptorName}, Due: {transcriptionDueDate}
          </li>
        )}
        {translatorName && translationDueDate && (
          <li style={listItemStyle}>
            <strong>Translator:</strong> {translatorName}, Due: {translationDueDate}
          </li>
        )}
        {voiceActorsArray.length > 0 && recordingDueDate && (
          <li style={listItemStyle}>
            <strong>Voice Actors:</strong>
            <ul style={{ paddingLeft: "20px" }}>
              {voiceActorsArray.map((actor, index) => (
                <li key={index} style={listItemStyle}>
                  {actor}, Due: {recordingDueDate}
                </li>
              ))}
            </ul>
          </li>
        )}
        {soundEngineerName && soundEngineeringDueDate && (
          <li>
            <strong>Sound Engineer:</strong> {soundEngineerName}, Due: {soundEngineeringDueDate}
          </li>
        )}
      </ul>
      <Text style={{ fontSize: "16px", marginTop: "20px" }}>
        Assigned by: <strong>{assignedBy}</strong>
      </Text>
    </EmailWrapper>
  );
};

export default StaffAssignedPAEmail;
