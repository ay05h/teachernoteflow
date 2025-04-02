
import React, { useState, useEffect } from 'react';
import AssignmentDiscussion from './AssignmentDiscussion';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { getSubmissionsWithPlagiarismInfo } from '@/services/mockData';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './ui/chart';
import { BarChart, Bar, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { ChevronDown } from 'lucide-react';
import PlagiarismMeter from './PlagiarismMeter';

interface TeacherAssignmentDiscussionProps {
  assignmentId: string;
  assignmentTitle: string;
  courseId: string;
  teacherId: string;
  onBack: () => void;
}

const TeacherAssignmentDiscussion: React.FC<TeacherAssignmentDiscussionProps> = ({
  assignmentId,
  assignmentTitle,
  courseId,
  teacherId,
  onBack
}) => {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [plagiarismClusters, setPlagiarismClusters] = useState<any[]>([]);
  const [submissionStats, setSubmissionStats] = useState({
    totalSubmissions: 0,
    plagiarismDetected: 0,
    lowPlagiarism: 0,
    mediumPlagiarism: 0,
    highPlagiarism: 0
  });
  
  useEffect(() => {
    if (assignmentId) {
      const { submissions, plagiarismClusters } = getSubmissionsWithPlagiarismInfo(assignmentId);
      setSubmissions(submissions);
      setPlagiarismClusters(plagiarismClusters);
      
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
  
  const plagiarismData = [
    { name: 'Low (0-20%)', value: submissionStats.lowPlagiarism },
    { name: 'Medium (21-50%)', value: submissionStats.mediumPlagiarism },
    { name: 'High (51-100%)', value: submissionStats.highPlagiarism }
  ];
  
  const submissionStatusData = [
    { name: 'Submitted', value: submissionStats.totalSubmissions },
    { name: 'Not Submitted', value: 20 - submissionStats.totalSubmissions } // Assuming 20 students per class for demo
  ];
  
  const COLORS = ['#22c55e', '#eab308', '#ef4444'];
  const STATUS_COLORS = ['#3b82f6', '#94a3b8'];
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{assignmentTitle} - Discussion</h2>
        <Button variant="outline" onClick={onBack}>
          Back to Submissions
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Submission Status</CardTitle>
            <CardDescription>
              {submissionStats.totalSubmissions} submissions received
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ChartContainer
                config={{
                  submitted: { label: 'Submitted' },
                  notSubmitted: { label: 'Not Submitted' }
                }}
              >
                <PieChart>
                  <Pie
                    data={submissionStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {submissionStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Plagiarism Levels</CardTitle>
            <CardDescription>
              Distribution of plagiarism scores across submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ChartContainer
                config={{
                  low: { label: 'Low' },
                  medium: { label: 'Medium' },
                  high: { label: 'High' }
                }}
              >
                <BarChart data={plagiarismData}>
                  <Bar dataKey="value" fill="hsl(var(--primary))">
                    {plagiarismData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {plagiarismClusters.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Potential Plagiarism Clusters</CardTitle>
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
      
      <AssignmentDiscussion
        assignmentId={assignmentId}
        assignmentTitle={assignmentTitle}
        courseId={courseId}
        teacherId={teacherId}
      />
    </div>
  );
};

export default TeacherAssignmentDiscussion;
