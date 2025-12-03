import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 font-heading",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        gold: "bg-gradient-to-r from-[hsl(51,100%,50%)] via-[hsl(43,96%,45%)] to-[hsl(36,100%,40%)] text-[hsl(240,33%,10%)] font-bold shadow-[0_4px_30px_hsla(51,100%,50%,0.4)] hover:shadow-[0_6px_40px_hsla(51,100%,50%,0.5)] hover:scale-105 active:scale-95",
        silver: "bg-gradient-to-r from-[hsl(210,14%,85%)] via-[hsl(210,14%,65%)] to-[hsl(210,14%,55%)] text-[hsl(240,33%,10%)] font-bold shadow-[0_4px_20px_hsla(210,14%,75%,0.3)] hover:shadow-[0_6px_30px_hsla(210,14%,75%,0.4)] hover:scale-105 active:scale-95",
        christmas: "bg-gradient-to-r from-[hsl(348,76%,45%)] to-[hsl(153,80%,30%)] text-[hsl(0,0%,98%)] font-bold hover:shadow-[0_4px_20px_hsla(348,76%,45%,0.4)] hover:scale-105 active:scale-95",
        game: "bg-card border-2 border-[hsl(153,80%,30%)] text-[hsl(0,0%,98%)] font-bold hover:border-[hsl(51,100%,50%)] hover:shadow-[0_0_20px_hsla(51,100%,50%,0.3)] transition-all duration-300",
        locked: "bg-[hsl(240,20%,20%)]/50 text-[hsl(210,14%,65%)] cursor-not-allowed backdrop-blur-sm border border-[hsl(240,20%,25%)]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
