import React, { useState, useEffect } from "react";
import { 
  Plus, GraduationCap, X, ChevronRight, Copy, ArrowLeft, Search, Bookmark, Sparkles, 
  Home, Bell, Settings, ChevronLeft, Calendar, HelpCircle, User, Sliders, Eye
} from "lucide-react";
import { ClassItem, Announcement, Classwork, Submission, UserProfile, Comment } from "./types";
import { 
  DEFAULT_USERS, 
  DEFAULT_CLASSES, 
  DEFAULT_ANNOUNCEMENTS, 
  DEFAULT_CLASSWORK, 
  DEFAULT_SUBMISSIONS 
} from "./initialData";

import Navbar from "./components/Navbar";
import ClassCard from "./components/ClassCard";
import StreamTab from "./components/StreamTab";
import ClassworkTab from "./components/ClassworkTab";
import PeopleTab from "./components/PeopleTab";
import GradesTab from "./components/GradesTab";
import GeminiDrawer from "./components/GeminiDrawer";

// Custom premium wallpapers data
import { 
  IMAGE_WALLPAPERS, 
  VIDEO_WALLPAPERS, 
  GRADIENT_WALLPAPERS, 
  PATTERN_WALLPAPERS,
  WallpaperItem
} from "./wallpapers";

export default function App() {
  // --- 1. STATE INITIALIZATION ---
  const [activeUser, setActiveUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("activeUser");
    return saved ? JSON.parse(saved) : DEFAULT_USERS[2]; // Start as student Nam
  });

  const [classes, setClasses] = useState<ClassItem[]>(() => {
    const saved = localStorage.getItem("g_classes");
    return saved ? JSON.parse(saved) : DEFAULT_CLASSES;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem("g_announcements");
    return saved ? JSON.parse(saved) : DEFAULT_ANNOUNCEMENTS;
  });

  const [classwork, setClasswork] = useState<Classwork[]>(() => {
    const saved = localStorage.getItem("g_classwork");
    return saved ? JSON.parse(saved) : DEFAULT_CLASSWORK;
  });

  const [submissions, setSubmissions] = useState<Submission[]>(() => {
    const saved = localStorage.getItem("g_submissions");
    return saved ? JSON.parse(saved) : DEFAULT_SUBMISSIONS;
  });

  // Navigation states
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<"stream" | "classwork" | "people" | "grades">("stream");

  // Dialog & Modal states
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [joinError, setJoinError] = useState("");

  const [showCreateClassModal, setShowCreateClassModal] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [newClassSec, setNewClassSec] = useState("");
  const [newClassSub, setNewClassSub] = useState("");
  const [newClassRoom, setNewClassRoom] = useState("");

  // Gemini Drawer states
  const [isGeminiOpen, setIsGeminiOpen] = useState(false);
  const [geminiMode, setGeminiMode] = useState<"syllabus" | "qna">("syllabus");
  const [geminiContextClasswork, setGeminiContextClasswork] = useState<Classwork | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // --- CUSTOMIZABLE USER INTERFACE STATES ---
  const [wrapperOpacity, setWrapperOpacity] = useState<number>(() => {
    const saved = localStorage.getItem("g_wrapperOpacity");
    return saved ? Number(saved) : 95; // default 95%
  });

  const [sidebarOpacity, setSidebarOpacity] = useState<number>(() => {
    const saved = localStorage.getItem("g_sidebarOpacity");
    return saved ? Number(saved) : 90; // default 90%
  });

  const [currentWallpaper, setCurrentWallpaper] = useState<string>(() => {
    const saved = localStorage.getItem("g_currentWallpaper");
    return saved || "https://i.ibb.co/G47jTb1g/minimalist-white-background-3840x2160-bright-space-clean-aesthetic-27644.jpg"; // default wallpaper
  });

  const [wallpaperType, setWallpaperType] = useState<"image" | "video" | "gradient" | "pattern">(() => {
    const saved = localStorage.getItem("g_wallpaperType");
    return (saved as any) || "image";
  });

  // Sidebar expanded state, default COLLAPSED (false) as requested in Rule 5
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(false);

  // Main list filters
  const [selectedFilter, setSelectedFilter] = useState<"all" | "active">("all");

  // Show custom modal dialogs
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showNotificationsPanel, setShowNotificationsPanel] = useState(false);
  const [showClassesPopup, setShowClassesPopup] = useState(false);
  const [showFloatingMenu, setShowFloatingMenu] = useState(false);
  const [showSidebarPlusMenu, setShowSidebarPlusMenu] = useState(false);
  const [showProfileSwitcher, setShowProfileSwitcher] = useState(false);

  // Colored border cycle state
  const borderColors = [
    "#3b82f6", // Royal blue
    "#10b981", // Emerald green
    "#f59e0b", // Amber yellow
    "#ef4444", // Crimson red
    "#8b5cf6", // Violet purple
    "#ec4899"  // Hot pink
  ];
  const [borderColorIndex, setBorderColorIndex] = useState<number>(0);

  // Update border color index every 1 minute (60000ms) as requested in Rule 2
  useEffect(() => {
    const interval = setInterval(() => {
      setBorderColorIndex((prev) => (prev + 1) % borderColors.length);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // --- 2. LOCAL STORAGE SYNC ---
  useEffect(() => {
    localStorage.setItem("g_wrapperOpacity", String(wrapperOpacity));
  }, [wrapperOpacity]);

  useEffect(() => {
    localStorage.setItem("g_sidebarOpacity", String(sidebarOpacity));
  }, [sidebarOpacity]);

  useEffect(() => {
    localStorage.setItem("g_currentWallpaper", currentWallpaper);
  }, [currentWallpaper]);

  useEffect(() => {
    localStorage.setItem("g_wallpaperType", wallpaperType);
  }, [wallpaperType]);

  useEffect(() => {
    localStorage.setItem("activeUser", JSON.stringify(activeUser));
  }, [activeUser]);

  useEffect(() => {
    localStorage.setItem("g_classes", JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem("g_announcements", JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem("g_classwork", JSON.stringify(classwork));
  }, [classwork]);

  useEffect(() => {
    localStorage.setItem("g_submissions", JSON.stringify(submissions));
  }, [submissions]);

  // Helper to trigger toast
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // --- 3. CORE HANDLERS & CALLBACKS ---

  // Copy Class Code to Clipboard
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    showToast("Đã sao chép mã lớp học thành công!");
  };

  // Join class via code
  const handleJoinClassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = joinCode.trim().toLowerCase();
    
    // Find class with this code
    const targetClassIndex = classes.findIndex((c) => c.code === cleanCode);
    
    if (targetClassIndex === -1) {
      setJoinError("Mã lớp không chính xác. Vui lòng hỏi lại giáo viên của bạn.");
      return;
    }

    const targetClass = classes[targetClassIndex];
    
    // Check if student already in class
    if (targetClass.students.includes(activeUser.id)) {
      setJoinError("Bạn đã là thành viên của lớp học này rồi.");
      return;
    }

    // Add student to class
    const updatedClasses = [...classes];
    updatedClasses[targetClassIndex] = {
      ...targetClass,
      students: [...targetClass.students, activeUser.id]
    };

    setClasses(updatedClasses);
    setJoinCode("");
    setShowJoinModal(false);
    setSelectedClassId(targetClass.id);
    setSelectedTab("stream");
    showToast(`Đã tham gia thành công vào lớp: ${targetClass.name}`);
  };

  // Create Class (Teacher)
  const handleCreateClassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    // Generate random code & gradient banner
    const randomCode = Math.random().toString(36).substring(2, 9);
    const gradients = [
      "linear-gradient(135deg, #1565c0 0%, #1e88e5 100%)",
      "linear-gradient(135deg, #2e7d32 0%, #43a047 100%)",
      "linear-gradient(135deg, #7b1fa2 0%, #ab47bc 100%)",
      "linear-gradient(135deg, #c62828 0%, #e53935 100%)",
      "linear-gradient(135deg, #e65100 0%, #fb8c00 100%)"
    ];
    const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];

    const newClass: ClassItem = {
      id: `class-${Date.now()}`,
      name: newClassName.trim(),
      section: newClassSec.trim() || undefined,
      subject: newClassSub.trim() || undefined,
      room: newClassRoom.trim() || undefined,
      code: randomCode,
      bannerGradient: randomGradient,
      teacherId: activeUser.id,
      teacherName: activeUser.name,
      teacherAvatar: activeUser.avatar,
      students: []
    };

    setClasses([newClass, ...classes]);
    setNewClassName("");
    setNewClassSec("");
    setNewClassSub("");
    setNewClassRoom("");
    setShowCreateClassModal(false);
    setSelectedClassId(newClass.id);
    setSelectedTab("stream");
    showToast(`Lớp học mới đã được tạo: ${newClass.name}`);
  };

  // Post announcement in stream
  const handleAddAnnouncement = (content: string) => {
    if (!selectedClassId) return;
    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      classId: selectedClassId,
      authorId: activeUser.id,
      authorName: activeUser.name,
      authorAvatar: activeUser.avatar,
      content,
      createdAt: new Date().toISOString(),
      comments: []
    };
    setAnnouncements([newAnn, ...announcements]);
    showToast("Đã đăng thông báo mới lên bảng tin.");
  };

  // Post comment in announcement
  const handleAddComment = (announcementId: string, content: string) => {
    const updatedAnnouncements = announcements.map((ann) => {
      if (ann.id !== announcementId) return ann;
      
      const newComment: Comment = {
        id: `com-${Date.now()}`,
        authorId: activeUser.id,
        authorName: activeUser.name,
        authorAvatar: activeUser.avatar,
        content,
        createdAt: new Date().toISOString()
      };

      return {
        ...ann,
        comments: [...ann.comments, newComment]
      };
    });

    setAnnouncements(updatedAnnouncements);
  };

  // Create Classwork Item (Teacher)
  const handleCreateClasswork = (cw: Partial<Classwork>) => {
    const newCw: Classwork = {
      id: `work-${Date.now()}`,
      classId: selectedClassId!,
      title: cw.title!,
      description: cw.description!,
      type: cw.type!,
      points: cw.points,
      dueDate: cw.dueDate,
      topic: cw.topic || "Chung",
      createdAt: new Date().toISOString(),
      quizQuestions: cw.quizQuestions,
      attachments: cw.attachments
    };
    setClasswork([newCw, ...classwork]);
    showToast(`Đã tạo nội dung mới: ${cw.title}`);
  };

  // Submit Homework Solution (Student)
  const handleSubmitWork = (
    classworkId: string, 
    content: string,
    quizAnswers?: Record<string, string>,
    quizScore?: number,
    autoGrade?: boolean
  ) => {
    const newSub: Submission = {
      id: `sub-${Date.now()}`,
      classworkId,
      studentId: activeUser.id,
      studentName: activeUser.name,
      studentAvatar: activeUser.avatar,
      content,
      submittedAt: new Date().toISOString(),
      status: autoGrade ? "graded" : "turned-in",
      grade: autoGrade ? quizScore : undefined,
      quizAnswers,
      quizScore
    };
    setSubmissions([newSub, ...submissions]);
    showToast(autoGrade ? `Nộp bài trắc nghiệm thành công! Điểm: ${quizScore}đ` : "Đã nộp bài tập thành công!");
  };

  // Grade/Feedback Submission (Teacher)
  const handleGradeSubmission = (subId: string, grade: number, feedback: string) => {
    const updatedSubmissions = submissions.map((sub) => {
      if (sub.id !== subId) return sub;
      return {
        ...sub,
        grade,
        feedback,
        status: "graded" as const
      };
    });
    setSubmissions(updatedSubmissions);
    showToast("Đã ghi điểm và gửi phản hồi thành công.");
  };

  // Direct Student Invitation (Teacher)
  const handleInviteStudent = (studentId: string) => {
    if (!selectedClassId) return;
    const classIndex = classes.findIndex((c) => c.id === selectedClassId);
    if (classIndex === -1) return;

    const targetClass = classes[classIndex];
    if (targetClass.students.includes(studentId)) return;

    const updatedClasses = [...classes];
    updatedClasses[classIndex] = {
      ...targetClass,
      students: [...targetClass.students, studentId]
    };

    setClasses(updatedClasses);
    
    // Find student name
    const st = DEFAULT_USERS.find((u) => u.id === studentId);
    showToast(`Đã thêm học viên ${st?.name || ""} vào lớp.`);
  };

  // Open Gemini syllabus drawer
  const handleOpenSyllabusAI = () => {
    const activeClass = classes.find((c) => c.id === selectedClassId);
    setGeminiMode("syllabus");
    setGeminiContextClasswork(null);
    setIsGeminiOpen(true);
  };

  // Open Gemini assignment study help drawer
  const handleOpenQnaAI = (cw: Classwork) => {
    setGeminiMode("qna");
    setGeminiContextClasswork(cw);
    setIsGeminiOpen(true);
  };

  // Filter classes:
  // - Teachers see classes they create/teach (teacherId === activeUser.id)
  // - Students see classes they joined (students.includes(activeUser.id))
  const filteredClasses = classes.filter((c) => {
    if (activeUser.role === "teacher") {
      return c.teacherId === activeUser.id;
    } else {
      return c.students.includes(activeUser.id);
    }
  });

  const activeClass = classes.find((c) => c.id === selectedClassId);

  return (
    <div className="w-screen h-screen p-[15px] overflow-hidden flex flex-col relative select-none antialiased font-sans text-gray-700">
      {/* --- BACKGROUND WALLPAPER ENGINE --- */}
      {wallpaperType === "image" && (
        <div 
          className="absolute inset-0 -z-10 w-full h-full bg-cover bg-center bg-no-repeat transition-all duration-700" 
          style={{ backgroundImage: `url(${currentWallpaper})` }}
        />
      )}

      {wallpaperType === "video" && (
        <video 
          src={currentWallpaper} 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 -z-10 w-full h-full object-cover transition-all duration-700" 
        />
      )}

      {wallpaperType === "gradient" && (
        <div 
          className="absolute inset-0 -z-10 w-full h-full transition-all duration-700" 
          style={{ background: currentWallpaper }}
        />
      )}

      {wallpaperType === "pattern" && (
        <>
          {currentWallpaper === "orbiting-planets" ? (
            <div 
              className="absolute inset-0 -z-10 w-full h-full bg-slate-950 overflow-hidden"
              style={{ backgroundImage: 'url("https://images.pexels.com/photos/1655166/pexels-photo-1655166.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500")', backgroundSize: 'cover' }}
            >
              {/* Dynamic Orbiting Planets Overlay */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] rounded-full border border-white/10 animate-[spin_15s_linear_infinite]" style={{ transformStyle: 'preserve-3d' }}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-sky-400 rounded-full shadow-[0_0_12px_#38bdf8]" />
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full border border-white/5 animate-[spin_35s_linear_infinite]" style={{ transformStyle: 'preserve-3d' }}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-6 bg-amber-400 rounded-full shadow-[0_0_18px_#fbbf24]" />
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110px] h-[110px] bg-yellow-200 rounded-full shadow-[0_0_45px_#fef08a]" />
            </div>
          ) : currentWallpaper === "dotted-pattern" ? (
            <div 
              className="absolute inset-0 -z-10 w-full h-full" 
              style={{
                backgroundImage: "radial-gradient(circle at 25% 25%, #a3b1c6 15%, transparent 15%), radial-gradient(circle at 75% 75%, #a3b1c6 15%, transparent 15%)",
                backgroundColor: "#e0e7ed",
                backgroundSize: "12px 12px"
              }}
            />
          ) : (
            <div 
              className="absolute inset-0 -z-10 w-full h-full" 
              style={{
                backgroundImage: "radial-gradient(circle, rgba(255, 255, 255, 0.15) 1px, transparent 1px)",
                backgroundColor: "#111213",
                backgroundSize: "13px 13px"
              }}
            />
          )}
        </>
      )}

      {/* --- THE 3D WEBSITE CANVAS WRAPPER CARD (Rule 2) --- */}
      <div 
        className="w-full h-full rounded-[10px] flex flex-col overflow-hidden relative shadow-[0_25px_60px_rgba(0,0,0,0.35)] border-[4px] transition-all duration-1000 ease-in-out"
        style={{ 
          borderColor: borderColors[borderColorIndex],
          backgroundColor: `rgba(255, 255, 255, ${wrapperOpacity / 100})`,
          backdropFilter: 'blur(10px)'
        }}
      >
        {/* 2. Main Workspace Layout */}
        <div className="flex flex-1 overflow-hidden relative">
          
          {/* --- COLLAPSIBLE SIDEBAR MENU (Rule 5) --- */}
          <aside 
            className="flex flex-col pt-5 pb-5 shrink-0 relative transition-all duration-300 ease-in-out border-r border-gray-200/60 z-20"
            style={{ 
              width: isSidebarExpanded ? "265px" : "72px",
              backgroundColor: `rgba(255, 255, 255, ${sidebarOpacity / 100})`,
              backdropFilter: 'blur(12px)'
            }}
          >
            {/* Collapse / Expand Toggle Button */}
            <button 
              onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
              className="absolute top-1/2 -right-3 -translate-y-1/2 z-30 w-6 h-6 bg-white rounded-full border border-gray-200 flex items-center justify-center shadow-sm hover:scale-110 text-gray-500 hover:text-gray-800 transition-all cursor-pointer"
              title={isSidebarExpanded ? "Thu gọn danh mục" : "Mở rộng danh mục"}
            >
              {isSidebarExpanded ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>

            {/* TOP: Company Logo & Slogan */}
            <div 
              onClick={() => {
                setSelectedClassId(null);
                showToast("Quay về màn hình chính");
              }}
              className={`px-4 mb-8 flex items-center gap-3 cursor-pointer select-none ${!isSidebarExpanded ? "justify-center" : "justify-start"}`}
            >
              <img 
                src="https://i.ibb.co/GvcmMgD3/Logo-Tr-ng.png" 
                alt="Logo Trắng" 
                className="h-8 w-8 object-contain rounded bg-blue-600 p-1 shadow-sm shrink-0"
              />
              {isSidebarExpanded && (
                <span className="font-bold text-base text-gray-800 tracking-tight whitespace-nowrap animate-in fade-in duration-300">
                  Power Service
                </span>
              )}
            </div>

            {/* CENTER: Vertically & Horizontally Centered Menu Icons */}
            <div className="flex-1 flex flex-col justify-center items-center gap-6 relative">
              
              {/* Menu Item 1: Trang chủ */}
              <div className="relative group w-full px-2">
                <button 
                  onClick={() => {
                    setSelectedClassId(null);
                    showToast("Màn hình chính Lớp học");
                  }}
                  className={`flex items-center gap-4 py-3 rounded-xl transition-all text-sm w-full ${
                    !selectedClassId 
                      ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20" 
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  } ${!isSidebarExpanded ? "justify-center px-0" : "px-4"}`}
                >
                  <Home className="w-5 h-5 shrink-0" />
                  {isSidebarExpanded && <span className="truncate">Trang chủ</span>}
                </button>
                {!isSidebarExpanded && (
                  <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 whitespace-nowrap">
                    Trang chủ
                  </div>
                )}
              </div>

              {/* Menu Item 2: Lớp học của tôi with Popup Submenu */}
              <div className="relative group w-full px-2">
                <button 
                  onClick={() => setShowClassesPopup(!showClassesPopup)}
                  className={`flex items-center gap-4 py-3 rounded-xl transition-all text-sm w-full ${
                    selectedClassId 
                      ? "bg-blue-50 text-blue-700 font-bold" 
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  } ${!isSidebarExpanded ? "justify-center px-0" : "px-4"}`}
                >
                  <GraduationCap className="w-5 h-5 shrink-0" />
                  {isSidebarExpanded && (
                    <div className="flex-1 flex items-center justify-between min-w-0">
                      <span className="truncate">Lớp học của tôi</span>
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform shrink-0 ${showClassesPopup ? "rotate-90" : ""}`} />
                    </div>
                  )}
                </button>
                {!isSidebarExpanded && (
                  <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 whitespace-nowrap">
                    Lớp học của tôi
                  </div>
                )}

                {/* Pop-up child menu centered on parent, high layer index (Rule 5) */}
                {showClassesPopup && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowClassesPopup(false)} />
                    <div 
                      className="absolute bg-white rounded-xl shadow-2xl border border-gray-100 p-2 z-[999] flex flex-col gap-1 min-w-[210px] max-h-80 overflow-y-auto"
                      style={{ 
                        left: isSidebarExpanded ? "100%" : "72px",
                        top: "50%",
                        transform: "translateY(-50%)"
                      }}
                    >
                      <p className="px-2.5 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-1 mb-1 select-none">
                        {activeUser.role === "teacher" ? "Lớp đang giảng dạy" : "Khóa học đã đăng ký"}
                      </p>
                      {filteredClasses.length === 0 ? (
                        <p className="text-[11px] text-gray-400 text-center py-3 italic">Trống</p>
                      ) : (
                        filteredClasses.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => {
                              setSelectedClassId(item.id);
                              setSelectedTab("stream");
                              setShowClassesPopup(false);
                              showToast(`Mở lớp: ${item.name}`);
                            }}
                            className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs text-left w-full transition-all hover:bg-gray-50 truncate ${
                              selectedClassId === item.id ? "bg-blue-50 text-blue-700 font-bold" : "text-gray-700"
                            }`}
                          >
                            <div 
                              className="w-4.5 h-4.5 rounded-full flex items-center justify-center text-white text-[8px] font-bold shrink-0"
                              style={{ background: item.bannerGradient }}
                            >
                              {item.name[0].toUpperCase()}
                            </div>
                            <span className="truncate">{item.name}</span>
                          </button>
                        ))
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Menu Item 3: Trợ lý AI */}
              <div className="relative group w-full px-2">
                <button 
                  onClick={() => {
                    handleOpenSyllabusAI();
                    showToast("Kích hoạt Trợ lý Đề cương AI");
                  }}
                  className={`flex items-center gap-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all text-sm w-full ${!isSidebarExpanded ? "justify-center px-0" : "px-4"}`}
                >
                  <Sparkles className="w-5 h-5 shrink-0 text-indigo-500 animate-pulse" />
                  {isSidebarExpanded && <span className="truncate">Trợ lý AI Đề cương</span>}
                </button>
                {!isSidebarExpanded && (
                  <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 whitespace-nowrap">
                    Trợ lý AI Đề cương
                  </div>
                )}
              </div>

              {/* Menu Item 4: Bài tập tổng hợp */}
              <div className="relative group w-full px-2">
                <button 
                  onClick={() => {
                    if (selectedClassId) {
                      setSelectedTab("classwork");
                      showToast("Mở danh mục Bài tập");
                    } else {
                      showToast("Vui lòng chọn một lớp học từ danh sách trước!");
                    }
                  }}
                  className={`flex items-center gap-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all text-sm w-full ${!isSidebarExpanded ? "justify-center px-0" : "px-4"}`}
                >
                  <Bookmark className="w-5 h-5 shrink-0 text-emerald-500" />
                  {isSidebarExpanded && <span className="truncate">Bài tập lớp học</span>}
                </button>
                {!isSidebarExpanded && (
                  <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 whitespace-nowrap">
                    Bài tập lớp học
                  </div>
                )}
              </div>

              {/* Menu Item 5: Tạo / Tham gia nhanh */}
              <div className="relative group w-full px-2">
                <button 
                  onClick={() => setShowSidebarPlusMenu(!showSidebarPlusMenu)}
                  className={`flex items-center gap-4 py-3 rounded-xl transition-all text-sm w-full ${
                    showSidebarPlusMenu 
                      ? "bg-blue-50 text-blue-700 font-bold" 
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  } ${!isSidebarExpanded ? "justify-center px-0" : "px-4"}`}
                >
                  <Plus className="w-5 h-5 shrink-0 text-sky-600 font-bold" />
                  {isSidebarExpanded && (
                    <div className="flex-1 flex items-center justify-between min-w-0">
                      <span className="truncate">Tạo & Tham gia</span>
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform shrink-0 ${showSidebarPlusMenu ? "rotate-90" : ""}`} />
                    </div>
                  )}
                </button>
                {!isSidebarExpanded && (
                  <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 whitespace-nowrap">
                    Tạo hoặc Tham gia lớp học
                  </div>
                )}

                {/* Popup Submenu cho Tạo / Tham gia nhanh */}
                {showSidebarPlusMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowSidebarPlusMenu(false)} />
                    <div 
                      className="absolute bg-white rounded-xl shadow-2xl border border-gray-100 p-2 z-[999] flex flex-col gap-1 min-w-[200px]"
                      style={{ 
                        left: isSidebarExpanded ? "100%" : "72px",
                        top: "50%",
                        transform: "translateY(-50%)"
                      }}
                    >
                      <p className="px-2.5 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-1 mb-1 select-none">
                        Tùy chọn nhanh
                      </p>
                      
                      {/* Thao tác 1: Tham gia lớp */}
                      <button
                        onClick={() => {
                          setJoinError("");
                          setJoinCode("");
                          setShowJoinModal(true);
                          setShowSidebarPlusMenu(false);
                        }}
                        className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-left w-full text-gray-700 hover:bg-gray-50 transition-all"
                      >
                        <Search className="w-4 h-4 text-gray-500 shrink-0" />
                        <span>Tham gia lớp học bằng mã</span>
                      </button>

                      {/* Thao tác 2: Tạo lớp học */}
                      <button
                        onClick={() => {
                          if (activeUser.role !== "teacher") {
                            const upgradedUser = { ...activeUser, role: "teacher" as const };
                            setActiveUser(upgradedUser);
                            localStorage.setItem("activeUser", JSON.stringify(upgradedUser));
                            showToast("Đã tự động chuyển đổi vai trò sang Giáo viên để tạo lớp học!");
                          }
                          setShowCreateClassModal(true);
                          setShowSidebarPlusMenu(false);
                        }}
                        className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-left w-full text-gray-700 hover:bg-gray-50 transition-all font-semibold text-blue-600"
                      >
                        <Plus className="w-4 h-4 text-blue-500 shrink-0" />
                        <span>Khởi tạo lớp học mới</span>
                      </button>
                    </div>
                  </>
                )}
              </div>

            </div>

            {/* BOTTOM: Notifications, Settings, Profile */}
            <div className="flex flex-col gap-4 px-2 mt-auto border-t border-gray-100/70 pt-4 items-center">
              
              {/* Bottom 1: Notifications */}
              <div className="relative group w-full px-1">
                <button 
                  onClick={() => setShowNotificationsPanel(!showNotificationsPanel)}
                  className={`flex items-center gap-4 py-2.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-all text-sm w-full ${!isSidebarExpanded ? "justify-center px-0" : "px-4"}`}
                >
                  <div className="relative">
                    <Bell className="w-5 h-5 shrink-0 text-amber-500 animate-swing" />
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white" />
                  </div>
                  {isSidebarExpanded && <span className="truncate font-medium">Thông báo</span>}
                </button>
                {!isSidebarExpanded && (
                  <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 whitespace-nowrap">
                    Thông báo mới
                  </div>
                )}
              </div>

              {/* Bottom 2: Settings */}
              <div className="relative group w-full px-1">
                <button 
                  onClick={() => setShowSettingsModal(true)}
                  className={`flex items-center gap-4 py-2.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-all text-sm w-full ${!isSidebarExpanded ? "justify-center px-0" : "px-4"}`}
                >
                  <Settings className="w-5 h-5 shrink-0 text-gray-600" />
                  {isSidebarExpanded && <span className="truncate font-medium">Cài đặt hiển thị</span>}
                </button>
                {!isSidebarExpanded && (
                  <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 whitespace-nowrap">
                    Cài đặt hiển thị
                  </div>
                )}
              </div>

              {/* Bottom 3: Profile Badge */}
              <div className="relative w-full px-1">
                <button 
                  onClick={() => setShowProfileSwitcher(!showProfileSwitcher)}
                  className={`flex items-center gap-3 py-2 rounded-lg text-gray-500 transition-all text-sm w-full text-left cursor-pointer hover:bg-gray-100/80 hover:text-gray-800 ${!isSidebarExpanded ? "justify-center" : "px-3 bg-gray-50/80 border border-gray-150/70"}`}
                >
                  <img 
                    src={activeUser.avatar} 
                    alt={activeUser.name} 
                    className="w-7 h-7 rounded-full object-cover border border-white shadow-sm shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  {isSidebarExpanded && (
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-xs text-gray-800 truncate leading-tight">{activeUser.name}</p>
                      <p className="text-[9px] text-gray-400 truncate capitalize animate-pulse">{activeUser.role === "teacher" ? "Giáo viên" : "Học sinh"}</p>
                    </div>
                  )}
                  {isSidebarExpanded && (
                    <Sliders className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600 ml-1 shrink-0" />
                  )}
                </button>

                {showProfileSwitcher && (
                  <>
                    <div className="fixed inset-0 z-45" onClick={() => setShowProfileSwitcher(false)} />
                    <div 
                      className="absolute bg-white rounded-xl shadow-2xl border border-gray-100 p-2 z-[999] flex flex-col gap-1 min-w-[220px]"
                      style={{ 
                        left: isSidebarExpanded ? "100%" : "72px",
                        bottom: "0px",
                        transform: "translateY(-10px)",
                        marginLeft: "8px"
                      }}
                    >
                      <p className="px-2.5 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-1 mb-1 select-none">
                        Chuyển đổi vai trò giả lập
                      </p>
                      {DEFAULT_USERS.map((user) => (
                        <button
                          key={user.id}
                          onClick={() => {
                            setActiveUser(user);
                            localStorage.setItem("activeUser", JSON.stringify(user));
                            setSelectedClassId(null);
                            setShowProfileSwitcher(false);
                            showToast(`Đã đổi vai trò giả lập: ${user.name}`);
                          }}
                          className={`flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-xs text-left w-full transition-all hover:bg-gray-50 ${
                            activeUser.id === user.id ? "bg-blue-50 text-blue-700 font-bold border border-blue-100" : "text-gray-700 border border-transparent"
                          }`}
                        >
                          <img src={user.avatar} className="w-5 h-5 rounded-full object-cover shrink-0" referrerPolicy="no-referrer" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-semibold">{user.name}</p>
                            <p className="text-[9px] text-gray-400 capitalize leading-none mt-0.5">{user.role === "teacher" ? "Giáo viên" : "Học sinh"}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </>
                )}
                
                {!isSidebarExpanded && !showProfileSwitcher && (
                  <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 whitespace-nowrap">
                    {activeUser.name} ({activeUser.role === "teacher" ? "Giáo viên" : "Học sinh"})
                  </div>
                )}
              </div>

            </div>

          </aside>

          {/* --- CONTENT PAGE LAYOUT (Rule 7) --- */}
          <main className="flex-1 overflow-y-auto px-5 py-6 md:p-8 flex flex-col gap-6 relative">
            
            {/* 1. Dynamic Banner (Rule 7) */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 rounded-[10px] p-6 text-white shadow-md relative overflow-hidden group shrink-0">
              {/* Floating glowing graphics */}
              <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />
              <div className="absolute left-1/3 -bottom-10 w-32 h-32 bg-indigo-400/20 rounded-full blur-xl" />

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                <div className="flex items-center gap-4">
                  {/* Dynamic Representative Icon with continuous animation */}
                  <div className="p-3 bg-white/20 rounded-xl animate-bounce hover:rotate-12 duration-1000 shrink-0">
                    <GraduationCap className="w-8 h-8 text-white shadow-sm" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                      {selectedClassId ? activeClass?.name : "Hệ Thống Đào Tạo Power Service"}
                      <span className="text-[10px] uppercase font-semibold bg-white/20 text-white px-2 py-0.5 rounded-full backdrop-blur-sm tracking-widest leading-none">
                        PRO v4.2
                      </span>
                    </h1>
                    <p className="text-xs text-indigo-100/90 mt-1 font-medium">
                      {selectedClassId 
                        ? (activeClass?.section || "Phân khoa học tập chất lượng cao") 
                        : "Khám phá phòng học thông minh tích hợp trí tuệ nhân tạo Gemini trợ giúp tự động."}
                    </p>
                  </div>
                </div>

                {/* Documentation Button (Nút Tài liệu hướng dẫn) */}
                <button 
                  onClick={() => setShowGuideModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-lg text-xs font-bold transition-all shadow-sm shrink-0 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-800 animate-pulse" />
                  Tài liệu hướng dẫn
                </button>
              </div>

              {/* Feature sub-bar inside Banner (Rule 7) */}
              <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                
                {/* Filters */}
                <div className="flex items-center gap-2.5 text-xs">
                  <span className="text-indigo-100 font-semibold select-none">Bộ lọc hiển thị:</span>
                  <button 
                    onClick={() => {
                      setSelectedFilter("all");
                      showToast("Bộ lọc: Tất cả lớp học");
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                      selectedFilter === "all" ? "bg-white text-indigo-700 shadow-sm" : "bg-white/10 hover:bg-white/20 text-white"
                    }`}
                  >
                    Tất cả
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedFilter("active");
                      showToast("Bộ lọc: Đang diễn ra tích cực");
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                      selectedFilter === "active" ? "bg-white text-indigo-700 shadow-sm" : "bg-white/10 hover:bg-white/20 text-white"
                    }`}
                  >
                    Đang hoạt động
                  </button>
                </div>

                {/* Additional interactive features / statistics preview inside Banner */}
                <div className="flex items-center gap-2.5 text-xs text-indigo-100/90 font-medium">
                  <span className="hidden sm:inline">Tổng số khóa học:</span>
                  <span className="bg-white/20 px-2.5 py-1 rounded-md font-bold text-white text-xs">{filteredClasses.length}</span>
                </div>
              </div>

            </div>

            {/* 2. Thẻ Chứa nội dung chính trang có nền màu trắng (Rule 7) */}
            <div className="flex-1 bg-white rounded-[10px] border border-gray-200/80 shadow-sm overflow-hidden flex flex-col relative">
              
              {!selectedClassId ? (
                /* --- DASHBOARD VIEW (LIST OF CLASSES) --- */
                <div className="p-6 md:p-8 flex-1 overflow-y-auto">
                  {/* Greeting & Quick Summary */}
                  <div className="mb-6 pb-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">Khám phá các Lớp học trực tuyến</h2>
                      <p className="text-xs text-gray-500 mt-1">Lựa chọn một lớp để xem bảng tin, trao đổi tài liệu giảng dạy và trả lời câu hỏi bài tập.</p>
                    </div>
                    
                    <div className="flex gap-2.5">
                      <button
                        onClick={() => {
                          setJoinError("");
                          setJoinCode("");
                          setShowJoinModal(true);
                        }}
                        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
                      >
                        <Search className="h-3.5 w-3.5 text-gray-400" />
                        Tìm mã lớp
                      </button>
                      {activeUser.role === "teacher" && (
                        <button
                          onClick={() => setShowCreateClassModal(true)}
                          className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          Tạo khóa mới
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Class Grid */}
                  {filteredClasses.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 text-center">
                      <div className="w-14 h-14 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-3 animate-pulse">
                        <GraduationCap className="w-7 h-7" />
                      </div>
                      <h4 className="font-bold text-sm text-gray-800">Chưa có lớp học nào</h4>
                      <p className="text-xs text-gray-500 mt-1 max-w-sm">
                        {activeUser.role === "teacher"
                          ? "Ấn nút 'Tạo lớp mới' ở góc trên hoặc thanh danh mục bên để khởi tạo lớp học đầu tiên."
                          : "Gia nhập bằng mã mẫu 'react101' hoặc 'engcomm' để trải nghiệm vai học viên nhé!"}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {filteredClasses.map((item) => (
                        <ClassCard
                          key={item.id}
                          classItem={item}
                          onSelect={(id) => {
                            setSelectedClassId(id);
                            setSelectedTab("stream");
                            showToast(`Đang vào lớp: ${item.name}`);
                          }}
                          onCopyCode={handleCopyCode}
                          activeUserRole={activeUser.role}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* --- INDIVIDUAL CLASS DETAILS VIEW --- */
                <div className="flex flex-col flex-1 overflow-hidden">
                  
                  {/* Top tabs toolbar */}
                  <div className="sticky top-0 z-30 flex h-14 justify-between items-center border-b border-gray-200 bg-white text-gray-600 text-sm font-medium select-none px-4">
                    {/* Return back button */}
                    <button
                      onClick={() => setSelectedClassId(null)}
                      className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-800 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      Thoát lớp
                    </button>

                    {/* Tab Selectors */}
                    <div className="flex h-full gap-5">
                      {[
                        { id: "stream", label: "Bảng tin" },
                        { id: "classwork", label: "Bài tập" },
                        { id: "people", label: "Thành viên" },
                        { id: "grades", label: activeUser.role === "teacher" ? "Điểm số" : "Bảng điểm cá nhân" }
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setSelectedTab(tab.id as any)}
                          className={`relative flex h-full items-center px-1 py-1 text-xs sm:text-sm font-semibold tracking-wide transition-all focus:outline-none ${
                            selectedTab === tab.id
                              ? "text-blue-600 font-bold"
                              : "text-gray-500 hover:text-blue-500"
                          }`}
                        >
                          {tab.label}
                          {selectedTab === tab.id && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.75 rounded-t-full bg-blue-600" />
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Trợ lý AI Assistant Launcher */}
                    <button
                      onClick={handleOpenSyllabusAI}
                      className="flex items-center gap-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition-colors cursor-pointer"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-indigo-500 animate-pulse shrink-0" />
                      <span>Học tập AI</span>
                    </button>
                  </div>

                  {/* Active Tab Scroll Container */}
                  <div className="p-4 sm:p-6 flex-1 overflow-y-auto bg-gray-50/50 animate-in fade-in duration-200">
                    {activeClass && (
                      <>
                        {selectedTab === "stream" && (
                          <StreamTab
                            classItem={activeClass}
                            activeUser={activeUser}
                            announcements={announcements}
                            classwork={classwork}
                            onAddAnnouncement={handleAddAnnouncement}
                            onAddComment={handleAddComment}
                            onCopyCode={handleCopyCode}
                          />
                        )}
                        {selectedTab === "classwork" && (
                          <ClassworkTab
                            classItem={activeClass}
                            activeUser={activeUser}
                            classwork={classwork}
                            submissions={submissions}
                            onCreateClasswork={handleCreateClasswork}
                            onSubmitWork={handleSubmitWork}
                            onOpenGrading={(cwId) => {
                              setSelectedTab("grades");
                            }}
                            onOpenAiHelper={handleOpenQnaAI}
                          />
                        )}
                        {selectedTab === "people" && (
                          <PeopleTab
                            classItem={activeClass}
                            activeUser={activeUser}
                            allUsers={DEFAULT_USERS}
                            onInviteStudent={handleInviteStudent}
                          />
                        )}
                        {selectedTab === "grades" && (
                          <GradesTab
                            classItem={activeClass}
                            activeUser={activeUser}
                            classwork={classwork}
                            submissions={submissions}
                            allUsers={DEFAULT_USERS}
                            onGradeSubmission={handleGradeSubmission}
                          />
                        )}
                      </>
                    )}
                  </div>

                </div>
              )}

            </div>

          </main>
        </div>

      </div>

      {/* --- FLOATING BOTTOM PLUS BUTTON (Rule 7) --- */}
      {!selectedClassId && (
        <div className="fixed bottom-8 right-8 z-40 flex flex-col items-end gap-3">
          {showFloatingMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowFloatingMenu(false)} />
              
              <div className="flex flex-col gap-2 items-end z-20 mb-1 animate-in slide-in-from-bottom-5 duration-200">
                {/* Nut 1: Tham gia lop bang ma */}
                <button
                  onClick={() => {
                    setJoinError("");
                    setJoinCode("");
                    setShowJoinModal(true);
                    setShowFloatingMenu(false);
                  }}
                  className="flex items-center gap-2 rounded-xl bg-white border border-gray-150 px-4 py-2.5 text-xs font-semibold text-gray-700 shadow-xl hover:bg-gray-50 transition-all scale-95 hover:scale-100"
                >
                  <Search className="h-4 w-4 text-gray-400 shrink-0" />
                  <span>Tham gia lớp bằng mã</span>
                </button>

                {/* Nut 2: Tao lop hoc moi */}
                <button
                  onClick={() => {
                    if (activeUser.role !== "teacher") {
                      const upgradedUser = { ...activeUser, role: "teacher" as const };
                      setActiveUser(upgradedUser);
                      localStorage.setItem("activeUser", JSON.stringify(upgradedUser));
                      showToast("Đã tự động chuyển đổi vai trò sang Giáo viên để tạo lớp học!");
                    }
                    setShowCreateClassModal(true);
                    setShowFloatingMenu(false);
                  }}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all scale-95 hover:scale-100"
                >
                  <Plus className="h-4 w-4 text-white shrink-0" />
                  <span>Tạo lớp học mới</span>
                </button>
              </div>
            </>
          )}

          <button
            onClick={() => setShowFloatingMenu(!showFloatingMenu)}
            className={`w-14 h-14 text-white rounded-full shadow-2xl flex items-center justify-center transition-all z-20 cursor-pointer ${
              showFloatingMenu ? "bg-gray-800 rotate-45 hover:bg-gray-900" : "bg-blue-600 hover:scale-110 hover:bg-blue-700"
            }`}
            title="Tạo hoặc tham gia lớp học"
          >
            <Plus className="w-7 h-7" strokeWidth={3} />
          </button>
        </div>
      )}

      {/* --- 4. GLOBAL DIALOGS & MODALS --- */}

      {/* Join Class Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <form
            onSubmit={handleJoinClassSubmit}
            className="bg-white rounded-xl shadow-2xl border border-gray-100 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
          >
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                <h3 className="font-bold text-sm">Tham gia lớp học bằng mã</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowJoinModal(false)}
                className="text-white hover:text-gray-200 text-xs font-bold w-6 h-6 rounded-full hover:bg-white/10 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-xs text-gray-500 leading-relaxed">
                Nhập mã lớp học do giáo viên của bạn chia sẻ để gia nhập phòng học. Bạn sẽ có thể theo dõi tài liệu, hoàn thành bài tập nộp cho giáo viên của mình.
              </p>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Mã phòng học lớp học
                </label>
                <input
                  type="text"
                  required
                  value={joinCode}
                  onChange={(e) => {
                    setJoinCode(e.target.value);
                    setJoinError("");
                  }}
                  placeholder="Ví dụ: react101"
                  className="w-full rounded border border-gray-300 p-3 text-sm outline-none font-bold focus:border-blue-500 text-center uppercase tracking-widest"
                />
                {joinError && (
                  <p className="text-xs text-red-600 font-semibold mt-1.5 flex items-center gap-1">
                    ⚠️ {joinError}
                  </p>
                )}
              </div>

              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-[10px] text-gray-600 leading-normal">
                <p className="font-bold text-blue-800 mb-1">Mã lớp học mô phỏng có sẵn:</p>
                - Lớp chuyên sâu: <code className="font-bold font-mono">react101</code><br />
                - Lớp Tiếng Anh: <code className="font-bold font-mono">engcomm</code><br />
                - Lớp Thiết kế UIUX: <code className="font-bold font-mono">uiux404</code>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 border-t border-gray-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowJoinModal(false)}
                className="rounded-lg px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={!joinCode.trim()}
                className={`rounded-lg px-5 py-2 text-xs font-bold text-white shadow-sm transition-colors cursor-pointer ${
                  joinCode.trim() ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                Gia nhập ngay
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Create Class Modal */}
      {showCreateClassModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <form
            onSubmit={handleCreateClassSubmit}
            className="bg-white rounded-xl shadow-2xl border border-gray-100 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
          >
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                <h3 className="font-bold text-sm">Tạo lớp học trực tuyến mới</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateClassModal(false)}
                className="text-white hover:text-gray-200 text-xs font-bold w-6 h-6 rounded-full hover:bg-white/10 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Tên lớp học (Bắt buộc)
                </label>
                <input
                  type="text"
                  required
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  placeholder="Ví dụ: Lập trình ReactJS & NextJS nâng cao"
                  className="w-full rounded border border-gray-350 p-2.5 text-sm outline-none focus:border-blue-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Phân viện / Ngành đào tạo
                </label>
                <input
                  type="text"
                  value={newClassSec}
                  onChange={(e) => setNewClassSec(e.target.value)}
                  placeholder="Ví dụ: Công nghệ thông tin - K22"
                  className="w-full rounded border border-gray-300 p-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Chủ đề giảng dạy
                </label>
                <input
                  type="text"
                  value={newClassSub}
                  onChange={(e) => setNewClassSub(e.target.value)}
                  placeholder="Ví dụ: Thiết kế phát triển Frontend Web"
                  className="w-full rounded border border-gray-300 p-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Phòng học ảo / Địa điểm
                </label>
                <input
                  type="text"
                  value={newClassRoom}
                  onChange={(e) => setNewClassRoom(e.target.value)}
                  placeholder="Ví dụ: Zoom Meet ID: 888-222"
                  className="w-full rounded border border-gray-300 p-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 border-t border-gray-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCreateClassModal(false)}
                className="rounded-lg px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={!newClassName.trim()}
                className={`rounded-lg px-5 py-2 text-xs font-bold text-white shadow-sm transition-colors cursor-pointer ${
                  newClassName.trim() ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                Khởi tạo ngay
              </button>
            </div>
          </form>
        </div>
      )}

      {/* --- DYNAMIC CUSTOMIZABLE SETTINGS DIALOG (Rule 8 & 9) --- */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-100 w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-sm">Cài đặt giao diện & Hình nền</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSettingsModal(false)}
                className="text-white hover:text-gray-200 text-xs font-bold w-6 h-6 rounded-full hover:bg-white/10 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              
              {/* Opacity Settings section */}
              <div>
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3.5 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-blue-500" />
                  Độ trong suốt các thành phần hiển thị (%):
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  {/* Website wrapper opacity card */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-700">Độ trong suốt của Thẻ chính:</span>
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{wrapperOpacity}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="10" 
                      max="100" 
                      value={wrapperOpacity}
                      onChange={(e) => setWrapperOpacity(Number(e.target.value))}
                      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <p className="text-[10px] text-gray-400">Điều chỉnh độ hiển thị mờ đục hoặc trong suốt của website so với hình nền.</p>
                  </div>

                  {/* Sidebar opacity card */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-700">Độ trong suốt của Sidebar:</span>
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{sidebarOpacity}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="10" 
                      max="100" 
                      value={sidebarOpacity}
                      onChange={(e) => setSidebarOpacity(Number(e.target.value))}
                      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <p className="text-[10px] text-gray-400">Chỉnh độ mờ cho Sidebar danh mục nằm bên trái của website.</p>
                  </div>
                </div>
              </div>

              {/* Wallpaper settings section (Rule 9) */}
              <div>
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-emerald-500" />
                  Lựa chọn Hình nền Premium hệ thống:
                </h4>

                {/* Categories */}
                <div className="space-y-5">
                  
                  {/* Category 1: Image Wallpapers */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">1. Hình nền tĩnh (Image Wallpapers)</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {IMAGE_WALLPAPERS.map((wp) => (
                        <div 
                          key={wp.url}
                          onClick={() => {
                            setWallpaperType("image");
                            setCurrentWallpaper(wp.url);
                            showToast(`Đã áp dụng hình nền tĩnh: ${wp.name}`);
                          }}
                          className={`group cursor-pointer rounded-lg border overflow-hidden transition-all relative ${
                            wallpaperType === "image" && currentWallpaper === wp.url 
                              ? "border-blue-500 ring-2 ring-blue-500/20 scale-102" 
                              : "border-gray-200 hover:border-blue-400"
                          }`}
                        >
                          <img 
                            src={wp.thumbnail} 
                            alt={wp.name} 
                            className="h-16 w-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="p-1.5 bg-white text-center">
                            <p className="text-[10px] font-bold text-gray-850 truncate">{wp.name}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Category 2: Video Wallpapers */}
                  <div className="space-y-2 pt-1">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">2. Hình nền động Video (Video Wallpapers)</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {VIDEO_WALLPAPERS.map((wp) => (
                        <div 
                          key={wp.url}
                          onClick={() => {
                            setWallpaperType("video");
                            setCurrentWallpaper(wp.url);
                            showToast(`Đã áp dụng hình nền động: ${wp.name}`);
                          }}
                          className={`group cursor-pointer rounded-lg border overflow-hidden transition-all relative ${
                            wallpaperType === "video" && currentWallpaper === wp.url 
                              ? "border-indigo-500 ring-2 ring-indigo-500/20 scale-102" 
                              : "border-gray-200 hover:border-indigo-400"
                          }`}
                        >
                          <div className="h-16 bg-slate-900 relative flex items-center justify-center">
                            <span className="text-[10px] bg-indigo-600 text-white font-bold px-2 py-0.5 rounded-full absolute top-1 right-1">Video</span>
                            <video src={wp.thumbnail} muted loop autoPlay className="h-full w-full object-cover opacity-60" />
                          </div>
                          <div className="p-1.5 bg-white text-center">
                            <p className="text-[10px] font-bold text-gray-850 truncate">{wp.name}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Category 3: Gradient Wallpapers */}
                  <div className="space-y-2 pt-1">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">3. Màu Gradient CSS (Gradient Wallpapers)</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {GRADIENT_WALLPAPERS.map((wp) => (
                        <div 
                          key={wp.url}
                          onClick={() => {
                            setWallpaperType("gradient");
                            setCurrentWallpaper(wp.url);
                            showToast(`Đã áp dụng dải màu: ${wp.name}`);
                          }}
                          className={`group cursor-pointer rounded-lg border overflow-hidden transition-all relative ${
                            wallpaperType === "gradient" && currentWallpaper === wp.url 
                              ? "border-violet-500 ring-2 ring-violet-500/20 scale-102" 
                              : "border-gray-200 hover:border-violet-400"
                          }`}
                        >
                          <div className="h-16 w-full" style={{ background: wp.thumbnail }} />
                          <div className="p-1.5 bg-white text-center">
                            <p className="text-[10px] font-bold text-gray-850 truncate">{wp.name}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Category 4: Custom Patterns */}
                  <div className="space-y-2 pt-1">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">4. Họa tiết đồ họa & Vũ trụ (Custom Patterns)</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {PATTERN_WALLPAPERS.map((wp) => (
                        <div 
                          key={wp.url}
                          onClick={() => {
                            setWallpaperType("pattern");
                            setCurrentWallpaper(wp.url);
                            showToast(`Đã áp dụng họa tiết: ${wp.name}`);
                          }}
                          className={`group cursor-pointer rounded-lg border overflow-hidden transition-all relative ${
                            wallpaperType === "pattern" && currentWallpaper === wp.url 
                              ? "border-amber-500 ring-2 ring-amber-500/20 scale-102" 
                              : "border-gray-200 hover:border-amber-400"
                          }`}
                        >
                          <div className="h-16 w-full bg-slate-900 flex items-center justify-center p-1">
                            <span className="text-[9px] font-bold text-white uppercase text-center bg-white/20 px-1.5 py-0.5 rounded tracking-wider">{wp.name}</span>
                          </div>
                          <div className="p-1.5 bg-white text-center">
                            <p className="text-[10px] font-bold text-gray-850 truncate">{wp.name}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

            </div>

            <div className="bg-gray-50 p-4 border-t border-gray-150 flex justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  setWrapperOpacity(95);
                  setSidebarOpacity(90);
                  setWallpaperType("image");
                  setCurrentWallpaper("https://i.ibb.co/G47jTb1g/minimalist-white-background-3840x2160-bright-space-clean-aesthetic-27644.jpg");
                  showToast("Khôi phục cấu hình mặc định ban đầu");
                }}
                className="rounded-lg px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
              >
                Khôi phục mặc định
              </button>
              <button
                type="button"
                onClick={() => setShowSettingsModal(false)}
                className="rounded-lg px-6 py-2 bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white shadow-sm cursor-pointer"
              >
                Hoàn tất
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- NOTIFICATIONS COMPONENT PANEL --- */}
      {showNotificationsPanel && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-end p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-100 w-full max-w-sm h-[80vh] flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4.5 h-4.5 text-yellow-300" />
                <h3 className="font-bold text-sm">Hộp thông báo tức thời</h3>
              </div>
              <button 
                onClick={() => setShowNotificationsPanel(false)}
                className="text-white hover:text-gray-200 text-xs font-bold w-6 h-6 rounded-full hover:bg-white/10 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {[
                { id: 1, title: "AI Trợ lý học thuật", text: "Trợ lý học thuật vừa cập nhật tài liệu hướng dẫn xây dựng đề cương 5 bài học thông minh.", date: "Hôm nay", tag: "AI" },
                { id: 2, title: "Lớp học Lập trình ReactJS", text: "Giáo viên Minh đã đăng tải một câu hỏi thực hành mới: Kiểm tra & thực hành Chương 1.", date: "Hôm qua", tag: "Bài tập" },
                { id: 3, title: "Hệ thống Power Service", text: "Hình nền động Video Space Universe đã được đưa vào kho lưu trữ hình nền cài đặt của bạn.", date: "2 ngày trước", tag: "Hệ thống" }
              ].map((notif) => (
                <div key={notif.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100/70 transition-colors text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-gray-850">{notif.title}</span>
                    <span className="text-[9px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{notif.tag}</span>
                  </div>
                  <p className="text-gray-500 leading-normal">{notif.text}</p>
                  <span className="text-[10px] text-gray-400 mt-1.5 block font-medium">{notif.date}</span>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 p-3 text-center border-t border-gray-100">
              <button 
                onClick={() => {
                  setShowNotificationsPanel(false);
                  showToast("Đã đánh dấu đọc tất cả thông báo.");
                }}
                className="text-[11px] font-bold text-blue-600 hover:underline"
              >
                Đánh dấu đọc tất cả
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- REFINED DOCUMENTATION TUTORIAL MODAL --- */}
      {showGuideModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-100 w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-300 animate-spin" />
                <h3 className="font-bold text-sm">Tài liệu hướng dẫn & Tính năng chính</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="text-white hover:text-gray-200 text-xs font-bold w-6 h-6 rounded-full hover:bg-white/10 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-gray-600 leading-relaxed max-h-[70vh] overflow-y-auto">
              <p className="font-bold text-sm text-gray-800 mb-2">
                Chào mừng bạn đến với Website Đào Tạo Trực Tuyến mô phỏng Google Lớp Học của Power Service!
              </p>

              <div className="space-y-3">
                <div className="p-3 bg-indigo-50 border-l-4 border-indigo-500 rounded-r-lg">
                  <p className="font-bold text-indigo-800 mb-0.5">🌟 1. Trợ lý Trí tuệ Nhân tạo AI thông minh</p>
                  Bạn có thể bấm vào nút **"AI Trợ lý"** hoặc **"Trợ lý AI Đề cương"** trên thanh danh mục để tự động tạo đề cương chi tiết 5 bài học cho bất kỳ chủ đề nào, hoặc hướng dẫn giải bài tập thực tế.
                </div>

                <div className="p-3 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg">
                  <p className="font-bold text-amber-800 mb-0.5">🎨 2. Thay đổi Hình nền & Tùy chỉnh Độ mờ</p>
                  Bấm biểu tượng **"Cài đặt hệ thống"** ở dưới thanh danh mục bên trái để tùy chỉnh độ trong suốt của Thẻ chính, thanh Menu và lựa chọn từ hàng chục hình nền ảnh, video động, gradient hay họa tiết vũ trụ.
                </div>

                <div className="p-3 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-lg">
                  <p className="font-bold text-emerald-800 mb-0.5">🛠️ 3. Mô phỏng Đầy đủ vai trò Giáo viên & Học viên</p>
                  Nhấp vào ảnh đại diện của bạn ở góc phải thanh công cụ phía trên để tự do hoán đổi vai trò giáo viên (để tạo lớp, giao bài tập, chấm điểm trực tiếp) và học viên (để vào lớp học, nộp bài, xem báo cáo điểm).
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3">
                <p className="font-bold text-gray-700 mb-1">Mã lớp học mẫu dành cho học viên:</p>
                <ul className="list-disc list-inside space-y-1 pl-1 font-semibold text-gray-600">
                  <li>Lớp Lập trình Web: <span className="font-mono text-blue-600">react101</span></li>
                  <li>Lớp Giao tiếp tiếng Anh: <span className="font-mono text-blue-600">engcomm</span></li>
                  <li>Lớp Thiết kế UI/UX: <span className="font-mono text-blue-600">uiux404</span></li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="rounded-lg px-6 py-2 bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white shadow-sm cursor-pointer"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Gemini Assistant Slide-out Drawer */}
      <GeminiDrawer
        isOpen={isGeminiOpen}
        onClose={() => {
          setIsGeminiOpen(false);
          setGeminiContextClasswork(null);
        }}
        mode={geminiMode}
        contextClasswork={geminiContextClasswork}
        subjectName={activeClass?.name}
      />

      {/* 6. Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 rounded-xl bg-gray-900/95 text-white px-5 py-3 text-xs font-semibold shadow-2xl border border-gray-800 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
