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
        uploadPreset="essencial_products"
        options={{
          maxFiles: 5,
          sources: ["local"],
          styles: {
            palette: {
              window: "#FFFFFF",
              windowBorder: "#90A0B3",
              tabIcon: "#111827",
              menuIcons: "#111827",
              textDark: "#111827",
              textLight: "#FFFFFF",
              link: "#111827",
              action: "#111827",
              inactiveTabIcon: "#6B7280",
              error: "#F44235",
              inProgress: "#0078FF",
              complete: "#20B832",
              sourceBg: "#F8F9FA",
            },
          },
        }}
        onSuccess={(result: any) => {
          if (result?.info?.secure_url) {
            onChange(result.info.secure_url);
          }
        }}
        onError={(error) => {
          console.error("Erro no upload:", error);
        }}
      >
        {({ open }) => {
          return (
            <Button
              type="button"
              variant="secondary"
              onClick={() => open()}
              disabled={disabled}
            >
              <ImagePlus className="h-4 w-4 mr-2" />
              Fazer upload de imagem
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
}
