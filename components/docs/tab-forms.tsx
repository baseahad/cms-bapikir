"use client";

import { ComponentDemo, DemoSection } from "./component-demo";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export function FormsTab() {
  const [showPass, setShowPass] = useState(false);

  return (
    <div className="space-y-10">
      <DemoSection title="Input">
        <ComponentDemo title="Variants" description="Text input types and states">
          <div className="w-full space-y-3">
            <Input placeholder="Default input" />
            <Input placeholder="Disabled" disabled />
            <Input type="email" placeholder="Email address" />
            <Input type="number" placeholder="Number" />
          </div>
        </ComponentDemo>
        <ComponentDemo title="With icons & labels" description="Inputs with adornments">
          <div className="w-full space-y-3">
            <div className="space-y-1">
              <Label htmlFor="search">Cari</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="search" className="pl-9" placeholder="Ketik sesuatu..." />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="email-f">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email-f" className="pl-9" type="email" placeholder="nama@domain.com" />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="pass">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="pass" className="pl-9 pr-9" type={showPass ? "text" : "password"} placeholder="••••••••" />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="Textarea">
        <ComponentDemo title="Basic" description="Multi-line text input">
          <div className="w-full space-y-3">
            <Textarea placeholder="Tulis pesan kamu..." rows={3} />
            <Textarea placeholder="Disabled" disabled rows={2} />
          </div>
        </ComponentDemo>
        <ComponentDemo title="With label & hint" description="Form field pattern">
          <div className="w-full space-y-1.5">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Ceritakan sedikit tentang dirimu..."
              rows={4}
            />
            <p className="text-xs text-muted-foreground">Maks 200 karakter.</p>
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="Select">
        <ComponentDemo title="Basic select" description="Dropdown selection">
          <Select>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Pilih opsi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="option1">Opsi Pertama</SelectItem>
              <SelectItem value="option2">Opsi Kedua</SelectItem>
              <SelectItem value="option3">Opsi Ketiga</SelectItem>
              <SelectItem value="option4" disabled>Disabled</SelectItem>
            </SelectContent>
          </Select>
        </ComponentDemo>
        <ComponentDemo title="Practical examples" description="Real-world use cases">
          <div className="w-full space-y-3">
            <div className="space-y-1">
              <Label>Payment status</Label>
              <Select defaultValue="pending">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Menunggu Verifikasi</SelectItem>
                  <SelectItem value="paid">Terverifikasi</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Plan</Label>
              <Select defaultValue="free">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Gratis</SelectItem>
                  <SelectItem value="pro">Pro — Rp 99.000/bulan</SelectItem>
                  <SelectItem value="ultimate">Ultimate — Rp 199.000/bulan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="Full Form Example">
        <ComponentDemo
          title="Registration form"
          description="Complete form using all form primitives"
          className="items-start justify-start"
        >
          <form className="w-full space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="fname">Nama depan</Label>
                <Input id="fname" placeholder="Budi" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lname">Nama belakang</Label>
                <Input id="lname" placeholder="Santoso" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="form-email">Email</Label>
              <Input id="form-email" type="email" placeholder="budi@example.com" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="form-plan">Plan</Label>
              <Select>
                <SelectTrigger id="form-plan">
                  <SelectValue placeholder="Pilih plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Gratis</SelectItem>
                  <SelectItem value="pro">Pro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="form-notes">Catatan (opsional)</Label>
              <Textarea id="form-notes" placeholder="Info tambahan..." rows={2} />
            </div>
            <Button type="submit" className="w-full">Daftar</Button>
          </form>
        </ComponentDemo>
        <ComponentDemo
          title="Login form"
          description="Email + password login"
          className="items-start justify-start"
        >
          <form className="w-full space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-1.5">
              <Label htmlFor="login-email">Email</Label>
              <Input id="login-email" type="email" placeholder="nama@domain.com" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="login-pass">Password</Label>
              <Input id="login-pass" type="password" placeholder="••••••••" />
            </div>
            <Button type="submit" className="w-full">Masuk</Button>
            <p className="text-center text-sm text-muted-foreground">
              Belum punya akun?{" "}
              <span className="text-primary underline cursor-pointer">Daftar</span>
            </p>
          </form>
        </ComponentDemo>
      </DemoSection>
    </div>
  );
}
