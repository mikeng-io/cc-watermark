import { forwardRef } from 'react';
import { Card } from '@/components/ui/card';

interface WatermarkPreviewProps {
  hasImage: boolean;
}

export const WatermarkPreview = forwardRef<HTMLCanvasElement, WatermarkPreviewProps>(
  ({ hasImage }, ref) => {
    if (!hasImage) {
      return (
        <Card className="p-8 text-center text-muted-foreground">
          <p>Upload an image to see preview</p>
        </Card>
      );
    }

    return (
      <Card className="p-4 overflow-auto">
        <canvas ref={ref} className="max-w-full h-auto mx-auto block" />
      </Card>
    );
  }
);

WatermarkPreview.displayName = 'WatermarkPreview';
