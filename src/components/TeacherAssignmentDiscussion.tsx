
import React, { useEffect } from 'react';
import AssignmentDiscussion from './AssignmentDiscussion';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { MessageCircle } from 'lucide-react';

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
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{assignmentTitle} - Discussion</h2>
        <Button variant="outline" onClick={onBack}>
          Back to Submissions
        </Button>
      </div>
      
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
