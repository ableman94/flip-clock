
export interface FlipDigitProps {
  value: string | number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  theme?: 'dark' | 'light';
  indicator?: string; // For AM/PM labels
}

export type ClockMode = 'clock' | 'timer';
export type OrientationMode = 'auto' | 'portrait';

export interface AppSettings {
  showSeconds: boolean;
  theme: 'dark' | 'light';
  is24Hour: boolean;
  mode: ClockMode;
  orientation: OrientationMode;
}
