interface SkeletonBoxProps {
  className?: string;
  style?: React.CSSProperties;
}

function SkeletonBox({ className = "", style }: SkeletonBoxProps) {
  return <div className={`animate-pulse bg-muted/50 rounded-xl ${className}`} style={style} />;
}

/** Stats card skeleton: icon placeholder + value line + label line + change line */
export function StatsCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <div className="mb-3">
        <SkeletonBox className="w-10 h-10" />
      </div>
      <SkeletonBox className="h-7 w-20 mb-2" />
      <SkeletonBox className="h-3.5 w-32 mb-1.5" />
      <SkeletonBox className="h-3 w-24" />
    </div>
  );
}

/** Chart skeleton: title line + gray block matching chart height */
export function ChartSkeletonStyled({ height = 230 }: { height?: number }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <SkeletonBox className="h-5 w-40 mb-4" />
      <SkeletonBox className="w-full rounded-xl" style={{ height }} />
    </div>
  );
}

/** Contest card skeleton: 3 lines of varying width */
export function ContestCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <div className="flex items-start justify-between mb-3">
        <SkeletonBox className="h-5 w-16 rounded-full" />
        <SkeletonBox className="h-5 w-20" />
      </div>
      <SkeletonBox className="h-5 w-full mb-3" />
      <SkeletonBox className="h-4 w-3/4 mb-4" />
      <div className="flex gap-2">
        <SkeletonBox className="flex-1 h-9" />
        <SkeletonBox className="flex-1 h-9" />
      </div>
    </div>
  );
}

/** Heatmap skeleton: title row + full-width gray block matching heatmap height */
export function HeatmapSkeleton() {
  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <SkeletonBox className="h-5 w-32" />
        <SkeletonBox className="h-3 w-28" />
      </div>
      <SkeletonBox
        className="w-full rounded-xl"
        style={{ height: 108 }}
      />
    </div>
  );
}

/** Analytics stat row skeleton: icon + value + label */
export function AnalyticsStatSkeleton() {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
      <SkeletonBox className="w-12 h-12" />
      <div>
        <SkeletonBox className="h-7 w-20 mb-1.5" />
        <SkeletonBox className="h-4 w-28" />
      </div>
    </div>
  );
}

/** Weak topics list skeleton */
export function WeakTopicsSkeleton() {
  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <SkeletonBox className="h-5 w-28 mb-4" />
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i}>
            <div className="flex items-center justify-between mb-1.5">
              <SkeletonBox className="h-4 w-32" />
              <SkeletonBox className="h-3 w-16" />
            </div>
            <SkeletonBox className="h-2 w-full rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}