export default function mapAuthCodeToMessage(authCode: string) {
  switch (authCode) {
    case "auth/invalid-credential":
      return "The credential you provided is invalid.";

    case "auth/credential-already-in-use":
      return "The credential you provided is already in use.";

    default:
      return "";
  }
}
