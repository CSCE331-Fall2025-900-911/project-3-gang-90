import React, { createContext, useContext, useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const AccessibilityContext = createContext()

export function useAccessibility() {
  return useContext(AccessibilityContext)
}

export function AccessibilityProvider({ children }) {
    const location = useLocation()
  const [spanish, setSpanish] = useState(false)
  const [screenReader, setScreenReader] = useState(false)
  const [magnifier, setMagnifier] = useState(false)

  const [readerActive, setReaderActive] = useState(false)
  const [currentOption, setCurrentOption] = useState(0)
  const selectableRefs = useRef([])
  const selectableLabels = useRef([])

  useEffect(() => {
    function detectSelectables() {
      const elements = Array.from(document.querySelectorAll(
        'button, [role="button"], input:not([type="hidden"]), select, a[href], [tabindex]:not([tabindex="-1"])'
      ))
      selectableRefs.current = elements
      function getDeepestText(node) {
        if (!node) return ''
        if (node.nodeType === Node.TEXT_NODE) return node.textContent.trim()
        let text = ''
        node.childNodes.forEach(child => {
          text += getDeepestText(child) + ' '
        })
        return text.trim()
      }
      selectableLabels.current = elements.map(el => {
        if (el.getAttribute('aria-label')) return el.getAttribute('aria-label')
        if (el.getAttribute('alt')) return el.getAttribute('alt')
        const deepText = getDeepestText(el)
        if (deepText.length > 0) return deepText
        if (el.value && el.value.trim().length > 0) return el.value.trim()
        if (el.getAttribute('title')) return el.getAttribute('title')
        return 'Option'
      })
    }
    detectSelectables()
    const observer = new window.MutationObserver(() => {
      detectSelectables()
    })
    observer.observe(document.body, { childList: true, subtree: true })
    return () => {
      observer.disconnect()
    }
  }, [location])

  function speak(text) {
    window.speechSynthesis.cancel()
    const utter = new window.SpeechSynthesisUtterance(text)
    window.speechSynthesis.speak(utter)
  }

  useEffect(() => {
    if (!readerActive) return
    const ref = selectableRefs.current[currentOption]
    const label = selectableLabels.current[currentOption]
    selectableRefs.current.forEach((el, idx) => {
      if (el) {
        if (idx === currentOption) {
          el.disabled = false
          el.tabIndex = 0
          el.style.outline = '2px solid #1976d2'
        } else {
          el.disabled = true
          el.tabIndex = -1
          el.style.outline = ''
        }
      }
    })
    if (ref) {
      ref.focus()
      speak(label)
    }
  }, [readerActive, currentOption])

  useEffect(() => {
    if (!readerActive) return
    let pressTimer = null
    const handleClick = (e) => {
      if (pressTimer) return
      let next = currentOption + 1
      if (next >= selectableRefs.current.length) next = 0
      setCurrentOption(next)
    }
    const handleMouseDown = (e) => {
      pressTimer = setTimeout(() => {
        const ref = selectableRefs.current[currentOption]
        if (ref) ref.click()
        pressTimer = null
      }, 1000)
    }
    const handleMouseUp = (e) => {
      if (pressTimer) {
        clearTimeout(pressTimer)
        pressTimer = null
      }
    }
    window.addEventListener('click', handleClick, true)
    window.addEventListener('mousedown', handleMouseDown, true)
    window.addEventListener('mouseup', handleMouseUp, true)
    return () => {
      window.removeEventListener('click', handleClick, true)
      window.removeEventListener('mousedown', handleMouseDown, true)
      window.removeEventListener('mouseup', handleMouseUp, true)
    }
  }, [readerActive, currentOption])

  useEffect(() => {
    setReaderActive(screenReader)
    if (!screenReader) {
      window.speechSynthesis.cancel()
    } else {
      setCurrentOption(0)
    }
  }, [screenReader])

  return (
    <AccessibilityContext.Provider value={{
      spanish,
      setSpanish,
      screenReader,
      setScreenReader,
      magnifier,
      setMagnifier,
      readerActive,
      currentOption,
      selectableRefs,
      selectableLabels,
      setCurrentOption,
      setReaderActive
    }}>
      {children}
    </AccessibilityContext.Provider>
  )
}