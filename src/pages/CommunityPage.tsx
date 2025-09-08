import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Heart, MessageCircle, Share2, Users, Plus, Bookmark, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  verse: {
    book_name: string;
    chapter: number;
    verse: number;
    text: string;
  };
  reflection: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isBookmarked: boolean;
  createdAt: string;
  tags: string[];
}

interface CommunityComment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

const SAMPLE_POSTS: CommunityPost[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'Sarah M.',
    verse: {
      book_name: 'Philippians',
      chapter: 4,
      verse: 13,
      text: 'I can do all things through Christ who strengthens me.'
    },
    reflection: 'This verse has been my anchor during challenging times. It reminds me that with God, nothing is impossible. When I feel overwhelmed, I come back to this truth.',
    likes: 24,
    comments: 8,
    shares: 5,
    isLiked: false,
    isBookmarked: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    tags: ['strength', 'faith', 'perseverance']
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'David K.',
    verse: {
      book_name: 'Psalm',
      chapter: 23,
      verse: 4,
      text: 'Even though I walk through the valley of the shadow of death, I will fear no evil, for you are with me; your rod and your staff, they comfort me.'
    },
    reflection: 'In times of uncertainty, this psalm brings such peace. God\'s presence is our greatest comfort.',
    likes: 31,
    comments: 12,
    shares: 7,
    isLiked: true,
    isBookmarked: true,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    tags: ['comfort', 'peace', 'trust']
  },
  {
    id: '3',
    userId: 'user3',
    userName: 'Mary L.',
    verse: {
      book_name: 'Romans',
      chapter: 8,
      verse: 28,
      text: 'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.'
    },
    reflection: 'Even in difficult seasons, I hold onto this promise. God is always working for our good, even when we can\'t see it.',
    likes: 18,
    comments: 6,
    shares: 3,
    isLiked: false,
    isBookmarked: false,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    tags: ['purpose', 'trust', 'hope']
  }
];

export default function CommunityPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>(SAMPLE_POSTS);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [newReflection, setNewReflection] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('trending');

  const timeAgo = (dateString: string): string => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - past.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return `${Math.floor(diffInDays / 7)}w ago`;
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          isLiked: !post.isLiked
        };
      }
      return post;
    }));
  };

  const handleBookmark = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isBookmarked: !post.isBookmarked
        };
      }
      return post;
    }));
    toast.success('Post bookmarked!');
  };

  const handleShare = (post: CommunityPost) => {
    const shareText = `"${post.verse.text}" - ${post.verse.book_name} ${post.verse.chapter}:${post.verse.verse}\n\n${post.reflection}`;
    
    if (navigator.share) {
      navigator.share({
        title: `${post.verse.book_name} ${post.verse.chapter}:${post.verse.verse}`,
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('Post copied to clipboard!');
    }
  };

  const handleCreatePost = () => {
    if (!user) {
      toast.error('Please sign in to share reflections');
      return;
    }
    setShowShareDialog(true);
  };

  const commonTags = ['faith', 'hope', 'love', 'peace', 'strength', 'comfort', 'trust', 'joy', 'worship', 'prayer'];

  const filteredPosts = posts.filter(post => {
    switch (activeTab) {
      case 'trending':
        return true; // Show all posts, sorted by engagement
      case 'recent':
        return true; // Show all posts, sorted by date
      case 'bookmarked':
        return post.isBookmarked;
      default:
        return true;
    }
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (activeTab === 'trending') {
      const aEngagement = a.likes + a.comments + a.shares;
      const bEngagement = b.likes + b.comments + b.shares;
      return bEngagement - aEngagement;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <Layout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Community</h1>
            <p className="text-muted-foreground">
              Share and discover meaningful reflections on God's Word
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={handleCreatePost}>
              <Plus className="h-4 w-4 mr-2" />
              Share Reflection
            </Button>
            <Users className="h-8 w-8 text-primary" />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="bookmarked">Bookmarked</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-6">
            {sortedPosts.map(post => (
              <Card key={post.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback>
                          {post.userName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{post.userName}</p>
                        <p className="text-sm text-muted-foreground">{timeAgo(post.createdAt)}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleBookmark(post.id)}
                      className={post.isBookmarked ? 'text-yellow-600' : ''}
                    >
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Verse */}
                  <div className="bg-muted/50 p-4 rounded-lg border-l-4 border-l-primary">
                    <p className="italic text-lg leading-relaxed">"{post.verse.text}"</p>
                    <p className="text-sm font-medium mt-2 text-primary">
                      {post.verse.book_name} {post.verse.chapter}:{post.verse.verse}
                    </p>
                  </div>

                  {/* Reflection */}
                  <p className="text-sm leading-relaxed">{post.reflection}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(post.id)}
                        className={`${post.isLiked ? 'text-red-600' : ''} p-0`}
                      >
                        <Heart className={`h-4 w-4 mr-1 ${post.isLiked ? 'fill-current' : ''}`} />
                        {post.likes}
                      </Button>
                      <Button variant="ghost" size="sm" className="p-0">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {post.comments}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleShare(post)}
                        className="p-0"
                      >
                        <Share2 className="h-4 w-4 mr-1" />
                        {post.shares}
                      </Button>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Eye className="h-3 w-3 mr-1" />
                      {post.likes + post.comments * 2 + post.shares * 3} views
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {sortedPosts.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No posts found</h3>
                  <p className="text-muted-foreground mb-4">
                    {activeTab === 'bookmarked' 
                      ? 'You haven\'t bookmarked any posts yet.'
                      : 'Be the first to share a reflection!'}
                  </p>
                  <Button onClick={handleCreatePost}>
                    <Plus className="h-4 w-4 mr-2" />
                    Share Reflection
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Share Dialog */}
        <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Share Your Reflection</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Your reflection
                </label>
                <Textarea
                  value={newReflection}
                  onChange={(e) => setNewReflection(e.target.value)}
                  placeholder="Share how this verse speaks to you..."
                  rows={4}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Tags (optional)
                </label>
                <div className="flex flex-wrap gap-2">
                  {commonTags.map(tag => (
                    <Button
                      key={tag}
                      variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setSelectedTags(prev => 
                          prev.includes(tag)
                            ? prev.filter(t => t !== tag)
                            : [...prev, tag]
                        );
                      }}
                    >
                      #{tag}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowShareDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  toast.success('Feature coming soon!');
                  setShowShareDialog(false);
                }}
                disabled={!newReflection.trim()}
              >
                Share Reflection
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}