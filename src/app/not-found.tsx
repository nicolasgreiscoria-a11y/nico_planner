import Link from 'next/link'

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: '#0F0F0F' }}
    >
      <div className="text-center space-y-4">
        <p className="text-6xl font-bold" style={{ color: '#2A2A2A', fontFamily: 'DM Sans, sans-serif' }}>
          404
        </p>
        <h1 className="text-xl font-semibold" style={{ color: '#E8E8E8', fontFamily: 'DM Sans, sans-serif' }}>
          Page not found
        </h1>
        <p className="text-sm" style={{ color: '#888888' }}>
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/dashboard"
          className="inline-block px-5 py-2 rounded-lg text-sm font-medium mt-2"
          style={{ background: '#57bb8A', color: '#0F0F0F' }}
        >
          Go to dashboard
        </Link>
      </div>
    </div>
  )
}
