
import React, { useState, useEffect } from 'react';
import AssignmentDiscussion from './AssignmentDiscussion';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { getSubmissionsWithPlagiarismInfo } from '@/services/mockData';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from './ui/chart';
import { BarChart, Bar, ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { ChevronDown, Users } from 'lucide-react';
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
  
  const formatPieChartLabel = ({ name, percent }: { name: string; percent: number }) => {
    return `${name}: ${(percent * 100).toFixed(0)}%`;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{assignmentTitle} - Discussion</h2>
        <Button variant="outline" onClick={onBack}>
          Back to Submissions
        </Button>
      </div>
      
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
            <CardTitle>Plagiarism Levels</CardTitle>
            <CardDescription>
              Distribution of plagiarism scores across submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={plagiarismData} layout="vertical">
                  <Tooltip 
                    formatter={(value, name) => [`${value} submissions`, name]}
                    contentStyle={{ background: 'var(--background)', border: '1px solid var(--border)' }}
                  />
                  <Legend 
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    formatter={(value) => <span className="text-sm text-muted-foreground">{value}</span>}
                  />
                  <Bar 
                    dataKey="value" 
                    minPointSize={5} 
                    barSize={30}
                  >
                    {plagiarismData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
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
