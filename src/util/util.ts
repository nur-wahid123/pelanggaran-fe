export function toTitleCase(str: string): string {
  return str
    .replace(/-/g, " ")
    .replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase(),
    );
}

export function truncateName(name: string, limit: number): string {
  const words = name.split(" ");

  // Step 1: Try initial truncation from the end
  let result = words
    .map((word, index) => (index === words.length - 1 ? word[0] + "." : word))
    .join(" ");

  // Step 2: If still too long, start reducing earlier words
  for (let i = words.length - 2; i >= 0 && result.length > limit; i--) {
    words[i] = words[i][0] + ".";
    result = words.join(" ");
  }

  return result;
}
