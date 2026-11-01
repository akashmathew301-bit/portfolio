import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { scrollToId } from '../lib/smoothScroll'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [selectedService, setSelectedService] = useState('')
  const [loaded, setLoaded] = useState(false)
  /* Set while a dropdown is open over the page. The floating dock is fixed
     and sits above everything, and a dropdown cannot out-stack it: ScrollStage
     animates opacity, and a fractional opacity opens a stacking context that
     traps every z-index inside the section. So the dock stands down instead. */
  const [overlayOpen, setOverlayOpen] = useState(false)

  /** Called by service cards: pre-select the service, then jump to the form. */
  const requestService = useCallback((title) => {
    setSelectedService(title)
    scrollToId('contact', -40)
    window.setTimeout(() => {
      const input = document.getElementById('field-name')
      if (input) input.focus({ preventScroll: true })
    }, 1100)
  }, [])

  const value = useMemo(
    () => ({
      selectedService,
      setSelectedService,
      requestService,
      loaded,
      setLoaded,
      overlayOpen,
      setOverlayOpen,
    }),
    [selectedService, requestService, loaded, overlayOpen],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>')
  return ctx
}
