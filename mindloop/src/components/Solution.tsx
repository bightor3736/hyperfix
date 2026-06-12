import { motion } from 'framer-motion'

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.6, delay, ease: 'easeOut' },
})

const VIDEO_URL = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_125119_8e5ae31c-0021-4396-bc08-f7aebeb877a2.mp4'

const FEATURES = [
  {
    title: 'Curated Feed',
    description: 'Algorithmically filtered content matched to your interests, not to advertisers.',
  },
  {
    title: 'Writer Tools',
    description: 'Compose, schedule, and analyze your newsletters with a minimal, focused editor.',
  },
  {
    title: 'Community',
    description: 'Build real connections through replies, threads, and reader circles.',
  },
  {
    title: 'Distribution',
    description: 'Reach inboxes, web feeds, and social channels from a single publish action.',
  },
]

export function Solution() {
  return (
    <section className="py-32 md:py-44 border-t border-border/30 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.p
          {...fadeUp(0)}
          className="text-xs tracking-[3px] uppercase text-muted-foreground mb-4"
        >
          SOLUTION
        </motion.p>

        <motion.h2
          {...fadeUp(0.1)}
          className="text-4xl md:text-6xl font-medium tracking-[-1.5px] text-foreground mb-16 leading-[1.1]"
        >
          The platform for{' '}
          <span className="font-serif italic font-normal">meaningful</span>
          {' '}content
        </motion.h2>

        {/* Wide video */}
        <motion.div {...fadeUp(0.2)} className="mb-16">
          <video
            className="w-full rounded-2xl aspect-[3/1] object-cover"
            src={VIDEO_URL}
            autoPlay
            muted
            loop
            playsInline
          />
        </motion.div>

        {/* Feature grid */}
        <div className="grid md:grid-cols-4 gap-8">
          {FEATURES.map(({ title, description }, i) => (
            <motion.div key={title} {...fadeUp(0.1 * i)}>
              <p className="font-semibold text-base text-foreground mb-2">{title}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
