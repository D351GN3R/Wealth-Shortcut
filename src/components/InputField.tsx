import React from 'react';
import { cn } from '../lib/utils';

interface InputFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  unit?: string;
  error?: string | null;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
}

export function InputField({
  label,
  value,
  onChange,
  unit,
  error,
  placeholder,
  min,
  max,
  step = 1
}: InputFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value) || 0;
    onChange(newValue);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {unit && <span className="text-gray-500 ml-1">({unit})</span>}
      </label>
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          className={cn(
            "w-full px-3 py-2 border rounded-lg shadow-sm transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
            "placeholder-gray-400",
            error
              ? "border-red-300 bg-red-50"
              : "border-gray-300 bg-white hover:border-gray-400"
          )}
        />
      </div>
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
}