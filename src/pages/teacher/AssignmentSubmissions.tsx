
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { mockAssignments, mockSubmissions, mockCourses, updateSubmission, getSubmissionsWithPlagiarismInfo } from '@/services/mockData';
import PlagiarismMeter from '@/components/PlagiarismMeter';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { CheckCircle, ChevronDown, FileText, MessageCircle } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';
import TeacherAssignmentDiscussion from '@/components/TeacherAssignmentDiscussion';

const TeacherAssignmentSubmissions = () => {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  
  const [assignment, setAssignment] = useState<any>(null);
  const [course, setCourse] = useState<any>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [plagiarismClusters, setPlagiarismClusters] = useState<any[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [marks, setMarks] = useState<number | ''>('');
  const [feedback, setFeedback] = useState('');
  const [activeTab, setActiveTab] = useState('submissions');
  
  useEffect(() => {
    if (!assignmentId) return;
    
    // Find the assignment
    const foundAssignment = mockAssignments.find(a => a.id === assignmentId);
    if (foundAssignment) {
      setAssignment(foundAssignment);
      
      // Find the course
      const foundCourse = mockCourses.find(c => c.id === foundAssignment.courseId);
      setCourse(foundCourse);
      
      // Get all submissions for this assignment with plagiarism info
      const { submissions, plagiarismClusters } = getSubmissionsWithPlagiarismInfo(assignmentId);
      setSubmissions(submissions);
      setPlagiarismClusters(plagiarismClusters);
    }
  }, [assignmentId]);
  
  const handleOpenDialog = (submission: any) => {
    setSelectedSubmission(submission);
    setMarks(submission.marks || '');
    setFeedback(submission.feedback || '');
    setDialogOpen(true);
  };
  
  const handleSaveGrades = () => {
    if (!selectedSubmission || marks === '') return;
    
    try {
      // Update the submission with marks and feedback
      const updatedSubmission = updateSubmission(selectedSubmission.id, {
        marks: Number(marks),
        feedback,
      });
      
      // Update the local state
      setSubmissions(prev => prev.map(sub => 
        sub.id === updatedSubmission.id ? updatedSubmission : sub
      ));
      
      // Close the dialog
      setDialogOpen(false);
      
      // Show success toast
      toast({
        title: "Grades saved successfully",
        description: `Marks: ${marks}, Feedback saved for ${selectedSubmission.studentName}`,
      });
      
      // Create notification for the student
      if (user) {
        addNotification({
          userId: selectedSubmission.studentId,
          title: "Assignment Graded",
          message: `Your assignment "${assignment.title}" has been graded. You received ${marks} marks.`,
        });
      }
    } catch (error) {
      console.error('Error saving grades:', error);
      toast({
        title: "Error",
        description: "There was an error saving the grades",
        variant: "destructive",
      });
    }
  };
  
  if (!assignment || !course) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="submissions" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{assignment.title}</h2>
            <p className="text-muted-foreground">
              {course.title} ({course.code}) - View and grade student submissions
            </p>
          </div>
          
          <TabsList className="mt-4 md:mt-0">
            <TabsTrigger value="submissions">Submissions</TabsTrigger>
            <TabsTrigger value="discussion">
              <div className="flex items-center">
                <MessageCircle className="w-4 h-4 mr-2" />
                Discussion
              </div>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="submissions" className="space-y-6">
          {plagiarismClusters.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Potential Plagiarism Detected</CardTitle>
                <CardDescription>
                  The following groups of submissions have similar or identical content.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {plagiarismClusters.map((cluster, index) => (
                  <Collapsible key={index} className="border rounded-lg p-4">
                    <CollapsibleTrigger className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <PlagiarismMeter value={cluster.plagiarismScore} size="sm" />
                        <span className="ml-2">
                          {cluster.studentNames.length} student{cluster.studentNames.length !== 1 ? 's' : ''} with similar submissions
                        </span>
                      </div>
                      <ChevronDown className="h-4 w-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-4">
                      <div className="space-y-2">
                        <p className="font-medium">Students involved:</p>
                        <ul className="list-disc pl-6">
                          {cluster.studentNames.map((name: string, i: number) => (
                            <li key={i}>{name}</li>
                          ))}
                        </ul>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle>All Submissions</CardTitle>
              <CardDescription>
                {submissions.length} submission{submissions.length !== 1 ? 's' : ''} received
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {submissions.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">
                    No submissions received yet.
                  </p>
                ) : (
                  submissions.map((submission) => (
                    <div 
                      key={submission.id} 
                      className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="space-y-1">
                        <div className="font-medium flex items-center">
                          {submission.studentName} 
                          {submission.marks && (
                            <span className="ml-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full flex items-center">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Graded
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Roll Number: {submission.rollNumber} • Submitted on {new Date(submission.submittedAt).toLocaleDateString()}
                        </div>
                        {submission.plagiarismScore > 0 && (
                          <div className="flex items-center mt-1">
                            <PlagiarismMeter value={submission.plagiarismScore} size="xs" />
                            <span className="text-xs ml-1">
                              {submission.plagiarismScore}% similar to other submissions
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex mt-3 md:mt-0 space-x-2 w-full md:w-auto">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 md:flex-none"
                          onClick={() => window.open(submission.fileUrl, '_blank')}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button 
                          size="sm"
                          className="flex-1 md:flex-none"
                          onClick={() => handleOpenDialog(submission)}
                        >
                          Grade
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Grade Submission</DialogTitle>
                <DialogDescription>
                  Student: {selectedSubmission?.studentName}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="marks">Marks (out of {assignment.totalMarks})</Label>
                  <Input 
                    id="marks" 
                    type="number"
                    min="0"
                    max={assignment.totalMarks} 
                    value={marks}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (!isNaN(val) && val >= 0 && val <= assignment.totalMarks) {
                        setMarks(val);
                      } else if (e.target.value === '') {
                        setMarks('');
                      }
                    }}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="feedback">Feedback</Label>
                  <Textarea 
                    id="feedback" 
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Provide feedback to the student..."
                    rows={4}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveGrades} disabled={marks === ''}>
                  Save Grades
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>
        
        <TabsContent value="discussion">
          <TeacherAssignmentDiscussion
            assignmentId={assignmentId || ''}
            assignmentTitle={assignment.title}
            courseId={assignment.courseId}
            teacherId={user?.id || ''}
            onBack={() => setActiveTab('submissions')}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeacherAssignmentSubmissions;
