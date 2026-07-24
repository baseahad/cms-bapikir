"use client";

import { ComponentDemo, DemoSection } from "./component-demo";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronsUpDown } from "lucide-react";
import { useState } from "react";

const invoices = [
  { id: "INV-001", status: "Lunas", amount: "Rp 99.000", date: "1 Mar 2025" },
  { id: "INV-002", status: "Pending", amount: "Rp 99.000", date: "1 Feb 2025" },
  { id: "INV-003", status: "Gagal", amount: "Rp 99.000", date: "1 Jan 2025" },
];

const statusVariant: Record<string, "default" | "secondary" | "destructive"> = {
  Lunas: "default",
  Pending: "secondary",
  Gagal: "destructive",
};

export function DataTab() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-10">
      <DemoSection title="Table">
        <ComponentDemo
          title="Basic table"
          description="Structured data in rows and columns"
          className="items-start p-0 overflow-hidden"
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Jumlah</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="font-medium">{inv.id}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{inv.date}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[inv.status]}>{inv.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{inv.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="Accordion & Collapsible">
        <ComponentDemo
          title="Accordion"
          description="Expandable FAQ sections"
          className="items-start"
        >
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Apakah ini gratis?</AccordionTrigger>
              <AccordionContent>
                Ya, tier Gratis tersedia selamanya dengan fitur dasar yang sudah lengkap.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Apa perbedaan plan Pro?</AccordionTrigger>
              <AccordionContent>
                Plan Pro membuka akses proyek tidak terbatas, email transaksional, dan
                dukungan prioritas.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Bagaimana cara pembayaran?</AccordionTrigger>
              <AccordionContent>
                Pembayaran lewat transfer manual — kamu upload bukti transfer, admin
                verifikasi, dan akses aktif otomatis.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ComponentDemo>
        <ComponentDemo
          title="Collapsible"
          description="Simple show/hide section"
          className="items-start"
        >
          <Collapsible open={open} onOpenChange={setOpen} className="w-full space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold">Dependensi (3)</h4>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                  <ChevronsUpDown className="h-4 w-4" />
                </Button>
              </CollapsibleTrigger>
            </div>
            <div className="rounded-md border px-3 py-2 text-sm font-mono">next</div>
            <CollapsibleContent className="space-y-2">
              <div className="rounded-md border px-3 py-2 text-sm font-mono">react</div>
              <div className="rounded-md border px-3 py-2 text-sm font-mono">supabase-js</div>
            </CollapsibleContent>
          </Collapsible>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="ScrollArea & Resizable">
        <ComponentDemo
          title="ScrollArea"
          description="Custom scrollbar container"
          className="items-start"
        >
          <ScrollArea className="h-48 w-full rounded-md border">
            <div className="p-4">
              <h4 className="mb-2 text-sm font-medium">Notifikasi</h4>
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i}>
                  <div className="py-2 text-sm">
                    <p className="font-medium">Pembayaran #{i + 1} berhasil</p>
                    <p className="text-xs text-muted-foreground">{i + 1} jam lalu</p>
                  </div>
                  {i < 9 && <Separator />}
                </div>
              ))}
            </div>
          </ScrollArea>
        </ComponentDemo>
        <ComponentDemo
          title="Resizable"
          description="Drag-to-resize split panels"
          className="items-start p-0 overflow-hidden"
        >
          <ResizablePanelGroup orientation="horizontal" className="h-40 w-full rounded-lg border">
            <ResizablePanel defaultSize={40}>
              <div className="flex h-full items-center justify-center p-4 text-sm text-muted-foreground">
                Panel Kiri
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={60}>
              <div className="flex h-full items-center justify-center p-4 text-sm text-muted-foreground">
                Panel Kanan
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="Carousel & Calendar">
        <ComponentDemo title="Carousel" description="Swipeable item carousel">
          <Carousel className="w-full max-w-xs">
            <CarouselContent>
              {["Fitur 1", "Fitur 2", "Fitur 3", "Fitur 4"].map((label, i) => (
                <CarouselItem key={i}>
                  <div className="flex aspect-square items-center justify-center rounded-lg border bg-muted text-sm font-medium">
                    {label}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </ComponentDemo>
        <ComponentDemo title="Calendar" description="Date picker calendar">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
        </ComponentDemo>
      </DemoSection>
    </div>
  );
}
