import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { SearchChanged } from './components/SearchChanged'
import { Mission } from './components/Mission'
import { Solution } from './components/Solution'
import { CTASection } from './components/CTASection'
import { Footer } from './components/Footer'

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <Hero />
      <SearchChanged />
      <Mission />
      <Solution />
      <CTASection />
      <Footer />
    </div>
  )
}
