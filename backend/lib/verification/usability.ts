export function assessUsability(responseText: string) {
  const formatted = responseText.trim();
  const hasActionableContent = formatted.length > 50 && !formatted.toLowerCase().includes('todo');

  return {
    usable: hasActionableContent,
    warnings: [
      ...(formatted.length < 50 ? ['Response appears too short to be operationally useful.'] : []),
      ...((formatted.toLowerCase().includes('todo') || formatted.toLowerCase().includes('tbd')) ? ['Response includes unfilled placeholders.'] : []),
    ],
  };
}
