import Link from "next/link";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-orange-500/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-orange-500/5 blur-3xl" />
      </div>

      <div className="text-center max-w-lg mx-auto relative z-10">
        {/* Animated Wave */}
        <div className="flex justify-center mb-8">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 bg-orange-500/20 rounded-full animate-ping" />
            <div className="relative w-20 h-20 bg-orange-500/10 border border-orange-500/30 rounded-full flex items-center justify-center">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-orange-500">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
          </div>
        </div>

        {/* Brand */}
        <p className="text-orange-500 text-xs tracking-[0.3em] uppercase font-bold mb-6">FLUVA SPORT</p>

        {/* Heading */}
        <h1 className="text-5xl font-serif text-white mb-6 leading-tight">
          We&apos;ll be back<br />
          <span className="text-orange-500">very soon</span>
        </h1>

        <p className="text-gray-400 text-lg font-light mb-10 leading-relaxed">
          We&apos;re making some improvements to bring you an even better experience.
          Check back shortly.
        </p>

        {/* Divider */}
        <div className="w-12 h-px bg-orange-500/50 mx-auto mb-10" />

        {/* Social Links */}
        <div className="flex items-center justify-center gap-6">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
            className="text-gray-500 hover:text-orange-500 transition-colors text-sm font-medium tracking-widest uppercase">
            Instagram
          </a>
          <span className="text-gray-800">·</span>
          <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer"
            className="text-gray-500 hover:text-orange-500 transition-colors text-sm font-medium tracking-widest uppercase">
            TikTok
          </a>
        </div>

        {/* Admin link (subtle) */}
        <div className="mt-16">
          <Link href="/admin/login" className="text-gray-800 hover:text-gray-600 text-xs transition-colors">
            Admin Access →
          </Link>
        </div>
      </div>
    </div>
  );
}
