import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

const cardVariants = cva(
  "transition-all duration-200 text-gray-900",
  {
    variants: {
      variant: {
        default: "bg-white border border-gray-100 rounded-2xl shadow-sm",
        flat: "bg-gray-50/70 border border-gray-200/80 rounded-2xl",
        interactive: "bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-emerald-200 hover:-translate-y-0.5 cursor-pointer",
        lesson: "bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-emerald-300",
        resource: "bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:bg-emerald-50/30",
        assessment: "bg-white border border-gray-100 rounded-2xl p-5 shadow-sm border-l-4 border-l-emerald-600",
        recommendation: "bg-emerald-50/50 border border-emerald-200/80 rounded-2xl p-5",
        // Phase 12 75-inch Classroom Display Card (Low-glare high contrast)
        classroom: "bg-[#131F30] border-2 border-[#20334D] rounded-3xl p-6 sm:p-8 text-white shadow-xl",
        "classroom-light": "bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 text-slate-900 shadow-xl",
      },
      padding: {
        none: "p-0",
        sm: "p-4",
        default: "p-5 sm:p-6",
        lg: "p-6 sm:p-8",
        classroom: "p-6 sm:p-10",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cardVariants({ variant, padding, className })}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`flex flex-col space-y-1.5 pb-4 border-b border-gray-50 ${className || ""}`}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={`text-base sm:text-lg font-extrabold text-gray-900 leading-snug tracking-tight ${className || ""}`}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={`text-xs text-gray-500 font-medium leading-relaxed ${className || ""}`}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={`pt-4 ${className || ""}`} {...props} />
));
CardContent.displayName = "CardContent";

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`flex items-center pt-4 border-t border-gray-50 ${className || ""}`}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";
