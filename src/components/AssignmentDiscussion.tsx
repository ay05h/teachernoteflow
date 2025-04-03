
import React, { useState, useEffect } from 'react';
import { User, Comment } from '@/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { SendHorizontal, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock data for comments (in a real app, this would come from a database)
let mockComments: Comment[] = [];

interface AssignmentDiscussionProps {
  assignmentId: string;
  user: User | null;
}

const AssignmentDiscussion: React.FC<AssignmentDiscussionProps> = ({ assignmentId, user }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const { toast } = useToast();
  
  // Fetch comments for this assignment
  useEffect(() => {
    // Filter comments for this assignment
    const assignmentComments = mockComments.filter(
      comment => comment.assignmentId === assignmentId
    );
    setComments(assignmentComments);
  }, [assignmentId, mockComments]);
  
  const handleSubmitComment = () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to post a comment",
        variant: "destructive",
      });
      return;
    }
    
    if (!newComment.trim()) {
      toast({
        title: "Error",
        description: "Comment cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    const newCommentObj: Comment = {
      id: Math.random().toString(36).substring(2, 9),
      assignmentId,
      userId: user.id,
      userName: user.name,
      userType: user.type,
      content: newComment,
      createdAt: new Date(),
    };
    
    // Add to mock data (in a real app, this would be saved to a database)
    mockComments = [...mockComments, newCommentObj];
    
    // Update local state
    setComments([...comments, newCommentObj]);
    setNewComment('');
    
    toast({
      title: "Comment posted",
      description: "Your comment has been added to the discussion",
    });
  };
  
  // Function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Discussion
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Comment input area */}
        <div className="space-y-4">
          <Textarea
            placeholder="Ask a question or share your thoughts..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
          />
          <div className="flex justify-end">
            <Button onClick={handleSubmitComment} disabled={!user || !newComment.trim()}>
              <SendHorizontal className="mr-2 h-4 w-4" />
              Post Comment
            </Button>
          </div>
        </div>
        
        {/* Comment list */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6">
              <MessageCircle className="h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-center text-muted-foreground">
                No comments yet. Be the first to start the discussion!
              </p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="rounded-lg border p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className={comment.userType === 'teacher' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}>
                      {getInitials(comment.userName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{comment.userName}</span>
                      <Badge variant={comment.userType === 'teacher' ? 'default' : 'secondary'} className="text-xs">
                        {comment.userType === 'teacher' ? 'Teacher' : 'Student'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(comment.createdAt), 'MMM dd, yyyy • h:mm a')}
                      </span>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AssignmentDiscussion;
