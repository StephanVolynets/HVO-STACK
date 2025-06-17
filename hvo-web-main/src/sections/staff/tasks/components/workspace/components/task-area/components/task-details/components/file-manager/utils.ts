export const getIconName = (fileName: string) => {
  console.log("fileName", fileName);
    switch (true) {
      case fileName.toLowerCase().endsWith('.mp4'):
      case fileName.toLowerCase().endsWith('.mov'):
      case fileName.toLowerCase().endsWith('.avi'):
      case fileName.toLowerCase().endsWith('.wmv'):
      case fileName.toLowerCase().endsWith('.flv'):
      case fileName.toLowerCase().endsWith('.mkv'):
        return "video";
      case fileName.toLowerCase().endsWith('.mp3'):
      case fileName.toLowerCase().endsWith('.wav'):
      case fileName.toLowerCase().endsWith('.aac'):
      case fileName.toLowerCase().endsWith('.ogg'):
        return "audio";
      case fileName.toLowerCase().endsWith('.srt'):
      case fileName.toLowerCase().endsWith('.docx'):
      case fileName.toLowerCase().endsWith('.txt'):
        return "script";
      default:
        return "script"; 
    }
  };