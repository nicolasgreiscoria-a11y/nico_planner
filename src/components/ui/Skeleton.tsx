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
      style={{ background: '#222222', ...style }}
    />
  )
}

export function SkeletonCard({ rows = 3 }: { rows?: number }) {
  return (
    <div
      className="rounded-xl p-5 space-y-3"
      style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}
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
