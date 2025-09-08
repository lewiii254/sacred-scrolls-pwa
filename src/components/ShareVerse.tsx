import { useState } from 'react';
import { BibleVerse } from '@/lib/bible-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { Share2, Copy, Facebook, Twitter, MessageCircle, Instagram, Mail } from 'lucide-react';
import { toast } from 'sonner';

interface ShareVerseProps {
  verse: BibleVerse;
}

export function ShareVerse({ verse }: ShareVerseProps) {
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [customMessage, setCustomMessage] = useState('');

  const verseText = `"${verse.text}" - ${verse.book_name} ${verse.chapter}:${verse.verse}`;
  const shareUrl = `${window.location.origin}/bible/${verse.book_id}/${verse.chapter}`;

  const handleCopyToClipboard = async () => {
    try {
      const textToCopy = customMessage 
        ? `${customMessage}\n\n${verseText}\n\n${shareUrl}`
        : `${verseText}\n\n${shareUrl}`;
      
      await navigator.clipboard.writeText(textToCopy);
      toast.success('Verse copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleShareToSocial = (platform: string) => {
    const message = customMessage 
      ? `${customMessage}\n\n${verseText}`
      : verseText;
    
    let shareUrlPlatform = '';
    
    switch (platform) {
      case 'twitter':
        shareUrlPlatform = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'facebook':
        shareUrlPlatform = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(message)}`;
        break;
      case 'whatsapp':
        shareUrlPlatform = `https://wa.me/?text=${encodeURIComponent(`${message}\n${shareUrl}`)}`;
        break;
      case 'email':
        shareUrlPlatform = `mailto:?subject=${encodeURIComponent(`Scripture: ${verse.book_name} ${verse.chapter}:${verse.verse}`)}&body=${encodeURIComponent(`${message}\n\n${shareUrl}`)}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrlPlatform, '_blank');
    setShowShareDialog(false);
    toast.success('Opened share dialog');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${verse.book_name} ${verse.chapter}:${verse.verse}`,
          text: customMessage ? `${customMessage}\n\n${verseText}` : verseText,
          url: shareUrl,
        });
        setShowShareDialog(false);
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      handleCopyToClipboard();
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Share2 className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setShowShareDialog(true)}>
            <Share2 className="h-4 w-4 mr-2" />
            Share with message
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCopyToClipboard}>
            <Copy className="h-4 w-4 mr-2" />
            Copy to clipboard
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleShareToSocial('twitter')}>
            <Twitter className="h-4 w-4 mr-2" />
            Share on Twitter
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleShareToSocial('facebook')}>
            <Facebook className="h-4 w-4 mr-2" />
            Share on Facebook
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleShareToSocial('whatsapp')}>
            <MessageCircle className="h-4 w-4 mr-2" />
            Share on WhatsApp
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleShareToSocial('email')}>
            <Mail className="h-4 w-4 mr-2" />
            Share via Email
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Verse</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm italic">"{verse.text}"</p>
              <p className="text-sm font-medium mt-2">
                {verse.book_name} {verse.chapter}:{verse.verse}
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">
                Add your message (optional)
              </label>
              <Textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Share your thoughts about this verse..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowShareDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCopyToClipboard} variant="outline">
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
            <Button onClick={handleNativeShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}