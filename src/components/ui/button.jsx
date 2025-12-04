import React from 'react';
import { Loader2 } from 'lucide-react';

export function Button({ 
  children, 
  variant = 'default', 
  size = 'default', 
  className = '', 
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  ...props 
}) {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    default: 'bg-amber-400 text-purple-900 hover:bg-amber-500 focus:ring-amber-400 shadow-lg hover:shadow-xl',
    ghost: 'bg-transparent text-purple-200 hover:bg-white/10 hover:text-white',
    outline: 'bg-transparent border border-purple-400/30 text-purple-200 hover:border-purple-400 hover:text-white hover:bg-white/10',
    secondary: 'bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500',
    destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
  };
  
  const sizes = {
    default: 'px-6 py-3 text-base',
    sm: 'px-4 py-2 text-sm',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl',
    icon: 'p-3'
  };
  
  const variantClass = variants[variant] || variants.default;
  const sizeClass = sizes[size] || sizes.default;
  
  return (
    <button
      type={type}
      className={`${baseStyles} ${variantClass} ${sizeClass} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Processando...
        </>
      ) : (
        children
      )}
    </button>
  );
}

// Componente de ícone para botão
export function ButtonIcon({ icon: Icon, ...props }) {
  return <Icon className="w-4 h-4" {...props} />;
}
