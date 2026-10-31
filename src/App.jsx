import { useEffect } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import Backdrop from './components/Backdrop'
import Cursor from './components/Cursor'
import FloatingWhatsApp from './components/FloatingWhatsApp'
import Navbar from './components/Navbar'
import Preloader from './components/Preloader'
import ScrollProgress from './components/ScrollProgress'

import About from './sections/About'
import Contact from './sections/Contact'
import Footer from './sections/Footer'
import Hero from './sections/Hero'
import Process from './sections/Process'
import Reviews from './sections/Reviews'
import Services from './sections/Services'
import ServicesMarquee from './sections/ServicesMarquee'
import Work from './sections/Work'

import { AppProvider, useApp } from './context/AppContext'
import useReducedMotion from './hooks/useReducedMotion'
import { destroySmoothScroll, initSmoothScroll } from './lib/smoothScroll'

function Site() {
  const { setLoaded } = useApp()
  const reduced = useReducedMotion()

  useEffect(() => {
    initSmoothScroll({ reducedMotion: reduced })
    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill())
      destroySmoothScroll()
    }
  }, [reduced])

  const handleLoaded = () => {
    setLoaded(true)
    // Positions settle once the curtain is gone — re-measure every trigger.
    window.setTimeout(() => ScrollTrigger.refresh(), 120)
  }

  return (
    <>
      <Preloader onComplete={handleLoaded} />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300] focus:rounded-full focus:bg-blue-main focus:px-5 focus:py-3 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>

      <ScrollProgress />
      <Cursor />
      <Backdrop />
      <Navbar />

      <main id="main">
        <Hero />
        <ServicesMarquee />
        <About />
        <Services />
        <Process />
        <Work />
        <Reviews />
        <Contact />
      </main>

      <Footer />
      <FloatingWhatsApp />
    </>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Site />
    </AppProvider>
  )
}
