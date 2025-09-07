import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { VerseComponent } from '@/components/VerseComponent';
import { BibleVerse, BIBLE_BOOKS, searchBibleVerses } from '@/lib/bible-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Loader2, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState<string>('all');
  const [searchResults, setSearchResults] = useState<BibleVerse[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a search query');
      return;
    }

    setLoading(true);
    setHasSearched(true);
    
    try {
      const results = await searchBibleVerses(
        searchQuery.trim(),
        selectedBook === 'all' ? undefined : selectedBook
      );
      setSearchResults(results);
      
      if (results.length === 0) {
        toast.info('No verses found matching your search');
      } else {
        toast.success(`Found ${results.length} verse${results.length === 1 ? '' : 's'}`);
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Error performing search');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const oldTestamentBooks = BIBLE_BOOKS.filter(book => book.testament === 'old');
  const newTestamentBooks = BIBLE_BOOKS.filter(book => book.testament === 'new');

  // Get unique books from search results for filtering
  const booksInResults = [...new Set(searchResults.map(v => v.book_id))];

  return (
    <Layout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Search Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5" />
              <span>Search the Bible</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Search Input */}
            <div className="flex space-x-2">
              <div className="flex-1">
                <Input
                  placeholder="Search for verses, keywords, or phrases..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full"
                />
              </div>
              <Button onClick={handleSearch} disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Filter by Book</label>
                <Select value={selectedBook} onValueChange={setSelectedBook}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Books</SelectItem>
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

              <div>
                <label className="text-sm font-medium mb-2 block">Quick Searches</label>
                <div className="flex flex-wrap gap-2">
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    onClick={() => setSearchQuery('love')}
                  >
                    Love
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    onClick={() => setSearchQuery('faith')}
                  >
                    Faith
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    onClick={() => setSearchQuery('hope')}
                  >
                    Hope
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    onClick={() => setSearchQuery('peace')}
                  >
                    Peace
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        {hasSearched && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  Search Results
                  {searchResults.length > 0 && (
                    <span className="ml-2 text-sm font-normal text-muted-foreground">
                      ({searchResults.length} verse{searchResults.length === 1 ? '' : 's'})
                    </span>
                  )}
                </CardTitle>
                
                {booksInResults.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {booksInResults.map(bookId => {
                      const book = BIBLE_BOOKS.find(b => b.id === bookId);
                      return (
                        <Badge key={bookId} variant="secondary" className="text-xs">
                          {book?.name}
                        </Badge>
                      );
                    })}
                  </div>
                )}
              </div>
            </CardHeader>
            
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="ml-2">Searching...</span>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-1">
                  {searchResults.map((verse, index) => (
                    <div key={`${verse.book_id}-${verse.chapter}-${verse.verse}-${index}`}>
                      <VerseComponent verse={verse} />
                      {index < searchResults.length - 1 && (
                        <div className="border-b border-border my-2" />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No results found</h3>
                  <p className="text-muted-foreground">
                    Try different keywords or check your spelling
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Search Tips */}
        {!hasSearched && (
          <Card>
            <CardHeader>
              <CardTitle>Search Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">What you can search:</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Keywords: "love", "faith", "hope"</li>
                    <li>• Phrases: "God so loved"</li>
                    <li>• Names: "Jesus", "David", "Moses"</li>
                    <li>• Topics: "forgiveness", "salvation"</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Search features:</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Filter by specific books</li>
                    <li>• Case-insensitive search</li>
                    <li>• Partial word matching</li>
                    <li>• Quick search suggestions</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}