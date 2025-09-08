import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { VerseComponent } from '@/components/VerseComponent';
import { AudioPlayer } from '@/components/AudioPlayer';
import { TouchNavigation } from '@/components/TouchNavigation';
import { MobileReadingControls } from '@/components/MobileReadingControls';
import { BibleChapter, BibleBook, BIBLE_BOOKS, fetchBibleChapter } from '@/lib/bible-api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Book, Loader2, Headphones, ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export default function BibleReader() {
  const { book: bookParam, chapter: chapterParam } = useParams();
  const navigate = useNavigate();
  
  const [currentBook, setCurrentBook] = useState<BibleBook | null>(null);
  const [currentChapter, setCurrentChapter] = useState<number>(1);
  const [chapterData, setChapterData] = useState<BibleChapter | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [readingPreferences, setReadingPreferences] = useState({
    fontSize: 16,
    lineHeight: 1.6,
    fontFamily: 'system',
    textAlign: 'left',
    darkMode: false,
    reducedMotion: false,
    highContrast: false
  });
  const [swipeIndicator, setSwipeIndicator] = useState<'left' | 'right' | null>(null);

  // Initialize book and chapter
  useEffect(() => {
    const book = bookParam ? BIBLE_BOOKS.find(b => b.id === bookParam) : BIBLE_BOOKS[0];
    const chapter = chapterParam ? parseInt(chapterParam) : 1;
    
    if (book) {
      setCurrentBook(book);
      setCurrentChapter(Math.min(chapter, book.chapters));
    }
  }, [bookParam, chapterParam]);

  // Load chapter content
  useEffect(() => {
    if (currentBook && currentChapter) {
      loadChapter(currentBook.id, currentChapter);
    }
  }, [currentBook, currentChapter]);

  const loadChapter = async (bookId: string, chapter: number) => {
    setLoading(true);
    try {
      const data = await fetchBibleChapter(bookId, chapter);
      if (data) {
        setChapterData(data);
        // Update URL
        navigate(`/bible/${bookId}/${chapter}`, { replace: true });
      } else {
        toast.error('Failed to load chapter');
      }
    } catch (error) {
      console.error('Error loading chapter:', error);
      toast.error('Error loading chapter');
    } finally {
      setLoading(false);
    }
  };

  const handleBookChange = (bookId: string) => {
    const book = BIBLE_BOOKS.find(b => b.id === bookId);
    if (book) {
      setCurrentBook(book);
      setCurrentChapter(1);
    }
  };

  const handleChapterChange = (chapter: string) => {
    setCurrentChapter(parseInt(chapter));
  };

  const goToPreviousChapter = () => {
    if (!currentBook) return;
    
    // Show swipe indicator
    setSwipeIndicator('right');
    setTimeout(() => setSwipeIndicator(null), 300);
    
    if (currentChapter > 1) {
      setCurrentChapter(currentChapter - 1);
    } else {
      // Go to previous book's last chapter
      const currentBookIndex = BIBLE_BOOKS.findIndex(b => b.id === currentBook.id);
      if (currentBookIndex > 0) {
        const previousBook = BIBLE_BOOKS[currentBookIndex - 1];
        setCurrentBook(previousBook);
        setCurrentChapter(previousBook.chapters);
      }
    }
  };

  const goToNextChapter = () => {
    if (!currentBook) return;
    
    // Show swipe indicator
    setSwipeIndicator('left');
    setTimeout(() => setSwipeIndicator(null), 300);
    
    if (currentChapter < currentBook.chapters) {
      setCurrentChapter(currentChapter + 1);
    } else {
      // Go to next book's first chapter
      const currentBookIndex = BIBLE_BOOKS.findIndex(b => b.id === currentBook.id);
      if (currentBookIndex < BIBLE_BOOKS.length - 1) {
        const nextBook = BIBLE_BOOKS[currentBookIndex + 1];
        setCurrentBook(nextBook);
        setCurrentChapter(1);
      }
    }
  };

  const oldTestamentBooks = BIBLE_BOOKS.filter(book => book.testament === 'old');
  const newTestamentBooks = BIBLE_BOOKS.filter(book => book.testament === 'new');

  if (!currentBook) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <TouchNavigation 
        onSwipeLeft={goToNextChapter}
        onSwipeRight={goToPreviousChapter}
        disabled={loading}
      >
        <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-4 md:space-y-6 relative">
          {/* Swipe Indicators */}
          {swipeIndicator && (
            <div className={`fixed top-1/2 transform -translate-y-1/2 z-50 ${
              swipeIndicator === 'left' ? 'right-4' : 'left-4'
            } bg-primary text-primary-foreground rounded-full p-3 shadow-lg transition-opacity duration-300`}>
              {swipeIndicator === 'left' ? (
                <ArrowRight className="h-6 w-6" />
              ) : (
                <ArrowLeft className="h-6 w-6" />
              )}
            </div>
          )}

          {/* Navigation Header */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Book className="h-5 w-5" />
                  <span className="hidden sm:inline">Bible Reader</span>
                  <span className="sm:hidden">Bible</span>
                </CardTitle>
                
                <div className="flex items-center space-x-2">
                  <MobileReadingControls onPreferencesChange={setReadingPreferences} />
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAudioPlayer(!showAudioPlayer)}
                    className="hidden sm:flex items-center space-x-2"
                  >
                    <Headphones className="h-4 w-4" />
                    <span>{showAudioPlayer ? 'Hide' : 'Show'} Audio</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAudioPlayer(!showAudioPlayer)}
                    className="sm:hidden"
                  >
                    <Headphones className="h-4 w-4" />
                  </Button>
                  
                  <div className="hidden md:flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToPreviousChapter}
                      disabled={BIBLE_BOOKS[0].id === currentBook.id && currentChapter === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToNextChapter}
                      disabled={
                        BIBLE_BOOKS[BIBLE_BOOKS.length - 1].id === currentBook.id && 
                        currentChapter === currentBook.chapters
                      }
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Book Selection */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Book</label>
                  <Select value={currentBook.id} onValueChange={handleBookChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="px-2 py-1 text-sm font-semibold text-muted-foreground">
                        Old Testament
                      </div>
                      {oldTestamentBooks.map((book) => (
                        <SelectItem key={book.id} value={book.id}>
                          {book.name}
                        </SelectItem>
                      ))}
                      <div className="px-2 py-1 text-sm font-semibold text-muted-foreground border-t mt-2 pt-2">
                        New Testament
                      </div>
                      {newTestamentBooks.map((book) => (
                        <SelectItem key={book.id} value={book.id}>
                          {book.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Chapter Selection */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Chapter</label>
                  <Select value={currentChapter.toString()} onValueChange={handleChapterChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: currentBook.chapters }, (_, i) => i + 1).map((chapter) => (
                        <SelectItem key={chapter} value={chapter.toString()}>
                          Chapter {chapter}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Reading Progress */}
                <div className="sm:col-span-2 lg:col-span-1">
                  <label className="text-sm font-medium mb-2 block">Progress</label>
                  <div className="text-sm text-muted-foreground">
                    Book {BIBLE_BOOKS.findIndex(b => b.id === currentBook.id) + 1} of {BIBLE_BOOKS.length}
                    <br />
                    Chapter {currentChapter} of {currentBook.chapters}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chapter Content */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-center text-lg md:text-xl">
                {currentBook.name} Chapter {currentChapter}
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="ml-2">Loading chapter...</span>
                </div>
              ) : chapterData ? (
                <div 
                  className="space-y-1"
                  style={{
                    fontSize: `${readingPreferences.fontSize}px`,
                    lineHeight: readingPreferences.lineHeight,
                    fontFamily: readingPreferences.fontFamily === 'system' ? 'inherit' : readingPreferences.fontFamily,
                    textAlign: readingPreferences.textAlign as any
                  }}
                >
                  {chapterData.verses.map((verse) => (
                    <div
                      key={`${verse.book_id}-${verse.chapter}-${verse.verse}`}
                      className={readingPreferences.highContrast ? 'text-black' : ''}
                    >
                      <VerseComponent verse={verse} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  No content available for this chapter.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Mobile Swipe Hint */}
          <div className="md:hidden text-center text-sm text-muted-foreground">
            💡 Swipe left/right to navigate between chapters
          </div>

          {/* Navigation Footer */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={goToPreviousChapter}
              disabled={BIBLE_BOOKS[0].id === currentBook.id && currentChapter === 1}
              className="flex items-center space-x-2"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Previous Chapter</span>
              <span className="sm:hidden">Previous</span>
            </Button>
            
            <div className="text-sm text-muted-foreground text-center">
              {currentBook.name} {currentChapter}
            </div>
            
            <Button
              variant="outline"
              onClick={goToNextChapter}
              disabled={
                BIBLE_BOOKS[BIBLE_BOOKS.length - 1].id === currentBook.id && 
                currentChapter === currentBook.chapters
              }
              className="flex items-center space-x-2"
            >
              <span className="hidden sm:inline">Next Chapter</span>
              <span className="sm:hidden">Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Audio Player */}
        {showAudioPlayer && chapterData && (
          <AudioPlayer
            verses={chapterData.verses}
            currentVerseIndex={currentVerseIndex}
            onVerseChange={setCurrentVerseIndex}
          />
        )}
      </TouchNavigation>
    </Layout>
  );
}