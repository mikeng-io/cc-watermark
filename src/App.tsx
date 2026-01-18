import { useState } from 'react';
import { ImageUpload } from '@/components/ImageUpload';
import { WatermarkControls } from '@/components/WatermarkControls';
import { WatermarkPreview } from '@/components/WatermarkPreview';
import { DownloadButton } from '@/components/DownloadButton';
import { Button } from '@/components/ui/button';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useWatermarkCanvas } from '@/hooks/useWatermarkCanvas';
import type { WatermarkSettings } from '@/types/watermark';
import { defaultSettings } from '@/types/watermark';

function App() {
  const { image, imageUrl, error, handleDrop, handleChange, reset } = useImageUpload();
  const [settings, setSettings] = useState<WatermarkSettings>(defaultSettings);
  const { canvasRef, download } = useWatermarkCanvas(image, settings);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-bold">Image Watermark Tool</h1>
          <p className="text-muted-foreground mt-2">
            Add repeating text watermarks to your images
          </p>
        </header>

        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          <div className="space-y-6">
            {!image ? (
              <ImageUpload
                onDrop={handleDrop}
                onChange={handleChange}
                imageUrl={imageUrl}
                error={error}
              />
            ) : (
              <>
                <WatermarkPreview ref={canvasRef} hasImage={!!image} />
                <div className="flex gap-4">
                  <Button variant="outline" onClick={reset} className="flex-1">
                    Upload New Image
                  </Button>
                  <div className="flex-1">
                    <DownloadButton
                      onDownload={download}
                      disabled={!image || !settings.text}
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          <aside>
            <WatermarkControls settings={settings} onChange={setSettings} />
          </aside>
        </div>
      </div>
    </div>
  );
}

export default App;
