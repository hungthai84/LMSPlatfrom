export interface User {
  id: string;
  name: string;
  avatarUrl?: string;
  role: 'teacher' | 'student';
}

export interface ClassItem {
  id: string;
  name: string;
  section?: string;
  subject?: string;
  room?: string;
  themeColor: string;
  teacherId: string;
}

export interface Announcement {
  id: string;
  classId: string;
  authorId: string;
  content: string;
  createdAt: string;
  comments: Comment[];
}

export interface Comment {
  id: string;
  authorId: string;
  content: string;
  createdAt: string;
}

export interface Assignment {
  id: string;
  classId: string;
  title: string;
  description: string;
  dueDate?: string;
  topic?: string;
  createdAt: string;
}

export interface ClassData {
  classInfo: ClassItem;
  announcements: Announcement[];
  assignments: Assignment[];
  students: User[];
  teachers: User[];
}
