import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

interface UserAvatarProps {
  src?: string | null;
  fallbackName?: string;
  className?: string;
}

export function UserAvatar({ src, fallbackName, className }: UserAvatarProps) {
  // Gera as iniciais do nome para o fallback
  const initials = fallbackName
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Avatar className={className}>
      <AvatarImage
        src={src || undefined}
        alt={fallbackName || "Avatar do usuário"}
      />
      <AvatarFallback className="bg-orange-100 text-orange-700">
        {initials || <User className="h-4 w-4" />}
      </AvatarFallback>
    </Avatar>
  );
}
