// Bible API integration using API.Bible
const API_KEY = import.meta.env.VITE_BIBLE_API_KEY || 'a0ae93eb5fd71857b24c1506dcd63112';
const BASE_URL = 'https://api.scripture.api.bible/v1';

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
  api_id?: string;
}

// Headers for API.Bible requests
const headers = {
  'api-key': API_KEY,
  'Content-Type': 'application/json',
};

// Bible books data with API.Bible book IDs
export const BIBLE_BOOKS: BibleBook[] = [
  // Old Testament
  { id: 'genesis', name: 'Genesis', chapters: 50, testament: 'old', api_id: 'GEN' },
  { id: 'exodus', name: 'Exodus', chapters: 40, testament: 'old', api_id: 'EXO' },
  { id: 'leviticus', name: 'Leviticus', chapters: 27, testament: 'old', api_id: 'LEV' },
  { id: 'numbers', name: 'Numbers', chapters: 36, testament: 'old', api_id: 'NUM' },
  { id: 'deuteronomy', name: 'Deuteronomy', chapters: 34, testament: 'old', api_id: 'DEU' },
  { id: 'joshua', name: 'Joshua', chapters: 24, testament: 'old', api_id: 'JOS' },
  { id: 'judges', name: 'Judges', chapters: 21, testament: 'old', api_id: 'JDG' },
  { id: 'ruth', name: 'Ruth', chapters: 4, testament: 'old', api_id: 'RUT' },
  { id: '1samuel', name: '1 Samuel', chapters: 31, testament: 'old', api_id: '1SA' },
  { id: '2samuel', name: '2 Samuel', chapters: 24, testament: 'old', api_id: '2SA' },
  { id: '1kings', name: '1 Kings', chapters: 22, testament: 'old', api_id: '1KI' },
  { id: '2kings', name: '2 Kings', chapters: 25, testament: 'old', api_id: '2KI' },
  { id: '1chronicles', name: '1 Chronicles', chapters: 29, testament: 'old', api_id: '1CH' },
  { id: '2chronicles', name: '2 Chronicles', chapters: 36, testament: 'old', api_id: '2CH' },
  { id: 'ezra', name: 'Ezra', chapters: 10, testament: 'old', api_id: 'EZR' },
  { id: 'nehemiah', name: 'Nehemiah', chapters: 13, testament: 'old', api_id: 'NEH' },
  { id: 'esther', name: 'Esther', chapters: 10, testament: 'old', api_id: 'EST' },
  { id: 'job', name: 'Job', chapters: 42, testament: 'old', api_id: 'JOB' },
  { id: 'psalms', name: 'Psalms', chapters: 150, testament: 'old', api_id: 'PSA' },
  { id: 'proverbs', name: 'Proverbs', chapters: 31, testament: 'old', api_id: 'PRO' },
  { id: 'ecclesiastes', name: 'Ecclesiastes', chapters: 12, testament: 'old', api_id: 'ECC' },
  { id: 'songofsolomon', name: 'Song of Solomon', chapters: 8, testament: 'old', api_id: 'SNG' },
  { id: 'isaiah', name: 'Isaiah', chapters: 66, testament: 'old', api_id: 'ISA' },
  { id: 'jeremiah', name: 'Jeremiah', chapters: 52, testament: 'old', api_id: 'JER' },
  { id: 'lamentations', name: 'Lamentations', chapters: 5, testament: 'old', api_id: 'LAM' },
  { id: 'ezekiel', name: 'Ezekiel', chapters: 48, testament: 'old', api_id: 'EZK' },
  { id: 'daniel', name: 'Daniel', chapters: 12, testament: 'old', api_id: 'DAN' },
  { id: 'hosea', name: 'Hosea', chapters: 14, testament: 'old', api_id: 'HOS' },
  { id: 'joel', name: 'Joel', chapters: 3, testament: 'old', api_id: 'JOL' },
  { id: 'amos', name: 'Amos', chapters: 9, testament: 'old', api_id: 'AMO' },
  { id: 'obadiah', name: 'Obadiah', chapters: 1, testament: 'old', api_id: 'OBA' },
  { id: 'jonah', name: 'Jonah', chapters: 4, testament: 'old', api_id: 'JON' },
  { id: 'micah', name: 'Micah', chapters: 7, testament: 'old', api_id: 'MIC' },
  { id: 'nahum', name: 'Nahum', chapters: 3, testament: 'old', api_id: 'NAM' },
  { id: 'habakkuk', name: 'Habakkuk', chapters: 3, testament: 'old', api_id: 'HAB' },
  { id: 'zephaniah', name: 'Zephaniah', chapters: 3, testament: 'old', api_id: 'ZEP' },
  { id: 'haggai', name: 'Haggai', chapters: 2, testament: 'old', api_id: 'HAG' },
  { id: 'zechariah', name: 'Zechariah', chapters: 14, testament: 'old', api_id: 'ZEC' },
  { id: 'malachi', name: 'Malachi', chapters: 4, testament: 'old', api_id: 'MAL' },

  // New Testament
  { id: 'matthew', name: 'Matthew', chapters: 28, testament: 'new', api_id: 'MAT' },
  { id: 'mark', name: 'Mark', chapters: 16, testament: 'new', api_id: 'MRK' },
  { id: 'luke', name: 'Luke', chapters: 24, testament: 'new', api_id: 'LUK' },
  { id: 'john', name: 'John', chapters: 21, testament: 'new', api_id: 'JHN' },
  { id: 'acts', name: 'Acts', chapters: 28, testament: 'new', api_id: 'ACT' },
  { id: 'romans', name: 'Romans', chapters: 16, testament: 'new', api_id: 'ROM' },
  { id: '1corinthians', name: '1 Corinthians', chapters: 16, testament: 'new', api_id: '1CO' },
  { id: '2corinthians', name: '2 Corinthians', chapters: 13, testament: 'new', api_id: '2CO' },
  { id: 'galatians', name: 'Galatians', chapters: 6, testament: 'new', api_id: 'GAL' },
  { id: 'ephesians', name: 'Ephesians', chapters: 6, testament: 'new', api_id: 'EPH' },
  { id: 'philippians', name: 'Philippians', chapters: 4, testament: 'new', api_id: 'PHP' },
  { id: 'colossians', name: 'Colossians', chapters: 4, testament: 'new', api_id: 'COL' },
  { id: '1thessalonians', name: '1 Thessalonians', chapters: 5, testament: 'new', api_id: '1TH' },
  { id: '2thessalonians', name: '2 Thessalonians', chapters: 3, testament: 'new', api_id: '2TH' },
  { id: '1timothy', name: '1 Timothy', chapters: 6, testament: 'new', api_id: '1TI' },
  { id: '2timothy', name: '2 Timothy', chapters: 4, testament: 'new', api_id: '2TI' },
  { id: 'titus', name: 'Titus', chapters: 3, testament: 'new', api_id: 'TIT' },
  { id: 'philemon', name: 'Philemon', chapters: 1, testament: 'new', api_id: 'PHM' },
  { id: 'hebrews', name: 'Hebrews', chapters: 13, testament: 'new', api_id: 'HEB' },
  { id: 'james', name: 'James', chapters: 5, testament: 'new', api_id: 'JAS' },
  { id: '1peter', name: '1 Peter', chapters: 5, testament: 'new', api_id: '1PE' },
  { id: '2peter', name: '2 Peter', chapters: 3, testament: 'new', api_id: '2PE' },
  { id: '1john', name: '1 John', chapters: 5, testament: 'new', api_id: '1JN' },
  { id: '2john', name: '2 John', chapters: 1, testament: 'new', api_id: '2JN' },
  { id: '3john', name: '3 John', chapters: 1, testament: 'new', api_id: '3JN' },
  { id: 'jude', name: 'Jude', chapters: 1, testament: 'new', api_id: 'JUD' },
  { id: 'revelation', name: 'Revelation', chapters: 22, testament: 'new', api_id: 'REV' },
];

