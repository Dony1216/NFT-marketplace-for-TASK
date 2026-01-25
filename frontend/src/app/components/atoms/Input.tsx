import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  className = '',
  ...props 
}) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label className="text-sm text-muted-foreground">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-4 py-3 rounded-lg 
          bg-white/5 border border-purple-500/20
          text-foreground placeholder:text-muted-foreground
          focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20
          transition-all duration-200
          ${error ? 'border-red-500/50' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <span className="text-sm text-red-400">{error}</span>
      )}
    </div>
  );
};
