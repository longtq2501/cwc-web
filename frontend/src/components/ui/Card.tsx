import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hoverable?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', padding = 'md', hoverable = false }) => {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10 md:p-12',
  };

  return (
    <div className={`bg-white rounded-[2.5rem] border border-gray-100 shadow-sm transition-all ${
      hoverable ? 'hover:shadow-md hover:border-primary-pale' : ''
    } ${paddings[padding]} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
