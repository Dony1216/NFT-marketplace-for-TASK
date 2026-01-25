import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'purple' | 'cyan' | 'success' | 'warning';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'default',
  className = '' 
}) => {
  const variants = {
    default: 'bg-white/10 text-foreground border-white/20',
    purple: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    cyan: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    success: 'bg-green-500/20 text-green-300 border-green-500/30',
    warning: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  };
  
  return (
    <span className={`
      inline-flex items-center px-3 py-1 rounded-full text-xs 
      border backdrop-blur-sm
      ${variants[variant]}
      ${className}
    `}>
      {children}
    </span>
  );
};
