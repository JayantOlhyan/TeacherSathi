import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full text-xs font-bold tracking-wide transition-colors select-none",
  {
    variants: {
      variant: {
        default: "bg-emerald-50 text-emerald-800 border border-emerald-200/70",
        brand: "bg-[#0F5B38]/10 text-[#0F5B38] border border-[#0F5B38]/20",
        success: "bg-green-50 text-green-800 border border-green-200",
        warning: "bg-amber-50 text-amber-900 border border-amber-200",
        danger: "bg-red-50 text-red-800 border border-red-200",
        info: "bg-blue-50 text-blue-800 border border-blue-200",
        neutral: "bg-gray-100 text-gray-700 border border-gray-200",
        // Phase 12 75-inch Classroom Display Badges (High contrast, bold, visible from 8m)
        classroom: "bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-sm px-3.5 py-1",
        "classroom-warning": "bg-amber-500/20 text-amber-300 border border-amber-400/40 text-sm px-3.5 py-1",
      },
      size: {
        sm: "px-2 py-0.5 text-[11px]",
        default: "px-2.5 py-1 text-xs",
        lg: "px-3.5 py-1.5 text-sm",
        classroom: "px-4 py-1.5 text-base font-extrabold",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode;
}

export function Badge({ className, variant, size, icon, children, ...props }: BadgeProps) {
  return (
    <div className={badgeVariants({ variant, size, className })} {...props}>
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </div>
  );
}
