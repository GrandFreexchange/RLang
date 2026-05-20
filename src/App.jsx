import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Flashcard from './components/Flashcard';
import DeckManager from './components/DeckManager';
import Modal from './components/Modal';
import Toast from './components/Toast';
import { loadDecks, saveDecks, getActiveDeckId, saveActiveDeckId } from './store';
import { BookPlus, RotateCcw } from 'lucide-react';

function App() {
  const [decks, setDecks] = useState([]);
  const [activeDeckId, setActiveDeckId] = useState(null);
  const [mode, setMode] = useState('study'); // 'study' or 'edit'
  
  const [studyQueue, setStudyQueue] = useState([]);
  const [currentCard, setCurrentCard] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionStats, setSessionStats] = useState({ reviewed: 0 });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const init = async () => {
      const loadedDecks = await loadDecks();
      setDecks(loadedDecks);
      const activeId = await getActiveDeckId(loadedDecks);
      setActiveDeckId(activeId);
    };
    init();
  }, []);

  const activeDeck = decks.find(d => d.id === activeDeckId) || decks[0];

  const addToast = (message, type = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // --- Study Logic ---
  const startStudySession = useCallback(() => {
    if (!activeDeck) return;
    
    let cardsToStudy = [...activeDeck.cards].filter(c => (c.level || 0) < 3);
    
    if (cardsToStudy.length === 0 && activeDeck.cards.length > 0) {
      cardsToStudy = [...activeDeck.cards].sort(() => Math.random() - 0.5).slice(0, 10);
      cardsToStudy.forEach(c => c.level = 2); 
    } else {
      cardsToStudy.sort((a, b) => {
        const diff = (a.level || 0) - (b.level || 0);
        return diff === 0 ? Math.random() - 0.5 : diff;
      });
    }

    setStudyQueue(cardsToStudy);
    setSessionStats({ reviewed: 0 });
    nextCard(cardsToStudy);
  }, [activeDeck]);

  useEffect(() => {
    if (mode === 'study') {
      startStudySession();
    }
  }, [mode, activeDeckId, startStudySession]); // Added dependencies

  const nextCard = (queue = studyQueue) => {
    if (queue.length > 0) {
      const next = queue[0];
      setStudyQueue(queue.slice(1));
      setCurrentCard(next);
    } else {
      setCurrentCard(null);
    }
    setIsFlipped(false);
  };

  const gradeCard = (quality) => {
    if (!isFlipped || !currentCard || !activeDeck || isTransitioning) return;

    const originalLevel = currentCard.level || 0;
    let newLevel = originalLevel;

    if (quality === 1) newLevel = 0;
    else if (quality === 2) newLevel = Math.min(3, originalLevel + 1);
    else if (quality === 3) newLevel = Math.min(3, originalLevel + 2);

    const updatedCard = { ...currentCard, level: newLevel };
    
    const updatedDecks = decks.map(d => {
      if (d.id !== activeDeck.id) return d;
      return {
        ...d,
        cards: d.cards.map(c => c.ru === currentCard.ru ? updatedCard : c)
      };
    });

    setDecks(updatedDecks);
    saveDecks(updatedDecks);
    setSessionStats(s => ({ reviewed: s.reviewed + 1 }));

    let newQueue = [...studyQueue];
    if (quality === 1 && newLevel < 3) {
      newQueue.push(updatedCard);
    }

    setIsTransitioning(true);
    setIsFlipped(false);
    setTimeout(() => {
      nextCard(newQueue);
      setIsTransitioning(false);
    }, 600);
  };

  const speakRussian = (e, text) => {
    if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ru-RU';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (mode !== 'study' || !currentCard || document.activeElement.tagName === 'INPUT' || isTransitioning) return;
      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped(prev => !prev);
      } else if (e.code === 'KeyA') {
        e.preventDefault();
        speakRussian(null, currentCard.ru);
      } else if (isFlipped) {
        if (e.code === 'Digit1' || e.code === 'Numpad1') { e.preventDefault(); gradeCard(1); }
        else if (e.code === 'Digit2' || e.code === 'Numpad2') { e.preventDefault(); gradeCard(2); }
        else if (e.code === 'Digit3' || e.code === 'Numpad3') { e.preventDefault(); gradeCard(3); }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, currentCard, isFlipped, studyQueue, isTransitioning]);

  // --- Deck Management ---
  const handleCreateDeck = (name) => {
    const newDeck = { id: 'deck_' + Date.now(), name, cards: [] };
    const newDecks = [...decks, newDeck];
    setDecks(newDecks);
    setActiveDeckId(newDeck.id);
    saveDecks(newDecks);
    saveActiveDeckId(newDeck.id);
    setMode('edit');
    addToast(`Created deck "${name}"`, 'success');
  };

  const handleAddCard = (card) => {
    if (!activeDeck) return;
    const updatedDecks = decks.map(d => {
      if (d.id !== activeDeck.id) return d;
      return { ...d, cards: [...d.cards, card] };
    });
    setDecks(updatedDecks);
    saveDecks(updatedDecks);
    addToast('Flashcard added successfully', 'success');
  };

  const handleDeleteCard = (idx) => {
    if (!activeDeck) return;
    const cardName = activeDeck.cards[idx].ru;
    const updatedDecks = decks.map(d => {
      if (d.id !== activeDeck.id) return d;
      const newCards = [...d.cards];
      newCards.splice(idx, 1);
      return { ...d, cards: newCards };
    });
    setDecks(updatedDecks);
    saveDecks(updatedDecks);
    addToast(`Removed "${cardName}"`, 'info');
  };

  const handleResetDeck = () => {
    if (!activeDeck) return;
    const updatedDecks = decks.map(d => {
      if (d.id !== activeDeck.id) return d;
      return { ...d, cards: d.cards.map(c => ({ ...c, level: 0 })) };
    });
    setDecks(updatedDecks);
    saveDecks(updatedDecks);
    addToast('Deck progress reset', 'info');
    if (mode === 'study') startStudySession();
  };

  return (
    <div className="app-container">
      <Header 
        decks={decks} 
        activeDeckId={activeDeckId} 
        onSelectDeck={(id) => { setActiveDeckId(id); saveActiveDeckId(id); }}
        onCreateDeck={() => setIsModalOpen(true)}
      />

      <main className="main-content">
        <Sidebar 
          mode={mode} 
          setMode={setMode} 
          deck={activeDeck} 
          onResetDeck={handleResetDeck}
        />

        {mode === 'study' ? (
          activeDeck?.cards.length === 0 ? (
            <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem', textAlign: 'center' }}>
              <BookPlus size={64} color="var(--text-muted)" style={{ marginBottom: '1.5rem' }} />
              <h2 style={{ fontSize: '2rem', fontFamily: 'Playfair Display', marginBottom: '1rem' }}>This deck is empty</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Add some Russian phrases to begin your learning session.</p>
              <button className="btn btn-primary" onClick={() => setMode('edit')}>Go to Deck Manager</button>
            </div>
          ) : !currentCard ? (
             <div className="glass-panel animate-slide-up" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem', textAlign: 'center' }}>
              <div style={{ width: '80px', height: '80px', background: 'var(--accent-green)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', fontSize: '2.5rem' }}>🎉</div>
              <h2 style={{ fontSize: '2.5rem', fontFamily: 'Playfair Display', marginBottom: '1rem' }}>Session Complete!</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1.25rem' }}>You've reviewed <span style={{ color: 'white', fontWeight: 'bold' }}>{sessionStats.reviewed}</span> cards today.</p>
              <button className="btn btn-primary" onClick={startStudySession}><RotateCcw size={18} /> Review More</button>
            </div>
          ) : (
            <Flashcard 
              card={currentCard} 
              isFlipped={isFlipped}
              onFlip={isTransitioning ? undefined : () => setIsFlipped(prev => !prev)}
              remaining={studyQueue.length + 1}
              onGrade={gradeCard}
              onSpeak={speakRussian}
            />
          )
        ) : (
          <DeckManager 
            deck={activeDeck} 
            onAddCard={handleAddCard}
            onDeleteCard={handleDeleteCard}
          />
        )}
      </main>

      <Modal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateDeck}
        title="Create New Deck"
        placeholder="e.g., Travel Vocabulary"
      />

      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

export default App;
