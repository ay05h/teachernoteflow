
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { mockCourses, addAssignment } from '@/services/mockData';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import FileUploader from '@/components/FileUploader';

const TeacherCreateAssignment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [courseId, setCourseId] = useState('');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [totalMarks, setTotalMarks] = useState('100');
  const [file, setFile] = useState<File | null>(null);
  
  // Check if course ID is in the URL query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const courseParam = params.get('course');
    if (courseParam) {
      setCourseId(courseParam);
    }
  }, [location.search]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!title || !description || !courseId || !dueDate || !totalMarks) {
      toast({
        title: 'Error',
        description: 'Please fill all required fields',
        variant: 'destructive',
      });
      return;
    }
    
    // Add assignment to mock data
    const newAssignment = addAssignment({
      courseId,
      title,
      description,
      dueDate,
      totalMarks: parseInt(totalMarks),
    });
    
    // Show success message
    toast({
      title: 'Success',
      description: 'Assignment created successfully',
    });
    
    // Redirect to assignments page
    navigate('/teacher/assignments');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Create Assignment</h2>
        <p className="text-muted-foreground">
          Create a new assignment for your students.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assignment Details</CardTitle>
          <CardDescription>
            Fill in the details of your new assignment.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Assignment Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter assignment title"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="course">Course</Label>
                <Select value={courseId} onValueChange={setCourseId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCourses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.title} ({course.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter assignment description"
                  rows={4}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${!dueDate && 'text-muted-foreground'}`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dueDate ? format(dueDate, 'PPP') : 'Select due date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dueDate}
                      onSelect={setDueDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="totalMarks">Total Marks</Label>
                <Input
                  id="totalMarks"
                  type="number"
                  value={totalMarks}
                  onChange={(e) => setTotalMarks(e.target.value)}
                  min="1"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label>Assignment File (Optional)</Label>
                <FileUploader 
                  onFileSelect={(selectedFile) => setFile(selectedFile)} 
                  accept=".pdf,.doc,.docx" 
                />
                <p className="text-xs text-muted-foreground">
                  Accepted file types: PDF, DOC, DOCX
                </p>
              </div>
            </div>
            
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/teacher/assignments')}
              >
                Cancel
              </Button>
              <Button type="submit">Create Assignment</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherCreateAssignment;
