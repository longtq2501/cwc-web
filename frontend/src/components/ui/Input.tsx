import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ElementType;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, icon: Icon, error, className = '', ...props }) => {
  return (
    <div className="space-y-2 w-full">
      {label && <label className="block text-sm font-bold text-gray-700">{label}</label>}
      <div className="relative group">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
        )}
        <input
          className={`w-full ${Icon ? 'pl-12' : 'px-4'} pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary transition-all outline-none text-sm ${
            error ? 'border-red-500 bg-white' : ''
          } ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-red-500 text-xs font-medium ml-1">{error}</p>}
    </div>
  );
};

export default Input;
