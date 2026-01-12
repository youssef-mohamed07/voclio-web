interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  gradient?: boolean;
}

export default function Card({ children, className = '', padding = 'md', hover = false, gradient = false }: CardProps) {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 ${paddings[padding]} ${hover ? 'card-hover' : ''} ${gradient ? 'gradient-border' : ''} ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`mb-4 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <h3 className={`text-lg font-bold text-gray-900 ${className}`}>{children}</h3>;
}

export function CardDescription({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-sm text-gray-500 mt-1 ${className}`}>{children}</p>;
}

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  gradient: 'purple' | 'green' | 'blue' | 'orange' | 'pink' | 'red';
}

export function StatCard({ title, value, change, changeType = 'neutral', icon, gradient }: StatCardProps) {
  const gradients = {
    purple: 'stat-purple',
    green: 'stat-green',
    blue: 'stat-blue',
    orange: 'stat-orange',
    pink: 'stat-pink',
    red: 'stat-red',
  };

  const changeColors = {
    positive: 'text-green-600 bg-green-50',
    negative: 'text-red-600 bg-red-50',
    neutral: 'text-gray-600 bg-gray-50',
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 card-hover">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mt-3 ${changeColors[changeType]}`}>
              {changeType === 'positive' && <span>↑</span>}
              {changeType === 'negative' && <span>↓</span>}
              {change}
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${gradients[gradient]} text-white shadow-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
