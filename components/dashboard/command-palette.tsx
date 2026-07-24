"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CreditCardIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  MoonIcon,
  SettingsIcon,
  SparklesIcon,
  SunIcon,
  UserIcon,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useTheme } from "next-themes";

type CommandAction = {
  label: string;
  icon: React.ReactNode;
  onSelect: () => void;
  group: string;
  keywords?: string[];
};

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { setTheme } = useTheme();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  function navigate(path: string) {
    router.push(path);
    setOpen(false);
  }

  const actions: CommandAction[] = [
    {
      label: "Dashboard",
      icon: <LayoutDashboardIcon className="mr-2 h-4 w-4" />,
      onSelect: () => navigate("/dashboard"),
      group: "Navigasi",
      keywords: ["home", "beranda"],
    },
    {
      label: "Pengaturan",
      icon: <SettingsIcon className="mr-2 h-4 w-4" />,
      onSelect: () => navigate("/dashboard/settings"),
      group: "Navigasi",
      keywords: ["settings", "profil"],
    },
    {
      label: "Billing",
      icon: <CreditCardIcon className="mr-2 h-4 w-4" />,
      onSelect: () => navigate("/dashboard/billing"),
      group: "Navigasi",
      keywords: ["pembayaran", "tagihan"],
    },
    {
      label: "AI Chat",
      icon: <SparklesIcon className="mr-2 h-4 w-4" />,
      onSelect: () => navigate("/dashboard/chat"),
      group: "Fitur",
      keywords: ["chat", "ai"],
    },
    {
      label: "Profil",
      icon: <UserIcon className="mr-2 h-4 w-4" />,
      onSelect: () => navigate("/dashboard/settings"),
      group: "Fitur",
      keywords: ["akun", "account"],
    },
    {
      label: "Tema Terang",
      icon: <SunIcon className="mr-2 h-4 w-4" />,
      onSelect: () => {
        setTheme("light");
        setOpen(false);
      },
      group: "Preferensi",
      keywords: ["light", "mode"],
    },
    {
      label: "Tema Gelap",
      icon: <MoonIcon className="mr-2 h-4 w-4" />,
      onSelect: () => {
        setTheme("dark");
        setOpen(false);
      },
      group: "Preferensi",
      keywords: ["dark", "mode"],
    },
    {
      label: "Keluar",
      icon: <LogOutIcon className="mr-2 h-4 w-4" />,
      onSelect: () => navigate("/auth/logout"),
      group: "Akun",
      keywords: ["logout", "sign out"],
    },
  ];

  const groups = [...new Set(actions.map((a) => a.group))];

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Ketik perintah atau cari..." />
      <CommandList>
        <CommandEmpty>Tidak ditemukan.</CommandEmpty>
        {groups.map((group, i) => (
          <div key={group}>
            {i > 0 && <CommandSeparator />}
            <CommandGroup heading={group}>
              {actions
                .filter((a) => a.group === group)
                .map((action) => (
                  <CommandItem
                    key={action.label}
                    onSelect={action.onSelect}
                    keywords={action.keywords}
                  >
                    {action.icon}
                    <span>{action.label}</span>
                  </CommandItem>
                ))}
            </CommandGroup>
          </div>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
