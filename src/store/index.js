import localforage from 'localforage';
import { defaultDecks } from '../data/defaultDecks';

const STORE_KEY = 'slovo_decks_v4';
const ACTIVE_DECK_KEY = 'slovo_active_deck_v4';

localforage.config({
  name: 'SlovoApp',
  storeName: 'slovo_data'
});

export const loadDecks = async () => {
  try {
    const stored = await localforage.getItem(STORE_KEY);
    if (stored && stored.length > 0) return stored;
  } catch (err) {
    console.error('Error loading decks from IndexedDB', err);
  }
  // Return default if empty
  await saveDecks(defaultDecks);
  return defaultDecks;
};

export const saveDecks = async (decks) => {
  try {
    await localforage.setItem(STORE_KEY, decks);
  } catch (err) {
    console.error('Error saving decks to IndexedDB', err);
  }
};

export const getActiveDeckId = async (decks) => {
  try {
    const stored = await localforage.getItem(ACTIVE_DECK_KEY);
    if (stored && decks.some(d => d.id === stored)) return stored;
  } catch (err) {
    console.error('Error loading active deck id', err);
  }
  return decks[0]?.id;
};

export const saveActiveDeckId = async (id) => {
  try {
    await localforage.setItem(ACTIVE_DECK_KEY, id);
  } catch (err) {
    console.error('Error saving active deck id', err);
  }
};
