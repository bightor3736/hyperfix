import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Hls from 'hls.js'

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.6, delay, ease: 'easeOut' },
})

const HLS_URL = 'https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8'

function ConcentricLogo() {
  return (
    <div className="relative flex items-center justify-center w-10 h-10 shrink-0">
      <div className="absolute w-10 h-10 rounded-full border-2 border-foreground/60" />
      <div className="w-5 h-5 rounded-full border border-foreground/60" />
    </div>
  )
}

export function CTASection() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (Hls.isSupported()) {
      const hls = new Hls({ autoStartLoad: true })
      hls.loadSource(HLS_URL)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {})
      })
      return () => hls.destroy()
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = HLS_URL
      video.play().catch(() => {})
    }
  }, [])

  return (
    <section className="relative py-32 md:py-44 border-t border-border/30 overflow-hidden">
      {/* HLS background video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover z-0"
        autoPlay
        muted
        loop
        playsInline
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-background/45 z-[1]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-2xl mx-auto">
        <motion.div {...fadeUp(0)} className="mb-8">
          <ConcentricLogo />
        </motion.div>

        <motion.h2
          {...fadeUp(0.1)}
          className="text-4xl md:text-6xl font-normal font-serif italic tracking-[-1px] text-foreground mb-4 leading-[1.1]"
        >
          Start Your Journey
        </motion.h2>

        <motion.p
          {...fadeUp(0.2)}
          className="text-base text-muted-foreground mb-10 max-w-md"
        >
          Join thousands of curious minds. Get the newsletter that makes you think twice about everything.
        </motion.p>

        <motion.div
          {...fadeUp(0.3)}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <a
            href="#"
            className="bg-foreground text-background text-sm font-semibold rounded-lg px-8 py-3.5 hover:bg-foreground/90 transition-colors"
          >
            Subscribe Now
          </a>
          <a
            href="#"
            className="liquid-glass text-foreground text-sm font-semibold rounded-lg px-8 py-3.5 hover:text-foreground/80 transition-colors"
          >
            Start Writing
          </a>
        </motion.div>
      </div>
    </section>
  )
}
