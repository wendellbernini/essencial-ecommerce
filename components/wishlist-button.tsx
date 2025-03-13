import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface WishlistButtonProps {
  productId: number;
  isInWishlist: boolean;
  onToggle: (id: number) => void;
}

export function WishlistButton({
  productId,
  isInWishlist,
  onToggle,
}: WishlistButtonProps) {
  return (
    <Button
      type="button"
      size="icon"
      variant="secondary"
      className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm hover:bg-white z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle(productId);
      }}
    >
      <Heart
        className={cn(
          "h-5 w-5",
          isInWishlist ? "fill-red-500 text-red-500" : "text-gray-600"
        )}
      />
    </Button>
  );
}
