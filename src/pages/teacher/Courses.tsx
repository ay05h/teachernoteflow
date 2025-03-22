
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import { mockAssignments, mockCourses, deleteCourse } from '@/services/mockData';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const TeacherCourses = () => {
  const [search, setSearch] = useState('');
  const [deletingCourseId, setDeletingCourseId] = useState<string | null>(null);
  const [viewingCourseId, setViewingCourseId] = useState<string | null>(null);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCode, setEditCode] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Filter courses based on search
  const filteredCourses = mockCourses.filter(
    course => course.title.toLowerCase().includes(search.toLowerCase()) || 
    course.code.toLowerCase().includes(search.toLowerCase())
  );

  // Handle view course details
  const handleViewDetails = (courseId: string) => {
    const course = mockCourses.find(c => c.id === courseId);
    if (course) {
      setViewingCourseId(courseId);
    }
  };

  // Close view details dialog
  const handleCloseViewDialog = () => {
    setViewingCourseId(null);
  };

  // Handle edit course
  const handleEditCourse = (courseId: string) => {
    const course = mockCourses.find(c => c.id === courseId);
    if (course) {
      setEditTitle(course.title);
      setEditDescription(course.description);
      setEditCode(course.code);
      setEditingCourseId(courseId);
    }
  };

  // Close edit dialog
  const handleCloseEditDialog = () => {
    setEditingCourseId(null);
    setEditTitle('');
    setEditDescription('');
    setEditCode('');
  };

  // Handle save edited course
  const handleSaveEditedCourse = () => {
    if (!editingCourseId) return;
    
    const courseIndex = mockCourses.findIndex(course => course.id === editingCourseId);
    if (courseIndex !== -1) {
      // Create a new array with the updated course
      const updatedCourses = [...mockCourses];
      updatedCourses[courseIndex] = {
        ...updatedCourses[courseIndex],
        title: editTitle,
        description: editDescription,
        code: editCode
      };
      
      // Update localStorage
      localStorage.setItem('courses', JSON.stringify(updatedCourses));
      
      toast({
        title: "Course Updated",
        description: "The course has been successfully updated.",
      });
      
      // Close dialog
      handleCloseEditDialog();
      
      // Force a reload of the component
      window.location.reload();
    }
  };

  // Handle delete course confirmation dialog
  const handleDeleteClick = (courseId: string) => {
    setDeletingCourseId(courseId);
  };

  // Handle actual course deletion
  const handleDeleteCourse = () => {
    if (deletingCourseId) {
      // Use the deleteCourse function from mockData.ts
      const success = deleteCourse(deletingCourseId);
      
      if (success) {
        toast({
          title: "Course Deleted",
          description: "The course has been successfully deleted.",
        });
        
        // Force a reload of the component to show updated list
        window.location.reload();
      } else {
        toast({
          title: "Error",
          description: "There was a problem deleting the course.",
          variant: "destructive",
        });
      }
      
      // Close dialog
      setDeletingCourseId(null);
    }
  };

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
                      <DropdownMenuItem onClick={() => handleEditCourse(course.id)}>
                        Edit Course
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate(`/teacher/assignments/create?course=${course.id}`)}>
                        Create Assignment
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => handleDeleteClick(course.id)}
                      >
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
                    {new Date(course.createdAt).toLocaleDateString()}
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
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleViewDetails(course.id)}
                  >
                    View Details
                  </Button>
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingCourseId} onOpenChange={(open) => !open && setDeletingCourseId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the course
              and all related assignments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCourse} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* View Course Details Dialog */}
      <Dialog open={!!viewingCourseId} onOpenChange={(open) => !open && handleCloseViewDialog()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Course Details</DialogTitle>
          </DialogHeader>
          {viewingCourseId && (
            <div className="space-y-4">
              {(() => {
                const course = mockCourses.find(c => c.id === viewingCourseId);
                return course ? (
                  <>
                    <div>
                      <h3 className="text-lg font-semibold">{course.title}</h3>
                      <p className="text-sm text-muted-foreground">Course Code: {course.code}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Description</h4>
                      <p className="text-sm">{course.description}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Created On</h4>
                      <p className="text-sm">{new Date(course.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Total Assignments</h4>
                      <p className="text-sm">
                        {mockAssignments.filter(a => a.courseId === course.id).length}
                      </p>
                    </div>
                  </>
                ) : <p>Course not found</p>;
              })()}
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleCloseViewDialog}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Course Dialog */}
      <Dialog open={!!editingCourseId} onOpenChange={(open) => !open && handleCloseEditDialog()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
            <DialogDescription>
              Make changes to your course details below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="title" className="text-sm font-medium">
                Course Title
              </label>
              <Input
                id="title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Enter course title"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="code" className="text-sm font-medium">
                Course Code
              </label>
              <Input
                id="code"
                value={editCode}
                onChange={(e) => setEditCode(e.target.value)}
                placeholder="Enter course code"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Enter course description"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseEditDialog}>
              Cancel
            </Button>
            <Button onClick={handleSaveEditedCourse}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeacherCourses;
