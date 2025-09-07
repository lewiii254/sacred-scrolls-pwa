import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { useBibleStudy } from '@/contexts/BibleStudyContext';
import { BIBLE_BOOKS, fetchBibleChapter } from '@/lib/bible-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { BookmarkCheck, Search, Calendar, ExternalLink, Trash2, BookOpen } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function BookmarksPage() {
  const navigate = useNavigate();
  const { bookmarks, removeBookmark } = useBibleStudy();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState<string>('all');
  const [deletingBookmark, setDeletingBookmark] = useState<string | null>(null);

  // Filter bookmarks based on search query and selected book
  const filteredBookmarks = bookmarks.filter(bookmark => {
    const bookName = getBookName(bookmark.book_id);
    const matchesSearch = searchQuery === '' || 
      bookName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (bookmark.title && bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesBook = selectedBook === 'all' || bookmark.book_id === selectedBook;
    
    return matchesSearch && matchesBook;
  });

  // Sort bookmarks by most recent first
  const sortedBookmarks = filteredBookmarks.sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const handleDeleteBookmark = async (bookmarkId: string) => {
    await removeBookmark(bookmarkId);
    toast.success('Bookmark removed successfully');
    setDeletingBookmark(null);
  };

  const handleGoToVerse = (bookmark: any) => {
    navigate(`/bible/${bookmark.book_id}/${bookmark.chapter}`);
  };

  const getBookName = (bookId: string) => {
    const book = BIBLE_BOOKS.find(b => b.id === bookId);
    return book?.name || bookId;
  };

  // Get unique books from bookmarks for filtering
  const booksWithBookmarks = [...new Set(bookmarks.map(bookmark => bookmark.book_id))];

  // Group bookmarks by book for better organization
  const bookmarksByBook = sortedBookmarks.reduce((acc, bookmark) => {
    const bookId = bookmark.book_id;
    if (!acc[bookId]) {
      acc[bookId] = [];
    }
    acc[bookId].push(bookmark);
    return acc;
  }, {} as Record<string, typeof bookmarks>);

  return (
    <Layout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookmarkCheck className="h-5 w-5" />
              <span>Saved Verses</span>
              <Badge variant="secondary" className="ml-2">
                {bookmarks.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Search and Filter */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Search Bookmarks</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by book or title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Filter by Book</label>
                <Select value={selectedBook} onValueChange={setSelectedBook}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Books ({bookmarks.length} bookmarks)</SelectItem>
                    {booksWithBookmarks.length > 0 && (
                      <>
                        <div className="px-2 py-1 text-sm font-semibold text-muted-foreground">
                          Books with Bookmarks
                        </div>
                        {booksWithBookmarks.map((bookId) => {
                          const bookBookmarks = bookmarks.filter(b => b.book_id === bookId);
                          return (
                            <SelectItem key={bookId} value={bookId}>
                              {getBookName(bookId)} ({bookBookmarks.length})
                            </SelectItem>
                          );
                        })}
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{bookmarks.length}</div>
                <div className="text-sm text-muted-foreground">Total Bookmarks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{booksWithBookmarks.length}</div>
                <div className="text-sm text-muted-foreground">Books</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {filteredBookmarks.length}
                </div>
                <div className="text-sm text-muted-foreground">Showing</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {bookmarks.filter(bookmark => {
                    const bookmarkDate = new Date(bookmark.created_at);
                    const today = new Date();
                    return bookmarkDate.toDateString() === today.toDateString();
                  }).length}
                </div>
                <div className="text-sm text-muted-foreground">Today</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bookmarks List */}
        <div className="space-y-4">
          {sortedBookmarks.length > 0 ? (
            selectedBook === 'all' ? (
              // Group by book when showing all
              Object.entries(bookmarksByBook).map(([bookId, bookBookmarks]) => (
                <Card key={bookId}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BookOpen className="h-4 w-4" />
                      <span>{getBookName(bookId)}</span>
                      <Badge variant="secondary">{bookBookmarks.length}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {bookBookmarks.map((bookmark) => (
                      <BookmarkCard
                        key={bookmark.id}
                        bookmark={bookmark}
                        onDelete={setDeletingBookmark}
                        onGoToVerse={handleGoToVerse}
                        getBookName={getBookName}
                      />
                    ))}
                  </CardContent>
                </Card>
              ))
            ) : (
              // Show flat list when filtering by specific book
              sortedBookmarks.map((bookmark) => (
                <BookmarkCard
                  key={bookmark.id}
                  bookmark={bookmark}
                  onDelete={setDeletingBookmark}
                  onGoToVerse={handleGoToVerse}
                  getBookName={getBookName}
                  showBookName={false}
                />
              ))
            )
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <BookmarkCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {searchQuery || selectedBook !== 'all' ? 'No bookmarks found' : 'No bookmarks yet'}
                </h3>
                <p className="text-muted-foreground">
                  {searchQuery || selectedBook !== 'all' 
                    ? 'Try adjusting your search or filter criteria'
                    : 'Start reading the Bible and bookmark verses that inspire you'
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deletingBookmark !== null} onOpenChange={() => setDeletingBookmark(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove Bookmark</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to remove this bookmark? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deletingBookmark && handleDeleteBookmark(deletingBookmark)}
                className="bg-red-600 hover:bg-red-700"
              >
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
}

// Separate component for bookmark cards to avoid repetition
function BookmarkCard({ 
  bookmark, 
  onDelete, 
  onGoToVerse, 
  getBookName, 
  showBookName = true 
}: {
  bookmark: any;
  onDelete: (id: string) => void;
  onGoToVerse: (bookmark: any) => void;
  getBookName: (bookId: string) => string;
  showBookName?: boolean;
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="font-medium">
                {showBookName && `${getBookName(bookmark.book_id)} `}
                {bookmark.chapter}:{bookmark.verse}
              </h3>
              {bookmark.title && bookmark.title !== `${getBookName(bookmark.book_id)} ${bookmark.chapter}:${bookmark.verse}` && (
                <Badge variant="outline" className="text-xs">
                  {bookmark.title}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>Saved {format(new Date(bookmark.created_at), 'MMM d, yyyy')}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onGoToVerse(bookmark)}
              className="text-blue-600 hover:text-blue-700"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(bookmark.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}