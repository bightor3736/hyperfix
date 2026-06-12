export function Footer() {
  return (
    <footer className="py-12 px-8 md:px-28 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/30">
      <p className="text-sm text-muted-foreground">
        © 2026 Mindloop. All rights reserved.
      </p>
      <div className="flex items-center gap-6">
        {['Privacy', 'Terms', 'Contact'].map(label => (
          <a
            key={label}
            href="#"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            {label}
          </a>
        ))}
      </div>
    </footer>
  )
}
