import { ClassItem, UserProfile, Announcement, Classwork, Submission } from "./types";

export const DEFAULT_USERS: UserProfile[] = [
  {
    id: "teacher-1",
    name: "Cô Nguyễn Thu Hà",
    role: "teacher",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
    email: "thuha.nguyen@classroom.edu.vn"
  },
  {
    id: "teacher-2",
    name: "Thầy John Watson",
    role: "teacher",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    email: "john.watson@classroom.edu.vn"
  },
  {
    id: "student-1",
    name: "Nguyễn Văn Nam",
    role: "student",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    email: "nam.nv26@student.edu.vn"
  },
  {
    id: "student-2",
    name: "Trần Thị Mai",
    role: "student",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    email: "mai.tt99@student.edu.vn"
  },
  {
    id: "student-3",
    name: "Lê Hoàng Long",
    role: "student",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
    email: "long.lh32@student.edu.vn"
  }
];

export const DEFAULT_CLASSES: ClassItem[] = [
  {
    id: "class-1",
    name: "Lập trình ReactJS nâng cao",
    section: "Kỹ thuật Phần mềm (K18)",
    subject: "Phát triển Web hiện đại",
    room: "Phòng máy A3-402",
    code: "react101",
    bannerGradient: "linear-gradient(135deg, #1565c0 0%, #1e88e5 100%)",
    teacherId: "teacher-1",
    teacherName: "Cô Nguyễn Thu Hà",
    teacherAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
    students: ["student-1", "student-2", "student-3"]
  },
  {
    id: "class-2",
    name: "Tiếng Anh Giao Tiếp Thuyết Trình",
    section: "Ngoại ngữ liên kết quốc tế",
    subject: "Kỹ năng mềm & Thuyết trình",
    room: "Phòng chuyên đề 1",
    code: "engcomm",
    bannerGradient: "linear-gradient(135deg, #2e7d32 0%, #43a047 100%)",
    teacherId: "teacher-2",
    teacherName: "Thầy John Watson",
    teacherAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    students: ["student-1", "student-2"]
  },
  {
    id: "class-3",
    name: "Thiết kế đồ họa & UI/UX căn bản",
    section: "Mỹ thuật ứng dụng",
    subject: "Tương tác người máy",
    room: "Phòng thiết kế Lab 2",
    code: "uiux404",
    bannerGradient: "linear-gradient(135deg, #7b1fa2 0%, #ab47bc 100%)",
    teacherId: "teacher-1",
    teacherName: "Cô Nguyễn Thu Hà",
    teacherAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
    students: ["student-1", "student-3"]
  }
];

export const DEFAULT_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "ann-1",
    classId: "class-1",
    authorId: "teacher-1",
    authorName: "Cô Nguyễn Thu Hà",
    authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
    content: "Chào mừng các em đến với khóa học Lập trình ReactJS nâng cao! Lớp chúng ta sẽ học trực tuyến kết hợp trực tiếp tại phòng máy A3-402 vào tối thứ 3 và thứ 5 hàng tuần lúc 18:00.\n\nCác em nhớ xem kỹ tài liệu slide bài giảng đầu tiên cô đã đính kèm trong mục Bài tập trên lớp nhé. Chúc các em học tập tốt và gặt hái nhiều dự án chất lượng!",
    createdAt: "2026-07-02T10:30:00Z",
    comments: [
      {
        id: "com-1",
        authorId: "student-1",
        authorName: "Nguyễn Văn Nam",
        authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
        content: "Dạ vâng, em chào cô ạ! Em rất mong chờ khóa học này để làm đồ án tốt nghiệp.",
        createdAt: "2026-07-02T11:15:00Z"
      },
      {
        id: "com-2",
        authorId: "student-2",
        authorName: "Trần Thị Mai",
        authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
        content: "Chào cô và các bạn trong lớp. Lớp mình có group Zalo trao đổi bài không ạ?",
        createdAt: "2026-07-02T12:00:00Z"
      }
    ]
  },
  {
    id: "ann-2",
    classId: "class-2",
    authorId: "teacher-2",
    authorName: "Thầy John Watson",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    content: "Hi class! Welcome to the English Communication and Presentation Course.\n\nFor our first class this coming Friday, please prepare a short 1-minute self-introduction. You will share your hobbies, background, and what you expect from this class. Don't be nervous, it's just a friendly ice-breaking! See you soon.",
    createdAt: "2026-07-03T09:00:00Z",
    comments: [
      {
        id: "com-3",
        authorId: "student-1",
        authorName: "Nguyễn Văn Nam",
        authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
        content: "Great! Looking forward to meeting you, Teacher.",
        createdAt: "2026-07-03T10:05:00Z"
      }
    ]
  }
];

