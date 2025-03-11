"use client";

import { useState, useEffect } from "react";
import { Star, ThumbsUp, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useToast } from "@/components/ui/use-toast";
import { ReviewWithUser } from "@/lib/types";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ReviewsProps {
  productId: number;
  initialReviews: ReviewWithUser[];
  averageRating: number;
  totalReviews: number;
  onReviewAdded?: (review: ReviewWithUser) => void;
}

export default function Reviews({
  productId,
  initialReviews = [],
  averageRating,
  totalReviews,
  onReviewAdded,
}: ReviewsProps) {
  const [reviews, setReviews] = useState<ReviewWithUser[]>(initialReviews);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, [supabase.auth]);

  useEffect(() => {
    console.log("useEffect - Atualizando reviews com:", initialReviews);
    setReviews(initialReviews);
  }, [initialReviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para enviar uma avaliação",
        variant: "destructive",
      });
      return;
    }

    if (!reviewTitle.trim() || !reviewComment.trim()) {
      toast({
        title: "Erro",
        description:
          "Por favor, preencha o título e o comentário da sua avaliação",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Inserir a nova review
      const { data: reviewData, error: reviewError } = await supabase
        .from("reviews")
        .insert([
          {
            product_id: productId,
            user_id: user.id,
            title: reviewTitle.trim(),
            comment: reviewComment.trim(),
            rating,
          },
        ])
        .select("*")
        .single();

      if (reviewError) throw reviewError;

      // Buscar dados do usuário
      const { data: userData } = await supabase
        .from("users")
        .select("full_name, avatar_url")
        .eq("id", user.id)
        .single();

      // Criar objeto da nova review com dados do usuário
      const newReviewWithUser = {
        ...reviewData,
        user: {
          name: userData?.full_name || "Usuário anônimo",
          avatar_url: userData?.avatar_url,
        },
      };

      console.log("Nova review criada:", newReviewWithUser);

      // Atualizar o estado local
      setReviews((prevReviews) => [newReviewWithUser, ...prevReviews]);

      // Limpar o formulário
      setReviewTitle("");
      setReviewComment("");
      setRating(5);

      // Notificar o componente pai
      if (onReviewAdded) {
        onReviewAdded(newReviewWithUser);
      }

      toast({
        title: "Sucesso",
        description: "Sua avaliação foi enviada com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao enviar avaliação:", error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar sua avaliação. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHelpful = async (reviewId: string) => {
    if (!user) {
      toast({
        title: "Erro",
        description:
          "Você precisa estar logado para marcar uma avaliação como útil",
        variant: "destructive",
      });
      return;
    }

    try {
      const review = reviews.find((r) => r.id === reviewId);
      if (!review) return;

      const newHelpfulCount = (review.helpful_count || 0) + 1;

      const { error } = await supabase
        .from("reviews")
        .update({ helpful_count: newHelpfulCount })
        .eq("id", reviewId);

      if (error) throw error;

      setReviews((prevReviews) =>
        prevReviews.map((r) =>
          r.id === reviewId ? { ...r, helpful_count: newHelpfulCount } : r
        )
      );

      toast({
        title: "Sucesso",
        description: "Avaliação marcada como útil!",
      });
    } catch (error) {
      console.error("Erro ao marcar como útil:", error);
      toast({
        title: "Erro",
        description: "Não foi possível marcar a avaliação como útil",
        variant: "destructive",
      });
    }
  };

  const handleReport = async (reviewId: string) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para reportar uma avaliação",
        variant: "destructive",
      });
      return;
    }

    try {
      const review = reviews.find((r) => r.id === reviewId);
      if (!review) return;

      const { error } = await supabase
        .from("reviews")
        .update({ reported: true })
        .eq("id", reviewId);

      if (error) throw error;

      setReviews((prevReviews) =>
        prevReviews.map((r) =>
          r.id === reviewId ? { ...r, reported: true } : r
        )
      );

      toast({
        title: "Sucesso",
        description: "Avaliação reportada com sucesso",
      });
    } catch (error) {
      console.error("Erro ao reportar avaliação:", error);
      toast({
        title: "Erro",
        description: "Não foi possível reportar a avaliação",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="text-4xl font-bold">{averageRating.toFixed(1)}</div>
        <div>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={
                  star <= averageRating
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }
              />
            ))}
          </div>
          <div className="text-sm text-gray-500">{totalReviews} avaliações</div>
        </div>
      </div>

      {user && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rating">Sua avaliação</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <Star
                    className={cn(
                      "w-6 h-6 transition-colors",
                      star <= rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Título da avaliação</Label>
            <Input
              id="title"
              value={reviewTitle}
              onChange={(e) => setReviewTitle(e.target.value)}
              placeholder="Resumo da sua experiência"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Seu comentário</Label>
            <Textarea
              id="comment"
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Conte-nos mais sobre sua experiência com o produto..."
              disabled={isSubmitting}
              rows={4}
            />
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Enviar avaliação
          </Button>
        </form>
      )}

      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="border rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Avatar>
                  {review.user.avatar_url ? (
                    <AvatarImage src={review.user.avatar_url} />
                  ) : (
                    <AvatarFallback>
                      {review.user.name?.charAt(0).toUpperCase() || "?"}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <div className="font-medium">{review.user.name}</div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn(
                          "w-4 h-4",
                          star <= review.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900">{review.title}</h4>
                <p className="text-gray-600 mt-1">{review.comment}</p>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleHelpful(review.id)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <ThumbsUp className="w-4 h-4 mr-1" />
                  Útil ({review.helpful_count || 0})
                </Button>
                {!review.reported && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleReport(review.id)}
                    className="text-gray-500 hover:text-red-600"
                  >
                    <Flag className="w-4 h-4 mr-1" />
                    Reportar
                  </Button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-8">
            Ainda não há avaliações para este produto. Seja o primeiro a
            avaliar!
          </div>
        )}
      </div>
    </div>
  );
}
