function parseJsonSafely(input: string): Record<string, unknown> {
  try {
    const parsed = JSON.parse(input);
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

export default parseJsonSafely;