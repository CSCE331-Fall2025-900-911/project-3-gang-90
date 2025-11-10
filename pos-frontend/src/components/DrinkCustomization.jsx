import React, { useState } from 'react'

export default function DrinkCustomization() {
  const [selectedIce, setSelectedIce] = useState('')
  const [selectedSweet, setSelectedSweet] = useState('')

  const iceOptions = ['No Ice', 'Light Ice', 'Regular Ice']
  const sweetOptions = ['0% Sweet', '50% Sweet', '100% Sweet']

  return (
    <div className="customize-panel-inner">
      <h2>Customize Your Drink</h2>
      <div className="customization">
        <h3>Ice Level</h3>
        <div className="customize-buttons">
          {iceOptions.map(option => (
            <button
              key={option}
              className={`customize-option${selectedIce === option ? ' selected' : ''}`}
              onClick={() => setSelectedIce(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      <div className="customization">
        <h3>Sweetness Level</h3>
        <div className="customize-buttons">
          {sweetOptions.map(option => (
            <button
              key={option}
              className={`customize-option${selectedSweet === option ? ' selected' : ''}`}
              onClick={() => setSelectedSweet(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
