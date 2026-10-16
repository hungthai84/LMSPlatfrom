import React, { useState, useEffect } from "react";
import { Sidebar } from "./components/layout/Sidebar";
import { SettingsModal } from "./components/layout/SettingsModal";
import { Header } from "./components/layout/Header";
import { MetricCard } from "./components/layout/MetricCard";
import { 
  Users, 
  Ticket, 
  CheckCircle, 
  Clock, 
  Sliders, 
  GraduationCap, 
  Search, 
  Plus, 
  Sparkles,
  Calendar as CalendarIcon,
  Award,
  BookOpen,
  MessageSquare,
  ThumbsUp,
  Send,
  FileText,
  Bookmark,
  Sparkle
} from 'lucide-react';
import { 
  DEFAULT_USERS, 
  DEFAULT_CLASSES, 
  DEFAULT_ANNOUNCEMENTS, 
  DEFAULT_CLASSWORK, 
  DEFAULT_SUBMISSIONS 
} from "./initialData";
import { ClassItem, Announcement, Classwork, Submission, UserProfile, Comment } from "./types";
import ClassCard from "./components/ClassCard";
import StreamTab from "./components/StreamTab";
import ClassworkTab from "./components/ClassworkTab";
import PeopleTab from "./components/PeopleTab";
import GradesTab from "./components/GradesTab";
import GeminiDrawer from "./components/GeminiDrawer";
import HomeDashboard from "./components/HomeDashboard";

