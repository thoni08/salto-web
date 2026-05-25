export const LIVE_FEATURE_ENABLED =
  String(import.meta.env.VITE_LIVE_FEATURE_ENABLED || "").toLowerCase() ===
  "true";

export const LIVE_COMING_SOON_LABEL = "Coming Soon";
