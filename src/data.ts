import { ClassItem, User, Announcement, Assignment } from './types';

export const currentUser: User = {
  id: 'u1',
  name: 'Hung Thai',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hung',
  role: 'teacher',
};

export const mockUsers: Record<string, User> = {
  'u1': currentUser,
  'u2': { id: 'u2', name: 'Alice Smith', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice', role: 'teacher' },
  'u3': { id: 'u3', name: 'Bob Johnson', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob', role: 'student' },
  'u4': { id: 'u4', name: 'Charlie Davis', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie', role: 'student' },
  'u5': { id: 'u5', name: 'Diana Prince', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Diana', role: 'student' },
};

export const mockClasses: ClassItem[] = [
  {
    id: 'c1',
    name: 'Advanced Web Development',
    section: 'CS 401',
    themeColor: 'bg-blue-600',
    teacherId: 'u1',
  },
  {
    id: 'c2',
    name: 'Introduction to UI/UX',
    section: 'DES 101',
    themeColor: 'bg-emerald-600',
    teacherId: 'u2',
  },
  {
    id: 'c3',
    name: 'Data Structures',
    section: 'CS 201',
    themeColor: 'bg-purple-600',
    teacherId: 'u1',
  },
];

export const mockAnnouncements: Announcement[] = [
  {
    id: 'a1',
    classId: 'c1',
    authorId: 'u1',
    content: 'Welcome to Advanced Web Development! Please make sure you have Node.js installed before our first lab session.',
    createdAt: '2026-07-01T10:00:00Z',
    comments: [
      { id: 'cm1', authorId: 'u3', content: 'Which version of Node should we use?', createdAt: '2026-07-01T11:30:00Z' },
      { id: 'cm2', authorId: 'u1', content: 'v20 LTS is recommended.', createdAt: '2026-07-01T12:00:00Z' }
    ]
  },
  {
    id: 'a2',
    classId: 'c1',
    authorId: 'u1',
    content: 'I have posted the reading materials for week 1.',
    createdAt: '2026-07-02T09:00:00Z',
    comments: []
  }
];

export const mockAssignments: Assignment[] = [
  {
    id: 'as1',
    classId: 'c1',
    title: 'React Fundamentals Portfolio',
    description: 'Build a small portfolio using React and Tailwind CSS.',
    dueDate: '2026-07-15T23:59:59Z',
    topic: 'Week 1: Frameworks',
    createdAt: '2026-07-03T10:00:00Z'
  },
  {
    id: 'as2',
    classId: 'c1',
    title: 'State Management Quiz',
    description: 'Multiple choice quiz on Context and Redux.',
    dueDate: '2026-07-20T23:59:59Z',
    topic: 'Week 2: State',
    createdAt: '2026-07-04T08:00:00Z'
  }
];
