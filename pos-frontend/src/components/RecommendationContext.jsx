import React, { createContext, useContext, useState } from 'react'

let server = import.meta.env.VITE_SERVER;

const RecommendationContext = createContext();

export function useRecommendation() {
  return useContext(RecommendationContext);
}

export function RecommendationProvider({ children }) {
  const [suggestions, setSuggestions] = useState([]);
  const [visible, setVisible] = useState(false);

  async function fetchRecommendations(name, category, limit = 3) {
    if (!name || !category) return;
    try {
      const res = await fetch(`${server}/api/menu/recommendations/${encodeURIComponent(name)}/${encodeURIComponent(category)}/${limit}`);
      if (!res.ok) {
        setSuggestions([]);
        setVisible(false);
        return;
      }
      const data = await res.json();
      const filtered = Array.isArray(data)
        ? data.filter(r => (r.item_name ?? r.name) !== name)
        : [];

      const uniqueById = [];
      const seen = new Set();
      for (const r of filtered) {
        const id = r.item_id ?? r.id;
        if (id != null && !seen.has(id)) {
          uniqueById.push(r);
          seen.add(id);
        }
        if (uniqueById.length >= limit) break;
      }

      setSuggestions(uniqueById);
      setVisible(uniqueById.length > 0);
    } catch (e) {
      setSuggestions([]);
      setVisible(false);
    }
  }

  function hideRecommendations() {
    setVisible(false);
  }

  return (
    <RecommendationContext.Provider value={{ suggestions, visible, fetchRecommendations, hideRecommendations }}>
      {children}
    </RecommendationContext.Provider>
  );
}
