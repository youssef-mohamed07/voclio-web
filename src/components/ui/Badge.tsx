interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple' | 'gradient';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

export default function Badge({ variant = 'default', size = 'sm', children, className = '', dot = false }: BadgeProps) {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    error: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700',
    gradient: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
  };

  const sizes = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  const dotColors = {
    default: 'bg-gray-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    purple: 'bg-purple-500',
    gradient: 'bg-white',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${variants[variant]} ${sizes[size]} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`}></span>}
      {children}
    </span>
  );
}
