"use client";

import { Address } from "@/types/address";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2 } from "lucide-react";
import { useAddresses } from "@/hooks/useAddresses";
import { useDialog } from "@/hooks/useDialog";
import { AddressForm } from "./address-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface AddressCardProps {
  address: Address;
}

export function AddressCard({ address }: AddressCardProps) {
  const { deleteAddress } = useAddresses();
  const { Dialog, openDialog, closeDialog } = useDialog();

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center space-x-2">
            <h3 className="font-medium">{address.name}</h3>
            {address.is_default && (
              <Badge variant="secondary">Endereço Principal</Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={openDialog}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Remover endereço</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja remover este endereço? Esta ação não
                    pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-500 hover:bg-red-600"
                    onClick={() => deleteAddress(address.id)}
                  >
                    Remover
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-1 text-sm">
            <p className="font-medium">{address.recipient}</p>
            <p>
              {address.street}, {address.number}
              {address.complement && ` - ${address.complement}`}
            </p>
            <p>
              {address.neighborhood} - {address.city}/{address.state}
            </p>
            <p>CEP: {address.zip_code.replace(/(\d{5})(\d{3})/, "$1-$2")}</p>
            {address.phone && <p>Telefone: {address.phone}</p>}
          </div>
        </CardContent>
      </Card>

      <Dialog title="Editar Endereço">
        <AddressForm address={address} onSuccess={closeDialog} />
      </Dialog>
    </>
  );
}
