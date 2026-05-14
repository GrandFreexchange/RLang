import React from 'react';
import { Brain, Database, Activity, RotateCcw } from 'lucide-react';

export default function Sidebar({ mode, setMode, deck, onResetDeck }) {
  const stats = { 0: 0, 1: 0, 2: 0, 3: 0 };
  if (deck) {
    deck.cards.forEach(c => stats[c.level || 0]++);
  }
  const total = deck ? deck.cards.length : 0;
  const dueCount = stats[0] + stats[1] + stats[2];

  return (
    <aside className="sidebar">
      <div className="glass-panel" style={{ padding: '1rem' }}>
        <button 
          className={`nav-item ${mode === 'study' ? 'active' : ''}`}
          onClick={() => setMode('study')}
        >
          <Brain size={20} /> Learn & Review
          {dueCount > 0 && (
            <span style={{ marginLeft: 'auto', background: 'var(--accent-primary)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem' }}>
              {dueCount}
            </span>
          )}
        </button>
        <button 
          className={`nav-item ${mode === 'edit' ? 'active' : ''}`}
          onClick={() => setMode('edit')}
          style={{ marginTop: '0.5rem' }}
        >
          <Database size={20} /> Manage Deck
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={16} /> Deck Mastery
        </h3>

        {total === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Add cards to see stats.</p>
        ) : (
          <>
            <div style={{ width: '100%', height: '8px', background: 'var(--surface-2)', borderRadius: '4px', overflow: 'hidden', display: 'flex', marginBottom: '1.5rem' }}>
              <div style={{ width: `${(stats[3]/total)*100}%`, background: 'var(--accent-green)' }} title="Mastered"></div>
              <div style={{ width: `${(stats[2]/total)*100}%`, background: 'var(--accent-blue)' }} title="Reviewing"></div>
              <div style={{ width: `${(stats[1]/total)*100}%`, background: 'var(--accent-orange)' }} title="Learning"></div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <StatRow label="Mastered" count={stats[3]} color="var(--accent-green)" />
              <StatRow label="Reviewing" count={stats[2]} color="var(--accent-blue)" />
              <StatRow label="Learning" count={stats[1]} color="var(--accent-orange)" />
              <StatRow label="New" count={stats[0]} color="var(--text-muted)" />
            </div>

            <button 
              className="btn" 
              style={{ width: '100%', marginTop: '1.5rem', background: 'transparent', border: '1px solid var(--card-border)', color: 'var(--text-muted)' }}
              onClick={onResetDeck}
            >
              <RotateCcw size={16} /> Reset Progress
            </button>
          </>
        )}
      </div>
    </aside>
  );
}

function StatRow({ label, count, color }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: color }}></div>
        <span style={{ color: 'var(--text-muted)' }}>{label}</span>
      </div>
      <span style={{ fontWeight: 'bold' }}>{count}</span>
    </div>
  );
}
