import { useState } from 'react'
import { motion } from 'framer-motion'

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.6, delay, ease: 'easeOut' },
})

const VIDEO_URL = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_120549_0cd82c36-56b3-4dd9-b190-069cfc3a623f.mp4'

function AvatarGroup() {
  const avatars = [
    'linear-gradient(135deg, #3a3a3a 0%, #1a1a1a 100%)',
    'linear-gradient(135deg, #4a4a4a 0%, #2a2a2a 100%)',
    'linear-gradient(135deg, #555 0%, #333 100%)',
  ]
  return (
    <div className="flex items-center gap-3">
      <div className="flex -space-x-2">
        {avatars.map((bg, i) => (
          <div
            key={i}
            className="w-8 h-8 rounded-full border-2 border-background"
            style={{ background: bg, zIndex: avatars.length - i }}
          />
        ))}
      </div>
      <span className="text-sm text-muted-foreground">7,000+ people already subscribed</span>
    </div>
  )
}

export function Hero() {
  const [email, setEmail] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
  }

  return (
    <section className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center">
      {/* Background video */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        src={VIDEO_URL}
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-background to-transparent z-[1]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 pt-28 md:pt-32 max-w-4xl mx-auto">
        <motion.div {...fadeUp(0)} className="mb-8">
          <AvatarGroup />
        </motion.div>

        <motion.h1
          {...fadeUp(0.1)}
          className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-[-2px] text-foreground mb-6 leading-[1.05]"
        >
          Get{' '}
          <span className="font-serif italic font-normal">Inspired</span>
          {' '}with Us
        </motion.h1>

        <motion.p
          {...fadeUp(0.2)}
          className="text-lg max-w-xl mb-10"
          style={{ color: 'hsl(var(--hero-subtitle))' }}
        >
          Join our feed for meaningful updates, news around technology and a shared journey toward depth and direction.
        </motion.p>

        {/* Email form */}
        <motion.form
          {...fadeUp(0.3)}
          onSubmit={handleSubmit}
          className="liquid-glass rounded-full p-2 flex items-center gap-2 w-full max-w-lg"
        >
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="flex-1 min-w-0 bg-transparent text-sm text-foreground placeholder-muted-foreground px-4 py-2 outline-none"
          />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="bg-foreground text-background text-sm font-semibold rounded-full px-8 py-3 shrink-0 cursor-pointer"
          >
            SUBSCRIBE
          </motion.button>
        </motion.form>
      </div>
    </section>
  )
}