// Sample Bible content for fallback
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
    const book = BIBLE_BOOKS.find(b => b.id === bookId);
    if (!book || !book.api_id) return null;

    // Use API.Bible to fetch real content with ASV translation
    const bibleId = 'de4e12af7f28f599-02'; // ASV Bible ID
    const chapterId = `${book.api_id}.${chapter}`;

    const response = await fetch(
      `${BASE_URL}/bibles/${bibleId}/chapters/${chapterId}?content-type=text&include-notes=false&include-titles=true&include-chapter-numbers=false&include-verse-numbers=true&include-verse-spans=false`,
      { headers }
    );

    if (!response.ok) {
      console.warn('API request failed, using sample content');
      return getFallbackContent(bookId, chapter, book);
    }

    const data = await response.json();
    const content = data.data?.content;

    if (!content) {
      return getFallbackContent(bookId, chapter, book);
    }

    // Parse the content to extract verses
    const verses = parseApiContent(content, bookId, book.name, chapter);

    if (verses.length === 0) {
      return getFallbackContent(bookId, chapter, book);
    }

    const chapterData = {
      book_id: bookId,
      book_name: book.name,
      chapter,
      verses
    };

    // Cache the Bible content in service worker for offline access
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'CACHE_BIBLE_CONTENT',
        bookId,
        chapter,
        content: chapterData
      });
    }

    return chapterData;
  } catch (error) {
    console.error('Error fetching Bible chapter:', error);
    const book = BIBLE_BOOKS.find(b => b.id === bookId);
    if (book) {
      return getFallbackContent(bookId, chapter, book);
    }
    return null;
  }
}

