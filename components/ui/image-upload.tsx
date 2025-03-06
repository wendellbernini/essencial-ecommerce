"use client";

import { CldUploadWidget } from "next-cloudinary";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (url: string) => void;
  value: string[];
}

export function ImageUpload({
  disabled,
  onChange,
  onRemove,
  value,
}: ImageUploadProps) {
  return (
    <div>
      <div className="mb-4 flex items-center gap-4 flex-wrap">
        {value.map((url) => (
          <div
            key={url}
            className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
          >
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                onClick={() => onRemove(url)}
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
      <CldUploadWidget
        onUpload={(result) => {
          console.log("Upload result:", result);
          onChange(result.info.secure_url);
        }}
        uploadPreset="essencial_products"
        options={{
          maxFiles: 1,
        }}
      >
        {({ open }) => (
          <Button
            type="button"
            variant="secondary"
            onClick={open}
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
