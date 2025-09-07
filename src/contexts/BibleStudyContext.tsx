import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface Highlight {
  id: string;
  user_id: string;
  book_id: string;
  chapter: number;
  verse: number;
  color: string;
  created_at: string;
}

export interface Note {
  id: string;
  user_id: string;
  book_id: string;
  chapter: number;
  verse: number;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface Bookmark {
  id: string;
  user_id: string;
  book_id: string;
  chapter: number;
  verse: number;
  title?: string;
  created_at: string;
}

interface BibleStudyContextType {
  highlights: Highlight[];
  notes: Note[];
  bookmarks: Bookmark[];
  addHighlight: (bookId: string, chapter: number, verse: number, color: string) => Promise<void>;
  removeHighlight: (bookId: string, chapter: number, verse: number) => Promise<void>;
  addNote: (bookId: string, chapter: number, verse: number, content: string) => Promise<void>;
  updateNote: (id: string, content: string) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  addBookmark: (bookId: string, chapter: number, verse: number, title?: string) => Promise<void>;
  removeBookmark: (id: string) => Promise<void>;
  getHighlightColor: (bookId: string, chapter: number, verse: number) => string | null;
  getNote: (bookId: string, chapter: number, verse: number) => Note | null;
  isBookmarked: (bookId: string, chapter: number, verse: number) => boolean;
  loading: boolean;
}

const BibleStudyContext = createContext<BibleStudyContextType | undefined>(undefined);

export function BibleStudyProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  // Highlight colors
  const HIGHLIGHT_COLORS = {
    yellow: '#fef3c7',
    green: '#d1fae5',
    blue: '#dbeafe',
    pink: '#fce7f3',
    orange: '#fed7aa'
  };

  useEffect(() => {
    if (user) {
      loadUserData();
    } else {
      setHighlights([]);
      setNotes([]);
      setBookmarks([]);
      setLoading(false);
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Load highlights, notes, and bookmarks from localStorage for now
      // In a real app, these would come from Supabase
      const savedHighlights = localStorage.getItem(`highlights_${user.id}`);
      const savedNotes = localStorage.getItem(`notes_${user.id}`);
      const savedBookmarks = localStorage.getItem(`bookmarks_${user.id}`);

      setHighlights(savedHighlights ? JSON.parse(savedHighlights) : []);
      setNotes(savedNotes ? JSON.parse(savedNotes) : []);
      setBookmarks(savedBookmarks ? JSON.parse(savedBookmarks) : []);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveToStorage = (key: string, data: any) => {
    if (user) {
      localStorage.setItem(`${key}_${user.id}`, JSON.stringify(data));
    }
  };

  const addHighlight = async (bookId: string, chapter: number, verse: number, color: string) => {
    if (!user) return;

    const highlight: Highlight = {
      id: crypto.randomUUID(),
      user_id: user.id,
      book_id: bookId,
      chapter,
      verse,
      color,
      created_at: new Date().toISOString()
    };

    const newHighlights = [...highlights.filter(h => 
      !(h.book_id === bookId && h.chapter === chapter && h.verse === verse)
    ), highlight];
    
    setHighlights(newHighlights);
    saveToStorage('highlights', newHighlights);
  };

  const removeHighlight = async (bookId: string, chapter: number, verse: number) => {
    const newHighlights = highlights.filter(h => 
      !(h.book_id === bookId && h.chapter === chapter && h.verse === verse)
    );
    setHighlights(newHighlights);
    saveToStorage('highlights', newHighlights);
  };

  const addNote = async (bookId: string, chapter: number, verse: number, content: string) => {
    if (!user) return;

    const note: Note = {
      id: crypto.randomUUID(),
      user_id: user.id,
      book_id: bookId,
      chapter,
      verse,
      content,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const newNotes = [...notes.filter(n => 
      !(n.book_id === bookId && n.chapter === chapter && n.verse === verse)
    ), note];
    
    setNotes(newNotes);
    saveToStorage('notes', newNotes);
  };

  const updateNote = async (id: string, content: string) => {
    const newNotes = notes.map(note => 
      note.id === id 
        ? { ...note, content, updated_at: new Date().toISOString() }
        : note
    );
    setNotes(newNotes);
    saveToStorage('notes', newNotes);
  };

  const deleteNote = async (id: string) => {
    const newNotes = notes.filter(note => note.id !== id);
    setNotes(newNotes);
    saveToStorage('notes', newNotes);
  };

  const addBookmark = async (bookId: string, chapter: number, verse: number, title?: string) => {
    if (!user) return;

    const bookmark: Bookmark = {
      id: crypto.randomUUID(),
      user_id: user.id,
      book_id: bookId,
      chapter,
      verse,
      title,
      created_at: new Date().toISOString()
    };

    const newBookmarks = [...bookmarks, bookmark];
    setBookmarks(newBookmarks);
    saveToStorage('bookmarks', newBookmarks);
  };

  const removeBookmark = async (id: string) => {
    const newBookmarks = bookmarks.filter(bookmark => bookmark.id !== id);
    setBookmarks(newBookmarks);
    saveToStorage('bookmarks', newBookmarks);
  };

  const getHighlightColor = (bookId: string, chapter: number, verse: number): string | null => {
    const highlight = highlights.find(h => 
      h.book_id === bookId && h.chapter === chapter && h.verse === verse
    );
    return highlight ? HIGHLIGHT_COLORS[highlight.color as keyof typeof HIGHLIGHT_COLORS] || highlight.color : null;
  };

  const getNote = (bookId: string, chapter: number, verse: number): Note | null => {
    return notes.find(n => 
      n.book_id === bookId && n.chapter === chapter && n.verse === verse
    ) || null;
  };

  const isBookmarked = (bookId: string, chapter: number, verse: number): boolean => {
    return bookmarks.some(b => 
      b.book_id === bookId && b.chapter === chapter && b.verse === verse
    );
  };

  const value: BibleStudyContextType = {
    highlights,
    notes,
    bookmarks,
    addHighlight,
    removeHighlight,
    addNote,
    updateNote,
    deleteNote,
    addBookmark,
    removeBookmark,
    getHighlightColor,
    getNote,
    isBookmarked,
    loading
  };

  return (
    <BibleStudyContext.Provider value={value}>
      {children}
    </BibleStudyContext.Provider>
  );
}

export function useBibleStudy() {
  const context = useContext(BibleStudyContext);
  if (context === undefined) {
    throw new Error('useBibleStudy must be used within a BibleStudyProvider');
  }
  return context;
}