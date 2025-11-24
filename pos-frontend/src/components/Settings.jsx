import React, { useState } from 'react'
import { useAccessibility } from './AccessibilityContext'
import { useNavigate } from 'react-router-dom'

export default function Settings() {
  const navigate = useNavigate()
  const {
    spanish,
    setSpanish,
    screenReader,
    setScreenReader,
    magnifier,
    setMagnifier,
    readerActive,
    currentOption,
    registerSelectable,
    unregisterSelectable
  } = useAccessibility()

  const [showSpanishTip, setShowSpanishTip] = useState(false)
  const [showReaderTip, setShowReaderTip] = useState(false)
  const [showMagnifierTip, setShowMagnifierTip] = useState(false)

  async function handleSpanishToggle() {
    setSpanish(v => !v)
    if (!spanish) {
      const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
      let node
      while ((node = walk.nextNode())) {
        const text = node.nodeValue.trim()
        if (text.length > 0) {
          try {
            const res = await fetch("https://de.libretranslate.com/translate", {
              method: "POST",
              body: JSON.stringify({
                q: text,
                source: "en",
                target: "es",
                format: "text",
                alternatives: 3,
                api_key: ""
              }),
              headers: { "Content-Type": "application/json" }
            })
            if (!res.ok) throw new Error('API error')
            const data = await res.json()
            node.nodeValue = data.translatedText || text + " (ES)"
          } catch (err) {
            node.nodeValue = text + " (ES)"
          }
        }
      }
    } else {
      window.location.reload()
    }
  }

  function speak(text) {
    window.speechSynthesis.cancel()
    const utter = new window.SpeechSynthesisUtterance(text)
    window.speechSynthesis.speak(utter)
  }

  function handleScreenReaderToggle() {
    setScreenReader(v => !v)
    if (!screenReader) {
      setReaderActive(true)
      setCurrentOption(0)
      setTimeout(() => {
        speak(selectableLabels[0])
        selectableRefs[0]?.focus()
      }, 300)
    } else {
      setReaderActive(false)
      window.speechSynthesis.cancel()
    }
  }

  function handleReaderClick() {
    if (!readerActive) return
    let next = currentOption + 1
    if (next >= selectableLabels.length) next = 0
    setCurrentOption(next)
    speak(selectableLabels[next])
    selectableRefs[next]?.focus()
  }

  function handleReaderDoubleClick() {
    if (!readerActive) return
    selectableRefs[currentOption]?.click()
  }

  function handleMagnifierToggle() {
    setMagnifier(v => !v)
    if (!magnifier) {
      const allElements = document.querySelectorAll('*')
      allElements.forEach(el => {
        const computed = window.getComputedStyle(el)
        const fontSize = computed.fontSize
        if (fontSize) {
          const sizeNum = parseFloat(fontSize)
          const sizeUnit = fontSize.replace(sizeNum, '').trim()
          if (['px', 'rem', 'em'].includes(sizeUnit)) {
            let newSize
            if (sizeUnit === 'px') {
              newSize = (sizeNum + 4) + 'px'
            } else {
              newSize = (sizeNum + 0.2) + sizeUnit
            }
            el.style.fontSize = newSize
          }
        }
      })
    }
    else {
      const allElements = document.querySelectorAll('*')
      allElements.forEach(el => {
        el.style.fontSize = ''
      })
    }
  }

  const infoButton = (toggleFn) => (
    <button
      onClick={toggleFn}
      style={{
        marginLeft: 8,
        background: '#1976d2',
        color: 'white',
        borderRadius: '50%',
        width: 24,
        height: 24,
        cursor: 'pointer',
        fontSize: '1rem',
        lineHeight: '24px',
        textAlign: 'center'
      }}
    >i</button>
  )

  const tooltip = (text) => (
    <div style={{
      background: 'white',
      padding: '12px 16px',
      marginTop: 8,
      borderRadius: 8,
      fontSize: '1rem'
    }}>{text}</div>
  )

  return (
    <div className="regular-container"
      tabIndex={-1}
      style={readerActive ? {outline:'2px solid #1976d2'} : {}}
    >
      <div className="top-bar">
        <h1>Settings</h1>
        <div className="time">5:00 PM</div>
      </div>

      <div style={{maxWidth:500, margin:'40px auto', background:'#e0e0e0', borderRadius:16, padding:32}}>
        <h2 style={{marginBottom:24}}>Accessibility Features</h2>

        <div style={{marginBottom:24}}>
          <label style={{fontSize:'1.3rem'}}>
            <input alt="Spanish Translation"
              type="checkbox"
              checked={spanish}
              onChange={handleSpanishToggle}
            />
            Translate page to Spanish
          </label>
          {infoButton(() => setShowSpanishTip(v => !v))}
          {showSpanishTip && tooltip('Automatically translates all visible page text into Spanish.')}
        </div>

        <div style={{marginBottom:24}}>
          <label style={{fontSize:'1.3rem'}}>
            <input alt="Screen Reader"
              type="checkbox"
              checked={screenReader}
              onChange={handleScreenReaderToggle}
            />
            Screen Reader (read text aloud)
          </label>
          {infoButton(() => setShowReaderTip(v => !v))}
          {showReaderTip && tooltip('Reads all visible text on the page out loud for accessibility.')}
        </div>

        <div style={{marginBottom:24}} >
          <label style={{fontSize:'1.3rem'}}>
            <input alt="Screen Magnifier"
              type="checkbox"
              checked={magnifier}
              onChange={handleMagnifierToggle}
            />
            Screen Magnifier (larger text)
          </label>
          {infoButton(() => setShowMagnifierTip(v => !v))}
          {showMagnifierTip && tooltip('Increases the size of all text on the screen for improved readability.')}
        </div>

        <button
          className="bottom-button"
          style={{marginTop:32, width:'100%'}}
          onClick={() => navigate('/')}
        >Back to Home</button>
      </div>
    </div>
  )
}