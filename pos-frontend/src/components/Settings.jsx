import React from 'react'
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
    setMagnifier
  } = useAccessibility()

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

  function handleScreenReaderToggle() {
    setScreenReader(v => !v)
    if (!screenReader) {
      const utter = new window.SpeechSynthesisUtterance(document.body.innerText)
      window.speechSynthesis.speak(utter)
    }
    else {
      window.speechSynthesis.cancel()
    }
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

  return (
    <div className="regular-container">
      <div className="top-bar">
        <h1>Settings</h1>
        <div className="time">5:00 PM</div>

      </div>
      <div style={{maxWidth:500, margin:'40px auto', background:'#e0e0e0', borderRadius:16, padding:32}}>
        <h2 style={{marginBottom:24}}>Accessibility Features</h2>
        <div style={{marginBottom:24}}>
          <label style={{fontSize:'1.3rem'}}>
            <input type="checkbox" checked={spanish} onChange={handleSpanishToggle} />
            Translate page to Spanish
          </label>
        </div>
        <div style={{marginBottom:24}}>
          <label style={{fontSize:'1.3rem'}}>
            <input type="checkbox" checked={screenReader} onChange={handleScreenReaderToggle} />
            Screen Reader (read text aloud)
          </label>
        </div>
        <div style={{marginBottom:24}}>
          <label style={{fontSize:'1.3rem'}}>
            <input type="checkbox" checked={magnifier} onChange={handleMagnifierToggle} />
            Screen Magnifier (larger text)
          </label>
        </div>
        <button className="bottom-button" style={{marginTop:32, width:'100%'}} onClick={() => navigate('/')}>Back to Home</button>
      </div>
    </div>
  )
}
