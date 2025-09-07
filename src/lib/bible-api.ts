// Bible API integration for fetching scripture content
export interface BibleVerse {
  book_id: string;
  book_name: string;
  chapter: number;
  verse: number;
  text: string;
}

export interface BibleChapter {
  book_id: string;
  book_name: string;
  chapter: number;
  verses: BibleVerse[];
}

export interface BibleBook {
  id: string;
  name: string;
  chapters: number;
  testament: 'old' | 'new';
}

// Bible books data
export const BIBLE_BOOKS: BibleBook[] = [
  // Old Testament
  { id: 'genesis', name: 'Genesis', chapters: 50, testament: 'old' },
  { id: 'exodus', name: 'Exodus', chapters: 40, testament: 'old' },
  { id: 'leviticus', name: 'Leviticus', chapters: 27, testament: 'old' },
  { id: 'numbers', name: 'Numbers', chapters: 36, testament: 'old' },
  { id: 'deuteronomy', name: 'Deuteronomy', chapters: 34, testament: 'old' },
  { id: 'joshua', name: 'Joshua', chapters: 24, testament: 'old' },
  { id: 'judges', name: 'Judges', chapters: 21, testament: 'old' },
  { id: 'ruth', name: 'Ruth', chapters: 4, testament: 'old' },
  { id: '1samuel', name: '1 Samuel', chapters: 31, testament: 'old' },
  { id: '2samuel', name: '2 Samuel', chapters: 24, testament: 'old' },
  { id: '1kings', name: '1 Kings', chapters: 22, testament: 'old' },
  { id: '2kings', name: '2 Kings', chapters: 25, testament: 'old' },
  { id: '1chronicles', name: '1 Chronicles', chapters: 29, testament: 'old' },
  { id: '2chronicles', name: '2 Chronicles', chapters: 36, testament: 'old' },
  { id: 'ezra', name: 'Ezra', chapters: 10, testament: 'old' },
  { id: 'nehemiah', name: 'Nehemiah', chapters: 13, testament: 'old' },
  { id: 'esther', name: 'Esther', chapters: 10, testament: 'old' },
  { id: 'job', name: 'Job', chapters: 42, testament: 'old' },
  { id: 'psalms', name: 'Psalms', chapters: 150, testament: 'old' },
  { id: 'proverbs', name: 'Proverbs', chapters: 31, testament: 'old' },
  { id: 'ecclesiastes', name: 'Ecclesiastes', chapters: 12, testament: 'old' },
  { id: 'songofsolomon', name: 'Song of Solomon', chapters: 8, testament: 'old' },
  { id: 'isaiah', name: 'Isaiah', chapters: 66, testament: 'old' },
  { id: 'jeremiah', name: 'Jeremiah', chapters: 52, testament: 'old' },
  { id: 'lamentations', name: 'Lamentations', chapters: 5, testament: 'old' },
  { id: 'ezekiel', name: 'Ezekiel', chapters: 48, testament: 'old' },
  { id: 'daniel', name: 'Daniel', chapters: 12, testament: 'old' },
  { id: 'hosea', name: 'Hosea', chapters: 14, testament: 'old' },
  { id: 'joel', name: 'Joel', chapters: 3, testament: 'old' },
  { id: 'amos', name: 'Amos', chapters: 9, testament: 'old' },
  { id: 'obadiah', name: 'Obadiah', chapters: 1, testament: 'old' },
  { id: 'jonah', name: 'Jonah', chapters: 4, testament: 'old' },
  { id: 'micah', name: 'Micah', chapters: 7, testament: 'old' },
  { id: 'nahum', name: 'Nahum', chapters: 3, testament: 'old' },
  { id: 'habakkuk', name: 'Habakkuk', chapters: 3, testament: 'old' },
  { id: 'zephaniah', name: 'Zephaniah', chapters: 3, testament: 'old' },
  { id: 'haggai', name: 'Haggai', chapters: 2, testament: 'old' },
  { id: 'zechariah', name: 'Zechariah', chapters: 14, testament: 'old' },
  { id: 'malachi', name: 'Malachi', chapters: 4, testament: 'old' },

  // New Testament
  { id: 'matthew', name: 'Matthew', chapters: 28, testament: 'new' },
  { id: 'mark', name: 'Mark', chapters: 16, testament: 'new' },
  { id: 'luke', name: 'Luke', chapters: 24, testament: 'new' },
  { id: 'john', name: 'John', chapters: 21, testament: 'new' },
  { id: 'acts', name: 'Acts', chapters: 28, testament: 'new' },
  { id: 'romans', name: 'Romans', chapters: 16, testament: 'new' },
  { id: '1corinthians', name: '1 Corinthians', chapters: 16, testament: 'new' },
  { id: '2corinthians', name: '2 Corinthians', chapters: 13, testament: 'new' },
  { id: 'galatians', name: 'Galatians', chapters: 6, testament: 'new' },
  { id: 'ephesians', name: 'Ephesians', chapters: 6, testament: 'new' },
  { id: 'philippians', name: 'Philippians', chapters: 4, testament: 'new' },
  { id: 'colossians', name: 'Colossians', chapters: 4, testament: 'new' },
  { id: '1thessalonians', name: '1 Thessalonians', chapters: 5, testament: 'new' },
  { id: '2thessalonians', name: '2 Thessalonians', chapters: 3, testament: 'new' },
  { id: '1timothy', name: '1 Timothy', chapters: 6, testament: 'new' },
  { id: '2timothy', name: '2 Timothy', chapters: 4, testament: 'new' },
  { id: 'titus', name: 'Titus', chapters: 3, testament: 'new' },
  { id: 'philemon', name: 'Philemon', chapters: 1, testament: 'new' },
  { id: 'hebrews', name: 'Hebrews', chapters: 13, testament: 'new' },
  { id: 'james', name: 'James', chapters: 5, testament: 'new' },
  { id: '1peter', name: '1 Peter', chapters: 5, testament: 'new' },
  { id: '2peter', name: '2 Peter', chapters: 3, testament: 'new' },
  { id: '1john', name: '1 John', chapters: 5, testament: 'new' },
  { id: '2john', name: '2 John', chapters: 1, testament: 'new' },
  { id: '3john', name: '3 John', chapters: 1, testament: 'new' },
  { id: 'jude', name: 'Jude', chapters: 1, testament: 'new' },
  { id: 'revelation', name: 'Revelation', chapters: 22, testament: 'new' },
];

