import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from '@/hooks/use-toast';
import { addCourse } from '@/services/mockData';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters' }),
  code: z.string().min(2, { message: 'Course code is required' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
});

const TeacherCreateCourse = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      code: '',
      description: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      // Add the course to our mock data
      const newCourse = addCourse({
        title: values.title,
        code: values.code,
        description: values.description,
      });
      
      toast({
        title: "Course created",
        description: `${values.title} has been created successfully.`,
      });
      
      navigate('/teacher/courses');
    } catch (error) {
      toast({
        title: "Error creating course",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Create New Course</h1>
        <p className="text-muted-foreground mt-1">
          Add a new course to your teaching portfolio
        </p>
      </div>
      
      <div className="glass-card p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Introduction to Computer Science" {...field} />
                  </FormControl>
                  <FormDescription>
                    The full title of your course
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Code</FormLabel>
                  <FormControl>
                    <Input placeholder="CS101" {...field} />
                  </FormControl>
                  <FormDescription>
                    A unique code for your course (e.g., CS101, MATH202)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Description</FormLabel>
                  <FormControl>
                    <textarea
                      className="flex min-h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Provide a detailed description of your course..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Describe what students will learn in this course
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex items-center justify-end space-x-4 pt-4">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate('/teacher/courses')}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Course'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default TeacherCreateCourse;
