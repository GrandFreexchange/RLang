import React, { useState } from 'react';
import { Trash2, Keyboard } from 'lucide-react';
import VirtualKeyboard from './VirtualKeyboard';

export default function DeckManager({ deck, onAddCard, onDeleteCard }) {
  const [ru, setRu] = useState('');
  const [en, setEn] = useState('');
  const [context, setContext] = useState('');
  const [showKeyboard, setShowKeyboard] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!ru.trim() || !en.trim()) return;
    onAddCard({ ru: ru.trim(), en: en.trim(), context: context.trim(), level: 0 });
    setRu('');
    setEn('');
    setContext('');
  };

  const handleKeyPress = (char) => {
    setRu(prev => prev + char);
  };

  const getLevelColor = (level) => {
    if (level === 3) return 'var(--accent-green)';
    if (level === 2) return 'var(--accent-blue)';
    if (level === 1) return 'var(--accent-orange)';
    return 'var(--text-muted)';
  };

  if (!deck) return null;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontFamily: 'Playfair Display' }}>Add New Flashcard</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 'bold' }}>Russian Phrase</label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input 
                type="text" 
                className="input-field" 
                style={{ margin: 0 }}
                value={ru} 
                onChange={e => setRu(e.target.value)} 
                placeholder="e.g., Спасибо"
              />
              <button 
                type="button" 
                className="btn-icon" 
                style={{ background: showKeyboard ? 'var(--accent-primary)' : 'var(--surface-2)', color: 'white', border: 'none', height: '42px', width: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-sm)' }}
                onClick={() => setShowKeyboard(!showKeyboard)}
                title="Toggle Virtual Keyboard"
              >
                <Keyboard size={20} />
              </button>
            </div>
            {showKeyboard && <VirtualKeyboard onKeyPress={handleKeyPress} />}
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 'bold' }}>English Translation</label>
            <input 
              type="text" 
              className="input-field" 
              style={{ margin: 0 }}
              value={en} 
              onChange={e => setEn(e.target.value)} 
              placeholder="e.g., Thank you"
            />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 'bold' }}>Context / Usage (Optional)</label>
            <input 
              type="text" 
              className="input-field" 
              style={{ margin: 0 }}
              value={context} 
              onChange={e => setContext(e.target.value)} 
              placeholder="e.g., Used to express gratitude"
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }} disabled={!ru.trim() || !en.trim()}>
            Add to {deck.name}
          </button>
        </form>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>Cards in Deck ({deck.cards.length})</h3>
        {deck.cards.map((card, idx) => (
          <div key={idx} className="card-list-item">
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: getLevelColor(card.level || 0) }}></div>
            
            <div style={{ flex: 1, paddingLeft: '1rem' }}>
              <div style={{ fontSize: '1.25rem', fontFamily: 'Playfair Display', color: 'white', marginBottom: '0.25rem' }}>{card.ru}</div>
              {card.context && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '0.25rem' }}>{card.context}</div>}
              <div style={{ fontSize: '0.875rem', color: 'var(--accent-blue)' }}>{card.en}</div>
            </div>

            <button 
              className="btn-icon" 
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              onClick={() => onDeleteCard(idx)}
              onMouseOver={e => e.currentTarget.style.color = 'var(--accent-primary)'}
              onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
