import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 select-none active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-[#0F5B38] text-white hover:bg-[#0C4B2E] shadow-sm",
        primary: "bg-[#0F5B38] text-white hover:bg-[#0C4B2E] shadow-sm",
        destructive: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
        outline: "border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 hover:border-gray-300 shadow-2xs",
        secondary: "bg-emerald-50 text-[#0F5B38] border border-emerald-200 hover:bg-emerald-100",
        ghost: "text-gray-700 hover:bg-gray-100/80 hover:text-gray-900",
        link: "text-[#0F5B38] underline-offset-4 hover:underline p-0 h-auto",
        // Phase 12 75-inch Classroom Touch Variant (High contrast, tactile elevation)
        classroom: "bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold border-2 border-emerald-400/40 shadow-lg",
        "classroom-secondary": "bg-[#1E293B] hover:bg-[#334155] text-slate-100 font-bold border border-slate-700 shadow-md",
        "classroom-quiz": "bg-purple-600 hover:bg-purple-500 text-white font-bold border border-purple-400 shadow-md",
        "classroom-accent": "bg-amber-500 hover:bg-amber-400 text-slate-950 font-black border border-amber-300 shadow-md",
      },
      size: {
        default: "h-10 px-4 py-2 rounded-xl text-sm",
        sm: "h-8 px-3 rounded-lg text-xs",
        md: "h-10 px-4 py-2 rounded-xl text-sm",
        lg: "h-12 px-6 py-2.5 rounded-xl text-base",
        icon: "h-10 w-10 rounded-xl p-0",
        // Phase 12 Classroom Sizes (>=64px touch target on 75" display, solving UX-011)
        classroom: "min-h-[64px] min-w-[64px] px-6 py-3.5 rounded-2xl text-lg font-bold tracking-wide",
        "classroom-lg": "min-h-[72px] min-w-[72px] px-8 py-4 rounded-2xl text-xl font-extrabold tracking-wide",
        "classroom-icon": "min-h-[64px] min-w-[64px] rounded-2xl p-0 flex items-center justify-center",
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
  loading?: boolean;
  icon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading = false, disabled, children, icon, ...props }, ref) => {
    return (
      <button
        className={buttonVariants({ variant, size, className })}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin shrink-0" />}
        {!loading && icon && <span className="mr-2 shrink-0">{icon}</span>}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
