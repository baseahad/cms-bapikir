"use client";

import { ComponentDemo, DemoSection } from "./component-demo";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

export function FoundationsTab() {
  return (
    <div className="space-y-10">
      <DemoSection title="Badge">
        <ComponentDemo title="Variants" description="All badge style variants">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </ComponentDemo>
        <ComponentDemo title="Use cases" description="Practical badge examples">
          <Badge>New</Badge>
          <Badge variant="secondary">Beta</Badge>
          <Badge variant="outline">v2.0</Badge>
          <Badge className="bg-green-500 hover:bg-green-600 text-white border-0">Active</Badge>
          <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white border-0">Pending</Badge>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="Avatar">
        <ComponentDemo title="Fallback initials" description="Avatar with text fallback">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary text-xs">KK</AvatarFallback>
          </Avatar>
          <Avatar className="h-10 w-10">
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
          <Avatar className="h-12 w-12">
            <AvatarFallback className="text-base">CD</AvatarFallback>
          </Avatar>
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-xl">EF</AvatarFallback>
          </Avatar>
        </ComponentDemo>
        <ComponentDemo title="Colored fallbacks" description="Custom avatar colors">
          <Avatar><AvatarFallback className="bg-red-100 text-red-700">RA</AvatarFallback></Avatar>
          <Avatar><AvatarFallback className="bg-blue-100 text-blue-700">BB</AvatarFallback></Avatar>
          <Avatar><AvatarFallback className="bg-green-100 text-green-700">GC</AvatarFallback></Avatar>
          <Avatar><AvatarFallback className="bg-purple-100 text-purple-700">PD</AvatarFallback></Avatar>
          <Avatar><AvatarFallback className="bg-orange-100 text-orange-700">OE</AvatarFallback></Avatar>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="Separator">
        <ComponentDemo title="Horizontal" description="Default orientation">
          <div className="w-full space-y-2">
            <p className="text-sm">Section A</p>
            <Separator />
            <p className="text-sm">Section B</p>
            <Separator />
            <p className="text-sm">Section C</p>
          </div>
        </ComponentDemo>
        <ComponentDemo title="Vertical" description="Inline divider">
          <div className="flex items-center gap-4 h-8">
            <span className="text-sm">Docs</span>
            <Separator orientation="vertical" />
            <span className="text-sm">Blog</span>
            <Separator orientation="vertical" />
            <span className="text-sm">GitHub</span>
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="Skeleton">
        <ComponentDemo title="Text skeleton" description="Loading placeholder for text">
          <div className="w-full space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
          </div>
        </ComponentDemo>
        <ComponentDemo title="Card skeleton" description="Loading placeholder for a card">
          <div className="w-full space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-24 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="Progress">
        <ComponentDemo title="Values" description="Different progress amounts">
          <div className="w-full space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground"><span>Upload</span><span>25%</span></div>
              <Progress value={25} />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground"><span>Processing</span><span>60%</span></div>
              <Progress value={60} />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground"><span>Complete</span><span>100%</span></div>
              <Progress value={100} />
            </div>
          </div>
        </ComponentDemo>
        <ComponentDemo title="Sizes" description="Thin and thick variants via className">
          <div className="w-full space-y-4">
            <Progress value={40} className="h-1" />
            <Progress value={60} className="h-2" />
            <Progress value={75} className="h-3" />
            <Progress value={90} className="h-4" />
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="Alert">
        <ComponentDemo title="Info & Success" description="Informational and success alerts" className="flex-col items-stretch">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Informasi</AlertTitle>
            <AlertDescription>Migrasi database perlu dijalankan sebelum deploy.</AlertDescription>
          </Alert>
          <Alert className="border-green-500/50 text-green-700 dark:text-green-400 [&>svg]:text-green-500">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Berhasil</AlertTitle>
            <AlertDescription>Pembayaran telah dikonfirmasi.</AlertDescription>
          </Alert>
        </ComponentDemo>
        <ComponentDemo title="Warning & Error" description="Warning and destructive alerts" className="flex-col items-stretch">
          <Alert className="border-yellow-500/50 text-yellow-700 dark:text-yellow-400 [&>svg]:text-yellow-500">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Perhatian</AlertTitle>
            <AlertDescription>API key akan kadaluarsa dalam 7 hari.</AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Gagal menghubungi server. Coba lagi.</AlertDescription>
          </Alert>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="Card">
        <ComponentDemo title="Basic card" description="Standard card layout" className="items-start">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>Judul Card</CardTitle>
              <CardDescription>Deskripsi singkat tentang card ini.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Konten card bisa berisi teks, form, atau komponen lainnya.</p>
            </CardContent>
            <CardFooter className="gap-2">
              <Button size="sm">Simpan</Button>
              <Button size="sm" variant="outline">Batal</Button>
            </CardFooter>
          </Card>
        </ComponentDemo>
        <ComponentDemo title="Stat card" description="KPI display card" className="items-start">
          <Card className="w-full max-w-sm">
            <CardHeader className="pb-1">
              <CardDescription>Total Revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">Rp 4.530.000</p>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-500">+12%</span> dari bulan lalu
              </p>
            </CardContent>
          </Card>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="Aspect Ratio">
        <ComponentDemo title="16:9 video placeholder" description="Responsive aspect ratio container">
          <div className="w-full max-w-sm">
            <AspectRatio ratio={16 / 9} className="bg-muted rounded-lg flex items-center justify-center">
              <span className="text-sm text-muted-foreground">16 / 9</span>
            </AspectRatio>
          </div>
        </ComponentDemo>
        <ComponentDemo title="1:1 square" description="Square aspect ratio">
          <div className="w-48">
            <AspectRatio ratio={1} className="bg-muted rounded-full flex items-center justify-center">
              <span className="text-sm text-muted-foreground">1 / 1</span>
            </AspectRatio>
          </div>
        </ComponentDemo>
      </DemoSection>
    </div>
  );
}
