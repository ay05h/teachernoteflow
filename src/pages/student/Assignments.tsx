
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { mockAssignments, mockCourses, mockSubmissions } from '@/services/mockData';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';

const StudentAssignments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const [assignments, setAssignments] = useState(mockAssignments);
  
  // Refresh assignments when component mounts
  useEffect(() => {
    setAssignments(mockAssignments);
  }, []);
  
  // Filter assignments based on search term
  const filteredAssignments = assignments.filter(assignment => 
    assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Get course name by ID
  const getCourseTitle = (courseId: string) => {
    const course = mockCourses.find(c => c.id === courseId);
    return course ? course.title : 'Unknown Course';
  };
  
  // Check if student has submitted an assignment
  const hasSubmitted = (assignmentId: string) => {
    return mockSubmissions.some(
      s => s.assignmentId === assignmentId && s.studentId === user?.id
    );
  };
  
  // Calculate time status for assignment
  const getTimeStatus = (dueDate: Date) => {
    const now = new Date();
    const dueDateObj = new Date(dueDate);
    
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">My Assignments</h2>
        <p className="text-muted-foreground">
          View and submit your course assignments.
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search assignments..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredAssignments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <FileText className="h-10 w-10 text-muted-foreground" />
            <p className="mt-2 text-center text-muted-foreground">
              No assignments found matching your search.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredAssignments.map((assignment) => {
            const timeStatus = getTimeStatus(new Date(assignment.dueDate));
            const submitted = hasSubmitted(assignment.id);
            
            return (
              <Card key={assignment.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="line-clamp-1">{assignment.title}</CardTitle>
                    {submitted ? (
                      <Badge variant="success">Submitted</Badge>
                    ) : (
                      <Badge variant={timeStatus.variant}>{timeStatus.label}</Badge>
                    )}
                  </div>
                  <CardDescription>
                    <Badge variant="outline" className="mt-1">
                      {getCourseTitle(assignment.courseId)}
                    </Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {assignment.description}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2 text-xs text-muted-foreground">
                    <div className="flex items-center">
                      <span className="font-medium">Due:</span>&nbsp;
                      {format(new Date(assignment.dueDate), 'MMM dd, yyyy')}
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium">Marks:</span>&nbsp;
                      {assignment.totalMarks}
                    </div>
                  </div>
                  <div className="pt-4">
                    <Link to={`/student/assignments/${assignment.id}`}>
                      <Button variant="outline" className="w-full">
                        {submitted ? 'View Submission' : 'Submit Assignment'}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentAssignments;
