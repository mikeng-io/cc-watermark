# Image Watermark Tool Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a client-side image watermarking tool that adds repeating transparent text across uploaded images.

**Architecture:** Single-page React app using Canvas API for image manipulation. User uploads image, enters watermark text, and downloads the watermarked result. All processing happens in browser.

**Tech Stack:** Vite, React 18, TypeScript, Tailwind CSS, shadcn/ui, Canvas API

---

### Task 1: Project Setup

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tailwind.config.js`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/index.css`

**Step 1: Initialize Vite React TypeScript project**

Run:
```bash
cd /Users/mike/Workplace/cc-watermark
npm create vite@latest . -- --template react-ts
```

**Step 2: Install dependencies**

Run:
```bash
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Step 3: Configure Tailwind**

Update `tailwind.config.js`:
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Update `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Step 4: Verify dev server runs**

Run: `npm run dev`
Expected: Dev server starts at localhost:5173

**Step 5: Commit**

```bash
git init
echo "node_modules\ndist\n.DS_Store" > .gitignore
git add .
git commit -m "chore: initialize vite react typescript project with tailwind"
```

---

### Task 2: Install shadcn/ui

**Files:**
- Modify: `package.json`, `tailwind.config.js`, `tsconfig.json`
- Create: `components.json`, `src/lib/utils.ts`, `src/components/ui/button.tsx`, `src/components/ui/input.tsx`, `src/components/ui/slider.tsx`, `src/components/ui/card.tsx`, `src/components/ui/label.tsx`

**Step 1: Install shadcn/ui CLI and dependencies**

Run:
```bash
npx shadcn@latest init
```

Select options:
- Style: Default
- Base color: Slate
- CSS variables: Yes

**Step 2: Add required components**

Run:
```bash
npx shadcn@latest add button input slider card label
```

**Step 3: Verify components installed**

Check that `src/components/ui/` contains the component files.

**Step 4: Commit**

```bash
git add .
git commit -m "chore: add shadcn/ui with button, input, slider, card, label components"
```

---

### Task 3: Create Image Upload Component

**Files:**
- Create: `src/components/ImageUpload.tsx`
- Create: `src/hooks/useImageUpload.ts`

**Step 1: Create the useImageUpload hook**

Create `src/hooks/useImageUpload.ts`:
```tsx
import { useState, useCallback } from 'react';

export function useImageUpload() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback((file: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!validTypes.includes(file.type)) {
      setError('Please upload a JPG, PNG, or WebP image');
      return;
    }

    setError(null);
    const url = URL.createObjectURL(file);
    setImageUrl(url);

    const img = new Image();
    img.onload = () => setImage(img);
    img.onerror = () => setError('Failed to load image');
    img.src = url;
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const reset = useCallback(() => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImage(null);
    setImageUrl(null);
    setError(null);
  }, [imageUrl]);

  return { image, imageUrl, error, handleDrop, handleChange, reset };
}
```

**Step 2: Create the ImageUpload component**

Create `src/components/ImageUpload.tsx`:
```tsx
import { useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
  onDrop: (e: React.DragEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  imageUrl: string | null;
  error: string | null;
}

export function ImageUpload({ onDrop, onChange, imageUrl, error }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <Card
      className="border-2 border-dashed p-8 text-center cursor-pointer hover:border-primary transition-colors"
      onDrop={onDrop}
      onDragOver={handleDragOver}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={onChange}
        className="hidden"
      />

      {imageUrl ? (
        <img src={imageUrl} alt="Uploaded" className="max-h-64 mx-auto" />
      ) : (
        <div className="space-y-2">
          <p className="text-lg font-medium">Drop an image here</p>
          <p className="text-sm text-muted-foreground">or click to browse</p>
          <p className="text-xs text-muted-foreground">Supports JPG, PNG, WebP</p>
        </div>
      )}

      {error && <p className="text-destructive mt-2">{error}</p>}
    </Card>
  );
}
```

**Step 3: Commit**

