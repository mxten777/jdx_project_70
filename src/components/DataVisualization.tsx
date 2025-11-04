import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  showPercentage?: boolean;
  className?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 120,
  strokeWidth = 8,
  color = '#3B82F6',
  backgroundColor = '#E5E7EB',
  showPercentage = true,
  className
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={clsx('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-gray-700">
            {Math.round(progress)}%
          </span>
        </div>
      )}
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon,
  color = 'blue',
  className
}) => {
  const colorStyles = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-red-500 to-red-600',
  };

  return (
    <motion.div
      className={clsx(
        'bg-white rounded-xl shadow-lg border border-white/20 p-6 relative overflow-hidden',
        className
      )}
      whileHover={{ y: -2, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
      transition={{ duration: 0.2 }}
    >
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${colorStyles[color]}`} />
      
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-600 korean-text">{title}</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              <span
                className={clsx(
                  'text-sm font-semibold',
                  change.type === 'increase' ? 'text-green-600' : 'text-red-600'
                )}
              >
                {change.type === 'increase' ? '+' : '-'}{Math.abs(change.value)}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs 지난달</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={`p-3 rounded-full bg-gradient-to-r ${colorStyles[color]}`}>
            <div className="text-white">{icon}</div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

interface BarChartProps {
  data: Array<{
    label: string;
    value: number;
    color?: string;
  }>;
  maxValue?: number;
  height?: number;
  showValues?: boolean;
  animated?: boolean;
  className?: string;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  maxValue,
  height = 200,
  showValues = true,
  animated = true,
  className
}) => {
  const max = maxValue || Math.max(...data.map(d => d.value));

  return (
    <div className={clsx('w-full', className)}>
      <div className="flex items-end justify-between space-x-2" style={{ height: height }}>
        {data.map((item, index) => {
          const barHeight = (item.value / max) * (height - 40);
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="relative w-full flex flex-col items-center">
                {showValues && (
                  <span className="text-xs font-medium text-gray-600 mb-1">
                    {item.value}
                  </span>
                )}
                <motion.div
                  className={clsx(
                    'w-full rounded-t',
                    item.color || 'bg-gradient-to-t from-blue-500 to-blue-400'
                  )}
                  initial={animated ? { height: 0 } : { height: barHeight }}
                  animate={{ height: barHeight }}
                  transition={{ duration: 0.8, delay: index * 0.1, ease: 'easeOut' }}
                />
              </div>
              <span className="text-xs text-gray-500 mt-2 korean-text text-center">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface DonutChartProps {
  data: Array<{
    label: string;
    value: number;
    color: string;
  }>;
  size?: number;
  strokeWidth?: number;
  showLegend?: boolean;
  centerContent?: React.ReactNode;
  className?: string;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  size = 200,
  strokeWidth = 30,
  showLegend = true,
  centerContent,
  className
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  let accumulatedPercentage = 0;

  return (
    <div className={clsx('flex flex-col items-center', className)}>
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
            const strokeDashoffset = -((accumulatedPercentage / 100) * circumference);
            
            accumulatedPercentage += percentage;

            return (
              <motion.circle
                key={index}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={item.color}
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                initial={{ strokeDasharray: `0 ${circumference}` }}
                animate={{ strokeDasharray }}
                transition={{ duration: 1, delay: index * 0.2, ease: 'easeOut' }}
              />
            );
          })}
        </svg>
        {centerContent && (
          <div className="absolute inset-0 flex items-center justify-center">
            {centerContent}
          </div>
        )}
      </div>
      
      {showLegend && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-600 korean-text">{item.label}</span>
              <span className="text-sm font-medium text-gray-900">
                {Math.round((item.value / total) * 100)}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  description,
  trend,
  icon,
  color = 'bg-gradient-to-r from-blue-500 to-purple-600',
  size = 'md',
  className
}) => {
  const sizeStyles = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const textSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <motion.div
      className={clsx(
        'bg-white rounded-xl shadow-lg border border-white/20 relative overflow-hidden',
        sizeStyles[size],
        className
      )}
      whileHover={{ 
        scale: 1.02,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}
      transition={{ duration: 0.2 }}
    >
      <div className={`absolute top-0 left-0 right-0 h-1 ${color}`} />
      
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-600 korean-text">{title}</h3>
          <p className={clsx('font-bold text-gray-900 mt-2', textSizes[size])}>
            {value}
          </p>
          {description && (
            <p className="text-sm text-gray-500 mt-1 korean-text">{description}</p>
          )}
          {trend && (
            <div className="flex items-center mt-2">
              <span
                className={clsx(
                  'text-sm font-semibold flex items-center',
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                )}
              >
                {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="ml-4">
            <div className={clsx('p-3 rounded-full text-white', color)}>
              {icon}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};