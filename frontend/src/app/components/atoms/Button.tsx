import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const baseStyles = 'rounded-lg transition-all duration-300 font-medium inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] hover:scale-[1.02]',
    secondary: 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:scale-[1.02]',
    ghost: 'bg-transparent text-foreground hover:bg-white/5 border border-border',
    outline: 'bg-transparent border border-purple-500/50 text-purple-400 hover:bg-purple-500/10 hover:border-purple-500',
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
