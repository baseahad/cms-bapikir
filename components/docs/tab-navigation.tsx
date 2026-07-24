"use client";

import { ComponentDemo, DemoSection } from "./component-demo";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Settings, User, FileText, Search } from "lucide-react";

export function NavigationTab() {
  return (
    <div className="space-y-10">
      <DemoSection title="Tabs">
        <ComponentDemo title="Default" description="Tabbed content switcher">
          <Tabs defaultValue="tab1" className="w-full">
            <TabsList>
              <TabsTrigger value="tab1">Akun</TabsTrigger>
              <TabsTrigger value="tab2">Password</TabsTrigger>
              <TabsTrigger value="tab3">Notifikasi</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1" className="mt-3 text-sm text-muted-foreground">
              Kelola informasi akun kamu di sini.
            </TabsContent>
            <TabsContent value="tab2" className="mt-3 text-sm text-muted-foreground">
              Ubah password kamu untuk keamanan.
            </TabsContent>
            <TabsContent value="tab3" className="mt-3 text-sm text-muted-foreground">
              Atur preferensi notifikasi kamu.
            </TabsContent>
          </Tabs>
        </ComponentDemo>
        <ComponentDemo title="Card-style tabs" description="Tabs inside a card layout">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
              <TabsTrigger value="analytics" className="flex-1">Analitik</TabsTrigger>
              <TabsTrigger value="reports" className="flex-1">Laporan</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-3 rounded-lg border p-4 text-sm text-muted-foreground">
              Ringkasan performa bulan ini.
            </TabsContent>
            <TabsContent value="analytics" className="mt-3 rounded-lg border p-4 text-sm text-muted-foreground">
              Data analitik mendalam.
            </TabsContent>
            <TabsContent value="reports" className="mt-3 rounded-lg border p-4 text-sm text-muted-foreground">
              Laporan yang bisa diunduh.
            </TabsContent>
          </Tabs>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="Breadcrumb">
        <ComponentDemo title="Basic" description="Navigation hierarchy">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Pengaturan</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </ComponentDemo>
        <ComponentDemo title="Deep nesting" description="Multi-level breadcrumb">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Docs</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Komponen</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Navigasi</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="Pagination">
        <ComponentDemo title="Basic" description="Page navigation">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </ComponentDemo>
        <ComponentDemo title="Extended" description="Pagination with more pages">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">4</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>5</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">6</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">12</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="Command">
        <ComponentDemo
          title="Command palette"
          description="Keyboard-driven search & navigation"
          className="items-start"
        >
          <Command className="rounded-lg border w-full max-w-sm">
            <CommandInput placeholder="Ketik perintah atau cari..." />
            <CommandList>
              <CommandEmpty>Tidak ada hasil.</CommandEmpty>
              <CommandGroup heading="Saran">
                <CommandItem>
                  <User className="mr-2 h-4 w-4" />
                  Profil
                  <CommandShortcut>⌘P</CommandShortcut>
                </CommandItem>
                <CommandItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Pengaturan
                  <CommandShortcut>⌘S</CommandShortcut>
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Halaman">
                <CommandItem>
                  <FileText className="mr-2 h-4 w-4" />
                  Dashboard
                </CommandItem>
                <CommandItem>
                  <Search className="mr-2 h-4 w-4" />
                  Cari...
                  <CommandShortcut>⌘K</CommandShortcut>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </ComponentDemo>
        <ComponentDemo
          title="Inline search"
          description="Command as a search interface"
          className="items-start"
        >
          <Command className="rounded-lg border w-full max-w-sm">
            <CommandInput placeholder="Filter komponen..." />
            <CommandList>
              <CommandEmpty>Komponen tidak ditemukan.</CommandEmpty>
              <CommandGroup heading="Dasar">
                <CommandItem>Badge</CommandItem>
                <CommandItem>Avatar</CommandItem>
                <CommandItem>Button</CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Form">
                <CommandItem>Input</CommandItem>
                <CommandItem>Select</CommandItem>
                <CommandItem>Textarea</CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </ComponentDemo>
      </DemoSection>
    </div>
  );
}
