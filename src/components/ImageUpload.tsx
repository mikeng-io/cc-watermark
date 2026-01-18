import { useRef } from 'react';
import { Card } from '@/components/ui/card';

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
