import { Link } from 'react-router-dom';
import { BookOpen, Clock, FileText, Plus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { mockAssignments, mockCourses, mockSubmissions } from '@/services/mockData';
import Chart from '@/components/Chart';

const TeacherDashboard = () => {
  const { user } = useAuth();

  // Simulated dashboard data
  const totalCourses = mockCourses.length;
  const totalAssignments = mockAssignments.length;
  const pendingSubmissions = mockSubmissions.filter(s => s.marks === undefined).length;
  const gradedSubmissions = mockSubmissions.filter(s => s.marks !== undefined).length;
  
  // Chart data for assignments by course
  const assignmentsByCoursesData = mockCourses.map(course => ({
    name: course.title,
    value: mockAssignments.filter(a => a.courseId === course.id).length
  }));
  
  // Chart data for submissions status
  const submissionStatusData = [
    { name: 'Graded', value: gradedSubmissions },
    { name: 'Pending', value: pendingSubmissions }
  ];
  
  // Chart data for plagiarism levels
  const plagiarismLevelsData = [
    { name: 'Low (0-20%)', value: mockSubmissions.filter(s => (s.plagiarismScore || 0) <= 20).length },
    { name: 'Medium (21-50%)', value: mockSubmissions.filter(s => (s.plagiarismScore || 0) > 20 && (s.plagiarismScore || 0) <= 50).length },
    { name: 'High (51-100%)', value: mockSubmissions.filter(s => (s.plagiarismScore || 0) > 50).length }
  ];

  // Recent submissions - ensure submittedAt is properly handled as a Date
  const recentSubmissions = [...mockSubmissions]
    .sort((a, b) => {
      // Convert to Date objects if they're strings
      const dateA = a.submittedAt instanceof Date ? a.submittedAt : new Date(a.submittedAt);
      const dateB = b.submittedAt instanceof Date ? b.submittedAt : new Date(b.submittedAt);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex space-x-2">
          <Link to="/teacher/courses/create">
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              New Course
            </Button>
          </Link>
          <Link to="/teacher/assignments/create">
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              New Assignment
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="glass-card p-6">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Courses</p>
              <h3 className="text-2xl font-bold">{totalCourses}</h3>
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
              <h3 className="text-2xl font-bold">{totalAssignments}</h3>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-6">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Submissions</p>
              <h3 className="text-2xl font-bold">{mockSubmissions.length}</h3>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-6">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending Review</p>
              <h3 className="text-2xl font-bold">{pendingSubmissions}</h3>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold mb-4">Assignments by Course</h2>
          <Chart data={assignmentsByCoursesData} type="bar" height={250} />
        </div>
        
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold mb-4">Submission Status</h2>
          <Chart data={submissionStatusData} type="pie" height={250} />
        </div>
      </div>
      
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold mb-4">Plagiarism Levels</h2>
        <Chart data={plagiarismLevelsData} type="bar" height={250} />
      </div>
      
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold mb-6">Recent Submissions</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b subtle-border text-left">
                <th className="pb-3 font-medium">Student</th>
                <th className="pb-3 font-medium">Assignment</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Plagiarism</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {recentSubmissions.map((submission) => {
                const assignment = mockAssignments.find(a => a.id === submission.assignmentId);
                // Ensure submittedAt is a proper Date object
                const submittedDate = submission.submittedAt instanceof Date 
                  ? submission.submittedAt 
                  : new Date(submission.submittedAt);
                
                return (
                  <tr key={submission.id} className="border-b subtle-border">
                    <td className="py-4">{submission.studentName}</td>
                    <td className="py-4">{assignment?.title}</td>
                    <td className="py-4">{submittedDate.toLocaleDateString()}</td>
                    <td className="py-4">
                      <div className="w-28">
                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              (submission.plagiarismScore || 0) < 20 
                                ? 'bg-green-500' 
                                : (submission.plagiarismScore || 0) < 50 
                                  ? 'bg-yellow-500' 
                                  : 'bg-red-500'
                            }`} 
                            style={{ width: `${submission.plagiarismScore || 0}%` }}
                          ></div>
                        </div>
                        <div className="text-xs mt-1">{submission.plagiarismScore || 0}%</div>
                      </div>
                    </td>
                    <td className="py-4">
                      {submission.marks !== undefined ? (
                        <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:text-green-300">
                          Graded
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-yellow-100 dark:bg-yellow-900/30 px-2.5 py-0.5 text-xs font-medium text-yellow-700 dark:text-yellow-300">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="py-4 text-right">
                      <Link to={`/teacher/assignments/${submission.assignmentId}/submissions`}>
                        <Button size="sm" variant="outline">
                          Review
                        </Button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {recentSubmissions.length === 0 && (
          <div className="py-8 text-center text-muted-foreground">
            No submissions yet
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
