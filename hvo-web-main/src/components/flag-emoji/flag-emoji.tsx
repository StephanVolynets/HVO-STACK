export default function FlagEmoji({
  countryCode,
  size,
  maxHeight,
}: {
  countryCode: string;
  size?: number;
  maxHeight?: number;
}) {
  const flagEmoji = getFlagEmoji(countryCode);

  return (
    <span
      style={{
        fontSize: size || "32px",
        fontFamily:
          "'Noto Color Emoji', Apple Color Emoji, Segoe UI Emoji, sans-serif",
        lineHeight: 1,
        maxHeight: maxHeight ? maxHeight : "unset",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {flagEmoji}
    </span>
  );
}

function getFlagEmoji(countryCode: string) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));

  return String.fromCodePoint(...codePoints);
}
