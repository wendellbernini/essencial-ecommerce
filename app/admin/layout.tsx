"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Settings,
  Menu,
  ListTree,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarProvider } from "@/components/ui/sidebar-context";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      current: pathname === "/admin",
    },
    {
      name: "Produtos",
      href: "/admin/produtos",
      icon: Package,
      current: pathname.startsWith("/admin/produtos"),
    },
    {
      name: "Categorias",
      href: "/admin/categorias",
      icon: ListTree,
      current: pathname.startsWith("/admin/categorias"),
    },
    {
      name: "Configurações",
      href: "/admin/configuracoes",
      icon: Settings,
      current: pathname.startsWith("/admin/configuracoes"),
    },
  ];

  return (
    <SidebarProvider>
      <div className="relative flex min-h-screen">
        {/* Sidebar para Desktop */}
        <div className="hidden lg:flex w-64 border-r bg-white">
          <div className="flex h-full w-full flex-col">
            <div className="flex h-14 items-center border-b px-4">
              <Link
                href="/admin"
                className="flex items-center gap-2 font-semibold"
              >
                <span className="text-lg">Essencial Admin</span>
              </Link>
            </div>
            <ScrollArea className="flex-1 px-3 py-2">
              <nav className="space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "group flex items-center rounded-md px-2 py-2 text-sm font-medium",
                      item.current
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "mr-3 h-5 w-5 flex-shrink-0",
                        item.current
                          ? "text-gray-500"
                          : "text-gray-400 group-hover:text-gray-500"
                      )}
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </ScrollArea>
          </div>
        </div>

        {/* Header Mobile */}
        <div className="sticky top-0 z-40 flex items-center gap-x-6 border-b border-gray-200 bg-white px-4 py-4 shadow-sm lg:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
              >
                <span className="sr-only">Abrir menu</span>
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <Link
                href="/admin"
                className="flex items-center gap-2 px-6 py-4 font-semibold"
              >
                <span className="text-lg">Essencial Admin</span>
              </Link>
              <ScrollArea className="h-[calc(100vh-5rem)]">
                <nav className="space-y-1 px-3 py-2">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "group flex items-center rounded-md px-2 py-2 text-sm font-medium",
                        item.current
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      )}
                      onClick={() => setOpen(false)}
                    >
                      <item.icon
                        className={cn(
                          "mr-3 h-5 w-5 flex-shrink-0",
                          item.current
                            ? "text-gray-500"
                            : "text-gray-400 group-hover:text-gray-500"
                        )}
                      />
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </ScrollArea>
            </SheetContent>
          </Sheet>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Essencial Admin</h1>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <main className="flex-1">
          <div className="h-full py-6">
            <div className="px-4 sm:px-6 lg:px-8">{children}</div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