// Sample Bible content - in a real app, this would come from an API
const SAMPLE_CONTENT: Record<string, Record<number, BibleVerse[]>> = {
  'john': {
    3: [
      { book_id: 'john', book_name: 'John', chapter: 3, verse: 16, text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.' },
      { book_id: 'john', book_name: 'John', chapter: 3, verse: 17, text: 'For God did not send his Son into the world to condemn the world, but to save the world through him.' },
      { book_id: 'john', book_name: 'John', chapter: 3, verse: 18, text: 'Whoever believes in him is not condemned, but whoever does not believe stands condemned already because they have not believed in the name of God\'s one and only Son.' },
    ]
  },
  'psalms': {
    23: [
      { book_id: 'psalms', book_name: 'Psalms', chapter: 23, verse: 1, text: 'The Lord is my shepherd, I lack nothing.' },
      { book_id: 'psalms', book_name: 'Psalms', chapter: 23, verse: 2, text: 'He makes me lie down in green pastures, he leads me beside quiet waters,' },
      { book_id: 'psalms', book_name: 'Psalms', chapter: 23, verse: 3, text: 'he refreshes my soul. He guides me along the right paths for his name\'s sake.' },
      { book_id: 'psalms', book_name: 'Psalms', chapter: 23, verse: 4, text: 'Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me.' },
      { book_id: 'psalms', book_name: 'Psalms', chapter: 23, verse: 5, text: 'You prepare a table before me in the presence of my enemies. You anoint my head with oil; my cup overflows.' },
      { book_id: 'psalms', book_name: 'Psalms', chapter: 23, verse: 6, text: 'Surely your goodness and love will follow me all the days of my life, and I will dwell in the house of the Lord forever.' },
    ]
  },
  'genesis': {
    1: [
      { book_id: 'genesis', book_name: 'Genesis', chapter: 1, verse: 1, text: 'In the beginning God created the heavens and the earth.' },
      { book_id: 'genesis', book_name: 'Genesis', chapter: 1, verse: 2, text: 'Now the earth was formless and empty, darkness was over the surface of the deep, and the Spirit of God was hovering over the waters.' },
      { book_id: 'genesis', book_name: 'Genesis', chapter: 1, verse: 3, text: 'And God said, "Let there be light," and there was light.' },
    ]
  }
};

export async function fetchBibleChapter(bookId: string, chapter: number): Promise<BibleChapter | null> {
  try {
    // In a real implementation, you would call an API like:
    // const response = await fetch(`https://bible-api.com/${bookId}+${chapter}`);
    // const data = await response.json();
    
    // For demo purposes, using sample content
    const book = BIBLE_BOOKS.find(b => b.id === bookId);
    if (!book) return null;

    const verses = SAMPLE_CONTENT[bookId]?.[chapter] || [];
    
    // If no sample content, generate placeholder verses
    if (verses.length === 0) {
      for (let i = 1; i <= 10; i++) {
        verses.push({
          book_id: bookId,
          book_name: book.name,
          chapter,
          verse: i,
          text: `This is verse ${i} of ${book.name} chapter ${chapter}. In a real implementation, this would contain actual Bible text from an API.`
        });
      }
    }

    return {
      book_id: bookId,
      book_name: book.name,
      chapter,
      verses
    };
  } catch (error) {
    console.error('Error fetching Bible chapter:', error);
    return null;
  }
}

export async function searchBibleVerses(query: string, bookFilter?: string): Promise<BibleVerse[]> {
  try {
    // In a real implementation, you would call a search API
    // For demo purposes, searching through sample content
    const results: BibleVerse[] = [];
    
    Object.entries(SAMPLE_CONTENT).forEach(([bookId, chapters]) => {
      if (bookFilter && bookId !== bookFilter) return;
      
      Object.values(chapters).forEach(verses => {
        verses.forEach(verse => {
          if (verse.text.toLowerCase().includes(query.toLowerCase())) {
            results.push(verse);
          }
        });
      });
    });

    return results;
  } catch (error) {
    console.error('Error searching Bible verses:', error);
    return [];
  }
}