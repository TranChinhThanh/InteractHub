import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, error, id, name, className = "", ...props }, ref) => {
    const inputId = id ?? (typeof name === "string" ? name : undefined);

    return (
      <div className="space-y-1.5">
        <label
          htmlFor={inputId}
          className="block text-sm font-medium tracking-wide text-slate-700"
        >
          {label}
        </label>

        <input
          ref={ref}
          id={inputId}
          name={name}
          className={[
            "block w-full rounded-xl border bg-white/90 px-4 py-2.5 text-slate-900 shadow-sm transition duration-150 placeholder:text-slate-400",
            "focus:outline-none focus:ring-4",
            error
              ? "border-rose-300 focus:border-rose-500 focus:ring-rose-100"
              : "border-slate-200 focus:border-sky-500 focus:ring-sky-100",
            className,
          ].join(" ")}
          aria-invalid={Boolean(error)}
          aria-describedby={error && inputId ? `${inputId}-error` : undefined}
          {...props}
        />

        {error ? (
          <p
            id={inputId ? `${inputId}-error` : undefined}
            className="text-sm font-medium text-rose-600"
          >
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);

TextInput.displayName = "TextInput";

export default TextInput;
