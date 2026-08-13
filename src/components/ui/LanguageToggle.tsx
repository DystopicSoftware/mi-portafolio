import { motion } from 'framer-motion';
import { usePortfolioStore } from '../../store/usePortfolioStore';

// ─────────────────────────────────────────────────────────────────────────────
// LanguageToggle
// Cyberpunk terminal-style EN / ES language switcher.
// Reads and writes language from the persisted Zustand store.
// ─────────────────────────────────────────────────────────────────────────────
export function LanguageToggle() {
  const { language, toggleLanguage } = usePortfolioStore();

  const isEN = language === 'en';

  return (
    <button
      id="language-toggle-btn"
      onClick={toggleLanguage}
      aria-label={isEN ? 'Switch to Spanish' : 'Cambiar a inglés'}
      // translate="no" — this component renders language codes, never user content.
      // Preventing translation here avoids a recursive UI paradox.
      translate="no"
      className="group relative flex items-center gap-0 font-mono text-[11px] tracking-[0.15em] select-none focus:outline-none"
    >
      {/* Outer shell — the "panel" frame */}
      <span className="flex items-center border border-cyan-500/30 bg-black/60 backdrop-blur-sm rounded-sm overflow-hidden transition-all duration-300 group-hover:border-cyan-400/60 group-hover:shadow-[0_0_12px_rgba(0,229,255,0.12)]">

        {/* EN slot */}
        <span
          className={[
            'relative px-2.5 py-1.5 transition-all duration-300',
            isEN
              ? 'bg-cyan-500/15 text-cyan-300'
              : 'text-slate-600 hover:text-slate-400',
          ].join(' ')}
        >
          {/* Active indicator dot */}
          {isEN && (
            <motion.span
              layoutId="lang-indicator"
              className="absolute inset-0 bg-cyan-500/10 border-r border-cyan-500/20"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10">EN</span>
        </span>

        {/* Separator */}
        <span className="text-cyan-500/20 px-0.5 py-1.5 border-x border-cyan-500/10 text-[9px]">
          /
        </span>

        {/* ES slot */}
        <span
          className={[
            'relative px-2.5 py-1.5 transition-all duration-300',
            !isEN
              ? 'bg-cyan-500/15 text-cyan-300'
              : 'text-slate-600 hover:text-slate-400',
          ].join(' ')}
        >
          {!isEN && (
            <motion.span
              layoutId="lang-indicator"
              className="absolute inset-0 bg-cyan-500/10 border-l border-cyan-500/20"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10">ES</span>
        </span>
      </span>

      {/* Scan-line shimmer on hover — pure CSS, no JS */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-sm bg-[linear-gradient(105deg,transparent_40%,rgba(0,229,255,0.06)_50%,transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      />
    </button>
  );
}
