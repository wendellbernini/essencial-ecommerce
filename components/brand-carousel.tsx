"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Brand } from "@/lib/types";

interface BrandCarouselProps {
  brands: Brand[];
}

export function BrandCarousel({ brands }: BrandCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const brandsPerSlide = 5;
  const totalSlides = Math.ceil(brands.length / brandsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <div className="container mx-auto px-4 py-6 mt-12">
      <h2 className="text-2xl font-bold text-gray-900 uppercase mb-8">
        Só na Essencial
      </h2>
      <div className="relative h-[120px]">
        {brands.length > brandsPerSlide && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute -left-4 top-[45%] -translate-y-1/2 z-10 w-10 h-14 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center justify-center shadow-sm"
              onClick={prevSlide}
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute -right-4 top-[45%] -translate-y-1/2 z-10 w-10 h-14 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center justify-center shadow-sm"
              onClick={nextSlide}
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </Button>
          </>
        )}

        <div className="overflow-hidden h-full">
          <div
            className="flex h-full transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {Array.from({ length: totalSlides }).map((_, slideIndex) => (
              <div
                key={slideIndex}
                className="flex justify-between w-full flex-shrink-0 gap-4"
              >
                {brands
                  .slice(
                    slideIndex * brandsPerSlide,
                    (slideIndex + 1) * brandsPerSlide
                  )
                  .map((brand) => (
                    <Link
                      key={brand.id}
                      href={`/marca/${brand.slug}`}
                      className="flex-1 group h-full"
                    >
                      <div className="relative h-full bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-orange-500 transition-colors">
                        {brand.logo_url ? (
                          <Image
                            src={brand.logo_url}
                            alt={brand.name}
                            fill
                            className="object-contain p-4"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-lg font-medium text-gray-900">
                            {brand.name}
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
