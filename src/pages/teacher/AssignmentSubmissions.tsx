import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Download, 
  FilePen, 
  FileText,
  Search, 
  UserCheck 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { mockAssignments, mockSubmissions, updateSubmission } from '@/services/mockData';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import PlagiarismMeter from '@/components/PlagiarismMeter';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import Chart from '@/components/Chart';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import AssignmentDiscussion from '@/components/AssignmentDiscussion';

const TeacherAssignmentSubmissions = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [assignment, setAssignment] = useState(mockAssignments.find(a => a.id === assignmentId));
  const [submissions, setSubmissions] = useState(mockSubmissions.filter(s => s.assignmentId === assignmentId));
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null);
  const [marks, setMarks] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  
  useEffect(() => {
    setAssignment(mockAssignments.find(a => a.id === assignmentId));
    setSubmissions(mockSubmissions.filter(s => s.assignmentId === assignmentId));
  }, [assignmentId, mockSubmissions, mockAssignments]);
  
  const filteredSubmissions = submissions.filter(submission => 
    submission.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleOpenDialog = (submissionId: string) => {
    const submission = submissions.find(s => s.id === submissionId);
    if (submission) {
      setMarks(submission.marks?.toString() || '');
      setFeedback(submission.feedback || '');
      setSelectedSubmission(submissionId);
    }
  };
  
  const handleCloseDialog = () => {
    setSelectedSubmission(null);
    setMarks('');
    setFeedback('');
  };
  
  const handleSaveGrading = () => {
    if (!selectedSubmission) return;
    
    const numericMarks = parseInt(marks);
    
    if (isNaN(numericMarks)) {
      toast({
        title: "Invalid marks",
        description: "Please enter a valid number for marks.",
        variant: "destructive"
      });
      return;
    }
    
    if (assignment && numericMarks > assignment.totalMarks) {
      toast({
        title: "Invalid marks",
        description: `Marks cannot exceed the maximum of ${assignment.totalMarks}.`,
        variant: "destructive"
      });
      return;
    }
    
    const updatedSubmission = updateSubmission(selectedSubmission, {
      marks: numericMarks,
      feedback: feedback
    });
    
    if (updatedSubmission) {
      toast({
        title: "Success",
        description: "Submission graded successfully",
      });
      
      setSubmissions(prevSubmissions => 
        prevSubmissions.map(s => 
          s.id === selectedSubmission ? { ...s, marks: numericMarks, feedback } : s
        )
      );
      
      handleCloseDialog();
    } else {
      toast({
        title: "Error",
        description: "Failed to update submission. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const totalSubmissions = submissions.length;
  const gradedSubmissions = submissions.filter(s => s.marks !== undefined).length;
  const highPlagiarism = submissions.filter(s => (s.plagiarismScore || 0) > 50).length;

  const plagiarismRanges = {
    '0-20%': submissions.filter(s => (s.plagiarismScore || 0) <= 20).length,
    '21-40%': submissions.filter(s => (s.plagiarismScore || 0) > 20 && (s.plagiarismScore || 0) <= 40).length,
    '41-60%': submissions.filter(s => (s.plagiarismScore || 0) > 40 && (s.plagiarismScore || 0) <= 60).length,
    '61-80%': submissions.filter(s => (s.plagiarismScore || 0) > 60 && (s.plagiarismScore || 0) <= 80).length,
    '81-100%': submissions.filter(s => (s.plagiarismScore || 0) > 80).length,
  };

  if (!assignment) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <FileText className="h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">Assignment not found</h3>
        <p className="text-muted-foreground">The assignment you're looking for doesn't exist.</p>
        <Button className="mt-4" onClick={() => navigate('/teacher/assignments')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Assignments
        </Button>
      </div>
    );
  }

  const handleDownload = (submissionId: string) => {
    const submission = submissions.find(s => s.id === submissionId);
    if (submission) {
      toast({
        title: "Download Started",
        description: `Downloading submission from ${submission.studentName}`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <Button 
          variant="outline" 
          className="w-fit"
          onClick={() => navigate('/teacher/assignments')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Assignments
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">{assignment.title}</h2>
        <p className="text-muted-foreground">
          Due: {format(new Date(assignment.dueDate), 'MMMM dd, yyyy')} | 
          Total Marks: {assignment.totalMarks}
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Total Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalSubmissions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Graded</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{gradedSubmissions} / {totalSubmissions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">High Plagiarism</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">{highPlagiarism}</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="submissions">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
          <TabsTrigger value="discussion">Discussion</TabsTrigger>
        </TabsList>
        
        <TabsContent value="submissions">
          <Card>
            <CardHeader>
              <CardTitle>Plagiarism Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Chart 
                  data={[
                    { name: '0-20%', value: plagiarismRanges['0-20%'] },
                    { name: '21-40%', value: plagiarismRanges['21-40%'] },
                    { name: '41-60%', value: plagiarismRanges['41-60%'] },
                    { name: '61-80%', value: plagiarismRanges['61-80%'] },
                    { name: '81-100%', value: plagiarismRanges['81-100%'] },
                  ]} 
                  type="bar"
                  title="Plagiarism Distribution" 
                />
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Student Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by student name or roll number..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {filteredSubmissions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <UserCheck className="h-10 w-10 text-muted-foreground" />
                  <p className="mt-2 text-center text-muted-foreground">
                    No submissions found matching your search.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Roll Number</TableHead>
                      <TableHead>Submitted On</TableHead>
                      <TableHead>Plagiarism</TableHead>
                      <TableHead>Marks</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubmissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell className="font-medium">{submission.studentName}</TableCell>
                        <TableCell>{submission.rollNumber}</TableCell>
                        <TableCell>{format(new Date(submission.submittedAt), 'MMM dd, yyyy')}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <PlagiarismMeter score={submission.plagiarismScore || 0} />
                            <span>{submission.plagiarismScore || 0}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {submission.marks !== undefined ? (
                            <Badge variant={submission.marks >= assignment.totalMarks * 0.7 ? "success" : "secondary"}>
                              {submission.marks} / {assignment.totalMarks}
                            </Badge>
                          ) : (
                            <Badge variant="outline">Not Graded</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDownload(submission.id)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleOpenDialog(submission.id)}
                            >
                              <FilePen className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="discussion">
          <AssignmentDiscussion assignmentId={assignmentId || ''} user={user} />
        </TabsContent>
      </Tabs>
      
      <Dialog open={!!selectedSubmission} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Grade Submission</DialogTitle>
            <DialogDescription>
              Provide feedback and assign marks for the student's submission.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="marks" className="text-sm font-medium">
                Marks (out of {assignment.totalMarks})
              </label>
              <Input
                id="marks"
                type="number"
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
                max={assignment.totalMarks}
                min="0"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="feedback" className="text-sm font-medium">
                Feedback
              </label>
              <Textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
                placeholder="Provide feedback on the submission"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button onClick={handleSaveGrading}>Save Grading</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeacherAssignmentSubmissions;
