import { useState } from "react";
import Image from "next/image";

interface ProductImageZoomProps {
  src: string;
  alt: string;
  priority?: boolean;
}

export function ProductImageZoom({
  src,
  alt,
  priority = false,
}: ProductImageZoomProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setPosition({ x, y });
  };

  return (
    <div
      className="aspect-[4/3] relative rounded-lg overflow-hidden border border-gray-200 cursor-zoom-in"
      onMouseEnter={() => setIsZoomed(true)}
      onMouseLeave={() => setIsZoomed(false)}
      onMouseMove={handleMouseMove}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className={`object-contain transition-transform duration-200 ${
          isZoomed ? "scale-150" : "scale-100"
        }`}
        style={{
          transformOrigin: `${position.x}% ${position.y}%`,
        }}
        priority={priority}
      />
    </div>
  );
}
