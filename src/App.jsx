import { useEffect } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import Backdrop from './components/Backdrop'
import Cursor from './components/Cursor'
import FloatingDock from './components/FloatingDock'
import Navbar from './components/Navbar'
import OfferPopup from './components/OfferPopup'
import ScrollStage from './components/ScrollStage'
import ScrollProgress from './components/ScrollProgress'

import About from './sections/About'
import Contact from './sections/Contact'
import Footer from './sections/Footer'
import Hero from './sections/Hero'
import Industries from './sections/Industries'
import Process from './sections/Process'
import Reviews from './sections/Reviews'
import Services from './sections/Services'
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

  /* No curtain any more: the page is live immediately, so the hero's entrance
     starts on mount and the triggers are measured once layout has settled. */
  useEffect(() => {
    setLoaded(true)
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 160)
    return () => window.clearTimeout(id)
  }, [setLoaded])

  return (
    <>

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
        {/* <OrbitBanner /> is kept in src/sections, currently switched off */}
        {/* each scene fades in on arrival and back out on exit */}
        <ScrollStage>
          <About />
          <Industries />
        </ScrollStage>
        <ScrollStage>
          <Services />
        </ScrollStage>
        <ScrollStage>
          <Process />
        </ScrollStage>
        <ScrollStage>
          <Work />
        </ScrollStage>
        <ScrollStage>
          <Reviews />
        </ScrollStage>
        <ScrollStage>
          <Contact />
        </ScrollStage>
      </main>

      <Footer />
      <FloatingDock />
      <OfferPopup />
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
