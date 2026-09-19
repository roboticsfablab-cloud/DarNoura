interface HeaderProps {
  currentPage: 'home' | 'recordings';
  onNavigate: (page: 'home' | 'recordings') => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  return (
    <header className="fixed top-0 inset-x-0 z-40 transition-all duration-500">
      <div className="absolute inset-0 bg-gradient-to-b from-snd-950/80 to-transparent backdrop-blur-sm" />
      <nav className="relative max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo + title */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 group no-select touch-manipulation"
          aria-label="العودة للصفحة الرئيسية"
        >
          <div className="relative h-12 w-44 overflow-hidden rounded-xl border border-snd-300/25 bg-snd-950/40 shadow-lg shadow-snd-950/20 transition-transform duration-300 group-hover:scale-[1.03]">
            <img
              src="/image.png"
              alt="وش شعورك؟"
              className="h-full w-full object-contain"
            />
          </div>
        </button>

        {/* Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('home')}
            className={`px-5 py-2.5 rounded-xl font-body font-medium text-sm transition-all duration-300 touch-manipulation no-select
              ${
                currentPage === 'home'
                  ? 'bg-snd-500/20 text-sand-50 border border-snd-300/30'
                  : 'text-sand-100/60 hover:text-sand-50 hover:bg-white/5 border border-transparent'
              }`}
            aria-current={currentPage === 'home' ? 'page' : undefined}
          >
            الرئيسية
          </button>
          <button
            onClick={() => onNavigate('recordings')}
            className={`px-5 py-2.5 rounded-xl font-body font-medium text-sm transition-all duration-300 touch-manipulation no-select
              ${
                currentPage === 'recordings'
                  ? 'bg-snd-500/20 text-sand-50 border border-snd-300/30'
                  : 'text-sand-100/60 hover:text-sand-50 hover:bg-white/5 border border-transparent'
              }`}
            aria-current={currentPage === 'recordings' ? 'page' : undefined}
          >
            التسجيلات
          </button>
        </div>
      </nav>
    </header>
  );
}
