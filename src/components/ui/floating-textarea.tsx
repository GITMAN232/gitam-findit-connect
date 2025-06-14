
import * as React from "react";
import { cn } from "@/lib/utils";

interface FloatingTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

const FloatingTextarea = React.forwardRef<HTMLTextAreaElement, FloatingTextareaProps>(
  ({ className, label, error, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(false);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(false);
      setHasValue(!!e.target.value);
      props.onBlur?.(e);
    };

    React.useEffect(() => {
      setHasValue(!!props.value || !!props.defaultValue);
    }, [props.value, props.defaultValue]);

    return (
      <div className="relative">
        <textarea
          ref={ref}
          className={cn(
            "peer w-full min-h-[140px] px-4 pt-8 pb-3 text-base border-2 rounded-xl bg-white/80 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-0 focus:border-maroon/60 hover:border-gray-300 resize-none",
            error ? "border-red-300 focus:border-red-500" : "border-gray-200",
            className
          )}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder=""
          {...props}
        />
        <label
          className={cn(
            "absolute left-4 transition-all duration-300 pointer-events-none text-gray-500",
            isFocused || hasValue
              ? "top-3 text-xs font-medium text-maroon"
              : "top-6 text-base"
          )}
        >
          {label}
        </label>
        {error && (
          <p className="mt-1 text-sm text-red-600 animate-fade-in">{error}</p>
        )}
      </div>
    );
  }
);

FloatingTextarea.displayName = "FloatingTextarea";

export { FloatingTextarea };
