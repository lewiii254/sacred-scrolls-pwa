import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { useBibleStudy } from '@/contexts/BibleStudyContext';
import { BIBLE_BOOKS } from '@/lib/bible-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
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
import { FileText, Edit, Trash2, Search, Calendar, BookOpen } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function NotesPage() {
  const { notes, updateNote, deleteNote } = useBibleStudy();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState<string>('all');
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [deletingNote, setDeletingNote] = useState<string | null>(null);

  // Filter notes based on search query and selected book
  const filteredNotes = notes.filter(note => {
    const matchesSearch = searchQuery === '' || 
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.book_id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesBook = selectedBook === 'all' || note.book_id === selectedBook;
    
    return matchesSearch && matchesBook;
  });

  // Sort notes by most recent first
  const sortedNotes = filteredNotes.sort((a, b) => 
    new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );

  const handleEditNote = (noteId: string, content: string) => {
    setEditingNote(noteId);
    setEditContent(content);
  };

  const handleSaveEdit = async () => {
    if (editingNote && editContent.trim()) {
      await updateNote(editingNote, editContent.trim());
      toast.success('Note updated successfully');
      setEditingNote(null);
      setEditContent('');
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    await deleteNote(noteId);
    toast.success('Note deleted successfully');
    setDeletingNote(null);
  };

  const getBookName = (bookId: string) => {
    const book = BIBLE_BOOKS.find(b => b.id === bookId);
    return book?.name || bookId;
  };

  // Get unique books from notes for filtering
  const booksWithNotes = [...new Set(notes.map(note => note.book_id))];
  const oldTestamentBooks = BIBLE_BOOKS.filter(book => book.testament === 'old');
  const newTestamentBooks = BIBLE_BOOKS.filter(book => book.testament === 'new');

  return (
    <Layout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>My Notes</span>
              <Badge variant="secondary" className="ml-2">
                {notes.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Search and Filter */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Search Notes</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by content or book..."
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
                    <SelectItem value="all">All Books ({notes.length} notes)</SelectItem>
                    {booksWithNotes.length > 0 && (
                      <>
                        <div className="px-2 py-1 text-sm font-semibold text-muted-foreground">
                          Books with Notes
                        </div>
                        {booksWithNotes.map((bookId) => {
                          const bookNotes = notes.filter(n => n.book_id === bookId);
                          return (
                            <SelectItem key={bookId} value={bookId}>
                              {getBookName(bookId)} ({bookNotes.length})
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
                <div className="text-2xl font-bold text-primary">{notes.length}</div>
                <div className="text-sm text-muted-foreground">Total Notes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{booksWithNotes.length}</div>
                <div className="text-sm text-muted-foreground">Books</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {filteredNotes.length}
                </div>
                <div className="text-sm text-muted-foreground">Showing</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {notes.filter(note => {
                    const noteDate = new Date(note.created_at);
                    const today = new Date();
                    return noteDate.toDateString() === today.toDateString();
                  }).length}
                </div>
                <div className="text-sm text-muted-foreground">Today</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes List */}
        <div className="space-y-4">
          {sortedNotes.length > 0 ? (
            sortedNotes.map((note) => (
              <Card key={note.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center space-x-2">
                        <BookOpen className="h-4 w-4" />
                        <span>{getBookName(note.book_id)} {note.chapter}:{note.verse}</span>
                      </CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>Created {format(new Date(note.created_at), 'MMM d, yyyy')}</span>
                        </div>
                        {note.updated_at !== note.created_at && (
                          <div>
                            Updated {format(new Date(note.updated_at), 'MMM d, yyyy')}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditNote(note.id, note.content)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeletingNote(note.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="whitespace-pre-wrap">{note.content}</p>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {searchQuery || selectedBook !== 'all' ? 'No notes found' : 'No notes yet'}
                </h3>
                <p className="text-muted-foreground">
                  {searchQuery || selectedBook !== 'all' 
                    ? 'Try adjusting your search or filter criteria'
                    : 'Start reading the Bible and add notes to verses that speak to you'
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Edit Note Dialog */}
        <Dialog open={editingNote !== null} onOpenChange={() => setEditingNote(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Note</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="Write your thoughts..."
                rows={6}
              />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingNote(null)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deletingNote !== null} onOpenChange={() => setDeletingNote(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Note</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this note? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deletingNote && handleDeleteNote(deletingNote)}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
}