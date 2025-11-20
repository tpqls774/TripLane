import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth = false,
  className = "",
  ...props
}) => {
  const widthClass = fullWidth ? "w-full" : "";
  const errorClass = error
    ? "border-error focus:ring-error"
    : "border-gray-300 focus:ring-primary";

  return (
    <div className={`${widthClass}`}>
      {label && (
        <label className="block text-sm font-medium text-text-primary mb-1">
          {label}
        </label>
      )}
      <input
        className={`${widthClass} px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ring-gray-400 transition-colors ${errorClass} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-error">{error}</p>}
    </div>
  );
};

export default Input;
