import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
const variants=cva("inline-flex items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50",{variants:{variant:{default:"bg-primary text-primary-foreground hover:opacity-90",outline:"border border-border bg-transparent text-foreground hover:bg-secondary",ghost:"text-muted-foreground hover:bg-secondary hover:text-foreground"},size:{default:"h-11 px-5",sm:"h-9 px-3",lg:"h-12 px-6"}},defaultVariants:{variant:"default",size:"default"}});
export function Button({className,variant,size,asChild=false,...props}:React.ButtonHTMLAttributes<HTMLButtonElement>&VariantProps<typeof variants>&{asChild?:boolean}){const Comp=asChild?Slot:"button";return <Comp className={cn(variants({variant,size}),className)} {...props}/>}