function getFallbackContent(bookId: string, chapter: number, book: BibleBook): BibleChapter {
  const existingContent = SAMPLE_CONTENT[bookId]?.[chapter] || [];
  
  // If no sample content, generate placeholder verses
  if (existingContent.length === 0) {
    const placeholderVerses: BibleVerse[] = [];
    for (let i = 1; i <= 10; i++) {
      placeholderVerses.push({
        book_id: bookId,
        book_name: book.name,
        chapter,
        verse: i,
        text: `This is verse ${i} of ${book.name} chapter ${chapter}. Loading from API.Bible...`
      });
    }
    return {
      book_id: bookId,
      book_name: book.name,
      chapter,
      verses: placeholderVerses
    };
  }

  return {
    book_id: bookId,
    book_name: book.name,
    chapter,
    verses: existingContent
  };
}

function parseApiContent(content: string, bookId: string, bookName: string, chapter: number): BibleVerse[] {
  const verses: BibleVerse[] = [];
  
  // Remove HTML tags and clean up the content
  const cleanContent = content
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  // Split by verse numbers (looking for patterns like "1 ", "2 ", etc.)
  const versePattern = /(\d+)\s+([^0-9]+?)(?=\d+\s|$)/g;
  let match;
  
  while ((match = versePattern.exec(cleanContent)) !== null) {
    const verseNumber = parseInt(match[1]);
    const verseText = match[2].trim();
    
    if (verseText && verseNumber) {
      verses.push({
        book_id: bookId,
        book_name: bookName,
        chapter,
        verse: verseNumber,
        text: verseText
      });
    }
  }
  
  // If parsing failed, try a simpler approach
  if (verses.length === 0) {
    const lines = cleanContent.split(/\d+/).filter(line => line.trim().length > 10);
    lines.forEach((line, index) => {
      verses.push({
        book_id: bookId,
        book_name: bookName,
        chapter,
        verse: index + 1,
        text: line.trim()
      });
    });
  }
  
  return verses;
}

export async function searchBibleVerses(query: string, bookFilter?: string): Promise<BibleVerse[]> {
  try {
    const bibleId = 'de4e12af7f28f599-02'; // ASV Bible ID
    
    const response = await fetch(
      `${BASE_URL}/bibles/${bibleId}/search?query=${encodeURIComponent(query)}&limit=20`,
      { headers }
    );

    if (!response.ok) {
      console.warn('Search API failed, using sample content');
      return searchSampleContent(query, bookFilter);
    }

    const data = await response.json();
    const results: BibleVerse[] = [];
    
    if (data.data?.verses) {
      data.data.verses.forEach((verse: any) => {
        const bookMatch = BIBLE_BOOKS.find(b => b.api_id === verse.bookId);
        if (bookMatch && (!bookFilter || bookMatch.id === bookFilter)) {
          results.push({
            book_id: bookMatch.id,
            book_name: bookMatch.name,
            chapter: verse.chapterNumber,
            verse: verse.verseNumber,
            text: verse.text.replace(/<[^>]*>/g, '').trim()
          });
        }
      });
    }

    return results.length > 0 ? results : searchSampleContent(query, bookFilter);
  } catch (error) {
    console.error('Error searching Bible verses:', error);
    return searchSampleContent(query, bookFilter);
  }
}

function searchSampleContent(query: string, bookFilter?: string): BibleVerse[] {
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
}