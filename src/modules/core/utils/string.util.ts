// capitalize the first letter per word
// ex: john emmanuel to John Emmanuel
export function capitalizeWord(words: string | undefined) {
  if (!words) return "N/A";
  return words
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
