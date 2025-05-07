export enum AvailableTermsKeys {
  Autumn = "autumn",
  Winter = "winter",
  Summer = "summer",
}

export type AvailableTerms = {
  [key in AvailableTermsKeys]: boolean;
};

export const TermIcons: Record<AvailableTermsKeys, string> = {
  [AvailableTermsKeys.Autumn]: "leaf",
  [AvailableTermsKeys.Winter]: "snow",
  [AvailableTermsKeys.Summer]: "sun",
};

export const TermIconBackgroundColors: Record<AvailableTermsKeys, string> = {
  [AvailableTermsKeys.Autumn]: "#ff8912",
  [AvailableTermsKeys.Winter]: "#36e3fe",
  [AvailableTermsKeys.Summer]: "#ff0",
};
