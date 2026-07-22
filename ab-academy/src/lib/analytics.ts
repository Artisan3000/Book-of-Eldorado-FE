type AnalyticsEventParameters = Record<
  string,
  string | number | boolean | null | undefined
>;

export function trackEvent(
  eventName: string,
  parameters: AnalyticsEventParameters = {}
) {
  if (typeof window === "undefined" || !window.gtag) return;

  window.gtag("event", eventName, parameters);
}
