"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SecondaryBanner {
  id: number;
  image_url: string;
  link: string | null;
  title: string | null;
  type: "double" | "carousel"; // double para os 2 banners lado a lado, carousel para os 3 rotativos
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface SecondaryBannersProps {
  doubleBanners: SecondaryBanner[];
  carouselBanners: SecondaryBanner[];
}

export function SecondaryBanners({
  doubleBanners,
  carouselBanners,
}: SecondaryBannersProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Avança para o próximo slide automaticamente
  useEffect(() => {
    if (!carouselBanners || carouselBanners.length <= 3) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselBanners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [carouselBanners]);

  const nextSlide = () => {
    if (!carouselBanners || carouselBanners.length <= 3) return;
    setCurrentSlide((prev) => (prev + 1) % carouselBanners.length);
  };

  const prevSlide = () => {
    if (!carouselBanners || carouselBanners.length <= 3) return;
    setCurrentSlide(
      (prev) => (prev - 1 + carouselBanners.length) % carouselBanners.length
    );
  };

  // Função para obter os 3 banners visíveis do carrossel
  const getVisibleCarouselBanners = () => {
    if (!carouselBanners || carouselBanners.length === 0) return [];

    const visibleBanners = [];
    const totalBanners = carouselBanners.length;

    for (let i = 0; i < Math.min(3, totalBanners); i++) {
      const index = (currentSlide + i) % totalBanners;
      visibleBanners.push(carouselBanners[index]);
    }

    return visibleBanners;
  };

  return (
    <div className="space-y-6">
      {/* Banners duplos */}
      <div className="grid grid-cols-2 gap-4">
        {doubleBanners.slice(0, 2).map((banner) => (
          <Link key={banner.id} href={banner.link || "#"}>
            <div className="relative aspect-[16/9] rounded-lg overflow-hidden">
              <Image
                src={banner.image_url}
                alt={banner.title || "Banner promocional"}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </Link>
        ))}
      </div>

      {/* Banners carrossel */}
      <div className="relative">
        <div className="overflow-hidden">
          <div className="grid grid-cols-3 gap-4 transition-transform duration-300 ease-in-out">
            {getVisibleCarouselBanners()
              .filter(Boolean)
              .map((banner) => (
                <Link key={banner.id} href={banner.link || "#"}>
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                    <Image
                      src={banner.image_url}
                      alt={banner.title || "Banner promocional"}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                </Link>
              ))}
          </div>
        </div>

        {carouselBanners.length > 3 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50"
              onClick={prevSlide}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50"
              onClick={nextSlide}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
