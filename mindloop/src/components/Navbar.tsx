import { motion } from 'framer-motion'

function ConcentricLogo() {
  return (
    <div className="relative flex items-center justify-center w-7 h-7 shrink-0">
      <div className="absolute w-7 h-7 rounded-full border-2 border-foreground/60" />
      <div className="w-3 h-3 rounded-full border border-foreground/60" />
    </div>
  )
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4.5"/>
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  )
}

function XIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  )
}

const NAV_LINKS = ['Home', 'How It Works', 'Philosophy', 'Use Cases']

export function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center px-8 md:px-28 py-4"
    >
      {/* Logo */}
      <a href="#" className="flex items-center gap-2.5 shrink-0">
        <ConcentricLogo />
        <span className="font-bold text-foreground text-base tracking-tight">Mindloop</span>
      </a>

      {/* Nav links */}
      <div className="hidden md:flex items-center gap-0 ml-10">
        {NAV_LINKS.map((label, i) => (
          <span key={label} className="flex items-center">
            {i > 0 && <span className="text-muted-foreground/40 mx-3 select-none">•</span>}
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {label}
            </a>
          </span>
        ))}
      </div>

      {/* Social icons */}
      <div className="flex items-center gap-2 ml-auto">
        {[
          { icon: <InstagramIcon />, label: 'Instagram' },
          { icon: <LinkedInIcon />, label: 'LinkedIn' },
          { icon: <XIcon />, label: 'X / Twitter' },
        ].map(({ icon, label }) => (
          <a
            key={label}
            href="#"
            aria-label={label}
            className="liquid-glass w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            {icon}
          </a>
        ))}
      </div>
    </motion.nav>
  )
}
