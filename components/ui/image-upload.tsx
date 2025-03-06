"use client";

import { CldUploadWidget } from "next-cloudinary";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: () => void;
  value: string[];
}

export function ImageUpload({
  disabled,
  onChange,
  onRemove,
  value,
}: ImageUploadProps) {
  const onUpload = (result: any) => {
    console.log("Upload result:", result);

    if (!result?.info) {
      console.error("Upload failed: No result info");
      return;
    }

    if (!result.info.secure_url) {
      console.error("Upload failed: No secure URL", result.info);
      return;
    }

    console.log("Upload successful:", result.info.secure_url);
    onChange(result.info.secure_url);
  };

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {value.map((url) => (
          <div
            key={url}
            className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
          >
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                onClick={onRemove}
                variant="destructive"
                size="icon"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image
              fill
              className="object-cover"
              alt="Product image"
              src={url}
            />
          </div>
        ))}
      </div>
      <CldUploadWidget onUpload={onUpload} uploadPreset="essencial_products">
        {({ open }) => (
          <Button
            type="button"
            variant="secondary"
            onClick={() => open()}
            disabled={disabled}
          >
            <ImagePlus className="h-4 w-4 mr-2" />
            Fazer upload de imagem
          </Button>
        )}
      </CldUploadWidget>
    </div>
  );
}
