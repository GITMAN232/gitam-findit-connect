
import * as React from "react";
import { cn } from "@/lib/utils";

interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ className, label, error, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(false);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setHasValue(!!e.target.value);
      props.onBlur?.(e);
    };

    React.useEffect(() => {
      setHasValue(!!props.value || !!props.defaultValue);
    }, [props.value, props.defaultValue]);

    return (
      <div className="relative">
        <input
          ref={ref}
          className={cn(
            "peer w-full h-14 px-4 pt-6 pb-2 text-base border-2 rounded-xl bg-white/80 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-0 focus:border-maroon/60 hover:border-gray-300",
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
              ? "top-2 text-xs font-medium text-maroon"
              : "top-1/2 transform -translate-y-1/2 text-base"
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

FloatingInput.displayName = "FloatingInput";

export { FloatingInput };
