import React from 'react';
import type {ButtonHTMLAttributes, ReactNode}  from 'react';
interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'brand';
}

const Button: React.FC<Props> = ({ children, variant = 'primary', className = '', ...rest }) => {
  const baseClass = 'rounded py-2 px-4';
  let variantClass = '';

  switch (variant) {
    case 'brand':
      variantClass = 'bg-blue-500 text-white hover:bg-blue-700';
      break;
    case 'secondary':
      variantClass = 'bg-gray-200 text-gray-700 hover:bg-gray-300';
      break;
    default:
      variantClass = 'bg-white text-gray-700 border hover:bg-gray-100';
      break;
  }

  return (
    <button className={`${baseClass} ${variantClass} ${className}`} {...rest}>
      {children}
    </button>
  );
};

export default Button;