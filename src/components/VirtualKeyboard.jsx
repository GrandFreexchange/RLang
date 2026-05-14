import React from 'react';

const layout = [
  ['й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ'],
  ['ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э'],
  ['я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю']
];

export default function VirtualKeyboard({ onKeyPress }) {
  return (
    <div style={{ background: 'var(--surface-2)', padding: '1rem', borderRadius: 'var(--radius-md)', marginTop: '0.5rem' }}>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Virtual Cyrillic Keyboard
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {layout.map((row, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'center', gap: '0.25rem' }}>
            {row.map(key => (
              <button
                key={key}
                type="button"
                onClick={() => onKeyPress(key)}
                style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  background: 'var(--surface-1)',
                  border: '1px solid var(--card-border)',
                  color: 'white',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '1rem',
                  fontFamily: 'Playfair Display',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'var(--accent-primary)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'var(--surface-1)'}
              >
                {key}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
