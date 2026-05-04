import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'pending' | 'accepted' | 'assigned' | 'on_way' | 'collected' | 'confirmed' | 'rejected' | 'cancelled' | 'primary';
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'primary', size = 'sm', className = '' }) => {
  const variants: any = {
    primary: 'bg-primary-pale text-primary',
    pending: 'bg-status-pending text-white',
    accepted: 'bg-status-accepted text-white',
    assigned: 'bg-status-assigned text-white',
    on_way: 'bg-status-on-way text-white',
    collected: 'bg-status-collected text-white',
    confirmed: 'bg-status-confirmed text-white',
    rejected: 'bg-status-rejected text-white',
    cancelled: 'bg-status-cancelled text-white',
  };

  const sizes = {
    xs: 'px-2 py-0.5 text-[10px]',
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-1.5 text-sm',
  };

  return (
    <span className={`inline-block font-bold rounded-full uppercase tracking-wider ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
