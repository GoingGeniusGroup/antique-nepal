"use client";

import { ReactNode } from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

type SettingsPreviewProps = {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
};

export function SettingsPreview({ title, children, defaultOpen = false }: SettingsPreviewProps) {
  return (
    <div className="mt-6">
      <Accordion
        type="single"
        collapsible
        defaultValue={defaultOpen ? "preview" : undefined}
        className="border border-border/60 rounded-lg bg-muted/40"
      >
        <AccordionItem value="preview" className="border-b-0">
          <AccordionTrigger className="px-4 text-sm font-medium text-foreground">
            <div className="flex items-center justify-between w-full">
              <span>{title}</span>
              <span className="text-xs text-muted-foreground ml-2">(click to toggle)</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pt-0 pb-4">
            {children}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
