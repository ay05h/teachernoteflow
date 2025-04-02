
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockAssignments, mockCourses, addSubmission, mockSubmissions } from '@/services/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FileText, Calendar, Clock, BookOpen, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Assignment, Submission } from '@/types';
import FileUploader from '@/components/FileUploader';
import { useNotifications } from '@/contexts/NotificationContext';
import { generateSubmissionNotification } from '@/services/notificationService';
import AssignmentDiscussion from '@/components/AssignmentDiscussion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const AssignmentDetail = () => {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [course, setCourse] = useState<any>(null);
  const [fileContent, setFileContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('details');
  const [existingSubmission, setExistingSubmission] = useState<Submission | null>(null);
  const [rollNumber, setRollNumber] = useState('');
  
  useEffect(() => {
    if (!assignmentId) {
      console.error("No assignment ID provided");
      toast({
        title: 'Error',
        description: 'Assignment not found',
        variant: 'destructive',
      });
      navigate('/student/assignments');
      return;
    }
    
    console.log("Assignment ID from params:", assignmentId);
    // Find assignment by id
    const foundAssignment = mockAssignments.find(a => a.id === assignmentId);
    if (foundAssignment) {
      setAssignment(foundAssignment);
      
      // Find associated course
      const foundCourse = mockCourses.find(c => c.id === foundAssignment.courseId);
      setCourse(foundCourse);
      
      // Check if the student has already submitted this assignment
      if (user) {
        const submission = mockSubmissions.find(
          s => s.assignmentId === assignmentId && s.studentId === user.id
        );
        if (submission) {
          setExistingSubmission(submission);
        }
      }
    } else {
      console.error("Assignment not found for ID:", assignmentId);
      toast({
        title: 'Error',
        description: 'Assignment not found',
        variant: 'destructive',
      });
      navigate('/student/assignments');
    }
  }, [assignmentId, user, toast, navigate]);
  
  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    
    // Only read content for TXT files for plagiarism detection
    if (file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setFileContent(e.target.result.toString());
        }
      };
      reader.readAsText(file);
    } else {
      // For non-text files like PDF, set empty content
      setFileContent('');
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!assignment || !user) {
      toast({
        title: 'Error',
        description: 'Error accessing assignment or user information',
        variant: 'destructive',
      });
      return;
    }
    
    if (!selectedFile) {
      toast({
        title: 'Error',
        description: 'Please select a file to submit',
        variant: 'destructive',
      });
      return;
    }
    
    if (!rollNumber) {
      toast({
        title: 'Error',
        description: 'Please enter your roll number',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, we would upload the file to a server
      // For this demo, we'll just use a placeholder URL
      const fileUrl = URL.createObjectURL(selectedFile);
      
      // Add submission to mock data
      const submission = addSubmission({
        assignmentId: assignment.id,
        studentId: user.id,
        studentName: user.name,
        rollNumber: rollNumber,
        fileUrl,
        fileContent,
      });
      
      setExistingSubmission(submission);
      
      // Create notification for the teacher
      if (course) {
        const teacherNotification = generateSubmissionNotification(
          submission, 
          assignment,
          user,
          true
        );
        addNotification(teacherNotification);
        
        // Notification for the student who submitted
        const studentNotification = generateSubmissionNotification(
          submission,
          assignment,
          user,
          false
        );
        addNotification(studentNotification);
      }
      
      toast({
        title: 'Success',
        description: 'Assignment submitted successfully',
      });
    } catch (error) {
      console.error('Error submitting assignment:', error);
      toast({
        title: 'Error',
        description: 'There was an error submitting your assignment',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!assignment || !course) {
    return <div className="flex items-center justify-center h-64">
      <p className="text-muted-foreground">Loading assignment details...</p>
    </div>;
  }
  
  // Format the due date properly
  const dueDate = assignment.dueDate instanceof Date 
    ? assignment.dueDate 
    : new Date(assignment.dueDate);
  
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" onClick={() => navigate('/student/assignments')}>
            <BookOpen className="w-4 h-4 mr-2" />
            Assignments
          </Button>
          <span>/</span>
          <h2 className="text-2xl font-bold">{assignment.title}</h2>
        </div>
        <p className="text-muted-foreground">
          {existingSubmission ? 'Your submission details' : 'Submit your assignment here.'}
        </p>
      </div>
      
      <Tabs defaultValue="details" onValueChange={setActiveTab} value={activeTab}>
        <TabsList>
          <TabsTrigger value="details">Assignment Details</TabsTrigger>
          <TabsTrigger value="discussion">
            <div className="flex items-center">
              <MessageCircle className="w-4 h-4 mr-2" />
              Community Discussion
            </div>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>{assignment.title}</CardTitle>
              <CardDescription>
                {course.title} ({course.code})
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>Description:</span>
                </div>
                <p>{assignment.description}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Due Date:</span>
                </div>
                <p>{format(dueDate, 'PPP')}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Total Marks:</span>
                </div>
                <p>{assignment.totalMarks}</p>
              </div>
              
              {existingSubmission ? (
                <div className="space-y-4 rounded-lg bg-secondary/50 p-4">
                  <h3 className="font-medium">Your Submission</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Submitted on {format(new Date(existingSubmission.submittedAt), 'PPP')}
                    </p>
                    {existingSubmission.marks !== undefined ? (
                      <p className="font-medium">
                        Score: {existingSubmission.marks}/{assignment.totalMarks}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">Not graded yet</p>
                    )}
                  </div>
                  
                  {existingSubmission.feedback && (
                    <div className="mt-2">
                      <h4 className="text-sm font-medium">Feedback:</h4>
                      <p className="text-sm">{existingSubmission.feedback}</p>
                    </div>
                  )}
                  
                  <div className="mt-2">
                    <Button variant="outline" asChild>
                      <a href={existingSubmission.fileUrl} target="_blank" rel="noopener noreferrer">
                        <FileText className="mr-2 h-4 w-4" />
                        View Submitted File
                      </a>
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="rollNumber">Roll Number</Label>
                    <Input 
                      id="rollNumber" 
                      value={rollNumber} 
                      onChange={(e) => setRollNumber(e.target.value)} 
                      placeholder="Enter your roll number"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="file">Upload File</Label>
                    <FileUploader onFileSelect={handleFileSelect} />
                    <p className="text-xs text-muted-foreground mt-1">
                      You can submit PDF documents or TXT files. TXT files will be used for plagiarism checking.
                    </p>
                  </div>
                  
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Assignment'}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="discussion">
          <AssignmentDiscussion 
            assignmentId={assignment.id} 
            assignmentTitle={assignment.title}
            courseId={assignment.courseId}
            teacherId={course.teacherId}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AssignmentDetail;
