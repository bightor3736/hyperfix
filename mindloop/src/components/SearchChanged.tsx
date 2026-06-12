import { motion } from 'framer-motion'

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.6, delay, ease: 'easeOut' },
})

function ChatGPTIcon() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx="40" cy="40" r="38" stroke="white" strokeWidth="1.5" strokeOpacity="0.3"/>
      <path d="M40 18C29 18 20 27 20 38C20 44 22.5 49.5 26.5 53.5M40 62C51 62 60 53 60 42C60 36 57.5 30.5 53.5 26.5M27 55C30 58 34 60 38 60.5M53 25C50 22 46 20 42 19.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.9"/>
      <path d="M40 28C34 28 29 33 29 39C29 42 30.2 44.8 32.2 46.8M40 52C46 52 51 47 51 41C51 38 49.8 35.2 47.8 33.2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.7"/>
      <circle cx="40" cy="40" r="4" fill="white" fillOpacity="0.9"/>
    </svg>
  )
}

function PerplexityIcon() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx="40" cy="40" r="38" stroke="white" strokeWidth="1.5" strokeOpacity="0.3"/>
      <path d="M40 16L48 32H64L52 42L56 58L40 48L24 58L28 42L16 32H32L40 16Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" strokeOpacity="0.9" fill="none"/>
      <path d="M40 24L45 34H55L47 40L50 50L40 44L30 50L33 40L25 34H35L40 24Z" fill="white" fillOpacity="0.15"/>
    </svg>
  )
}

function GoogleAIIcon() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx="40" cy="40" r="38" stroke="white" strokeWidth="1.5" strokeOpacity="0.3"/>
      <path d="M40 16C40 16 44 28 44 40C44 52 40 64 40 64C40 64 36 52 36 40C36 28 40 16 40 16Z" fill="white" fillOpacity="0.9"/>
      <path d="M16 40C16 40 28 36 40 36C52 36 64 40 64 40C64 40 52 44 40 44C28 44 16 40 16 40Z" fill="white" fillOpacity="0.9"/>
    </svg>
  )
}

const PLATFORMS = [
  {
    name: 'ChatGPT',
    icon: <ChatGPTIcon />,
    description: 'The conversational AI redefining how people search, write, and think.',
  },
  {
    name: 'Perplexity',
    icon: <PerplexityIcon />,
    description: 'Answer-first search that surfaces sourced, cited responses instantly.',
  },
  {
    name: 'Google AI',
    icon: <GoogleAIIcon />,
    description: "Google's deep integration of generative AI across its entire ecosystem.",
  },
]

export function SearchChanged() {
  return (
    <section className="text-center px-6 pt-52 md:pt-64 pb-6 md:pb-9">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          {...fadeUp(0)}
          className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-[-2px] text-foreground mb-6 leading-[1.05]"
        >
          Search has{' '}
          <span className="font-serif italic font-normal">changed.</span>
          {' '}Have you?
        </motion.h2>

        <motion.p
          {...fadeUp(0.1)}
          className="text-lg text-muted-foreground max-w-2xl mx-auto mb-24"
        >
          The way people find information has fundamentally shifted. AI-powered platforms now answer questions before users even finish typing.
        </motion.p>

        {/* Platform cards */}
        <div className="grid md:grid-cols-3 gap-12 md:gap-8 mb-20">
          {PLATFORMS.map(({ name, icon, description }, i) => (
            <motion.div
              key={name}
              {...fadeUp(0.1 * i)}
              className="flex flex-col items-center gap-4"
            >
              <div className="w-[200px] h-[200px] flex items-center justify-center rounded-2xl"
                style={{ background: 'hsl(var(--card))' }}>
                {icon}
              </div>
              <p className="font-semibold text-base text-foreground">{name}</p>
              <p className="text-sm text-muted-foreground max-w-[220px]">{description}</p>
            </motion.div>
          ))}
        </div>

        <motion.p {...fadeUp(0.3)} className="text-sm text-muted-foreground text-center">
          "If you don't answer the questions, someone else will."
        </motion.p>
      </div>
    </section>
  )
}
