import { useRef } from 'react'
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion'

const VIDEO_URL = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_132944_a0d124bb-eaa1-4082-aa30-2310efb42b4b.mp4'

const PARA1 = "We're building a space where curiosity meets clarity — where readers find depth, writers find reach, and every newsletter becomes a conversation worth having."
const PARA2 = "A platform where content, community, and insight flow together — with less noise, less friction, and more meaning for everyone involved."
const HIGHLIGHTED = new Set(['curiosity', 'meets', 'clarity'])

function Word({
  word,
  progress,
  start,
  end,
  highlighted,
}: {
  word: string
  progress: MotionValue<number>
  start: number
  end: number
  highlighted: boolean
}) {
  const opacity = useTransform(progress, [start, end], [0.15, 1])
  const clean = word.replace(/[^a-zA-Z]/g, '').toLowerCase()
  const color = highlighted && HIGHLIGHTED.has(clean) ? 'hsl(var(--foreground))' : 'hsl(var(--hero-subtitle))'
  return (
    <motion.span style={{ opacity, color }} className="inline">
      {word}{' '}
    </motion.span>
  )
}

function ScrollParagraph({
  text,
  className,
  highlighted = false,
}: {
  text: string
  className: string
  highlighted?: boolean
}) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.9', 'end 0.4'],
  })
  const words = text.split(' ')
  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => {
        const start = i / words.length
        const end = Math.min((i + 2) / words.length, 1)
        return (
          <Word
            key={i}
            word={word}
            progress={scrollYProgress}
            start={start}
            end={end}
            highlighted={highlighted}
          />
        )
      })}
    </p>
  )
}

export function Mission() {
  return (
    <section className="pt-0 pb-32 md:pb-44 px-6">
      <div className="max-w-4xl mx-auto text-center">
        {/* Mission video */}
        <div className="flex justify-center mb-24">
          <video
            className="w-full max-w-[800px] aspect-square object-cover rounded-2xl"
            src={VIDEO_URL}
            autoPlay
            muted
            loop
            playsInline
          />
        </div>

        <ScrollParagraph
          text={PARA1}
          className="text-2xl md:text-4xl lg:text-5xl font-medium tracking-[-1px] leading-[1.3]"
          highlighted
        />
        <ScrollParagraph
          text={PARA2}
          className="text-xl md:text-2xl lg:text-3xl font-medium mt-10 leading-[1.4]"
        />
      </div>
    </section>
  )
}
