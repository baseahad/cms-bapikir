"use client";

import { useState } from "react";
import { ComponentDemo, DemoSection } from "./component-demo";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Loader2, Plus } from "lucide-react";

export function ControlsTab() {
  const [sliderVal, setSliderVal] = useState([40]);
  const [sliderRange, setSliderRange] = useState([20, 70]);

  return (
    <div className="space-y-10">
      <DemoSection title="Button">
        <ComponentDemo title="Variants" description="All button styles">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button variant="destructive">Destructive</Button>
        </ComponentDemo>
        <ComponentDemo title="Sizes & States" description="Sizes and interactive states">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon"><Plus className="h-4 w-4" /></Button>
          <Button disabled>Disabled</Button>
          <Button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading
          </Button>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="Toggle">
        <ComponentDemo title="Text formatting" description="Stateful toggle buttons">
          <Toggle aria-label="Bold"><Bold className="h-4 w-4" /></Toggle>
          <Toggle aria-label="Italic"><Italic className="h-4 w-4" /></Toggle>
          <Toggle aria-label="Underline"><Underline className="h-4 w-4" /></Toggle>
        </ComponentDemo>
        <ComponentDemo title="Variants" description="Toggle style variants">
          <Toggle>Default</Toggle>
          <Toggle variant="outline">Outline</Toggle>
          <Toggle size="sm">Small</Toggle>
          <Toggle size="lg">Large</Toggle>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="Toggle Group">
        <ComponentDemo title="Text alignment" description="Single-select group">
          <ToggleGroup type="single" defaultValue="center">
            <ToggleGroupItem value="left" aria-label="Left"><AlignLeft className="h-4 w-4" /></ToggleGroupItem>
            <ToggleGroupItem value="center" aria-label="Center"><AlignCenter className="h-4 w-4" /></ToggleGroupItem>
            <ToggleGroupItem value="right" aria-label="Right"><AlignRight className="h-4 w-4" /></ToggleGroupItem>
          </ToggleGroup>
        </ComponentDemo>
        <ComponentDemo title="Multi-select" description="Multiple items selectable">
          <ToggleGroup type="multiple" variant="outline">
            <ToggleGroupItem value="b"><Bold className="h-4 w-4" /></ToggleGroupItem>
            <ToggleGroupItem value="i"><Italic className="h-4 w-4" /></ToggleGroupItem>
            <ToggleGroupItem value="u"><Underline className="h-4 w-4" /></ToggleGroupItem>
          </ToggleGroup>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="Switch">
        <ComponentDemo title="On / Off states" description="Binary toggle control">
          <div className="flex items-center gap-2">
            <Switch id="s1" />
            <Label htmlFor="s1">Notifications</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="s2" defaultChecked />
            <Label htmlFor="s2">Dark mode</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="s3" disabled />
            <Label htmlFor="s3" className="text-muted-foreground">Disabled</Label>
          </div>
        </ComponentDemo>
        <ComponentDemo title="Settings example" description="Practical switch list" className="items-start justify-start">
          <div className="w-full space-y-3">
            {[
              { id: "email", label: "Email digest", defaultChecked: true },
              { id: "sms", label: "SMS alerts", defaultChecked: false },
              { id: "push", label: "Push notifications", defaultChecked: true },
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <Label htmlFor={item.id} className="text-sm">{item.label}</Label>
                <Switch id={item.id} defaultChecked={item.defaultChecked} />
              </div>
            ))}
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="Checkbox">
        <ComponentDemo title="States" description="Checked, unchecked, disabled">
          <div className="flex items-center gap-2">
            <Checkbox id="c1" />
            <Label htmlFor="c1">Accept terms</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="c2" defaultChecked />
            <Label htmlFor="c2">Remember me</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="c3" disabled />
            <Label htmlFor="c3" className="text-muted-foreground">Disabled</Label>
          </div>
        </ComponentDemo>
        <ComponentDemo title="Checklist" description="Task list example" className="items-start justify-start">
          <div className="w-full space-y-2">
            {["Setup Supabase", "Add env vars", "Apply migrations", "Test payment"].map((task, i) => (
              <div key={task} className="flex items-center gap-2">
                <Checkbox id={`task-${i}`} defaultChecked={i < 2} />
                <Label htmlFor={`task-${i}`} className={`text-sm ${i < 2 ? "line-through text-muted-foreground" : ""}`}>{task}</Label>
              </div>
            ))}
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="Radio Group">
        <ComponentDemo title="Plan selection" description="Single choice from options" className="items-start justify-start">
          <RadioGroup defaultValue="pro" className="w-full space-y-2">
            {[{ value: "free", label: "Gratis", sub: "Fitur dasar" }, { value: "pro", label: "Pro", sub: "Rp 99.000/bulan" }, { value: "ultimate", label: "Ultimate", sub: "Rp 199.000/bulan" }].map((p) => (
              <div key={p.value} className="flex items-start gap-3">
                <RadioGroupItem value={p.value} id={`r-${p.value}`} className="mt-1" />
                <div>
                  <Label htmlFor={`r-${p.value}`} className="font-medium">{p.label}</Label>
                  <p className="text-xs text-muted-foreground">{p.sub}</p>
                </div>
              </div>
            ))}
          </RadioGroup>
        </ComponentDemo>
        <ComponentDemo title="Theme choice" description="Simple horizontal options">
          <RadioGroup defaultValue="system" className="flex gap-4">
            {["light", "dark", "system"].map((t) => (
              <div key={t} className="flex items-center gap-2">
                <RadioGroupItem value={t} id={`t-${t}`} />
                <Label htmlFor={`t-${t}`} className="capitalize">{t}</Label>
              </div>
            ))}
          </RadioGroup>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="Slider">
        <ComponentDemo title="Single value" description={`Current value: ${sliderVal[0]}`}>
          <div className="w-full px-2">
            <Slider
              value={sliderVal}
              onValueChange={setSliderVal}
              max={100}
              step={1}
            />
          </div>
        </ComponentDemo>
        <ComponentDemo title="Range slider" description={`Range: ${sliderRange[0]} – ${sliderRange[1]}`}>
          <div className="w-full px-2">
            <Slider
              value={sliderRange}
              onValueChange={setSliderRange}
              max={100}
              step={1}
            />
          </div>
        </ComponentDemo>
      </DemoSection>
    </div>
  );
}
