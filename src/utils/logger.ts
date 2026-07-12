function timestamp(): string {
  return new Date().toISOString().split('T')[1]?.replace('Z', '') ?? '';
}

export const logger = {
  section(title: string) {
    console.log(`\n=== ${title} ===`);
  },
  info(message: string) {
    if (message) console.log(message);
  },
  success(message: string) {
    console.log(`\n[done] ${message}`);
  },
  warn(message: string) {
    console.warn(`[warn] ${message}`);
  },
  tool(agentName: string, toolName: string, input: unknown) {
    const preview = JSON.stringify(input);
    const truncated = preview.length > 160 ? `${preview.slice(0, 160)}…` : preview;
    console.log(`[${timestamp()}] ${agentName} -> ${toolName}(${truncated})`);
  },
};