```bash
git add .
git commit -m "feat: add image upload component with drag-and-drop support"
```

---

### Task 4: Create Watermark Controls Component

**Files:**
- Create: `src/components/WatermarkControls.tsx`
- Create: `src/types/watermark.ts`

**Step 1: Create watermark types**

Create `src/types/watermark.ts`:
```tsx
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
```

**Step 2: Create WatermarkControls component**

Create `src/components/WatermarkControls.tsx`:
```tsx
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { WatermarkSettings } from '@/types/watermark';

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
```

**Step 3: Commit**

```bash
git add .
git commit -m "feat: add watermark controls component with text, size, opacity, rotation, spacing settings"
```

---

### Task 5: Create Watermark Canvas Renderer

**Files:**
- Create: `src/hooks/useWatermarkCanvas.ts`
- Create: `src/components/WatermarkPreview.tsx`

**Step 1: Create the useWatermarkCanvas hook**

Create `src/hooks/useWatermarkCanvas.ts`:
```tsx
import { useRef, useEffect, useCallback } from 'react';
import { WatermarkSettings } from '@/types/watermark';

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
```

**Step 2: Create WatermarkPreview component**

Create `src/components/WatermarkPreview.tsx`:
```tsx
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
```

**Step 3: Commit**

```bash
git add .
git commit -m "feat: add watermark canvas renderer with repeating text pattern"
```

---

### Task 6: Create Download Component

**Files:**
- Create: `src/components/DownloadButton.tsx`

**Step 1: Create DownloadButton component**

Create `src/components/DownloadButton.tsx`:
```tsx
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DownloadButtonProps {
  onDownload: (format: 'png' | 'jpeg' | 'webp') => void;
  disabled: boolean;
}

export function DownloadButton({ onDownload, disabled }: DownloadButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button disabled={disabled} className="w-full">
          Download
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => onDownload('png')}>
          Download as PNG
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDownload('jpeg')}>
          Download as JPEG
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDownload('webp')}>
          Download as WebP
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

**Step 2: Add dropdown-menu component from shadcn**

Run:
```bash
npx shadcn@latest add dropdown-menu
```

**Step 3: Commit**

```bash
git add .
git commit -m "feat: add download button with format selection dropdown"
```

---

### Task 7: Assemble Main App

**Files:**
- Modify: `src/App.tsx`

**Step 1: Update App.tsx to assemble all components**

Replace `src/App.tsx`:
```tsx
import { useState } from 'react';
import { ImageUpload } from '@/components/ImageUpload';
import { WatermarkControls } from '@/components/WatermarkControls';
import { WatermarkPreview } from '@/components/WatermarkPreview';
import { DownloadButton } from '@/components/DownloadButton';
import { Button } from '@/components/ui/button';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useWatermarkCanvas } from '@/hooks/useWatermarkCanvas';
import { WatermarkSettings, defaultSettings } from '@/types/watermark';

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
```

**Step 2: Verify the app works**

Run: `npm run dev`
- Upload an image
- Enter watermark text
- Adjust settings
- Verify watermark appears with repeating pattern
- Download in different formats

**Step 3: Commit**

```bash
git add .
git commit -m "feat: assemble main app with all components integrated"
```

---

### Task 8: Build and Verify Production

**Files:**
- None (verification only)

**Step 1: Build for production**

Run:
```bash
npm run build
```

Expected: Build succeeds, outputs to `dist/` folder

**Step 2: Preview production build**

Run:
```bash
npm run preview
```

Expected: App runs correctly from production build

**Step 3: Commit any fixes**

```bash
git add .
git commit -m "chore: verify production build"
```

---

## Summary

This plan creates a complete client-side image watermarking tool with:
- Drag-and-drop image upload (JPG, PNG, WebP)
- Configurable watermark settings (text, size, opacity, rotation, spacing, color)
- Canvas-based repeating watermark pattern
- Download in multiple formats
- Clean, responsive UI with shadcn/ui components
