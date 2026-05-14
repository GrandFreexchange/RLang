import React from 'react';
import { Plus } from 'lucide-react';

export default function Header({ decks, activeDeckId, onSelectDeck, onCreateDeck }) {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <div className="logo-icon">С</div>
          Slovo <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>| v2</span>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <select 
            className="input-field" 
            style={{ margin: 0, minWidth: '200px' }}
            value={activeDeckId || ''}
            onChange={(e) => onSelectDeck(e.target.value)}
          >
            {decks.map(deck => (
              <option key={deck.id} value={deck.id}>{deck.name}</option>
            ))}
          </select>
          <button className="btn btn-primary btn-icon" onClick={onCreateDeck} title="Create New Deck">
            <Plus size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
