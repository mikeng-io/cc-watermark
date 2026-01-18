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
