"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PromoBanner as PromoBannerType } from "@/lib/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

interface PromoBanner {
  id: number;
  title: string;
  description?: string;
  image_url: string;
  link?: string;
  original_price: number;
  sale_price: number;
  discount_percentage: number;
  has_countdown: boolean;
  start_date: string;
  end_date: string;
  is_active: boolean;
  order_index: number;
}

interface PromoBannerProps {
  slides: PromoBanner[];
}

export function PromoBanner({ slides = [] }: PromoBannerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [timeLeft, setTimeLeft] = useState<{ [key: number]: TimeLeft }>({});
  const [activeSlides, setActiveSlides] = useState(slides);
  const supabase = createClientComponentClient();

  // Função para atualizar o status do banner no banco de dados
  const updateBannerStatus = async (bannerId: number, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from("promo_banners")
        .update({ is_active: isActive })
        .eq("id", bannerId);

      if (error) {
        console.error("Erro ao atualizar status do banner:", error);
      }
    } catch (error) {
      console.error("Erro ao atualizar status do banner:", error);
    }
  };

  // Função para calcular o tempo restante
  const calculateTimeLeft = useCallback((endDate: string) => {
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();
    const distance = end - now;

    if (distance > 0) {
      const totalHours = Math.floor(distance / (1000 * 60 * 60));
      return {
        hours: totalHours,
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      };
    }
    return null;
  }, []);

  // Atualiza todos os contadores a cada segundo
  useEffect(() => {
    // Função para atualizar todos os contadores
    const updateAllCountdowns = () => {
      const newTimeLeft: { [key: number]: TimeLeft } = {};
      let shouldUpdateSlides = false;

      activeSlides.forEach((banner, index) => {
        if (banner.has_countdown && banner.end_date) {
          const timeRemaining = calculateTimeLeft(banner.end_date);
          if (timeRemaining) {
            newTimeLeft[index] = timeRemaining;
          } else if (banner.is_active) {
            // Se o tempo acabou e o banner ainda está ativo, marca para atualização
            shouldUpdateSlides = true;
            updateBannerStatus(banner.id, false);
          }
        }
      });

      setTimeLeft(newTimeLeft);

      // Se algum banner precisa ser desativado, atualiza a lista de slides ativos
      if (shouldUpdateSlides) {
        const updatedSlides = activeSlides
          .map((banner) => {
            if (banner.has_countdown && banner.end_date) {
              const timeRemaining = calculateTimeLeft(banner.end_date);
              if (!timeRemaining) {
                return { ...banner, is_active: false };
              }
            }
            return banner;
          })
          .filter((banner) => banner.is_active);

        setActiveSlides(updatedSlides);
      }
    };

    // Atualiza imediatamente e depois a cada segundo
    updateAllCountdowns();
    const interval = setInterval(updateAllCountdowns, 1000);

    return () => clearInterval(interval);
  }, [activeSlides, calculateTimeLeft]);

  // Avança para o próximo slide automaticamente
  useEffect(() => {
    if (activeSlides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [activeSlides.length]);

  // Se não houver slides ativos, não renderiza nada
  if (!activeSlides || activeSlides.length === 0) {
    return null;
  }

  const currentBanner = activeSlides[currentSlide];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + activeSlides.length) % activeSlides.length
    );
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  // Função para formatar número com zero à esquerda
  const padNumber = (num: number): string => {
    return num.toString().padStart(2, "0");
  };

  return (
    <div className="relative w-full mt-6">
      <div className="container mx-auto px-0">
        <div className="relative bg-white rounded-lg overflow-hidden">
          {/* Navegação */}
          {activeSlides.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full"
                onClick={prevSlide}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full"
                onClick={nextSlide}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </>
          )}

          {/* Slide atual */}
          <Link href={currentBanner.link || "#"}>
            <div className="relative aspect-[16/5] w-full">
              <Image
                src={currentBanner.image_url}
                alt={currentBanner.title || "Banner promocional"}
                fill
                className="object-cover"
                priority
                quality={100}
                sizes="100vw"
              />

              {/* Contador regressivo */}
              {currentBanner.has_countdown && timeLeft[currentSlide] && (
                <div className="absolute right-[5%] top-1/2 -translate-y-1/2 flex items-center gap-4">
                  <div className="relative bg-white rounded-lg w-[120px] h-[120px] shadow-lg">
                    <div className="absolute inset-x-0 top-0 h-1/2 bg-gray-200 rounded-t-lg" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-[72px] font-bold text-gray-900 leading-none">
                        {padNumber(timeLeft[currentSlide].hours)}
                      </span>
                      <span className="text-[20px] text-gray-900 mt-1">
                        {timeLeft[currentSlide].hours === 1 ? "Hora" : "Horas"}
                      </span>
                    </div>
                  </div>
                  <span className="text-4xl font-bold text-white">:</span>
                  <div className="relative bg-white rounded-lg w-[120px] h-[120px] shadow-lg">
                    <div className="absolute inset-x-0 top-0 h-1/2 bg-gray-200 rounded-t-lg" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-[72px] font-bold text-gray-900 leading-none">
                        {padNumber(timeLeft[currentSlide].minutes)}
                      </span>
                      <span className="text-[20px] text-gray-900 mt-1">
                        {timeLeft[currentSlide].minutes === 1
                          ? "Minuto"
                          : "Minutos"}
                      </span>
                    </div>
                  </div>
                  <span className="text-4xl font-bold text-white">:</span>
                  <div className="relative bg-white rounded-lg w-[120px] h-[120px] shadow-lg">
                    <div className="absolute inset-x-0 top-0 h-1/2 bg-gray-200 rounded-t-lg" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-[72px] font-bold text-gray-900 leading-none">
                        {padNumber(timeLeft[currentSlide].seconds)}
                      </span>
                      <span className="text-[20px] text-gray-900 mt-1">
                        {timeLeft[currentSlide].seconds === 1
                          ? "Segundo"
                          : "Segundos"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Link>

          {/* Indicadores */}
          {activeSlides.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {activeSlides.map((_, index) => (
                <button
                  key={index}
                  className={`w-1 h-1 rounded-full transition-all ${
                    index === currentSlide ? "bg-gray-900 w-4" : "bg-gray-300"
                  }`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
