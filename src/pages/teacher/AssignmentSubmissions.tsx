
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { mockAssignments, mockSubmissions, mockCourses, updateSubmission, getSubmissionsWithPlagiarismInfo } from '@/services/mockData';
import PlagiarismMeter from '@/components/PlagiarismMeter';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { CheckCircle, ChevronDown, FileText, MessageCircle, Users } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';
import TeacherAssignmentDiscussion from '@/components/TeacherAssignmentDiscussion';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

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
  const [submissionStats, setSubmissionStats] = useState({
    totalSubmissions: 0,
    plagiarismDetected: 0,
    lowPlagiarism: 0,
    mediumPlagiarism: 0,
    highPlagiarism: 0
  });
  
  useEffect(() => {
    if (!assignmentId) return;
    
    const foundAssignment = mockAssignments.find(a => a.id === assignmentId);
    if (foundAssignment) {
      setAssignment(foundAssignment);
      
      const foundCourse = mockCourses.find(c => c.id === foundAssignment.courseId);
      setCourse(foundCourse);
      
      const { submissions, plagiarismClusters } = getSubmissionsWithPlagiarismInfo(assignmentId);
      setSubmissions(submissions);
      setPlagiarismClusters(plagiarismClusters.sort((a, b) => b.plagiarismScore - a.plagiarismScore)); // Sort by plagiarism score descending

      // Calculate statistics
      const stats = {
        totalSubmissions: submissions.length,
        plagiarismDetected: submissions.filter(s => (s.plagiarismScore || 0) > 20).length,
        lowPlagiarism: submissions.filter(s => (s.plagiarismScore || 0) <= 20).length,
        mediumPlagiarism: submissions.filter(s => (s.plagiarismScore || 0) > 20 && (s.plagiarismScore || 0) <= 50).length,
        highPlagiarism: submissions.filter(s => (s.plagiarismScore || 0) > 50).length
      };
      setSubmissionStats(stats);
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
      const updatedSubmission = updateSubmission(selectedSubmission.id, {
        marks: Number(marks),
        feedback,
      });
      
      setSubmissions(prev => prev.map(sub => 
        sub.id === updatedSubmission?.id ? updatedSubmission : sub
      ));
      
      setDialogOpen(false);
      
      toast({
        title: "Grades saved successfully",
        description: `Marks: ${marks}, Feedback saved for ${selectedSubmission.studentName}`,
      });
      
      if (user) {
        addNotification({
          userId: selectedSubmission.studentId,
          title: "Assignment Graded",
          message: `Your assignment "${assignment.title}" has been graded. You received ${marks} marks.`,
          type: "student" // Explicitly route this to student
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
  
  // Generate data for the plagiarism distribution chart
  const generatePlagiarismDistributionData = () => {
    // Create bins for plagiarism percentage ranges (0-10, 11-20, ..., 91-100)
    const bins = Array.from({ length: 10 }, (_, i) => ({
      range: `${i * 10}-${(i + 1) * 10}%`,
      count: 0,
      percent: i * 10 // Starting percent for the range
    }));
    
    // Count submissions in each bin
    submissions.forEach(submission => {
      const score = submission.plagiarismScore || 0;
      const binIndex = Math.min(Math.floor(score / 10), 9); // Ensure we don't go out of bounds
      bins[binIndex].count++;
    });
    
    return bins;
  };
  
  const plagiarismDistribution = generatePlagiarismDistributionData();
  
  const COLORS = ['#22c55e', '#eab308', '#ef4444'];
  const STATUS_COLORS = ['#3b82f6', '#94a3b8'];
  
  const plagiarismData = [
    { name: 'Low (0-20%)', value: submissionStats.lowPlagiarism },
    { name: 'Medium (21-50%)', value: submissionStats.mediumPlagiarism },
    { name: 'High (51-100%)', value: submissionStats.highPlagiarism }
  ];
  
  const submissionStatusData = [
    { name: 'Submitted', value: submissionStats.totalSubmissions },
    { name: 'Not Submitted', value: 20 - submissionStats.totalSubmissions } // Assuming 20 students per class for demo
  ];
  
  const formatPieChartLabel = ({ name, percent }: { name: string; percent: number }) => {
    return `${name}: ${(percent * 100).toFixed(0)}%`;
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
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Submission Status</CardTitle>
                <CardDescription>
                  {submissionStats.totalSubmissions} out of 20 submissions received
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={submissionStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={formatPieChartLabel}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {submissionStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name) => [`${value} students`, name]}
                        contentStyle={{ background: 'var(--background)', border: '1px solid var(--border)' }}
                      />
                      <Legend 
                        layout="horizontal" 
                        verticalAlign="bottom" 
                        align="center"
                        formatter={(value) => <span className="text-sm text-muted-foreground">{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Plagiarism Distribution</CardTitle>
                <CardDescription>
                  Number of submissions by plagiarism percentage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={plagiarismDistribution}
                      margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        dataKey="range" 
                        label={{ value: 'Similarity %', position: 'bottom', offset: 0 }}
                        tick={{ fontSize: 11 }}
                      />
                      <YAxis 
                        label={{ value: 'Number of Students', angle: -90, position: 'insideLeft' }}
                        tick={{ fontSize: 11 }}
                      />
                      <Tooltip
                        formatter={(value) => [`${value} submissions`, 'Count']}
                        contentStyle={{ background: 'var(--background)', border: '1px solid var(--border)' }}
                      />
                      <Bar 
                        dataKey="count" 
                        fill="#3b82f6"
                        name="Number of Submissions" 
                        radius={[4, 4, 0, 0]}
                      >
                        {plagiarismDistribution.map((entry, index) => {
                          // Determine color based on percentage range
                          let color = '#22c55e'; // green for low
                          if (entry.percent >= 50) color = '#ef4444'; // red for high
                          else if (entry.percent >= 20) color = '#eab308'; // yellow for medium
                          return <Cell key={`cell-${index}`} fill={color} />;
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {plagiarismClusters.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Plagiarism Clusters
                </CardTitle>
                <CardDescription>
                  The following groups of submissions have similar or identical content.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {plagiarismClusters.map((cluster, index) => (
                  <Collapsible key={index} className="border rounded-lg p-4">
                    <CollapsibleTrigger className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <PlagiarismMeter score={cluster.plagiarismScore} size="sm" />
                        <span className="ml-2 font-medium">
                          Cluster #{index + 1}: {cluster.plagiarismScore}% similarity between {cluster.studentNames.length} submissions
                        </span>
                      </div>
                      <ChevronDown className="h-4 w-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-4 pl-8">
                      <div className="space-y-2">
                        <p className="font-medium text-muted-foreground">Students involved:</p>
                        <ul className="list-disc pl-6 space-y-1">
                          {cluster.studentNames.map((name: string, i: number) => (
                            <li key={i} className="text-sm">{name}</li>
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
                            <PlagiarismMeter score={submission.plagiarismScore} size="sm" />
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
