import React, { createContext, useContext, useState } from 'react'

const AccessibilityContext = createContext()

export function useAccessibility() {
  return useContext(AccessibilityContext)
}

export function AccessibilityProvider({ children }) {
  const [spanish, setSpanish] = useState(false)
  const [screenReader, setScreenReader] = useState(false)
  const [magnifier, setMagnifier] = useState(false)

  return (
    <AccessibilityContext.Provider value={{
      spanish,
      setSpanish,
      screenReader,
      setScreenReader,
      magnifier,
      setMagnifier
    }}>
      {children}
    </AccessibilityContext.Provider>
  )
}
