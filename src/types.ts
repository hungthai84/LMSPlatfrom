export interface ClassItem {
  id: string;
  name: string;
  section?: string;
  subject?: string;
  room?: string;
  code: string;
  bannerGradient: string;
  teacherId: string;
  teacherName: string;
  teacherAvatar: string;
  students: string[]; // User IDs of joined students
}

export interface UserProfile {
  id: string;
  name: string;
  role: "teacher" | "student";
  avatar: string;
  email: string;
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
}

export interface Announcement {
  id: string;
  classId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
  comments: Comment[];
}

export interface Attachment {
  type: "link" | "file" | "youtube" | "drive";
  name: string;
  url: string;
}

export interface Classwork {
  id: string;
  classId: string;
  title: string;
  description: string;
  type: "assignment" | "material" | "question" | "quiz";
  points?: number;
  dueDate?: string;
  createdAt: string;
  topic?: string;
  quizQuestions?: QuizQuestion[];
  attachments?: Attachment[];
}

export interface QuizQuestion {
  id: string;
  type: "choice" | "true-false" | "essay";
  questionText: string;
  options?: string[];
  correctOptionIndex?: number;
  correctAnswerText?: string;
  points: number;
}

export interface Submission {
  id: string;
  classworkId: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  content: string;
  submittedAt?: string;
  status: "assigned" | "turned-in" | "graded";
  grade?: number;
  feedback?: string;
  quizAnswers?: Record<string, string>; // maps questionId to selected option index or essay text
  quizScore?: number;
}
