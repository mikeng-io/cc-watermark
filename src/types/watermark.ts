export interface WatermarkSettings {
  text: string;
  fontSize: number;
  opacity: number;
  rotation: number;
  spacing: number;
  color: string;
}

export const defaultSettings: WatermarkSettings = {
  text: '',
  fontSize: 24,
  opacity: 0.3,
  rotation: -30,
  spacing: 100,
  color: '#000000',
};
