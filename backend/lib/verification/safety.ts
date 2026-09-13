export function assessSafety(responseText: string) {
  const lower = responseText.toLowerCase();
  const refusalMarkers = ['cannot comply', 'not able to fulfill', 'refuse', 'unable to provide'];
  const uncertaintyMarkers = ['uncertain', 'not sure', 'might', 'possibly'];

  const refusal = refusalMarkers.some((marker) => lower.includes(marker));
  const uncertainty = uncertaintyMarkers.some((marker) => lower.includes(marker));

  return {
    refusal,
    uncertainty,
    safe: !refusal,
    confidenceAdjustment: refusal ? -0.25 : uncertainty ? -0.1 : 0,
  };
}
