export function Skeleton({
  className,
  style,
}: {
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <div
      className={`rounded-lg animate-pulse ${className ?? ''}`}
      style={{ background: 'rgba(255,255,255,0.06)', ...style }}
    />
  )
}

export function SkeletonCard({ rows = 3 }: { rows?: number }) {
  return (
    <div
      className="rounded-xl p-5 space-y-3"
      style={{ background: 'var(--glass-surface)', border: '1px solid var(--glass-border)', backdropFilter: 'blur(12px)' }}
    >
      <Skeleton style={{ height: 16, width: '40%' }} />
      {Array.from({ length: rows }, (_, i) => (
        <Skeleton key={i} style={{ height: 12, width: `${70 + (i % 3) * 10}%` }} />
      ))}
    </div>
  )
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 py-2.5 px-4">
      <Skeleton style={{ width: 16, height: 16, borderRadius: 4 }} />
      <Skeleton style={{ flex: 1, height: 12 }} />
      <Skeleton style={{ width: 60, height: 12 }} />
    </div>
  )
}
