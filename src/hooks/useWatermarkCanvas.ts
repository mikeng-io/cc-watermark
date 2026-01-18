import { useRef, useEffect, useCallback } from 'react';
import type { WatermarkSettings } from '@/types/watermark';

export function useWatermarkCanvas(
  image: HTMLImageElement | null,
  settings: WatermarkSettings
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;

    // Draw original image
    ctx.drawImage(image, 0, 0);

    if (!settings.text) return;

    // Configure watermark style
    ctx.font = `${settings.fontSize}px Arial`;
    ctx.fillStyle = settings.color;
    ctx.globalAlpha = settings.opacity;

    // Measure text for spacing
    const textWidth = ctx.measureText(settings.text).width;
    const stepX = textWidth + settings.spacing;
    const stepY = settings.fontSize + settings.spacing;

    // Calculate diagonal to ensure coverage when rotated
    const diagonal = Math.sqrt(
      canvas.width * canvas.width + canvas.height * canvas.height
    );

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((settings.rotation * Math.PI) / 180);

    // Draw repeating watermark grid
    for (let y = -diagonal; y < diagonal; y += stepY) {
      for (let x = -diagonal; x < diagonal; x += stepX) {
        ctx.fillText(settings.text, x, y);
      }
    }

    ctx.restore();
    ctx.globalAlpha = 1;
  }, [image, settings]);

  useEffect(() => {
    render();
  }, [render]);

  const download = useCallback((format: 'png' | 'jpeg' | 'webp' = 'png') => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const mimeType = `image/${format}`;
    const quality = format === 'jpeg' ? 0.92 : undefined;

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `watermarked.${format}`;
        a.click();
        URL.revokeObjectURL(url);
      },
      mimeType,
      quality
    );
  }, []);

  return { canvasRef, download };
}
