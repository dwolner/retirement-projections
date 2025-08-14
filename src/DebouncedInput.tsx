import React, { useEffect, useRef, useState } from "react";

interface DebouncedInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  debounce?: number;
  min?: number;
  max?: number;
  step?: number;
}

export const DebouncedInput: React.FC<DebouncedInputProps> = ({
  label,
  value,
  onChange,
  debounce = 500,
  min,
  max,
  step = 1,
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
      <label className="block text-xs text-gray-600">{label}</label>
      <input
        ref={inputRef}
        type="number"
        className="border-gray-200 border rounded px-2 py-1 bg-white w-full shadow-md"
        value={internalValue}
        min={min}
        max={max}
        step={step}
        onChange={(e) => setInternalValue(Number(e.target.value))}
      />
    </div>
  );
};
