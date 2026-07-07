import React, { useState, useEffect } from "react";
import { Sidebar } from "./components/layout/Sidebar";
import { SettingsModal } from "./components/layout/SettingsModal";
import { Header } from "./components/layout/Header";
import { MetricCard } from "./components/layout/MetricCard";
import { Users, Ticket, CheckCircle, Clock, Sliders } from 'lucide-react';
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
import { GraduationCap, Search, Plus, Sparkles } from "lucide-react";

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
    <div className="flex h-screen bg-transparent p-[15px] overflow-hidden font-sans text-gray-900 transition-colors duration-1000" style={getAppStyle()}>
      {wallpaperType === 'video' && currentWallpaper && (
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none">
          <source src={currentWallpaper} type="video/mp4" />
        </video>
      )}
      <div 
        className="flex h-full w-full rounded-[10px] overflow-hidden shadow-[0_10px_30px_-10px_rgba(0,0,0,0.3)] border-2 transition-colors duration-1000 relative z-10"

        style={{ borderColor: borderColor }}
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

        <main className="flex-1 overflow-y-auto p-6 bg-transparent">
          <div className="max-w-[1600px] mx-auto w-full h-full flex flex-col">
            <div className="flex-1 flex flex-col min-h-0 bg-transparent relative">
              
              {!selectedClassId ? (
                <div className="flex flex-col gap-6 h-full">
                  {/* 1. Banner */}
                  <div className="flex items-center justify-between bg-blue-600 rounded-xl p-6 text-white shadow-md relative overflow-hidden shrink-0" style={{ backgroundImage: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)" }}>
                    <div className="relative z-10 flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center animate-bounce">
                        <GraduationCap className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-display font-bold tracking-tight">Tổng quan Hệ thống</h2>
                        <p className="text-blue-100 text-sm mt-1 opacity-90">Quản lý và theo dõi toàn bộ lớp học, bài tập và tiến độ học tập của bạn.</p>
                      </div>
                    </div>
                    <button className="relative z-10 flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2 rounded-lg text-sm font-semibold transition-colors border border-white/20 shadow-sm">
                      <Sparkles className="w-4 h-4" />
                      Tài liệu hướng dẫn
                    </button>
                    {/* Abstract background shapes */}
                    <div className="absolute -top-24 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-10 right-20 w-32 h-32 bg-indigo-500/30 rounded-full blur-2xl pointer-events-none" />
                  </div>

                  {/* 2. Tab */}
                  <div className="flex items-center gap-6 border-b border-gray-200 mt-2 shrink-0">
                    <button className="border-b-2 border-blue-600 text-blue-600 font-bold text-sm py-3 px-2">Dashboard</button>
                    <button className="border-b-2 border-transparent text-gray-500 hover:text-gray-800 font-semibold text-sm py-3 px-2 transition-colors">Báo cáo</button>
                    <button className="border-b-2 border-transparent text-gray-500 hover:text-gray-800 font-semibold text-sm py-3 px-2 transition-colors">Phân tích</button>
                  </div>

                  {/* 3. Thẻ thống kê (Statistics Cards) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 shrink-0 mt-4">
                    <MetricCard cardOpacity={cardOpacity} label="Tổng Lớp Học" value={filteredClasses.length} icon={<GraduationCap size={28} />} />
                    <MetricCard cardOpacity={cardOpacity} label="Học viên" value="1,245" icon={<Users size={28} />} />
                    <MetricCard cardOpacity={cardOpacity} label="Bài tập" value="142" icon={<Ticket size={28} />} />
                    <MetricCard cardOpacity={cardOpacity} label="Hoàn thành" value="89%" icon={<CheckCircle size={28} />} />
                  </div>

                  {/* 4. Nội dung chính */}
                  <div className="flex-1 rounded-xl border border-slate-200 p-6 shadow-sm overflow-y-auto mt-4" style={{ backgroundColor: `rgba(255, 255, 255, ${cardOpacity / 100})`, backdropFilter: cardOpacity < 100 ? "blur(10px)" : "none" }}>
                    {/* Toolbar */}
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                      <div className="flex items-center gap-4">
                        <h2 className="text-xl font-bold text-gray-800">Khám phá Lớp học của bạn</h2>
                        <div className="hidden md:flex items-center gap-2 bg-gray-50 p-1 rounded-lg border border-gray-200">
                          <button className="px-3 py-1 bg-white shadow-sm rounded-md text-xs font-bold text-gray-800">Lưới</button>
                          <button className="px-3 py-1 text-gray-500 hover:text-gray-800 rounded-md text-xs font-semibold">Bảng</button>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-slate-50 transition-colors">
                          <Sliders className="h-4 w-4 text-gray-500" />
                          Lọc dữ liệu
                        </button>
                        <button
                          onClick={() => {
                            setJoinError("");
                            setJoinCode("");
                            setShowJoinModal(true);
                          }}
                          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-slate-50 transition-colors"
                        >
                          <Search className="h-4 w-4 text-gray-500" />
                          Tìm mã lớp
                        </button>
                        {activeUser.role === "teacher" && (
                          <button
                            onClick={() => setShowCreateClassModal(true)}
                            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
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
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12">
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
