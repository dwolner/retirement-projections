import React, { useEffect, useRef, useState } from "react";

interface DebouncedInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  debounce?: number;
  min?: number;
  max?: number;
  step?: number;
  darkMode?: boolean;
}

export const DebouncedInput: React.FC<DebouncedInputProps> = ({
  label,
  value,
  onChange,
  debounce = 750,
  min,
  max,
  step = 1,
  darkMode = false,
}) => {
  const [internalValue, setInternalValue] = useState(value);
  const timeout = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  useEffect(() => {
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      if (internalValue !== value) {
        onChange(internalValue);
      }
    }, debounce);
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
    // eslint-disable-next-line
  }, [internalValue]);

  return (
    <div>
      <label
        className={
          `block text-xs ` + (darkMode ? "text-gray-300" : "text-gray-600")
        }
      >
        {label}
      </label>
      <input
        ref={inputRef}
        type="number"
        className={
          `border rounded px-2 py-1 w-full shadow-md ` +
          (darkMode
            ? "border-gray-700 bg-slate-800 text-slate-100 placeholder:text-gray-500"
            : "border-gray-200 bg-white text-slate-900 placeholder:text-gray-400")
        }
        value={internalValue}
        min={min}
        max={max}
        step={step}
        onChange={(e) => setInternalValue(Number(e.target.value))}
      />
    </div>
  );
};
