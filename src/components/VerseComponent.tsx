import { useState } from 'react';
import { BibleVerse } from '@/lib/bible-api';
import { useBibleStudy } from '@/contexts/BibleStudyContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ShareVerse } from '@/components/ShareVerse';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bookmark, FileText, Palette, BookmarkCheck } from 'lucide-react';
import { toast } from 'sonner';

interface VerseComponentProps {
  verse: BibleVerse;
}

export function VerseComponent({ verse }: VerseComponentProps) {
  const {
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
    bookmarks
  } = useBibleStudy();

  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [isEditingNote, setIsEditingNote] = useState(false);

  const highlightColor = getHighlightColor(verse.book_id, verse.chapter, verse.verse);
  const existingNote = getNote(verse.book_id, verse.chapter, verse.verse);
  const bookmarked = isBookmarked(verse.book_id, verse.chapter, verse.verse);

  const handleHighlight = async (color: string) => {
    if (highlightColor) {
      await removeHighlight(verse.book_id, verse.chapter, verse.verse);
      toast.success('Highlight removed');
    } else {
      await addHighlight(verse.book_id, verse.chapter, verse.verse, color);
      toast.success('Verse highlighted');
    }
  };

  const handleOpenNoteDialog = () => {
    setNoteContent(existingNote?.content || '');
    setIsEditingNote(!!existingNote);
    setShowNoteDialog(true);
  };

  const handleSaveNote = async () => {
    if (noteContent.trim()) {
      if (existingNote) {
        await updateNote(existingNote.id, noteContent);
        toast.success('Note updated');
      } else {
        await addNote(verse.book_id, verse.chapter, verse.verse, noteContent);
        toast.success('Note added');
      }
    } else if (existingNote) {
      await deleteNote(existingNote.id);
      toast.success('Note deleted');
    }
    setShowNoteDialog(false);
    setNoteContent('');
  };

  const handleBookmark = async () => {
    if (bookmarked) {
      const bookmark = bookmarks.find(b => 
        b.book_id === verse.book_id && 
        b.chapter === verse.chapter && 
        b.verse === verse.verse
      );
      if (bookmark) {
        await removeBookmark(bookmark.id);
        toast.success('Bookmark removed');
      }
    } else {
      await addBookmark(
        verse.book_id, 
        verse.chapter, 
        verse.verse, 
        `${verse.book_name} ${verse.chapter}:${verse.verse}`
      );
      toast.success('Verse bookmarked');
    }
  };

  const highlightColors = [
    { name: 'Yellow', value: 'yellow', color: '#fef3c7' },
    { name: 'Green', value: 'green', color: '#d1fae5' },
    { name: 'Blue', value: 'blue', color: '#dbeafe' },
    { name: 'Pink', value: 'pink', color: '#fce7f3' },
    { name: 'Orange', value: 'orange', color: '#fed7aa' },
  ];

  return (
    <>
      <div className="flex items-start space-x-2 sm:space-x-4 py-3 sm:py-2 group hover:bg-muted/30 px-2 sm:px-2 rounded">
        <span className="text-xs sm:text-sm font-medium text-muted-foreground min-w-[1.5rem] sm:min-w-[2rem] mt-0.5 flex-shrink-0">
          {verse.verse}
        </span>

        <div className="flex-1 min-w-0">
          <p
            className="text-sm sm:text-base leading-relaxed cursor-pointer select-text text-left"
            style={{
              backgroundColor: highlightColor || 'transparent',
              padding: highlightColor ? '4px 6px' : '0',
              borderRadius: highlightColor ? '4px' : '0'
            }}
          >
            {verse.text}
          </p>
          
          {existingNote && (
            <Card className="mt-2 p-3 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
              <div className="flex items-start justify-between">
                <p className="text-xs text-blue-800 dark:text-blue-200">
                  {existingNote.content}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleOpenNoteDialog}
                  className="h-6 w-6 p-0 ml-2"
                >
                  <FileText className="h-3 w-3" />
                </Button>
              </div>
            </Card>
          )}
        </div>

        <div className="flex items-center space-x-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex-shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Palette className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {highlightColors.map((color) => (
                <DropdownMenuItem
                  key={color.value}
                  onClick={() => handleHighlight(color.value)}
                  className="flex items-center space-x-2"
                >
                  <div 
                    className="w-4 h-4 rounded border"
                    style={{ backgroundColor: color.color }}
                  />
                  <span>{color.name}</span>
                </DropdownMenuItem>
              ))}
              {highlightColor && (
                <DropdownMenuItem
                  onClick={() => handleHighlight('')}
                  className="text-red-600"
                >
                  Remove Highlight
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleOpenNoteDialog}
            className={`h-8 w-8 p-0 ${existingNote ? 'text-blue-600' : ''}`}
          >
            <FileText className="h-4 w-4" />
          </Button>

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBookmark}
            className={`h-8 w-8 p-0 ${bookmarked ? 'text-yellow-600' : ''}`}
          >
            {bookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
          </Button>

          <ShareVerse verse={verse} />
        </div>
      </div>

      <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditingNote ? 'Edit Note' : 'Add Note'} - {verse.book_name} {verse.chapter}:{verse.verse}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground italic">
              "{verse.text}"
            </p>
            <Textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Write your thoughts about this verse..."
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNoteDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveNote}>
              {isEditingNote ? 'Update Note' : 'Save Note'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}