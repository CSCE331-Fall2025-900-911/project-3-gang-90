import React, { useState } from 'react'

export default function DrinkCustomization({ mods, setMods }) {
  // mods: array of "Category:Value" strings
  function handleSelect(category, value, multi = false) {
    const key = `${category}:${value}`;
    if (multi) {
      if (mods.includes(key)) {
        setMods(mods.filter(m => m !== key));
      } else {
        setMods([...mods, key]);
      }
    } else {
      setMods([...mods.filter(m => !m.startsWith(category + ':')), key]);
    }
  }

  const sizeOptions = ['Small', 'Medium', 'Large'];
  const iceOptions = ['No Ice', 'Light Ice', 'Regular Ice'];
  const sweetOptions = ['0% Sweet', '50% Sweet', '100% Sweet'];
  const tempOptions = ['Normal', 'Hot'];
  const toppingOptions = ["Boba", "Honey Boba", "Lychee Jelly", "Coconut Jelly", "Pudding", "Ice Cream", "Oreo", "Mini Pearls", "Aiyu Jelly", "Crema", "Sub Crema", "Crystal Boba", "Mango Boba", "Strawberry Boba", "Coffee Jelly", "Honey Jelly", "Peach Boba", "Fresh Milk"];

  return (
    <div className="customize-panel-inner">
      <h2>Customize Your Drink</h2>
      <div className="customization">
        <h3>Size</h3>
        <div className="customize-buttons">
          {sizeOptions.map(option => (
            <button
              key={option}
              className={`customize-option${mods.includes(`Size:${option}`) ? ' selected' : ''}`}
              onClick={() => handleSelect('Size', option)}
            >
              {option}
              {option === 'Medium' && <span style={{ fontSize: '0.8em', color: '#2a7b2a', marginLeft: 4 }}>+0.50</span>}
              {option === 'Large' && <span style={{ fontSize: '0.8em', color: '#2a7b2a', marginLeft: 4 }}>+1.00</span>}
            </button>
          ))}
        </div>
      </div>
      <div className="customization">
        <h3>Ice Level</h3>
        <div className="customize-buttons">
          {iceOptions.map(option => (
            <button
              key={option}
              className={`customize-option${mods.includes(`Ice:${option}`) ? ' selected' : ''}`}
              onClick={() => handleSelect('Ice', option)}
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
              className={`customize-option${mods.includes(`Sweet:${option}`) ? ' selected' : ''}`}
              onClick={() => handleSelect('Sweet', option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      <div className="customization">
        <h3>Temperature</h3>
        <div className="customize-buttons">
          {tempOptions.map(option => (
            <button
              key={option}
              className={`customize-option${mods.includes(`Temp:${option}`) ? ' selected' : ''}`}
              onClick={() => handleSelect('Temp', option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      <div className="customization">
        <h3>Toppings</h3>
        <div className="customize-buttons">
          {toppingOptions.map(option => (
            <button
              key={option}
              style={{ fontSize: "1.2rem" }}
              className={`customize-option${mods.includes(`Toppings:${option}`) ? ' selected' : ''}`}
              onClick={() => handleSelect('Toppings', option, true)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}