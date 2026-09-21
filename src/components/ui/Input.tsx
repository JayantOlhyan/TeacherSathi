import * as React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, helperText, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-bold text-gray-700 tracking-wide"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            id={inputId}
            type={type}
            className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm font-medium text-gray-900 transition-all duration-150 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400 ${
              error
                ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                : "border-gray-200 hover:border-gray-300 focus:border-emerald-600 focus:ring-emerald-600/20"
            } ${className || ""}`}
            ref={ref}
            {...props}
          />
        </div>
        {error ? (
          <p className="text-[11px] font-semibold text-red-600 animate-fadeIn">{error}</p>
        ) : helperText ? (
          <p className="text-[11px] text-gray-400 font-medium">{helperText}</p>
        ) : null}
      </div>
    );
  }
);
Input.displayName = "Input";