export default function App() {
  const [activeUser, setActiveUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("activeUser");
    return saved ? JSON.parse(saved) : DEFAULT_USERS[2];
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

  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<"stream" | "classwork" | "people" | "grades">("stream");
  const [activeMainTab, setActiveMainTab] = useState<"tongquan" | "khoahoc" | "lich" | "baitap" | "chungchi" | "thuvien" | "thongbao" | "congdong" | "caidat">("tongquan");

  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(true);
  const [newClassName, setNewClassName] = useState("");
  const [newClassSec, setNewClassSec] = useState("");
  const [newClassSub, setNewClassSub] = useState("");
  const [newClassRoom, setNewClassRoom] = useState("");
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [joinError, setJoinError] = useState("");
  const [showCreateClassModal, setShowCreateClassModal] = useState(false);
  const [showNotificationsPanel, setShowNotificationsPanel] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showProfileSwitcher, setShowProfileSwitcher] = useState(false);

  const [wrapperOpacity, setWrapperOpacity] = useState(100);
  const [sidebarOpacity, setSidebarOpacity] = useState(100);
  const [cardOpacity, setCardOpacity] = useState(100);
  const [wallpaperType, setWallpaperType] = useState<'none' | 'image' | 'video' | 'gradient' | 'pattern'>('none');
  const [currentWallpaper, setCurrentWallpaper] = useState<string>('');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [borderColor, setBorderColor] = useState("#3b82f6");
  useEffect(() => {
    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#6366f1"];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % colors.length;
      setBorderColor(colors[i]);
    }, 60000); // 1 minute
    return () => clearInterval(interval);
  }, []);


  const [isGeminiOpen, setIsGeminiOpen] = useState(false);
  const [geminiMode, setGeminiMode] = useState<"syllabus" | "qna">("syllabus");
  const [geminiContextClasswork, setGeminiContextClasswork] = useState<Classwork | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenSyllabusAI = () => {
    setGeminiMode("syllabus");
    setGeminiContextClasswork(null);
    setIsGeminiOpen(true);
  };

  const filteredClasses = classes.filter(c => {
    if (activeUser.role === "teacher") {
      return c.teacherId === activeUser.id;
    }
    return c.students.includes(activeUser.id);
  });
  const activeClass = classes.find(c => c.id === selectedClassId);


  const getAppStyle = () => {
    let style: React.CSSProperties = { backgroundColor: "#f8fafc" };
    if (wallpaperType === 'image') {
      style = { backgroundImage: `url(${currentWallpaper})`, backgroundSize: 'cover', backgroundPosition: 'center' };
    } else if (wallpaperType === 'gradient') {
      style = { background: currentWallpaper };
    } else if (wallpaperType === 'pattern' && currentWallpaper) {
      try {
        const pat = JSON.parse(currentWallpaper);
        style = { backgroundColor: pat.bg, backgroundImage: pat.css, backgroundSize: pat.size };
      } catch (e) {}
    }
    return style;
  };

  const getPageTitle = () => {
    if (!selectedClassId) return "Dashboard";
    if (activeClass) return activeClass.name;
    return "Chi tiết Lớp học";
  };

  return (
    <div className="flex h-screen bg-[#f3f6fc] overflow-hidden font-sans text-gray-900" style={getAppStyle()}>
      {wallpaperType === 'video' && currentWallpaper && (
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none">
          <source src={currentWallpaper} type="video/mp4" />
        </video>
      )}
      <div 
        className="flex h-full w-full overflow-hidden relative z-10"
      >
        <Sidebar 
        isSidebarExpanded={isSidebarExpanded}
        setIsSidebarExpanded={setIsSidebarExpanded}
        selectedClassId={selectedClassId}
        setSelectedClassId={setSelectedClassId}
        setSelectedTab={setSelectedTab}
        showToast={showToast}
        handleOpenSyllabusAI={handleOpenSyllabusAI}
        setShowJoinModal={setShowJoinModal}
        setJoinError={setJoinError}
        setJoinCode={setJoinCode}
        activeUser={activeUser}
        setActiveUser={setActiveUser}
        setShowCreateClassModal={setShowCreateClassModal}
        setShowSettingsModal={setShowSettingsModal}
        showProfileSwitcher={showProfileSwitcher}
        setShowProfileSwitcher={setShowProfileSwitcher}
        sidebarOpacity={sidebarOpacity}
        activeMainTab={activeMainTab}
        setActiveMainTab={setActiveMainTab}
      />

      <div className="flex-1 flex flex-col min-w-0 relative" style={{ backgroundColor: `rgba(248, 250, 252, ${wrapperOpacity / 100})`, backdropFilter: wrapperOpacity < 100 ? "blur(10px)" : "none" }}>
        <Header 
          showNotificationsPanel={showNotificationsPanel}
          setShowNotificationsPanel={setShowNotificationsPanel}
          headerOpacity={wrapperOpacity}
          title={getPageTitle()}
          activeUser={activeUser}
          setActiveUser={setActiveUser}
          showProfileSwitcher={showProfileSwitcher}
          setShowProfileSwitcher={setShowProfileSwitcher}
        />

        <main className="flex-1 overflow-y-auto p-5 sm:p-6 lg:p-8 bg-[#f8f9fc]">
          <div className="max-w-[1520px] mx-auto w-full h-full flex flex-col">
            <div className="flex-1 flex flex-col min-h-0 relative">
              
              {!selectedClassId ? (
                <div className="flex flex-col h-full justify-between gap-6">
                  {/* MAIN PANEL VIEW ROUTER BASED ON SELECTED TAB */}
                  <div className="flex-1 min-h-0 overflow-y-auto">
                    {activeMainTab === "tongquan" && (
                      <HomeDashboard 
                        userName={activeUser.name} 
                        onSelectCourse={(courseId) => {
                          setSelectedClassId(courseId);
                          setSelectedTab("stream");
                          showToast(`Đã mở lớp học trực tiếp`);
                        }} 
                        showToast={showToast} 
                      />
                    )}

                    {activeMainTab === "khoahoc" && (
                      <div className="space-y-6">
                        {/* 1. Banner */}
                        <div className="flex items-center justify-between bg-blue-600 rounded-xl p-6 text-white shadow-md relative overflow-hidden shrink-0" style={{ backgroundImage: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)" }}>
                          <div className="relative z-10 flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center animate-bounce">
                              <GraduationCap className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h2 className="text-3xl font-display font-bold tracking-tight">Khám phá Lớp học của bạn</h2>
                              <p className="text-blue-100 text-sm mt-1 opacity-90">Quản lý và tham gia toàn bộ các khóa học đang có trong hệ thống đào tạo.</p>
                            </div>
                          </div>
                        </div>

                        {/* 2. Content */}
                        <div className="rounded-xl border border-slate-200 p-6 shadow-sm bg-white">
                          {/* Toolbar */}
                          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                            <div className="flex items-center gap-4">
                              <h2 className="text-lg font-bold text-gray-800">Khóa học hiện có</h2>
                            </div>
                            <div className="flex gap-3">
                              <button
                                onClick={() => {
                                  setJoinError("");
                                  setJoinCode("");
                                  setShowJoinModal(true);
                                }}
                                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm hover:bg-slate-50 transition-colors"
                              >
                                <Search className="h-4 w-4 text-gray-500" />
                                Tìm mã lớp
                              </button>
                              {activeUser.role === "teacher" && (
                                <button
                                  onClick={() => setShowCreateClassModal(true)}
                                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
                                >
                                  <Plus className="h-4 w-4" />
                                  Tạo lớp mới
                                </button>
                              )}
                            </div>
                          </div>
                          
                          {filteredClasses.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                              <div className="w-16 h-16 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4 animate-pulse">
                                <GraduationCap className="w-8 h-8" />
                              </div>
                              <h4 className="font-bold text-base text-gray-800">Chưa có lớp học nào</h4>
                              <p className="text-[13px] text-gray-500 mt-2 max-w-sm">
                                {activeUser.role === "teacher"
                                  ? "Tạo lớp học đầu tiên của bạn để bắt đầu chia sẻ tài liệu."
                                  : "Tham gia một lớp học để khám phá kiến thức mới."}
                              </p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-6">
                              {filteredClasses.map((item) => (
                                <ClassCard cardOpacity={cardOpacity}
                                  key={item.id}
                                  classItem={item}
                                  activeUserRole={activeUser.role}
                                  onSelect={() => {
                                    setSelectedClassId(item.id);
                                    setSelectedTab("stream");
                                    showToast(`Đã mở lớp ${item.name}`);
                                  }}
                                  onCopyCode={() => showToast("Đã copy mã lớp")}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {activeMainTab === "lich" && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h2 className="text-xl font-extrabold text-slate-800">Lịch học trực tuyến</h2>
                            <p className="text-xs text-slate-400 font-medium">Theo dõi lịch trình các buổi học và thời hạn nộp bài tập</p>
                          </div>
                          <span className="text-xs font-bold bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full border border-blue-100">
                            Tháng 8, 2026
                          </span>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          {/* Calendar Grid mockup (Left 2 cols) */}
                          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                            <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 pb-4 border-b border-slate-50">
                              <span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span><span>CN</span>
                            </div>
                            <div className="grid grid-cols-7 gap-2 text-center mt-3 font-semibold text-xs text-slate-700">
                              {/* Empty days / offset */}
                              {Array.from({ length: 4 }).map((_, i) => (
                                <span key={`offset-${i}`} className="text-slate-300 py-2">28</span>
                              ))}
                              {/* August Days */}
                              {Array.from({ length: 31 }).map((_, i) => {
                                const day = i + 1;
                                const isToday = day === 7; // Mock "today" matches local time
                                const hasClass = [4, 6, 11, 13, 18, 20, 25, 27].includes(day); // Tue & Thu ReactJS
                                const hasEnglish = [7, 14, 21, 28].includes(day); // Fri English
                                
                                return (
                                  <button 
                                    key={day}
                                    onClick={() => showToast(`Chi tiết sự kiện ngày ${day}/08/2026`)}
                                    className={`py-2 relative flex flex-col items-center justify-center rounded-xl transition-all cursor-pointer ${
                                      isToday 
                                        ? "bg-blue-600 text-white font-extrabold shadow-md" 
                                        : "hover:bg-slate-50 text-slate-800"
                                    }`}
                                  >
                                    <span>{day}</span>
                                    <div className="flex gap-0.5 mt-1 justify-center">
                                      {hasClass && (
                                        <span className={`w-1 h-1 rounded-full ${isToday ? "bg-white" : "bg-blue-600"}`} />
                                      )}
                                      {hasEnglish && (
                                        <span className={`w-1 h-1 rounded-full ${isToday ? "bg-white" : "bg-emerald-500"}`} />
                                      )}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Upcomming Events list (Right 1 col) */}
                          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
                            <h3 className="text-xs font-bold text-slate-800">Lịch sự kiện trong ngày</h3>
                            <div className="space-y-3">
                              <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 flex items-start gap-3">
                                <div className="w-2.5 h-2.5 bg-blue-600 rounded-full mt-1.5 shrink-0" />
                                <div>
                                  <h4 className="text-xs font-bold text-slate-800">Lớp Lập trình ReactJS</h4>
                                  <p className="text-[10px] text-slate-400 mt-1">18:00 - 20:00 • Phòng máy A3-402</p>
                                </div>
                              </div>

                              <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 flex items-start gap-3">
                                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full mt-1.5 shrink-0" />
                                <div>
                                  <h4 className="text-xs font-bold text-slate-800">Tiếng Anh Giao Tiếp</h4>
                                  <p className="text-[10px] text-slate-400 mt-1">19:00 - 21:00 • Phòng chuyên đề 1</p>
                                </div>
                              </div>

                              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3 opacity-60">
                                <div className="w-2.5 h-2.5 bg-slate-400 rounded-full mt-1.5 shrink-0" />
                                <div>
                                  <h4 className="text-xs font-bold text-slate-800">Hạn chót nộp bài tập</h4>
                                  <p className="text-[10px] text-slate-400 mt-1">23:59 • Tìm hiểu về React Hooks</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeMainTab === "baitap" && (
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-xl font-extrabold text-slate-800">Danh sách bài tập và nhiệm vụ</h2>
                          <p className="text-xs text-slate-400 font-medium">Theo dõi và nộp bài tập cho các khóa học của bạn</p>
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
                          <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                            <h3 className="text-sm font-bold text-slate-800">Tất cả bài tập</h3>
                            <span className="text-[11px] font-bold text-slate-400">3 bài tập cần hoàn thành</span>
                          </div>

                          <div className="space-y-4">
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between gap-4 hover:border-blue-200 transition-all">
                              <div className="space-y-1">
                                <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Lập trình ReactJS</span>
                                <h4 className="text-xs font-bold text-slate-800">Tìm hiểu về React Hooks & State Management</h4>
                                <p className="text-[10px] text-slate-400">Hạn chót: 15/07/2026 • 100 điểm</p>
                              </div>
                              <button 
                                onClick={() => {
                                  setSelectedClassId("class-1");
                                  setSelectedTab("classwork");
                                  showToast("Đang chuyển đến khu vực nộp bài...");
                                }}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0"
                              >
                                Làm bài
                              </button>
                            </div>

                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between gap-4 hover:border-blue-200 transition-all">
                              <div className="space-y-1">
                                <span className="text-[9px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">Digital Marketing</span>
                                <h4 className="text-xs font-bold text-slate-800">Lập kế hoạch Marketing tổng thể kênh Social</h4>
                                <p className="text-[10px] text-slate-400">Hạn chót: 20/07/2026 • 50 điểm</p>
                              </div>
                              <button 
                                onClick={() => showToast("Đã gửi yêu cầu nộp bài tập Marketing")}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0"
                              >
                                Làm bài
                              </button>
                            </div>

                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between gap-4 hover:border-blue-200 transition-all opacity-70">
                              <div className="space-y-1">
                                <span className="text-[9px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">UI/UX Design</span>
                                <h4 className="text-xs font-bold text-slate-800">Vẽ Wireframe cho App Mobile đặt đồ ăn</h4>
                                <p className="text-[10px] text-emerald-600 font-bold">Đã nộp • Chờ chấm điểm</p>
                              </div>
                              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg">Đã nộp</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeMainTab === "chungchi" && (
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-xl font-extrabold text-slate-800">Kho chứng chỉ & Thành tựu</h2>
                          <p className="text-xs text-slate-400 font-medium">Lưu trữ và xuất bản các chứng chỉ học tập bạn đã đạt được</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Active Certificate Frame */}
                          <div className="bg-white rounded-2xl border border-slate-150 p-6 shadow-md relative overflow-hidden flex flex-col justify-between h-72">
                            {/* Decorative border layout */}
                            <div className="absolute inset-4 border border-dashed border-slate-200 rounded-xl pointer-events-none" />
                            
                            <div className="relative z-10 flex items-start justify-between">
                              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                                <Award className="w-6 h-6" />
                              </div>
                              <span className="text-[9px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                                Đã xác thực
                              </span>
                            </div>

                            <div className="relative z-10 space-y-2 py-4">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Chứng nhận hoàn thành</p>
                              <h3 className="text-lg font-black text-slate-800 leading-tight">
                                ReactJS Developer
                              </h3>
                              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                Chứng nhận học viên <span className="font-bold text-slate-700">Nguyễn Văn A</span> đã hoàn thành xuất sắc chương trình đào tạo ReactJS chuyên sâu từ cơ bản đến nâng cao.
                              </p>
                            </div>

                            <div className="relative z-10 flex items-center justify-between border-t border-slate-100 pt-4">
                              <span className="text-[10px] font-bold text-slate-400">Đạt ngày: 15/05/2024</span>
                              <button 
                                onClick={() => showToast("Đã tải xuống file PDF chứng chỉ hoàn thành!")}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                              >
                                Tải xuống PDF
                              </button>
                            </div>
                          </div>

                          {/* Roadmap next certs */}
                          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
                            <h3 className="text-xs font-bold text-slate-800">Chứng chỉ sắp đạt được</h3>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="font-bold text-slate-700">UI/UX Specialist Certificate</span>
                                  <span className="font-extrabold text-teal-600">65%</span>
                                </div>
                                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                  <div className="h-full bg-teal-500 rounded-full" style={{ width: "65%" }} />
                                </div>
                                <p className="text-[10px] text-slate-400 font-medium">Hoàn thành 3 bài tập và 1 bài kiểm tra nữa để nhận</p>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="font-bold text-slate-700">Digital Marketer Certification</span>
                                  <span className="font-extrabold text-purple-600">45%</span>
                                </div>
                                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                  <div className="h-full bg-purple-500 rounded-full" style={{ width: "45%" }} />
                                </div>
                                <p className="text-[10px] text-slate-400 font-medium">Hoàn thành thêm các chuyên đề để nhận</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeMainTab === "thuvien" && (
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-xl font-extrabold text-slate-800">Thư viện tài nguyên & Tài liệu</h2>
                          <p className="text-xs text-slate-400 font-medium">Khám phá sách điện tử, giáo trình, slide bài giảng chất lượng cao</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                            <div className="space-y-2">
                              <div className="w-9 h-9 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                                <BookOpen className="w-5 h-5" />
                              </div>
                              <h4 className="text-xs font-bold text-slate-800 leading-snug">Giáo trình ReactJS nâng cao</h4>
                              <p className="text-[10px] text-slate-400 font-medium leading-relaxed">Bộ giáo trình chuyên sâu biên soạn bởi đội ngũ EduSmart.</p>
                            </div>
                            <button onClick={() => showToast("Đã tải tài liệu!")} className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer">Tải tài liệu ✕</button>
                          </div>

                          <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                            <div className="space-y-2">
                              <div className="w-9 h-9 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center shrink-0">
                                <BookOpen className="w-5 h-5" />
                              </div>
                              <h4 className="text-xs font-bold text-slate-800 leading-snug">Cơ bản về Wireframe & Layout</h4>
                              <p className="text-[10px] text-slate-400 font-medium leading-relaxed">Tài liệu hướng dẫn vẽ khung xương và thiết kế bố cục UI/UX.</p>
                            </div>
                            <button onClick={() => showToast("Đã tải tài liệu!")} className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer">Tải tài liệu ✕</button>
                          </div>

                          <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                            <div className="space-y-2">
                              <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                                <BookOpen className="w-5 h-5" />
                              </div>
                              <h4 className="text-xs font-bold text-slate-800 leading-snug">SEO Cheat Sheet 2026</h4>
                              <p className="text-[10px] text-slate-400 font-medium leading-relaxed">Bản tóm tắt tối ưu hóa công cụ tìm kiếm mới nhất.</p>
                            </div>
                            <button onClick={() => showToast("Đã tải tài liệu!")} className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer">Tải tài liệu ✕</button>
                          </div>

                          <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                            <div className="space-y-2">
                              <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                <BookOpen className="w-5 h-5" />
                              </div>
                              <h4 className="text-xs font-bold text-slate-800 leading-snug">Kiến trúc Microservices với Node</h4>
                              <p className="text-[10px] text-slate-400 font-medium leading-relaxed">Tập slide bài giảng về hệ thống phân tán và APIs.</p>
                            </div>
                            <button onClick={() => showToast("Đã tải tài liệu!")} className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer">Tải tài liệu ✕</button>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeMainTab === "thongbao" && (
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-xl font-extrabold text-slate-800">Thông báo & Hộp thư tin nhắn</h2>
                          <p className="text-xs text-slate-400 font-medium">Cập nhật những tin tức và chỉ thị mới nhất của lớp học</p>
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
                          <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                            <h3 className="text-xs font-bold text-slate-800">Hộp thư thông báo</h3>
                            <button onClick={() => showToast("Đã đánh dấu đọc tất cả")} className="text-[10px] font-bold text-blue-600 hover:underline cursor-pointer">Đánh dấu đã đọc</button>
                          </div>

                          <div className="divide-y divide-slate-50">
                            <div className="py-4 flex gap-4 items-start">
                              <div className="w-2.5 h-2.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                              <div className="space-y-1">
                                <h4 className="text-xs font-bold text-slate-800">Lịch thi giữa kỳ Chuyên đề ReactJS nâng cao</h4>
                                <p className="text-[10px] text-slate-400">Gửi bởi: Giáo vụ khoa CNTT • 2 giờ trước</p>
                                <p className="text-xs text-slate-500 leading-relaxed pt-1.5">
                                  Thông báo lịch thi giữa kỳ sẽ được tổ chức vào lúc 18:00 Thứ Năm tuần sau ngày 10/09/2026 tại phòng máy A3-402. Đề nghị các bạn có mặt đúng giờ.
                                </p>
                              </div>
                            </div>

                            <div className="py-4 flex gap-4 items-start">
                              <div className="w-2.5 h-2.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                              <div className="space-y-1">
                                <h4 className="text-xs font-bold text-slate-800">Cập nhật tài liệu Slide Chương 2: Component Lifecycles</h4>
                                <p className="text-[10px] text-slate-400">Gửi bởi: Cô Nguyễn Thu Hà • Hôm qua</p>
                                <p className="text-xs text-slate-500 leading-relaxed pt-1.5">
                                  Cô vừa upload thêm slide lý thuyết của Chương 2 lên kho tài nguyên của lớp Lập trình ReactJS. Các em nhớ download về đọc trước nhé.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeMainTab === "congdong" && (
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-xl font-extrabold text-slate-800">Cộng đồng & Diễn đàn trao đổi học viên</h2>
                          <p className="text-xs text-slate-400 font-medium">Chia sẻ kiến thức, đặt câu hỏi giải đáp cùng giảng viên và bạn học</p>
                        </div>

                        {/* Interactive discussion creator */}
                        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
                          <div className="flex gap-3">
                            <img src={activeUser.avatar} className="w-9 h-9 rounded-full object-cover shrink-0" referrerPolicy="no-referrer" />
                            <textarea 
                              placeholder="Đặt câu hỏi hoặc chia sẻ điều gì đó hôm nay cùng cộng đồng..."
                              className="w-full bg-slate-50/70 border border-slate-150 rounded-xl p-3 text-xs outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 transition-all font-semibold resize-none h-20"
                            />
                          </div>
                          <div className="flex justify-end pt-2 border-t border-slate-50">
                            <button 
                              onClick={() => {
                                showToast("Đã đăng bài viết lên cộng đồng thành công!");
                              }}
                              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <Send className="w-3.5 h-3.5" />
                              Đăng bài viết
                            </button>
                          </div>
                        </div>

                        {/* Public discussions feed */}
                        <div className="space-y-4">
                          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-3.5">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150" className="w-8 h-8 rounded-full object-cover shrink-0" />
                                <div>
                                  <h4 className="text-xs font-bold text-slate-800">Trần Thị Mai</h4>
                                  <p className="text-[10px] text-slate-400 font-semibold">Học viên • 2 giờ trước</p>
                                </div>
                              </div>
                              <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">Chủ đề: Lập trình</span>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed font-sans">
                              Mọi người cho mình hỏi khi sử dụng React Router Dom v6, có cách nào để cấu hình nested routes mà không bị mất layout header khi click chuyển trang không ạ? Cảm ơn nhiều!
                            </p>
                            <div className="flex items-center gap-4 pt-3 border-t border-slate-50 text-[11px] font-bold text-slate-450 select-none">
                              <button onClick={() => showToast("Đã thích bài viết!")} className="flex items-center gap-1.5 hover:text-blue-600 transition-colors cursor-pointer">
                                <ThumbsUp className="w-4 h-4" /> Thích (12)
                              </button>
                              <button onClick={() => showToast("Nhập bình luận thảo luận!")} className="flex items-center gap-1.5 hover:text-blue-600 transition-colors cursor-pointer">
                                <MessageSquare className="w-4 h-4" /> Thảo luận (5)
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 5. Persistent Horizontal Tags Bar exactly matching the image */}
                  <div className="flex flex-wrap items-center justify-center gap-2 mt-4 pt-4 border-t border-slate-100 shrink-0">
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50/70 hover:bg-blue-50 border border-blue-100/50 px-2.5 py-1 rounded-full cursor-pointer transition-colors shadow-sm">
                      #Learning
                    </span>
                    <span className="text-[10px] font-bold text-teal-600 bg-teal-50/70 hover:bg-teal-50 border border-teal-100/50 px-2.5 py-1 rounded-full cursor-pointer transition-colors shadow-sm">
                      #OnlineEducation
                    </span>
                    <span className="text-[10px] font-bold text-purple-600 bg-purple-50/70 hover:bg-purple-50 border border-purple-100/50 px-2.5 py-1 rounded-full cursor-pointer transition-colors shadow-sm">
                      #Development
                    </span>
                    <span className="text-[10px] font-bold text-orange-600 bg-orange-50/70 hover:bg-orange-50 border border-orange-100/50 px-2.5 py-1 rounded-full cursor-pointer transition-colors shadow-sm">
                      #Skills
                    </span>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50/70 hover:bg-blue-50 border border-blue-100/50 px-2.5 py-1 rounded-full cursor-pointer transition-colors shadow-sm">
                      #Knowledge
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50/70 hover:bg-emerald-50 border border-emerald-100/50 px-2.5 py-1 rounded-full cursor-pointer transition-colors shadow-sm">
                      #Growth
                    </span>
                    <span className="text-[10px] font-bold text-purple-600 bg-purple-50/70 hover:bg-purple-50 border border-purple-100/50 px-2.5 py-1 rounded-full cursor-pointer transition-colors shadow-sm">
                      #Community
                    </span>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50/70 hover:bg-blue-50 border border-blue-100/50 px-2.5 py-1 rounded-full cursor-pointer transition-colors shadow-sm">
                      #Success
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col h-full rounded-xl border border-slate-200 shadow-sm overflow-hidden" style={{ backgroundColor: `rgba(255, 255, 255, ${cardOpacity / 100})`, backdropFilter: cardOpacity < 100 ? "blur(10px)" : "none" }}>
                  <div className="flex items-center justify-center gap-8 border-b border-gray-200 bg-transparent px-6 shrink-0 h-14">
                    <button
                      onClick={() => setSelectedTab("stream")}
                      className={`h-full border-b-[3px] px-2 font-medium text-[13px] transition-all ${
                        selectedTab === "stream" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Bảng tin
                    </button>
                    <button
                      onClick={() => setSelectedTab("classwork")}
                      className={`h-full border-b-[3px] px-2 font-medium text-[13px] transition-all ${
                        selectedTab === "classwork" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Bài tập trên lớp
                    </button>
                    <button
                      onClick={() => setSelectedTab("people")}
                      className={`h-full border-b-[3px] px-2 font-medium text-[13px] transition-all ${
                        selectedTab === "people" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Mọi người
                    </button>
                    {activeUser.role === "teacher" && (
                      <button
                        onClick={() => setSelectedTab("grades")}
                        className={`h-full border-b-[3px] px-2 font-medium text-[13px] transition-all ${
                          selectedTab === "grades" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        Số điểm
                      </button>
                    )}
                  </div>

                  <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6">
                    <div className="max-w-5xl mx-auto h-full">
                      {selectedTab === "stream" && activeClass && (
                        <StreamTab
                          classItem={activeClass}
                          activeUser={activeUser}
                          announcements={announcements}
                          classwork={classwork}
                          onAddAnnouncement={(c) => { 
                            const n = {id:`a${Date.now()}`, classId: activeClass.id, authorId: activeUser.id, authorName: activeUser.name, authorAvatar: activeUser.avatar, content: c, createdAt: new Date().toISOString(), comments: []}; 
                            const v = [n, ...announcements]; 
                            setAnnouncements(v); 
                            localStorage.setItem("g_announcements", JSON.stringify(v));
                          }}
                          onAddComment={(aId, content) => { 
                            const v = announcements.map(a => a.id === aId ? {...a, comments: [...a.comments, {id:`c${Date.now()}`, authorId:activeUser.id, authorName:activeUser.name, authorAvatar:activeUser.avatar, content, createdAt:new Date().toISOString()}]} : a); 
                            setAnnouncements(v); 
                            localStorage.setItem("g_announcements", JSON.stringify(v)); 
                          }}
                          onCopyCode={() => showToast("Đã copy mã lớp")}
                        />
                      )}
                      {selectedTab === "classwork" && activeClass && (
                        <ClassworkTab
                          classItem={activeClass}
                          activeUser={activeUser}
                          classwork={classwork}
                          submissions={submissions}
                          onCreateClasswork={(cw) => { 
                            const n = { id: `cw${Date.now()}`, classId: activeClass.id, title: cw.title||"", description: cw.description||"", type: cw.type||"assignment", dueDate: cw.dueDate, createdAt: new Date().toISOString(), ...cw } as Classwork; 
                            const v = [n, ...classwork]; 
                            setClasswork(v); 
                            localStorage.setItem("g_classwork", JSON.stringify(v)); 
                            showToast("Đã tạo bài tập"); 
                          }}
                          onOpenGrading={(cwId) => { setSelectedTab("grades"); }}
                          onSubmitWork={(cwId, content, answers, score) => { 
                            const n = { id: `sub${Date.now()}`, classworkId: cwId, studentId: activeUser.id, studentName: activeUser.name, studentAvatar: activeUser.avatar, status: "turned-in", content, quizAnswers: answers, quizScore: score, submittedAt: new Date().toISOString() } as Submission; 
                            const v = [n, ...submissions]; 
                            setSubmissions(v); 
                            localStorage.setItem("g_submissions", JSON.stringify(v)); 
                            showToast("Đã nộp bài"); 
                          }}
                          onOpenAiHelper={(cw) => {
                            setGeminiMode("qna");
                            setGeminiContextClasswork(cw);
                            setIsGeminiOpen(true);
                          }}
                        />
                      )}
                      {selectedTab === "people" && activeClass && (
                        <PeopleTab
                          classItem={activeClass}
                          activeUser={activeUser}
                          allUsers={DEFAULT_USERS}
                          onInviteStudent={() => showToast("Đã gửi lời mời")}
                        />
                      )}
                      {selectedTab === "grades" && activeClass && activeUser.role === "teacher" && (
                        <GradesTab
                          classItem={activeClass}
                          activeUser={activeUser}
                          classwork={classwork}
                          submissions={submissions}
                          allUsers={DEFAULT_USERS}
                          onGradeSubmission={(subId, grade, feedback) => { 
                            const v = submissions.map(s => s.id === subId ? {...s, grade, feedback, status:"graded" as const} : s); 
                            setSubmissions(v); 
                            localStorage.setItem("g_submissions", JSON.stringify(v)); 
                            showToast("Đã chấm điểm"); 
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </main>
      </div>

      {/* Join Class Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <form onSubmit={(e) => { e.preventDefault(); /* mock */ setShowJoinModal(false); showToast("Đã gửi yêu cầu tham gia lớp!"); }} className="bg-white rounded-xl shadow-2xl border border-gray-100 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                <h3 className="font-bold text-sm">Tham gia lớp học bằng mã</h3>
              </div>
              <button type="button" onClick={() => setShowJoinModal(false)} className="text-white hover:text-gray-200 text-xs font-bold w-6 h-6 rounded-full hover:bg-white/10 flex items-center justify-center">✕</button>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-xs text-gray-500 leading-relaxed">
                Nhập mã lớp học do giáo viên của bạn chia sẻ để gia nhập phòng học. Bạn sẽ có thể theo dõi tài liệu, hoàn thành bài tập nộp cho giáo viên của mình.
              </p>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Mã phòng học lớp học</label>
                <input type="text" required value={joinCode} onChange={(e) => { setJoinCode(e.target.value); setJoinError(""); }} placeholder="Ví dụ: react101" className="w-full rounded border border-gray-300 p-3 text-sm outline-none font-bold focus:border-blue-500 text-center uppercase tracking-widest" />
                {joinError && <p className="text-xs text-red-600 font-semibold mt-1.5 flex items-center gap-1">⚠️ {joinError}</p>}
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-[10px] text-gray-600 leading-normal">
                <p className="font-bold text-blue-800 mb-1">Mã lớp học mô phỏng có sẵn:</p>
                - Lớp chuyên sâu: <code className="font-bold font-mono">react101</code><br />
                - Lớp Tiếng Anh: <code className="font-bold font-mono">engcomm</code><br />
                - Lớp Thiết kế UIUX: <code className="font-bold font-mono">uiux404</code>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 border-t border-gray-100 flex justify-end gap-2">
              <button type="button" onClick={() => setShowJoinModal(false)} className="rounded-lg px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 cursor-pointer">Hủy bỏ</button>
              <button type="submit" disabled={!joinCode.trim()} className={`rounded-lg px-5 py-2 text-xs font-bold text-white shadow-sm transition-colors cursor-pointer ${joinCode.trim() ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"}`}>Gia nhập ngay</button>
            </div>
          </form>
        </div>
      )}
      {/* Create Class Modal */}
      {showCreateClassModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <form onSubmit={(e) => { e.preventDefault(); const n = { id: `new-class-${Date.now()}`, name: newClassName || "Lớp mới", section: "Khóa mới", subject: "Tổng hợp", room: "Online", code: "new101", bannerGradient: "linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)", teacherId: activeUser.id, teacherName: activeUser.name, teacherAvatar: activeUser.avatar, students: [] }; setClasses([n, ...classes]); setShowCreateClassModal(false); showToast("Đã tạo lớp học thành công!"); }} className="bg-white rounded-xl shadow-2xl border border-gray-100 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2"><Plus className="w-5 h-5" /><h3 className="font-bold text-sm">Tạo lớp học trực tuyến mới</h3></div>
              <button type="button" onClick={() => setShowCreateClassModal(false)} className="text-white hover:text-gray-200 text-xs font-bold w-6 h-6 rounded-full hover:bg-white/10 flex items-center justify-center">✕</button>
            </div>
            <div className="p-5 space-y-4">
              <div><label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Tên lớp học (Bắt buộc)</label><input type="text" required value={newClassName} onChange={(e) => setNewClassName(e.target.value)} placeholder="Ví dụ: Lập trình ReactJS & NextJS nâng cao" className="w-full rounded border border-gray-350 p-2.5 text-sm outline-none focus:border-blue-500 font-semibold" /></div>
            </div>
            <div className="bg-gray-50 px-4 py-3 border-t border-gray-100 flex justify-end gap-2">
              <button type="button" onClick={() => setShowCreateClassModal(false)} className="rounded-lg px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 cursor-pointer">Hủy bỏ</button>
              <button type="submit" className="rounded-lg px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors cursor-pointer">Khởi tạo ngay</button>
            </div>
          </form>
        </div>
      )}


      <SettingsModal 
        showSettingsModal={showSettingsModal}
        setShowSettingsModal={setShowSettingsModal}
        wrapperOpacity={wrapperOpacity}
        setWrapperOpacity={setWrapperOpacity}
        sidebarOpacity={sidebarOpacity}
        setSidebarOpacity={setSidebarOpacity}
        cardOpacity={cardOpacity}
        setCardOpacity={setCardOpacity}
        currentWallpaper={currentWallpaper}
        setCurrentWallpaper={setCurrentWallpaper}
        wallpaperType={wallpaperType}
        setWallpaperType={setWallpaperType}
      />

      <GeminiDrawer 
        isOpen={isGeminiOpen}
        onClose={() => setIsGeminiOpen(false)}
        mode={geminiMode}
        contextClasswork={geminiContextClasswork}
      />

      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[999] animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="bg-gray-900 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 text-sm font-medium">
            <Sparkles className="w-4 h-4 text-amber-400" />
            {toastMessage}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
