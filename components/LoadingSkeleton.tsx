import React from 'react';

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular';
    width?: string | number;
    height?: string | number;
    animation?: 'pulse' | 'shimmer';
}

export const Skeleton: React.FC<SkeletonProps> = ({
    className = '',
    variant = 'rectangular',
    width,
    height,
    animation = 'shimmer'
}) => {
    const baseClasses = animation === 'shimmer' ? 'skeleton' : 'animate-pulse bg-surface-elevated';

    const variantClasses = {
        text: 'rounded-sm',
        circular: 'rounded-full',
        rectangular: 'rounded-sm'
    };

    const style: React.CSSProperties = {
        width: width ?? '100%',
        height: height ?? (variant === 'text' ? '1em' : '100%')
    };

    return (
        <div
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            style={style}
            aria-hidden="true"
        />
    );
};

// Workout Card Skeleton
export const WorkoutCardSkeleton: React.FC = () => (
    <div className="p-4 bg-surface-dark rounded-sm border border-white/5 space-y-3">
        <div className="flex items-center gap-3">
            <Skeleton variant="rectangular" width={48} height={48} />
            <div className="flex-1 space-y-2">
                <Skeleton variant="text" width="60%" height={20} />
                <Skeleton variant="text" width="40%" height={14} />
            </div>
        </div>
    </div>
);

// Stats Card Skeleton
export const StatsCardSkeleton: React.FC = () => (
    <div className="p-4 bg-surface-dark rounded-sm text-center space-y-2">
        <Skeleton variant="rectangular" width={40} height={40} className="mx-auto" />
        <Skeleton variant="text" width="50%" height={28} className="mx-auto" />
        <Skeleton variant="text" width="30%" height={12} className="mx-auto" />
    </div>
);

// Exercise List Item Skeleton
export const ExerciseListSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => (
    <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-surface-dark rounded-sm border border-white/5">
                <Skeleton variant="rectangular" width={64} height={64} />
                <div className="flex-1 space-y-2">
                    <Skeleton variant="text" width="70%" height={18} />
                    <Skeleton variant="text" width="50%" height={14} />
                </div>
                <Skeleton variant="circular" width={32} height={32} />
            </div>
        ))}
    </div>
);

// History List Skeleton
export const HistoryListSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => (
    <div className="space-y-2">
        {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-surface-dark rounded-sm">
                <div className="flex items-center gap-3">
                    <Skeleton variant="rectangular" width={40} height={40} />
                    <div className="space-y-1">
                        <Skeleton variant="text" width={100} height={16} />
                        <Skeleton variant="text" width={80} height={12} />
                    </div>
                </div>
                <div className="text-right space-y-1">
                    <Skeleton variant="text" width={60} height={16} />
                    <Skeleton variant="text" width={40} height={12} />
                </div>
            </div>
        ))}
    </div>
);

// Chart Skeleton
export const ChartSkeleton: React.FC<{ height?: number }> = ({ height = 200 }) => (
    <div className="p-4 bg-surface-dark rounded-sm border border-white/5">
        <div className="flex justify-between items-center mb-4">
            <Skeleton variant="text" width={120} height={20} />
            <Skeleton variant="text" width={80} height={14} />
        </div>
        <Skeleton variant="rectangular" height={height} />
    </div>
);

// Dashboard Stats Row Skeleton
export const DashboardStatsSkeleton: React.FC = () => (
    <div className="grid grid-cols-3 gap-3">
        <StatsCardSkeleton />
        <StatsCardSkeleton />
        <StatsCardSkeleton />
    </div>
);

// Full Page Loading Skeleton
export const PageLoadingSkeleton: React.FC = () => (
    <div className="min-h-screen bg-background-dark p-4 space-y-6">
        <div className="space-y-2">
            <Skeleton variant="text" width={100} height={14} />
            <Skeleton variant="text" width={200} height={32} />
        </div>
        <Skeleton variant="rectangular" height={80} />
        <DashboardStatsSkeleton />
        <div className="space-y-3">
            <Skeleton variant="text" width={150} height={20} />
            <HistoryListSkeleton count={3} />
        </div>
    </div>
);

export default Skeleton;
