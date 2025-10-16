import { useState } from 'react';
import { Page, UserRole } from '../App';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Slider } from './ui/slider';
import { motion } from 'motion/react';
import { MessageSquare, ThumbsUp, Reply, Bot, BarChart3, Sparkles } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

interface DiscussionForumProps {
  onNavigate: (page: Page) => void;
  userRole: UserRole;
}

const threads = [
  {
    id: 1,
    title: 'Understanding Backpropagation in Neural Networks',
    author: 'Sarah Chen',
    avatar: '👩‍💻',
    time: '2 hours ago',
    replies: 12,
    upvotes: 24,
    category: 'Technical',
    summary: 'Discussion about gradient descent and how backpropagation works in deep learning models.',
  },
  {
    id: 2,
    title: 'Best Practices for Data Preprocessing',
    author: 'Alex Rivera',
    avatar: '👨‍🎓',
    time: '5 hours ago',
    replies: 8,
    upvotes: 18,
    category: 'Best Practices',
    summary: 'Sharing tips and techniques for cleaning and preparing data for machine learning.',
  },
  {
    id: 3,
    title: 'Resources for Deep Learning Beginners',
    author: 'Emma Wilson',
    avatar: '👩‍🎓',
    time: '1 day ago',
    replies: 15,
    upvotes: 32,
    category: 'Resources',
    summary: 'Curated list of books, courses, and tutorials for learning deep learning from scratch.',
  },
  {
    id: 4,
    title: 'Help with Assignment #4',
    author: 'Michael Brown',
    avatar: '👨‍💼',
    time: '1 day ago',
    replies: 0,
    upvotes: 3,
    category: 'Help',
    summary: 'Having trouble implementing the neural network for assignment 4.',
  },
];

const pollData = {
  question: 'What topic should we cover next?',
  options: [
    { label: 'Transformers', votes: 45 },
    { label: 'GANs', votes: 32 },
    { label: 'Reinforcement Learning', votes: 28 },
    { label: 'Computer Vision', votes: 38 },
  ],
};

export function DiscussionForum({ onNavigate, userRole }: DiscussionForumProps) {
  const [filter, setFilter] = useState('most-active');
  const [pollVote, setPollVote] = useState<number | null>(null);
  const [expandedSummary, setExpandedSummary] = useState<number | null>(null);

  const handleVote = (index: number) => {
    setPollVote(index);
  };

  const totalVotes = pollData.options.reduce((sum, opt) => sum + opt.votes, 0);

  return (
    <div className="min-h-screen p-6">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1>Discussion Forum</h1>
              <p className="text-muted-foreground">Connect, collaborate, and learn together</p>
            </div>
            <Button className="bg-primary hover:bg-accent">Start Discussion</Button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="most-active">Most Active</SelectItem>
                <SelectItem value="unanswered">Unanswered</SelectItem>
                <SelectItem value="top-rated">Top Rated</SelectItem>
                <SelectItem value="recent">Most Recent</SelectItem>
              </SelectContent>
            </Select>
            
            <Badge variant="outline" className="border-primary text-primary">
              {threads.length} Active Threads
            </Badge>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content - Threads */}
          <div className="lg:col-span-2 space-y-4">
            {threads.map((thread, index) => (
              <motion.div
                key={thread.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.01 }}
              >
                <Card className="p-5 hover:shadow-lg transition-all border-secondary cursor-pointer">
                  {/* Thread Header */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="text-2xl">{thread.avatar}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-sm mb-1">{thread.title}</h3>
                          <p className="text-xs text-muted-foreground">
                            {thread.author} • {thread.time}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {thread.category}
                        </Badge>
                      </div>

                      {/* AI Summary */}
                      <Collapsible
                        open={expandedSummary === thread.id}
                        onOpenChange={(open) => setExpandedSummary(open ? thread.id : null)}
                      >
                        <CollapsibleTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 text-xs text-primary hover:bg-transparent mb-2"
                          >
                            <Bot className="h-3 w-3 mr-1" />
                            AI Summary
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="p-3 bg-secondary/30 rounded-lg mb-3">
                            <p className="text-xs text-muted-foreground">{thread.summary}</p>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>

                      {/* Thread Stats */}
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                          <ThumbsUp className="h-4 w-4" />
                          {thread.upvotes}
                        </button>
                        <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                          <MessageSquare className="h-4 w-4" />
                          {thread.replies} {thread.replies === 0 ? 'reply' : 'replies'}
                        </button>
                        
                        {/* Emoji Reactions */}
                        <div className="flex items-center gap-1 ml-auto">
                          <button className="text-lg hover:scale-125 transition-transform">👍</button>
                          <button className="text-lg hover:scale-125 transition-transform">❤️</button>
                          <button className="text-lg hover:scale-125 transition-transform">💡</button>
                          <button className="text-lg hover:scale-125 transition-transform">🎉</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Sidebar - Quick Poll & Reply Form */}
          <div className="space-y-6">
            {/* Quick Poll */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="h-5 w-5 text-primary" />
                <h2>Quick Poll</h2>
              </div>
              <Card className="p-4">
                <p className="mb-4">{pollData.question}</p>
                <div className="space-y-3">
                  {pollData.options.map((option, index) => {
                    const percentage = ((option.votes / totalVotes) * 100).toFixed(0);
                    const isVoted = pollVote === index;
                    
                    return (
                      <button
                        key={index}
                        onClick={() => handleVote(index)}
                        className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                          isVoted
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50 hover:bg-secondary/30'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm">{option.label}</span>
                          <span className="text-xs text-muted-foreground">{percentage}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-primary"
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.5, delay: 0.1 * index }}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  {totalVotes} votes • Poll closes in 2 days
                </p>
              </Card>
            </motion.div>

            {/* Reply Form */}
            {userRole !== 'admin' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Reply className="h-5 w-5 text-primary" />
                  <h2>Quick Reply</h2>
                </div>
                <Card className="p-4">
                  <Textarea
                    placeholder="Share your thoughts..."
                    className="min-h-[120px] mb-3"
                  />
                  <Button className="w-full bg-primary hover:bg-accent">Post Reply</Button>
                </Card>
              </motion.div>
            )}

            {/* Top Contributors */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-primary" />
                <h2>Top Contributors</h2>
              </div>
              <Card className="p-4">
                <div className="space-y-3">
                  {[
                    { name: 'Sarah Chen', posts: 127, avatar: '👩‍💻' },
                    { name: 'Alex Rivera', posts: 98, avatar: '👨‍🎓' },
                    { name: 'Emma Wilson', posts: 84, avatar: '👩‍🎓' },
                  ].map((contributor, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/30 transition-colors"
                    >
                      <div className="text-2xl">{contributor.avatar}</div>
                      <div className="flex-1">
                        <p className="text-sm">{contributor.name}</p>
                        <p className="text-xs text-muted-foreground">{contributor.posts} posts</p>
                      </div>
                      <Badge variant="outline" className="border-accent text-accent">
                        #{index + 1}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
