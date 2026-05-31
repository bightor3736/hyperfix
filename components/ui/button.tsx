import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "accent" | "invert";
  size?: "sm" | "md" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl font-sans font-medium transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none",
          {
            // variants
            "bg-bg-elevated border border-line text-ink hover:opacity-80 active:scale-[0.97]":
              variant === "default",
            "border border-line bg-transparent text-ink-muted hover:text-ink hover:border-line-strong active:scale-[0.97]":
              variant === "outline",
            "bg-transparent text-ink-muted hover:text-ink hover:bg-line active:scale-[0.97]":
              variant === "ghost",
            "bg-accent-soft border border-accent text-accent hover:opacity-80 active:scale-[0.97]":
              variant === "accent",
            "bg-invert-bg text-invert-ink hover:opacity-90 active:scale-[0.97]":
              variant === "invert",
            // sizes
            "text-[11px] px-3 py-1.5": size === "sm",
            "text-[13px] px-4 py-2": size === "md",
            "text-[14px] px-5 py-2.5": size === "lg",
            "w-8 h-8 p-0 rounded-lg": size === "icon",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
