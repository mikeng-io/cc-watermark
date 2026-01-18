import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import type { WatermarkSettings } from '@/types/watermark';

interface WatermarkControlsProps {
  settings: WatermarkSettings;
  onChange: (settings: WatermarkSettings) => void;
}

export function WatermarkControls({ settings, onChange }: WatermarkControlsProps) {
  const update = <K extends keyof WatermarkSettings>(
    key: K,
    value: WatermarkSettings[K]
  ) => {
    onChange({ ...settings, [key]: value });
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-2">
        <Label htmlFor="watermark-text">Watermark Text</Label>
        <Input
          id="watermark-text"
          value={settings.text}
          onChange={(e) => update('text', e.target.value)}
          placeholder="Enter watermark text..."
        />
      </div>

      <div className="space-y-2">
        <Label>Font Size: {settings.fontSize}px</Label>
        <Slider
          value={[settings.fontSize]}
          onValueChange={([v]) => update('fontSize', v)}
          min={12}
          max={72}
          step={1}
        />
      </div>

      <div className="space-y-2">
        <Label>Opacity: {Math.round(settings.opacity * 100)}%</Label>
        <Slider
          value={[settings.opacity]}
          onValueChange={([v]) => update('opacity', v)}
          min={0.1}
          max={0.8}
          step={0.05}
        />
      </div>

      <div className="space-y-2">
        <Label>Rotation: {settings.rotation}°</Label>
        <Slider
          value={[settings.rotation]}
          onValueChange={([v]) => update('rotation', v)}
          min={-90}
          max={90}
          step={5}
        />
      </div>

      <div className="space-y-2">
        <Label>Spacing: {settings.spacing}px</Label>
        <Slider
          value={[settings.spacing]}
          onValueChange={([v]) => update('spacing', v)}
          min={50}
          max={300}
          step={10}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="watermark-color">Color</Label>
        <Input
          id="watermark-color"
          type="color"
          value={settings.color}
          onChange={(e) => update('color', e.target.value)}
          className="h-10 w-full cursor-pointer"
        />
      </div>
    </Card>
  );
}
