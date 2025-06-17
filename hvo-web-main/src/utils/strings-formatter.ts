/**
 * Converts an uppercase underscore-separated string (e.g., IN_PROGRESS) to Title Case (e.g., "In Progress")
 */
export function toTitleCase(input: string): string {
  return input
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Converts an uppercase underscore-separated string (e.g., IN_PROGRESS) to Sentence Case (e.g., "In progress")
 */
export function toSentenceCase(input: string): string {
  const formatted = input.toLowerCase().split("_").join(" ");
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}
