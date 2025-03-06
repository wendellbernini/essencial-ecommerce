import { useState, useCallback } from "react";
import {
  Dialog as DialogPrimitive,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DialogProps {
  children: React.ReactNode;
  title: string;
}

export function useDialog() {
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = useCallback(() => setIsOpen(true), []);
  const closeDialog = useCallback(() => setIsOpen(false), []);

  const Dialog = useCallback(
    ({ children, title }: DialogProps) => (
      <DialogPrimitive open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          {children}
        </DialogContent>
      </DialogPrimitive>
    ),
    [isOpen]
  );

  return {
    Dialog,
    openDialog,
    closeDialog,
    isOpen,
  };
}
