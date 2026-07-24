"use client";

import { ComponentDemo, DemoSection } from "./component-demo";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarDays, LogOut, Settings, User } from "lucide-react";

export function OverlaysTab() {
  return (
    <div className="space-y-10">
      <DemoSection title="Dialog">
        <ComponentDemo title="Basic dialog" description="Modal with title and actions">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Buka Dialog</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Profil</DialogTitle>
                <DialogDescription>
                  Ubah nama tampilan kamu. Klik simpan jika sudah selesai.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2 py-2">
                <Label htmlFor="dialog-name">Nama</Label>
                <Input id="dialog-name" placeholder="Nama kamu" />
              </div>
              <DialogFooter>
                <Button type="submit">Simpan</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </ComponentDemo>
        <ComponentDemo title="Alert dialog" description="Confirmation before destructive action">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Hapus Akun</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Yakin ingin menghapus?</AlertDialogTitle>
                <AlertDialogDescription>
                  Tindakan ini tidak bisa dibatalkan. Data akun kamu akan
                  dihapus permanen dari server kami.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction>Ya, Hapus</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="Sheet & Drawer">
        <ComponentDemo title="Sheet" description="Slide-in panel from the side">
          <div className="flex gap-2 flex-wrap">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">Kanan</Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Pengaturan</SheetTitle>
                  <SheetDescription>
                    Kelola preferensi akun kamu dari panel ini.
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-4 space-y-3">
                  <div className="space-y-1">
                    <Label>Nama</Label>
                    <Input placeholder="Nama kamu" />
                  </div>
                  <div className="space-y-1">
                    <Label>Email</Label>
                    <Input type="email" placeholder="email@domain.com" />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">Kiri</Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Menu Navigasi</SheetTitle>
                  <SheetDescription>Pilih halaman tujuan.</SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
        </ComponentDemo>
        <ComponentDemo title="Drawer" description="Bottom sheet for mobile-friendly flows">
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline">Buka Drawer</Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Konfirmasi Pembayaran</DrawerTitle>
                <DrawerDescription>
                  Tinjau detail pesanan sebelum melanjutkan.
                </DrawerDescription>
              </DrawerHeader>
              <div className="px-4 py-2 text-sm text-muted-foreground">
                Total: <span className="font-semibold text-foreground">Rp 99.000</span>
              </div>
              <DrawerFooter>
                <Button>Bayar Sekarang</Button>
                <DrawerClose asChild>
                  <Button variant="outline">Batal</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="Popover & Tooltip">
        <ComponentDemo title="Popover" description="Rich floating content on click">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Buka Popover</Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Filter Hasil</h4>
                <p className="text-xs text-muted-foreground">
                  Atur filter pencarian untuk mempersempit hasil.
                </p>
                <div className="space-y-1">
                  <Label className="text-xs">Kata kunci</Label>
                  <Input placeholder="Cari..." className="h-7 text-xs" />
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </ComponentDemo>
        <ComponentDemo title="Tooltip" description="Simple hover hint">
          <div className="flex gap-3 flex-wrap">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <User className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Profil pengguna</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Pengaturan</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <LogOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Keluar</TooltipContent>
            </Tooltip>
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="HoverCard & Menus">
        <ComponentDemo title="HoverCard" description="Rich preview on hover">
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="link">@kilatkoding</Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-64">
              <div className="flex gap-3">
                <Avatar>
                  <AvatarFallback className="bg-primary/10 text-primary">KK</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">CMS Bapikir</h4>
                  <p className="text-xs text-muted-foreground">
                    Platform SaaS starter kit dengan Next.js + Supabase.
                  </p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <CalendarDays className="mr-1 h-3 w-3" />
                    Bergabung Maret 2024
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </ComponentDemo>
        <ComponentDemo title="Dropdown Menu" description="Action menu triggered by button">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Menu</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-44">
              <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profil
                <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Pengaturan
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Keluar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="Context Menu">
        <ComponentDemo title="Right-click menu" description="Menu triggered by right-click">
          <ContextMenu>
            <ContextMenuTrigger className="flex h-24 w-full items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
              Klik kanan di sini
            </ContextMenuTrigger>
            <ContextMenuContent className="w-44">
              <ContextMenuLabel>Tindakan</ContextMenuLabel>
              <ContextMenuSeparator />
              <ContextMenuItem>
                Buka
                <ContextMenuShortcut>Enter</ContextMenuShortcut>
              </ContextMenuItem>
              <ContextMenuItem>
                Salin
                <ContextMenuShortcut>⌘C</ContextMenuShortcut>
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem className="text-destructive">
                Hapus
                <ContextMenuShortcut>⌫</ContextMenuShortcut>
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </ComponentDemo>
      </DemoSection>
    </div>
  );
}
