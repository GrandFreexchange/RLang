import React from 'react';
import { Volume2, MousePointerClick } from 'lucide-react';
import { motion, useAnimation } from 'framer-motion';

export default function Flashcard({ card, isFlipped, onFlip, remaining, onGrade }) {
  const isNew = (card.level || 0) === 0;
  const levelLabel = isNew ? 'New Card' : ['Learning', 'Reviewing', 'Mastered'][card.level - 1];
  
  const getLevelColor = () => {
    if (isNew) return '#94A3B8';
    if (card.level === 1) return 'var(--accent-orange)';
    if (card.level === 2) return 'var(--accent-blue)';
    return 'var(--accent-green)';
  };

  const speakRussian = (e, text) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ru-RU';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Swiping logic
  const handleDragEnd = (event, info) => {
    if (!isFlipped) return;
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) {
      onGrade(1); // Swipe left = Again
    } else if (info.offset.x > swipeThreshold) {
      onGrade(3); // Swipe right = Easy
    } else if (info.offset.y < -swipeThreshold) {
      onGrade(2); // Swipe up = Good
    }
  };

  return (
    <div className="flashcard-container animate-fade-in">
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', padding: '0 0.5rem' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          {remaining} cards remaining
        </span>
        <span style={{ fontSize: '0.625rem', fontWeight: 'bold', textTransform: 'uppercase', padding: '0.25rem 0.75rem', borderRadius: '1rem', background: 'rgba(255,255,255,0.1)', color: getLevelColor() }}>
          {levelLabel}
        </span>
      </div>

      <div className="perspective">
        <motion.div 
          className={`flip-card ${isFlipped ? 'flipped' : ''}`}
          onClick={!isFlipped ? onFlip : undefined}
          drag={isFlipped ? true : false}
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          onDragEnd={handleDragEnd}
        >
          <div className="flip-card-face flip-card-front">
            <button 
              className="btn-icon" 
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'var(--surface-2)', border: '1px solid var(--card-border)', color: 'var(--text-main)' }}
              onClick={(e) => speakRussian(e, card.ru)}
            >
              <Volume2 size={24} />
            </button>
            <h2 className="russian-text font-serif">{card.ru}</h2>
            {card.context && <p className="context-text">"{card.context}"</p>}
            
            <div className="action-label">
              <MousePointerClick size={20} />
              <span>Reveal Answer</span>
            </div>
          </div>

          <div className="flip-card-face flip-card-back">
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.25rem 1rem', borderRadius: '1rem' }}>
              Translation
            </span>
            <h2 className="english-text">{card.en}</h2>
            
            {/* Swipe hint */}
            <div style={{ position: 'absolute', bottom: '1rem', width: '100%', display: 'flex', justifyContent: 'space-around', fontSize: '0.75rem', color: 'var(--text-muted)', opacity: 0.5 }}>
              <span>← Again</span>
              <span>Good ↑</span>
              <span>Easy →</span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className={`grading-controls ${isFlipped ? 'visible' : ''}`}>
        <button className="grade-btn grade-again" onClick={() => onGrade(1)}>
          <span style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>🤔</span>
          Again
          <span>Press 1</span>
        </button>
        <button className="grade-btn grade-good" onClick={() => onGrade(2)}>
          <span style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>👍</span>
          Good
          <span>Press 2</span>
        </button>
        <button className="grade-btn grade-easy" onClick={() => onGrade(3)}>
          <span style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>🎉</span>
          Easy
          <span>Press 3</span>
        </button>
      </div>
    </div>
  );
}
