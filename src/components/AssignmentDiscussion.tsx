
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { Comment } from '@/types';
import { format } from 'date-fns';
import { MessageCircle, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from '@/contexts/NotificationContext';

// Mock functions for comments (would be replaced by real backend calls in production)
const getComments = (assignmentId: string): Comment[] => {
  try {
    const commentsString = localStorage.getItem(`comments-${assignmentId}`);
    if (commentsString) {
      const parsedComments = JSON.parse(commentsString);
      return parsedComments.map((c: any) => ({
        ...c,
        createdAt: new Date(c.createdAt),
      }));
    }
    return [];
  } catch (error) {
    console.error('Error getting comments:', error);
    return [];
  }
};

const saveComments = (assignmentId: string, comments: Comment[]) => {
  localStorage.setItem(`comments-${assignmentId}`, JSON.stringify(comments));
};

const addComment = (comment: Omit<Comment, 'id' | 'createdAt'>): Comment => {
  const newComment: Comment = {
    ...comment,
    id: Math.random().toString(36).substring(2, 9),
    createdAt: new Date(),
  };
  
  const comments = getComments(comment.assignmentId);
  const updatedComments = [newComment, ...comments];
  saveComments(comment.assignmentId, updatedComments);
  
  return newComment;
};

interface AssignmentDiscussionProps {
  assignmentId: string;
  assignmentTitle: string;
  courseId: string;
  teacherId: string;
}

const AssignmentDiscussion: React.FC<AssignmentDiscussionProps> = ({
  assignmentId,
  assignmentTitle,
  courseId,
  teacherId,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  
  // Load existing comments
  useEffect(() => {
    const loadedComments = getComments(assignmentId);
    setComments(loadedComments);
    
    // Set up polling for "real-time" updates (would use WebSockets in production)
    const interval = setInterval(() => {
      const refreshedComments = getComments(assignmentId);
      if (JSON.stringify(refreshedComments) !== JSON.stringify(comments)) {
        setComments(refreshedComments);
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, [assignmentId]);
  
  const handleSubmitComment = () => {
    if (!user || !newComment.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      // Add the new comment
      const comment = addComment({
        assignmentId,
        userId: user.id,
        userName: user.name,
        userType: user.type,
        content: newComment,
      });
      
      // Update the local state
      setComments(prev => [comment, ...prev]);
      setNewComment('');
      
      toast({
        title: "Comment posted",
        description: "Your comment has been posted successfully.",
      });
      
      // Create notification for teacher if student is commenting
      if (user.type === 'student') {
        addNotification({
          userId: teacherId, // Send to the teacher
          title: "New Question on Assignment",
          message: `${user.name} asked a question on "${assignmentTitle}"`,
        });
      } 
      // Create notification for students if teacher is commenting
      else if (user.type === 'teacher') {
        addNotification({
          userId: 'student', // Send to all students
          title: "Teacher Response on Assignment",
          message: `Teacher responded to questions on "${assignmentTitle}"`,
        });
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      toast({
        title: "Error",
        description: "Failed to post your comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageCircle className="w-5 h-5 mr-2" />
          Community Discussion
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {user && (
          <div className="flex items-start space-x-2">
            <Textarea 
              placeholder="Ask a question or share your thoughts..." 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleSubmitComment} 
              disabled={isSubmitting || !newComment.trim()}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {comments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No questions or comments yet. Be the first to start the discussion!
            </p>
          ) : (
            comments.map((comment) => (
              <div 
                key={comment.id} 
                className={`p-4 rounded-lg ${
                  comment.userType === 'teacher' 
                    ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' 
                    : 'bg-muted'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="font-medium flex items-center">
                    {comment.userName}
                    {comment.userType === 'teacher' && (
                      <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                        Teacher
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(comment.createdAt), 'MMM d, yyyy h:mm a')}
                  </span>
                </div>
                <p className="mt-2 whitespace-pre-wrap">{comment.content}</p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AssignmentDiscussion;
