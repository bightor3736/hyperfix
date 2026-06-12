import { useState } from 'react'
import {
  Twitter,
  Circle,
  Instagram,
  Linkedin,
} from 'lucide-react'

// ─── Constants ───────────────────────────────────────────────────────────────

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260602_150901_c45b90ec-18d7-42ff-90e2-b95d7109e330.mp4'

const SERVICES = [
  'Website',
  'Mobile App',
  'Web App',
  'E-Commerce',
  'Visual Identity',
  '3D & Motion',
  'Digital Marketing',
  'Growth & Consulting',
  'Other',
]

// ─── Logo ─────────────────────────────────────────────────────────────────────

function Logo() {
  return (
    <svg
      width={32}
      height={32}
      viewBox="0 0 256 256"
      fill="none"
      aria-label="Forma"
    >
      <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z" fill="black" />
      <path d="M 256 128 L 128 128 L 0 0 L 128 0 Z" fill="black" />
    </svg>
  )
}

// ─── SocialBtn ────────────────────────────────────────────────────────────────

type SocialBtnProps = {
  href: string
  bg: string
  color: string
  icon: React.ReactNode
  label: string
}

function SocialBtn({ href, bg, color, icon, label }: SocialBtnProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={`w-8 h-8 rounded-xl flex items-center justify-center hover:opacity-80 transition-opacity ${bg} ${color}`}
    >
      {icon}
    </a>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [selected, setSelected] = useState<string[]>([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  function toggleService(s: string) {
    setSelected((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    await new Promise((r) => setTimeout(r, 1000))
    setSending(false)
    setSent(true)
  }

  const inputClass =
    'flex-1 min-w-0 text-sm px-3 py-2.5 rounded-xl border border-gray-200 bg-transparent placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition'

  return (
    <div className="min-h-screen bg-white p-3 sm:p-4 md:p-6">
      {/* Main card */}
      <div
        className="
          relative rounded-2xl sm:rounded-3xl overflow-hidden
          min-h-[calc(100vh-24px)] sm:min-h-[calc(100vh-32px)]
          md:min-h-[calc(100vh-48px)] lg:h-[calc(100vh-48px)]
        "
      >
        {/* Background video */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={VIDEO_URL}
          autoPlay
          muted
          loop
          playsInline
        />

        {/* Dark scrim for readability */}
        <div className="absolute inset-0 bg-black/30" />

        {/* Content */}
        <div
          className="
            relative z-10 flex flex-col
            min-h-[calc(100vh-24px)] sm:min-h-[calc(100vh-32px)]
            md:min-h-[calc(100vh-48px)] lg:h-full
            p-4 sm:p-6 md:p-8 gap-6
          "
        >
          {/* ── Navbar ── */}
          <nav className="flex items-center gap-3 sm:gap-6 bg-white/60 backdrop-blur-md rounded-2xl shadow-sm pl-3 sm:pl-4 pr-2 py-2 w-full sm:w-auto self-start">
            <Logo />

            {/* Links — hidden on mobile */}
            <div className="hidden sm:flex items-center gap-5">
              {['Our story', 'Expertise', 'Our work', 'Journal'].map((label) => (
                <a
                  key={label}
                  href="#"
                  className="text-gray-800 text-sm font-medium hover:opacity-60 transition-opacity whitespace-nowrap"
                >
                  {label}
                </a>
              ))}
            </div>

            {/* CTA */}
            <a
              href="#"
              className="ml-auto bg-black text-white text-sm font-medium px-4 sm:px-5 py-2 rounded-xl hover:bg-gray-800 transition-colors whitespace-nowrap"
            >
              Start a project
            </a>
          </nav>

          {/* ── Spacer ── */}
          <div className="flex-1 min-h-[2rem]" />

          {/* ── Bottom row ── */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            {/* Headline */}
            <p className="text-white text-3xl sm:text-4xl xl:text-5xl font-medium leading-tight drop-shadow-lg lg:max-w-lg xl:max-w-2xl shrink-0">
              We craft bold ideas
              <br />
              and ship them as{' '}
              <span
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontStyle: 'italic',
                  fontWeight: 400,
                }}
              >
                products
              </span>
            </p>

            {/* ── Contact form card ── */}
            <div className="w-full lg:w-[min(480px,45%)] shrink-0">
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden p-4 sm:p-6 flex flex-col gap-4">
                <h2 className="text-xl sm:text-2xl font-semibold text-black tracking-tight">
                  Say hello! 👋
                </h2>

                {/* Email + socials row */}
                <div className="flex flex-row items-center justify-between gap-3 bg-gray-50 rounded-2xl px-4 py-2.5">
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs text-gray-400 font-medium leading-none mb-0.5">
                      Drop us a line
                    </span>
                    <a
                      href="mailto:hello@forma.co"
                      className="text-blue-600 font-semibold text-sm hover:underline truncate"
                    >
                      hello@forma.co
                    </a>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <SocialBtn
                      href="#"
                      bg="bg-gray-100"
                      color="text-gray-800"
                      icon={<Twitter size={13} />}
                      label="Twitter"
                    />
                    <SocialBtn
                      href="#"
                      bg="bg-pink-100"
                      color="text-pink-500"
                      icon={<Circle size={13} />}
                      label="Threads"
                    />
                    <SocialBtn
                      href="#"
                      bg="bg-orange-100"
                      color="text-orange-400"
                      icon={<Instagram size={13} />}
                      label="Instagram"
                    />
                    <SocialBtn
                      href="#"
                      bg="bg-blue-100"
                      color="text-blue-600"
                      icon={<Linkedin size={13} />}
                      label="LinkedIn"
                    />
                  </div>
                </div>

                {/* OR divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-gray-400 font-medium text-sm">OR</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Form / Success state */}
                {sent ? (
                  <div className="flex flex-col items-center justify-center py-6 gap-3">
                    <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-xl">
                      ✓
                    </div>
                    <p className="text-base font-semibold text-gray-900">
                      You&apos;re all set!
                    </p>
                    <p className="text-sm text-gray-500">
                      Expect a reply within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                      <label className="text-sm font-medium text-black block mb-2">
                        Tell us about your vision
                      </label>

                      {/* Name + Email */}
                      <div className="flex flex-col sm:flex-row gap-2 mb-2">
                        <input
                          className={inputClass}
                          type="text"
                          placeholder="Full name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                        <input
                          className={inputClass}
                          type="email"
                          placeholder="Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>

                      {/* Textarea */}
                      <textarea
                        className={`${inputClass} w-full resize-none`}
                        rows={4}
                        placeholder="What are you looking to build or improve..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                      />
                    </div>

                    {/* Service tags */}
                    <div>
                      <p className="text-sm font-medium text-black mb-2">
                        I need help with...
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {SERVICES.map((s) => {
                          const active = selected.includes(s)
                          return (
                            <button
                              key={s}
                              type="button"
                              onClick={() => toggleService(s)}
                              className={`text-xs font-medium px-3 py-2 rounded-lg border transition-all ${
                                active
                                  ? 'bg-gray-100 text-black border-black'
                                  : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                              }`}
                            >
                              {s}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={sending}
                      className="w-full bg-black text-white text-sm font-semibold py-3 rounded-2xl hover:bg-gray-800 transition-colors disabled:opacity-60"
                    >
                      {sending ? 'Sending...' : 'Send my message'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
