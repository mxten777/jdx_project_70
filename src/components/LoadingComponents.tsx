import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = 'primary',
  className 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-purple-600',
    white: 'text-white'
  };

  return (
    <motion.div
      className={clsx(
        'inline-block animate-spin rounded-full border-2 border-current border-t-transparent',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  );
};

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  rounded?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className, 
  width = 'w-full', 
  height = 'h-4',
  rounded = true 
}) => {
  return (
    <div
      className={clsx(
        'animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]',
        width,
        height,
        rounded && 'rounded',
        className
      )}
    />
  );
};

interface PulseDotsProps {
  count?: number;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const PulseDotsLoader: React.FC<PulseDotsProps> = ({ 
  count = 3, 
  color = 'bg-blue-500',
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  return (
    <div className="flex space-x-1 justify-center items-center">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          className={clsx('rounded-full', color, sizeClasses[size])}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: index * 0.2,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

interface TypingIndicatorProps {
  text?: string;
  speed?: number;
  className?: string;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ 
  text = "분석 중", 
  speed = 500,
  className 
}) => {
  const [displayedText, setDisplayedText] = React.useState('');
  const [showCursor, setShowCursor] = React.useState(true);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setDisplayedText(prev => {
        if (prev.length < text.length) {
          return text.slice(0, prev.length + 1);
        } else {
          return '';
        }
      });
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  React.useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <span className={clsx('korean-text', className)}>
      {displayedText}
      <span className={clsx('ml-1', showCursor ? 'opacity-100' : 'opacity-0')}>|</span>
    </span>
  );
};

interface ProgressBarProps {
  progress: number;
  className?: string;
  showPercentage?: boolean;
  color?: string;
  animated?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  className,
  showPercentage = false,
  color = 'bg-gradient-to-r from-blue-500 to-purple-600',
  animated = true
}) => {
  return (
    <div className={clsx('w-full', className)}>
      <div className="flex justify-between items-center mb-1">
        {showPercentage && (
          <span className="text-sm font-medium text-gray-700">{Math.round(progress)}%</span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <motion.div
          className={clsx('h-2 rounded-full', color)}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={animated ? { duration: 0.5, ease: 'easeOut' } : { duration: 0 }}
        />
      </div>
    </div>
  );
};

export default {
  LoadingSpinner,
  Skeleton,
  PulseDotsLoader,
  TypingIndicator,
  ProgressBar,
};