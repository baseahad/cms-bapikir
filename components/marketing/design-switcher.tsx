"use client";

import { SwatchBook } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useMarketingDesign } from "@/components/marketing/design-provider";
import { isMarketingDesignId } from "@/config/marketing-designs";

export function DesignSwitcher() {
  const { activeDesign, designId, presets, setDesignId } = useMarketingDesign();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="marketing-design-trigger gap-2"
        >
          <SwatchBook size={16} className="text-muted-foreground" />
          <span className="hidden lg:inline">{activeDesign.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="max-h-[80vh] w-[280px] overflow-y-auto sm:w-[320px]"
        align="end"
        sideOffset={10}
      >
        <DropdownMenuLabel>Design Preset</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={designId}
          onValueChange={(value) => {
            if (isMarketingDesignId(value)) {
              setDesignId(value);
            }
          }}
        >
          {presets.map((preset) => (
            <DropdownMenuRadioItem
              key={preset.id}
              value={preset.id}
              className="flex min-h-12 flex-col items-start gap-0.5 pr-6"
            >
              <span className="font-medium text-foreground">{preset.label}</span>
              <span className="text-xs leading-relaxed text-muted-foreground">
                {preset.description}
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