export const DEFAULT_CLASSWORK: Classwork[] = [
  {
    id: "work-1",
    classId: "class-1",
    title: "Tìm hiểu về React Hooks & State Management",
    description: "Các em hãy viết một bài luận hoặc báo cáo so sánh chi tiết giữa: \n1. **useState & useReducer**: Khi nào dùng cái nào?\n2. **React Context API & Redux Toolkit (hoặc Zustand)**: So sánh bài toán tối ưu hiệu năng và quy mô quản lý state.\n\n**Yêu cầu:**\n- Trình bày rõ ràng dưới định dạng Markdown hoặc văn bản thường.\n- Đưa ra ví dụ thực tế hoặc sơ đồ tư duy giải thích luồng dữ liệu.\n- Bài nộp tối thiểu 300 từ.",
    type: "assignment",
    points: 100,
    dueDate: "2026-07-15",
    createdAt: "2026-07-03T08:00:00Z",
    topic: "Chương 1: Kiến thức nền tảng & Hooks"
  },
  {
    id: "work-4",
    classId: "class-1",
    title: "Trắc nghiệm & Tự luận nhanh: Kiểm tra kiến thức Chương 1",
    description: "Bài trắc nghiệm tổng hợp giúp kiểm tra nhanh mức độ hiểu bài của các em về React Hooks, cơ chế hoạt động và cập nhật React 19 mới. Hãy đọc kỹ từng câu hỏi trước khi chọn và viết trả lời.",
    type: "quiz",
    points: 10,
    dueDate: "2026-07-20",
    createdAt: "2026-07-04T10:00:00Z",
    topic: "Chương 1: Kiến thức nền tảng & Hooks",
    quizQuestions: [
      {
        id: "q1",
        type: "choice",
        questionText: "Hook nào dùng để ghi nhớ (cache) một giá trị được tính toán đắt đỏ giữa các lần render?",
        options: ["useCallback", "useMemo", "useRef", "useEffect"],
        correctOptionIndex: 1,
        points: 3
      },
      {
        id: "q2",
        type: "true-false",
        questionText: "React 19 giới thiệu hook 'use' đặc biệt có thể được gọi có điều kiện bên trong câu lệnh 'if' và vòng lặp?",
        options: ["Đúng", "Sai"],
        correctOptionIndex: 0,
        points: 3
      },
      {
        id: "q3",
        type: "essay",
        questionText: "Hãy viết một đoạn mã ngắn sử dụng hook 'useRef' để tham chiếu đến một thẻ input DOM và tự động focus vào input đó khi component mount.",
        points: 4
      }
    ]
  },
  {
    id: "work-2",
    classId: "class-1",
    title: "Tài liệu học tập Chương 1: Giới thiệu React 19 mới nhất",
    description: "Bộ slide bài giảng chi tiết về các tính năng mới của React 19 bao gồm: Server Components, Actions, và các hooks mới như `useActionState`, `useFormStatus`, `use` API.\n\nCác em hãy chủ động tải về và đọc trước để thực hành trên lớp thuận lợi nhé.",
    type: "material",
    createdAt: "2026-07-02T11:00:00Z",
    topic: "Chương 1: Kiến thức nền tảng & Hooks"
  },
  {
    id: "work-3",
    classId: "class-1",
    title: "Câu hỏi nhanh: Tại sao không nên gọi Hook bên trong vòng lặp?",
    description: "Hãy giải thích ngắn gọn cơ chế lưu trữ Hook của React dưới dạng Linked List và tại sao việc gọi Hook trong vòng lặp hoặc câu điều kiện sẽ phá vỡ tính nhất quán của thứ tự gọi Hook.",
    type: "question",
    points: 10,
    dueDate: "2026-07-10",
    createdAt: "2026-07-04T09:00:00Z",
    topic: "Chương 1: Kiến thức nền tảng & Hooks"
  }
];

export const DEFAULT_SUBMISSIONS: Submission[] = [
  {
    id: "sub-1",
    classworkId: "work-1",
    studentId: "student-2",
    studentName: "Trần Thị Mai",
    studentAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    content: "### So sánh State Management trong React\n\n**1. useState & useReducer:**\n- `useState` phù hợp cho các state độc lập, logic đơn giản (ví dụ: đóng/mở modal, lưu trữ input text, toggle theme).\n- `useReducer` thích hợp cho các state phức tạp, có nhiều thuộc tính liên quan chặt chẽ với nhau, hoặc khi state tiếp theo phụ thuộc nhiều vào state trước đó. Giúp cô lập logic cập nhật state ra khỏi UI component.\n\n**2. Context API & Global Stores (Zustand/Redux):**\n- `Context API` dùng để truyền dữ liệu đi xa (dependency injection) hơn là quản lý state tần suất cao. Nếu thay đổi giá trị liên tục sẽ gây re-render toàn bộ cụm con.\n- `Zustand` hay `Redux Toolkit` cung cấp cơ chế select state thông minh, chỉ render lại đúng component sử dụng trường thông tin đó, tối ưu hiệu năng vượt trội cho ứng dụng lớn.",
    submittedAt: "2026-07-03T15:30:00Z",
    status: "graded",
    grade: 95,
    feedback: "Rất xuất sắc! Bài phân tích vô cùng mạch lạc và hiểu sâu vấn đề. Cô thích cách em phân biệt rõ ràng giữa truyền dữ liệu (Context) và quản lý hiệu năng (Zustand)."
  },
  {
    id: "sub-2",
    classworkId: "work-1",
    studentId: "student-1",
    studentName: "Nguyễn Văn Nam",
    studentAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    content: "Em xin nộp bài tóm tắt:\n- useState để quản lý biến đơn lẻ.\n- useReducer giống redux thu nhỏ, gom nhóm action.\n- Context API giúp tránh truyền prop-drilling.\nEm sẽ cập nhật chi tiết thêm sơ đồ sau.",
    submittedAt: "2026-07-04T12:00:00Z",
    status: "turned-in"
  }
];
