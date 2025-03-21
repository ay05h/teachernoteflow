
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Book, Calendar, FileText, MoreHorizontal, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { mockAssignments, mockCourses } from '@/services/mockData';

const TeacherCourses = () => {
  const [search, setSearch] = useState('');
  
  // Filter courses based on search
  const filteredCourses = mockCourses.filter(
    course => course.title.toLowerCase().includes(search.toLowerCase()) || 
    course.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Courses</h1>
        <Link to="/teacher/courses/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Course
          </Button>
        </Link>
      </div>
      
      <div className="flex w-full items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search courses by title or code..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      
      {filteredCourses.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => {
            const courseAssignments = mockAssignments.filter(a => a.courseId === course.id);
            const totalAssignments = courseAssignments.length;
            
            return (
              <div key={course.id} className="glass-card relative overflow-hidden p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Book className="h-6 w-6 text-primary" />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>Edit Course</DropdownMenuItem>
                      <DropdownMenuItem>Create Assignment</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Delete Course
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-xl font-semibold mb-1">{course.title}</h3>
                  <div className="text-sm text-muted-foreground mb-3">
                    Course Code: {course.code}
                  </div>
                  <p className="text-foreground/80 text-sm line-clamp-2">
                    {course.description}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-3 mb-4">
                  <div className="flex items-center text-sm text-foreground/70">
                    <Calendar className="mr-1 h-4 w-4" />
                    {course.createdAt.toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-sm text-foreground/70">
                    <FileText className="mr-1 h-4 w-4" />
                    {totalAssignments} {totalAssignments === 1 ? 'Assignment' : 'Assignments'}
                  </div>
                </div>
                
                <div className="space-x-2">
                  <Link to={`/teacher/assignments/create?course=${course.id}`}>
                    <Button size="sm" variant="outline">
                      <Plus className="mr-1 h-3.5 w-3.5" />
                      Assignment
                    </Button>
                  </Link>
                  <Button size="sm" variant="outline">View Details</Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-card py-12 text-center">
          <Book className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium">No courses found</h3>
          <p className="text-muted-foreground mt-1 mb-6">
            {search ? "Try a different search term" : "You haven't created any courses yet"}
          </p>
          <Link to="/teacher/courses/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Course
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default TeacherCourses;
