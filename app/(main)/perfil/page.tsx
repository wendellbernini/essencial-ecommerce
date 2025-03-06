"use client";

import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAddresses } from "@/hooks/useAddresses";
import { AddressesSection } from "@/components/profile/addresses-section";
import { PersonalDataSection } from "@/components/profile/personal-data-section";
import { OrdersSection } from "@/components/profile/orders-section";
import { WishlistSection } from "@/components/profile/wishlist-section";

export default function ProfilePage() {
  const { fetchAddresses } = useAddresses();

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Meu Perfil</h1>

      <Tabs defaultValue="personal-data" className="space-y-6">
        <TabsList className="bg-muted w-full justify-start border-b">
          <TabsTrigger
            value="personal-data"
            className="data-[state=active]:bg-background"
          >
            Dados Pessoais
          </TabsTrigger>
          <TabsTrigger
            value="addresses"
            className="data-[state=active]:bg-background"
          >
            Endereços
          </TabsTrigger>
          <TabsTrigger
            value="orders"
            className="data-[state=active]:bg-background"
          >
            Meus Pedidos
          </TabsTrigger>
          <TabsTrigger
            value="wishlist"
            className="data-[state=active]:bg-background"
          >
            Lista de Desejos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal-data" className="mt-6">
          <PersonalDataSection />
        </TabsContent>

        <TabsContent value="addresses" className="mt-6">
          <AddressesSection />
        </TabsContent>

        <TabsContent value="orders" className="mt-6">
          <OrdersSection />
        </TabsContent>

        <TabsContent value="wishlist" className="mt-6">
          <WishlistSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
