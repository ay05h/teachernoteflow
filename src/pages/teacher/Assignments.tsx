
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { mockAssignments, mockCourses } from '@/services/mockData';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';

const TeacherAssignments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [assignments, setAssignments] = useState(mockAssignments);
  const { user } = useAuth();
  
  // Refresh assignments when component mounts or when mockAssignments changes
  useEffect(() => {
    try {
      setAssignments(mockAssignments);
    } catch (error) {
      console.error("Error setting assignments:", error);
    }
  }, [mockAssignments]);
  
  // Filter assignments based on search term
  const filteredAssignments = assignments.filter(assignment => 
    assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Get course name by ID
  const getCourseTitle = (courseId: string) => {
    try {
      const course = mockCourses.find(c => c.id === courseId);
      return course ? course.title : 'Unknown Course';
    } catch (error) {
      console.error("Error getting course title:", error);
      return 'Unknown Course';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Assignments</h2>
          <p className="text-muted-foreground">
            Manage your course assignments and track student submissions.
          </p>
        </div>
        <Link to="/teacher/assignments/create">
          <Button className="w-full md:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Create Assignment
          </Button>
        </Link>
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
              No assignments found. Create your first assignment to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredAssignments.map((assignment) => (
            <Card key={assignment.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="line-clamp-1">{assignment.title}</CardTitle>
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
                  <Link to={`/teacher/assignments/${assignment.id}/submissions`}>
                    <Button variant="outline" className="w-full">
                      View Submissions
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherAssignments;
