import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
let server = import.meta.env.VITE_SERVER;

function groupByCategory(items) {
  const grouped = {};
  for (const item of items) {
    if (!grouped[item.category]) grouped[item.category] = [];
    grouped[item.category].push(item);
  }
  return grouped;
}

export default function MenuBoard() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function fetchMenu() {
      try {
        const res = await fetch(server + '/api/menu/');
        const data = await res.json();
        const toTitle = (str = "") =>
          str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
        const items = Array.isArray(data)
          ? data.filter(i => i.stat).map(i => ({
              ...i,
              item_name: toTitle(i.name),
              price: Number(i.price),
              category: i.category || 'Other',
            }))
          : [];
        setItems(items);
      } catch (err) {
        setItems([]);
      }
    }
    fetchMenu();
  }, []);

  const grouped = groupByCategory(items);

  return (
    <main style={{ background: '#e0e0e0', minHeight: '100vh', width: '100vw', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
      <div className="top-bar" style={{ width: '100%', marginBottom: 0 }}>
        <h1 style={{ fontSize: '2rem', letterSpacing: 1 }}>Menu Board</h1>
        <div className="time" style={{ fontSize: '1rem' }}>5:00 PM</div>
      </div>
      <div style={{
        width: '100vw',
        maxWidth: 1800,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'stretch',
        gap: 32,
        padding: '24px 16px 0 16px',
        flex: 1,
        height: 'calc(100vh - 110px)',
        boxSizing: 'border-box',
      }}>
        {Object.keys(grouped).length === 0 ? (
          <div style={{ textAlign: 'center', fontSize: '2.5em', color: '#555', marginTop: 80, width: '100%' }}>No items available.</div>
        ) : (
          Object.entries(grouped).map(([category, items]) => (
            <section key={category} style={{
              flex: 1,
              minWidth: 180,
              background: '#fff',
              borderRadius: 18,
              boxShadow: '0 2px 16px #bbb',
              padding: '12px 8px 8px 8px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              maxHeight: 'calc(100vh - 170px)',
              overflow: 'hidden',
            }}>
              <h2 style={{ fontSize: '2rem', color: '#3a3a3a', borderBottom: '2px solid #929292', marginBottom: 8, paddingBottom: 2, width: '100%', textAlign: 'center', letterSpacing: 0.5 }}>{category}</h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, width: '100%' }}>
                {items.map(item => (
                  <li key={item.item_id || item.id} style={{
                    fontSize: '1.15rem',
                    color: '#222',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px',
                    borderBottom: '1px solid #e0e0e0',
                    fontWeight: 500,
                  }}>
                    <span style={{ flex: 1, textAlign: 'left', paddingRight: 8 }}>{item.item_name}</span>
                    <span style={{ color: '#2a7b2a', fontWeight: 800, fontSize: '1.15rem', minWidth: 50, textAlign: 'right' }}>${item.price.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}
      </div>
      <div style={{ position: 'absolute', left: 32, bottom: 32 }}>
        <Link to="/" style={{
          display: 'inline-block',
          background: '#929292',
          color: '#fff',
          fontSize: '1rem',
          borderRadius: 10,
          padding: '10px 24px',
          textDecoration: 'none',
          fontWeight: 600,
          boxShadow: '0 2px 8px #bbb',
        }}>⬅ Back</Link>
      </div>
    </main>
  );
}
