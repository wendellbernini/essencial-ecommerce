"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Category } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageUpload } from "@/components/ui/image-upload";
import { Switch } from "@/components/ui/switch";
import { Brand } from "@/lib/types";

export default function NewProductPage() {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClientComponentClient();
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [classifications, setClassifications] = useState<any[]>([]);
  const [selectedClassifications, setSelectedClassifications] = useState<
    number[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    original_price: "",
    category_id: "",
    subcategory_id: "",
    brand_id: "",
    stock_quantity: "",
    featured: false,
    is_new_release: false,
    is_best_seller: false,
    images: [] as string[],
  });

  useEffect(() => {
    loadCategories();
    loadBrands();
  }, []);

  useEffect(() => {
    if (formData.category_id) {
      loadSubcategories(formData.category_id);
      loadClassifications(formData.category_id);
    }
  }, [formData.category_id]);

  async function loadCategories() {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("name");
    if (data) setCategories(data);
  }

  async function loadBrands() {
    const { data } = await supabase.from("brands").select("*");
    if (data) setBrands(data);
  }

  async function loadSubcategories(categoryId: string) {
    const { data } = await supabase
      .from("subcategories")
      .select("*")
      .eq("category_id", categoryId)
      .order("name");
    if (data) setSubcategories(data);
  }

  async function loadClassifications(categoryId: string) {
    const { data } = await supabase
      .from("classifications")
      .select("*")
      .eq("category_id", categoryId)
      .order("type, name");
    if (data) setClassifications(data);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true);

    try {
      // Validação dos campos obrigatórios
      const requiredFields = {
        name: "Nome do produto",
        category_id: "Categoria",
        subcategory_id: "Subcategoria",
        brand_id: "Marca",
      };

      for (const [field, label] of Object.entries(requiredFields)) {
        if (!formData[field as keyof typeof formData]) {
          throw new Error(`O campo "${label}" é obrigatório`);
        }
      }

      // Validação específica para preços
      if (!formData.original_price && !formData.price) {
        throw new Error(
          "É necessário informar pelo menos um preço (original ou com desconto)"
        );
      }

      if (formData.images.length === 0) {
        throw new Error("Adicione pelo menos uma imagem do produto");
      }

      const productData = {
        name: formData.name.trim(),
        slug: formData.name
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-"),
        description: formData.description?.trim() || "",
        price: Number(formData.original_price || formData.price),
        sale_price: formData.price ? Number(formData.price) : null,
        stock_quantity: Number(formData.stock_quantity) || 0,
        category_id: Number(formData.category_id),
        subcategory_id: Number(formData.subcategory_id),
        brand_id: Number(formData.brand_id),
        featured: formData.featured,
        is_new_release: formData.is_new_release,
        is_best_seller: formData.is_best_seller,
        images: formData.images,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data: product, error: productError } = await supabase
        .from("products")
        .insert([productData])
        .select()
        .single();

      if (productError) throw productError;

      if (selectedClassifications.length > 0 && product) {
        const classificationData = selectedClassifications.map(
          (classificationId) => ({
            product_id: product.id,
            classification_id: classificationId,
          })
        );

        const { error: classificationError } = await supabase
          .from("product_classifications")
          .insert(classificationData);

        if (classificationError) throw classificationError;
      }

      toast({
        title: "Produto criado com sucesso!",
        description: "O produto foi adicionado ao catálogo.",
      });

      router.push("/admin/produtos");
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      toast({
        title: "Erro ao criar produto",
        description:
          error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const groupedClassifications = classifications.reduce(
    (acc, classification) => {
      if (!acc[classification.type]) {
        acc[classification.type] = [];
      }
      acc[classification.type].push(classification);
      return acc;
    },
    {} as Record<string, typeof classifications>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Novo Produto</h2>
        <p className="text-muted-foreground">
          Adicione um novo produto ao catálogo.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Produto</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Digite o nome do produto"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    category_id: value,
                    subcategory_id: "",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subcategory">Subcategoria</Label>
            <Select
              value={formData.subcategory_id}
              onValueChange={(value) =>
                setFormData({ ...formData, subcategory_id: value })
              }
              disabled={!formData.category_id}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma subcategoria" />
              </SelectTrigger>
              <SelectContent>
                {subcategories.map((subcategory) => (
                  <SelectItem
                    key={subcategory.id}
                    value={subcategory.id.toString()}
                  >
                    {subcategory.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Digite a descrição do produto"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="original_price">Preço Original</Label>
              <Input
                id="original_price"
                type="number"
                step="0.01"
                min="0"
                value={formData.original_price}
                onChange={(e) =>
                  setFormData({ ...formData, original_price: e.target.value })
                }
                placeholder="0,00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Preço com Desconto</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                placeholder="0,00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stock">Quantidade em Estoque</Label>
            <Input
              id="stock"
              type="number"
              min="0"
              value={formData.stock_quantity}
              onChange={(e) =>
                setFormData({ ...formData, stock_quantity: e.target.value })
              }
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="brand">Marca</Label>
            <Select
              value={formData.brand_id}
              onValueChange={(value) =>
                setFormData({ ...formData, brand_id: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma marca" />
              </SelectTrigger>
              <SelectContent>
                {brands.map((brand) => (
                  <SelectItem key={brand.id} value={brand.id.toString()}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Imagens do Produto</Label>
            <div>
              <ImageUpload
                value={formData.images}
                disabled={isLoading}
                onChange={(url) => {
                  setFormData((prev) => ({
                    ...prev,
                    images: [...prev.images, url],
                  }));
                }}
                onRemove={(url) => {
                  setFormData((prev) => ({
                    ...prev,
                    images: prev.images.filter((image) => image !== url),
                  }));
                }}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={formData.featured}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, featured: checked as boolean })
              }
            />
            <Label htmlFor="featured">Produto em Destaque</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_best_seller"
              checked={formData.is_best_seller}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, is_best_seller: checked as boolean })
              }
            />
            <Label htmlFor="is_best_seller">Mais Vendido</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_new_release"
              checked={formData.is_new_release}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, is_new_release: checked as boolean })
              }
            />
            <Label htmlFor="is_new_release">Lançamento</Label>
          </div>

          {/* Classificações */}
          {Object.entries(groupedClassifications).map(([type, items]) => (
            <div key={type} className="space-y-2">
              <Label>{type.replace(/_/g, " ").toUpperCase()}</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {items.map((classification) => (
                  <div
                    key={classification.id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`classification-${classification.id}`}
                      checked={selectedClassifications.includes(
                        classification.id
                      )}
                      onCheckedChange={(checked) => {
                        setSelectedClassifications(
                          checked
                            ? [...selectedClassifications, classification.id]
                            : selectedClassifications.filter(
                                (id) => id !== classification.id
                              )
                        );
                      }}
                    />
                    <Label
                      htmlFor={`classification-${classification.id}`}
                      className="text-sm font-normal"
                    >
                      {classification.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Criando..." : "Criar Produto"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
