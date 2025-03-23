import { Link } from 'react-router-dom';
import { BookOpen, Clock, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { mockAssignments, mockCourses, mockSubmissions } from '@/services/mockData';
import PlagiarismMeter from '@/components/PlagiarismMeter';
import Chart from '@/components/Chart';

const StudentDashboard = () => {
  const { user } = useAuth();
  
  // For demo purposes, we'll assume all courses are available to the student
  const studentCourses = mockCourses;
  
  // Filter assignments with upcoming deadlines (assuming now + 14 days as "upcoming")
  const now = new Date();
  const twoWeeksFromNow = new Date();
  twoWeeksFromNow.setDate(now.getDate() + 14);
  
  const upcomingAssignments = mockAssignments
    .filter(a => {
      // Ensure dueDate is a proper Date object
      const dueDate = a.dueDate instanceof Date ? a.dueDate : new Date(a.dueDate);
      return dueDate > now && dueDate <= twoWeeksFromNow;
    })
    .sort((a, b) => {
      const dueDateA = a.dueDate instanceof Date ? a.dueDate : new Date(a.dueDate);
      const dueDateB = b.dueDate instanceof Date ? b.dueDate : new Date(b.dueDate);
      return dueDateA.getTime() - dueDateB.getTime();
    })
    .slice(0, 5);
  
  // For demo, assume some submissions belong to this student
  const studentSubmissions = mockSubmissions.filter((_, index) => index % 2 === 0);
  
  // Chart data - assignment status
  const assignmentStatusData = [
    { 
      name: 'Submitted', 
      value: studentSubmissions.length
    },
    { 
      name: 'Pending', 
      value: mockAssignments.length - studentSubmissions.length
    }
  ];
  
  // Chart data - scores by course
  const scoresByCourseData = studentCourses.map(course => {
    const courseAssignments = mockAssignments.filter(a => a.courseId === course.id);
    const courseSubmissions = studentSubmissions.filter(s => 
      courseAssignments.some(a => a.id === s.assignmentId)
    );
    
    const totalMarks = courseSubmissions
      .reduce((sum, submission) => sum + (submission.marks || 0), 0);
    
    const avgScore = courseSubmissions.length > 0 
      ? totalMarks / courseSubmissions.length 
      : 0;
    
    return {
      name: course.code,
      value: avgScore
    };
  });
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Student Dashboard</h1>
        <div>
          <Link to="/student/assignments">
            <Button size="sm">
              View All Assignments
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="glass-card p-6">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Enrolled Courses</p>
              <h3 className="text-2xl font-bold">{studentCourses.length}</h3>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-6">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Assignments</p>
              <h3 className="text-2xl font-bold">{mockAssignments.length}</h3>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-6">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completed Assignments</p>
              <h3 className="text-2xl font-bold">{studentSubmissions.length}</h3>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold mb-4">Assignment Status</h2>
          <Chart data={assignmentStatusData} type="pie" height={250} />
        </div>
        
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold mb-4">Average Scores by Course</h2>
          <Chart data={scoresByCourseData} type="bar" height={250} />
        </div>
      </div>
      
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold mb-6">Upcoming Assignments</h2>
        
        {upcomingAssignments.length > 0 ? (
          <div className="space-y-4">
            {upcomingAssignments.map((assignment) => {
              const course = mockCourses.find(c => c.id === assignment.courseId);
              const submission = studentSubmissions.find(s => s.assignmentId === assignment.id);
              // Ensure dueDate is a proper Date object
              const dueDate = assignment.dueDate instanceof Date ? assignment.dueDate : new Date(assignment.dueDate);
              const daysLeft = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
              
              return (
                <div key={assignment.id} className="border subtle-border rounded-lg p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{assignment.title}</span>
                        <span className="text-xs text-muted-foreground">({course?.code})</span>
                      </div>
                      <p className="text-sm text-foreground/70 mb-2 line-clamp-1">
                        {assignment.description}
                      </p>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="flex items-center">
                          <Clock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                          Due in {daysLeft} {daysLeft === 1 ? 'day' : 'days'}
                        </span>
                        <span className="flex items-center">
                          <FileText className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                          {assignment.totalMarks} marks
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
                      {submission && (
                        <div className="w-40">
                          <PlagiarismMeter 
                            score={submission.plagiarismScore || 0} 
                            size="sm"
                            showLabel={false}
                          />
                        </div>
                      )}
                      
                      <Link to={`/student/assignments/${assignment.id}`}>
                        <Button size="sm" variant={submission ? "outline" : "default"}>
                          {submission ? "View Submission" : "Submit Assignment"}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            No upcoming assignments
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
