import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Download,
  FileText,
  Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { mockAssignments, mockCourses, mockSubmissions, addSubmission } from '@/services/mockData';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import FileUploader from '@/components/FileUploader';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import PlagiarismMeter from '@/components/PlagiarismMeter';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import AssignmentDiscussion from '@/components/AssignmentDiscussion';

const StudentAssignmentDetail = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [assignment, setAssignment] = useState(mockAssignments.find(a => a.id === assignmentId));
  const [course, setCourse] = useState(assignment ? mockCourses.find(c => c.id === assignment.courseId) : null);
  const [submission, setSubmission] = useState(
    mockSubmissions.find(s => s.assignmentId === assignmentId && s.studentId === user?.id)
  );
  
  useEffect(() => {
    const currentAssignment = mockAssignments.find(a => a.id === assignmentId);
    setAssignment(currentAssignment);
    
    if (currentAssignment) {
      setCourse(mockCourses.find(c => c.id === currentAssignment.courseId));
    }
    
    setSubmission(mockSubmissions.find(
      s => s.assignmentId === assignmentId && s.studentId === user?.id
    ));
  }, [assignmentId, user?.id]);
  
  const [rollNumber, setRollNumber] = useState(submission?.rollNumber || '');
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [isFileValid, setIsFileValid] = useState(true);
  const [fileError, setFileError] = useState<string | null>(null);
  
  const handleFileRead = (file: File) => {
    if (!file) {
      setIsFileValid(false);
      setFileError('No file selected');
      return;
    }
    
    if (!file.name.toLowerCase().endsWith('.txt')) {
      setIsFileValid(false);
      setFileError('Only .txt files are allowed for plagiarism detection');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setFileContent(text);
      setIsFileValid(true);
      setFileError(null);
    };
    
    reader.onerror = () => {
      setIsFileValid(false);
      setFileError('Error reading the file');
    };
    
    reader.readAsText(file);
  };
  
  useEffect(() => {
    if (file) {
      handleFileRead(file);
    }
  }, [file]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rollNumber || !file || !isFileValid) {
      toast({
        title: 'Error',
        description: fileError || 'Please enter your roll number and upload a valid text file',
        variant: 'destructive',
      });
      return;
    }
    
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to submit an assignment',
        variant: 'destructive',
      });
      return;
    }
    
    const newSubmission = addSubmission({
      assignmentId: assignmentId || '',
      studentId: user.id,
      studentName: user.name,
      fileUrl: URL.createObjectURL(file),
      rollNumber: rollNumber,
      fileContent: fileContent,
    });
    
    toast({
      title: 'Success',
      description: 'Assignment submitted successfully',
    });
    
    setSubmission(newSubmission);
  };
  
  if (!assignment || !course) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <FileText className="h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">Assignment not found</h3>
        <p className="text-muted-foreground">The assignment you're looking for doesn't exist.</p>
        <Button className="mt-4" onClick={() => navigate('/student/assignments')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Assignments
        </Button>
      </div>
    );
  }

  const getTimeStatus = () => {
    const now = new Date();
    const dueDateObj = new Date(assignment.dueDate);
    
    if (now > dueDateObj) {
      return { label: 'Overdue', variant: 'destructive' as const };
    }
    
    const diffTime = dueDateObj.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 2) {
      return { label: 'Due Soon', variant: 'warning' as const };
    }
    
    return { label: `${diffDays} days left`, variant: 'outline' as const };
  };
  
  const timeStatus = getTimeStatus();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <Button 
          variant="outline" 
          className="w-fit"
          onClick={() => navigate('/student/assignments')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Assignments
        </Button>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h2 className="text-3xl font-bold tracking-tight">{assignment.title}</h2>
          {submission ? (
            <Badge variant="success">Submitted</Badge>
          ) : (
            <Badge variant={timeStatus.variant}>{timeStatus.label}</Badge>
          )}
        </div>
        <p className="text-muted-foreground">
          Course: {course.title} | Due: {format(new Date(assignment.dueDate), 'MMMM dd, yyyy')} | 
          Total Marks: {assignment.totalMarks}
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Assignment Details</CardTitle>
          <CardDescription>{course.code} - {course.title}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium">Description</h3>
            <p className="mt-1 text-muted-foreground">{assignment.description}</p>
          </div>
          
          {assignment.fileUrl && (
            <div>
              <h3 className="font-medium">Assignment File</h3>
              <Button variant="outline" className="mt-2">
                <Download className="mr-2 h-4 w-4" />
                Download Assignment
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {submission ? (
        <Card>
          <CardHeader>
            <CardTitle>Your Submission</CardTitle>
            <CardDescription>
              Submitted on {format(new Date(submission.submittedAt), 'MMMM dd, yyyy')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h3 className="font-medium">Roll Number</h3>
                <p className="mt-1 text-muted-foreground">{submission.rollNumber}</p>
              </div>
              <div>
                <h3 className="font-medium">Submission File</h3>
                <Button variant="outline" className="mt-1" onClick={() => window.open(submission.fileUrl)}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Your Submission
                </Button>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Plagiarism Detection</h3>
                <div className="mt-2 flex items-center gap-4">
                  <PlagiarismMeter score={submission.plagiarismScore || 0} size="lg" />
                  <div>
                    <p className="font-bold text-xl">{submission.plagiarismScore}%</p>
                    <p className="text-muted-foreground text-sm">
                      {submission.plagiarismScore && submission.plagiarismScore > 50 
                        ? 'High similarity detected with other submissions' 
                        : submission.plagiarismScore > 0
                          ? 'Low similarity with other submissions'
                          : 'No similarity with other submissions'}
                    </p>
                  </div>
                </div>
              </div>
              
              {submission.marks !== undefined && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-medium">Grading</h3>
                    <div className="mt-2">
                      <p className="font-bold text-xl">
                        {submission.marks} / {assignment.totalMarks}
                        <span className="ml-2 text-sm font-normal text-muted-foreground">
                          ({Math.round((submission.marks / assignment.totalMarks) * 100)}%)
                        </span>
                      </p>
                      {submission.feedback && (
                        <div className="mt-2">
                          <h4 className="text-sm font-medium">Feedback:</h4>
                          <p className="text-muted-foreground mt-1">{submission.feedback}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Submit Assignment</CardTitle>
            <CardDescription>
              Upload your assignment file below before the due date.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Important</AlertTitle>
              <AlertDescription>
                Only .txt files are accepted for plagiarism detection. Your submission will be checked against previous submissions to detect potential plagiarism.
              </AlertDescription>
            </Alert>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="rollNumber">Your Roll Number</Label>
                  <Input
                    id="rollNumber"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    placeholder="Enter your roll number"
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label>Assignment File</Label>
                  <FileUploader 
                    onFileSelect={(selectedFile) => setFile(selectedFile)} 
                    accept=".txt" 
                    label="Upload Text File"
                  />
                  {fileError && (
                    <p className="text-xs text-destructive">{fileError}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Only plain text (.txt) files are accepted
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button type="submit" disabled={!isFileValid}>
                  <Upload className="mr-2 h-4 w-4" />
                  Submit Assignment
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      
      <AssignmentDiscussion assignmentId={assignmentId || ''} user={user} />
    </div>
  );
};

export default StudentAssignmentDetail;
