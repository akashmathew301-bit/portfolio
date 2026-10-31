import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { scrollToId } from '../lib/smoothScroll'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [selectedService, setSelectedService] = useState('')
  const [loaded, setLoaded] = useState(false)

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
    () => ({ selectedService, setSelectedService, requestService, loaded, setLoaded }),
    [selectedService, requestService, loaded],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>')
  return ctx
}
