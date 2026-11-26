import React, { useEffect, useState } from "react";
import { Sidebar } from "./components/layout/Sidebar";
import { SettingsModal } from "./components/layout/SettingsModal";
import { Header } from "./components/layout/Header";
import {
  DEFAULT_USERS,
  DEFAULT_CLASSES,
  DEFAULT_ANNOUNCEMENTS,
  DEFAULT_CLASSWORK,
  DEFAULT_SUBMISSIONS,
} from "./initialData";
import { ClassItem, Announcement, Classwork, Submission } from "./types";
import StreamTab from "./components/StreamTab";
import ClassworkTab from "./components/ClassworkTab";
import PeopleTab from "./components/PeopleTab";
import GradesTab from "./components/GradesTab";
import GeminiDrawer from "./components/GeminiDrawer";
import HomeDashboard from "./components/HomeDashboard";
import { useLms } from "./contexts/LmsContext";
import { AiLearningCenter } from "./modules/ai-learning/AiLearningCenter";
import { TrainingAndContentModules } from "./modules/training/TrainingAndContentModules";
import { UsersAndOrgsModule } from "./modules/users/UsersAndOrgsModule";
import { ClassroomAndEnrollmentModule } from "./modules/classroom/ClassroomAndEnrollmentModule";
import { AssessmentsAndCertsModule } from "./modules/assessments/AssessmentsAndCertsModule";
import { EnterpriseSystemModules } from "./modules/enterprise/EnterpriseSystemModules";
import { ROUTE_TITLES, tr } from "./i18n/translations";
import { THEME_CONFIG_MAP } from "./themes/themeConfig";
import { Sparkles, ArrowLeft, LogIn } from "lucide-react";

export default function App() {
  const {
    language,
    activeRoute,
    setActiveRoute,
    systemTheme,
    fontSizeScale,
    reduceMotion,
    highContrast,
    isSignedIn,
    signInWithGoogle,
    wrapperOpacity,
    wallpaperType,
    currentWallpaper,
    playSound,
    toastMessage,
    showToast,
  } = useLms();

  const [classes] = useState<ClassItem[]>(DEFAULT_CLASSES);
  const [announcements, setAnnouncements] = useState<Announcement[]>(DEFAULT_ANNOUNCEMENTS);
  const [classwork, setClasswork] = useState<Classwork[]>(DEFAULT_CLASSWORK);
  const [submissions, setSubmissions] = useState<Submission[]>(DEFAULT_SUBMISSIONS);

  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<"stream" | "classwork" | "people" | "grades">("stream");
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotificationsPanel, setShowNotificationsPanel] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showProfileSwitcher, setShowProfileSwitcher] = useState(false);

  const [isGeminiOpen, setIsGeminiOpen] = useState(false);
  const [geminiMode, setGeminiMode] = useState<"syllabus" | "qna">("syllabus");
  const [geminiContextClasswork, setGeminiContextClasswork] = useState<Classwork | null>(null);

  const activeUser = DEFAULT_USERS[2];
  const activeClass = classes.find((c) => c.id === selectedClassId);
  const themeMeta = THEME_CONFIG_MAP[systemTheme];
  const isDark = themeMeta.isDark;

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", systemTheme);
  }, [systemTheme]);

  const getOuterBackdropStyle = (): React.CSSProperties => {
    if (wallpaperType === "gradient" && currentWallpaper) {
      return { background: currentWallpaper };
    }
    const imageSrc =
      wallpaperType === "image" && currentWallpaper ? currentWallpaper : themeMeta.wallpaperUrl;
    if (imageSrc) {
      return {
        backgroundImage: `url(${imageSrc})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      };
    }
    return { background: themeMeta.previewGradient };
  };

  const getWorkspaceBgColor = (): string => {
    const scale = Math.max(0.45, Math.min(0.95, wrapperOpacity / 100));
    switch (systemTheme) {
      case "ocean-navy-dark":
        return `rgba(8, 22, 46, ${Math.max(scale, 0.68)})`;
      case "dark-neon":
        return `rgba(10, 14, 26, ${Math.max(scale, 0.72)})`;
      case "ocean-navy-light":
        return `rgba(232, 246, 255, ${Math.min(scale, 0.65)})`;
      case "glass-light":
        return `rgba(255, 255, 255, ${Math.min(scale, 0.68)})`;
      case "flat-light":
        return `rgba(241, 245, 249, ${Math.max(scale, 0.86)})`;
      case "origin-os":
        return `rgba(251, 247, 240, ${Math.min(scale + 0.06, 0.82)})`;
      case "glass-liquid":
      default:
        return `rgba(244, 248, 255, ${Math.min(scale, 0.62)})`;
    }
  };

  const getRouteTitle = (): string => {
    if (selectedClassId && activeClass) return activeClass.name;
    const entry = ROUTE_TITLES[activeRoute];
    return entry ? (language === "en" ? entry.en : entry.vi) : "EDU LMS";
  };

  return (
    /* Outer viewport shell: fits cleanly in 1 page (100dvh) with exact 15px margin on all 4 sides */
    <div
      data-theme={systemTheme}
      className={`h-[100dvh] w-screen overflow-hidden p-[15px] font-sans ${
        fontSizeScale === "large" ? "text-[15px]" : ""
      } ${reduceMotion ? "motion-reduce" : ""} ${highContrast ? "contrast-125" : ""}`}
      style={getOuterBackdropStyle()}
    >
      {/* SINGLE MAIN WEBSITE CARD: 14px rounded corners, fills remaining viewport cleanly */}
      <div
        className={`glass-liquid-shell h-full w-full rounded-[14px] overflow-hidden flex border shadow-2xl relative ${
          systemTheme === "dark-neon"
            ? "border-cyan-400/40 text-slate-100"
            : systemTheme === "ocean-navy-dark"
            ? "border-sky-400/25 text-slate-100"
            : systemTheme === "flat-light"
            ? "border-slate-300 text-slate-900 shadow-lg"
            : "border-white/75 text-slate-900"
        }`}
      >
        <Sidebar
          isSidebarExpanded={isSidebarExpanded}
          setIsSidebarExpanded={setIsSidebarExpanded}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          selectedClassId={selectedClassId}
          setSelectedClassId={setSelectedClassId}
          setShowSettingsModal={setShowSettingsModal}
        />

        <div
          className="flex-1 flex flex-col min-w-0 h-full overflow-hidden transition-colors duration-300"
          style={{
            backgroundColor: getWorkspaceBgColor(),
          }}
        >
          <Header
            showNotificationsPanel={showNotificationsPanel}
            setShowNotificationsPanel={setShowNotificationsPanel}
            showProfileSwitcher={showProfileSwitcher}
            setShowProfileSwitcher={setShowProfileSwitcher}
            setShowSettingsModal={setShowSettingsModal}
            onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
            title={getRouteTitle()}
          />

          {/* Honest Demo / Auth Status Strip */}
          {!isSignedIn && (
            <div
              className={`px-3 sm:px-5 py-2 border-b flex flex-wrap items-center justify-between gap-2 text-[11px] sm:text-xs shrink-0 ${
                isDark
                  ? "bg-amber-950/55 border-amber-700/45 text-amber-200"
                  : "bg-amber-50/85 border-amber-200/70 text-amber-900"
              }`}
            >
              <span className="font-bold">
                {tr(
                  language,
                  "[CHẾ ĐỘ XEM TRƯỚC DEMO] Dữ liệu hiển thị là dữ liệu mẫu. Đăng nhập Google để đồng bộ Cloud Firestore.",
                  "[DEMO PREVIEW MODE] Showing sample data. Sign in with Google to sync with Cloud Firestore."
                )}
              </span>
              <button
                onClick={() => {
                  playSound("click");
                  signInWithGoogle();
                }}
                className="px-3 py-1 rounded-[14px] bg-[#0d6efd] text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer shrink-0"
              >
                <LogIn className="w-3 h-3" /> {tr(language, "Đăng nhập Google", "Google Sign-In")}
              </button>
            </div>
          )}

          {/* Scrollable Internal Workspace Area inside the Single Main Card */}
          <main className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-6">
            <div className="max-w-[1500px] mx-auto w-full">
              {selectedClassId && activeClass ? (
                <div className="glass-liquid-card rounded-[14px] overflow-hidden flex flex-col">
                  <div className="flex flex-wrap items-center justify-between gap-2 px-4 sm:px-5 py-3 border-b border-white/70 bg-white/60">
                    <button
                      onClick={() => {
                        playSound("nav");
                        setSelectedClassId(null);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-[14px] bg-white text-xs font-bold text-slate-700 hover:text-[#0d6efd] cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> {tr(language, "Quay lại", "Back")}
                    </button>
                    <div className="flex items-center gap-1.5 overflow-x-auto">
                      {(["stream", "classwork", "people", "grades"] as const).map((tab) => (
                        <button
                          key={tab}
                          onClick={() => {
                            playSound("nav");
                            setSelectedTab(tab);
                          }}
                          className={`px-3 py-1.5 rounded-[14px] text-xs font-bold cursor-pointer whitespace-nowrap ${
                            selectedTab === tab ? "bg-[#0d6efd] text-white" : "bg-white/80 text-slate-700"
                          }`}
                        >
                          {tab === "stream"
                            ? tr(language, "Bảng tin", "Stream")
                            : tab === "classwork"
                            ? tr(language, "Bài tập trên lớp", "Classwork")
                            : tab === "people"
                            ? tr(language, "Mọi người", "People")
                            : tr(language, "Điểm số", "Grades")}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 sm:p-5">
                    {selectedTab === "stream" && (
                      <StreamTab
                        classItem={activeClass}
                        announcements={announcements.filter((a) => a.classId === activeClass.id)}
                        classwork={classwork.filter((cw) => cw.classId === activeClass.id)}
                        activeUser={activeUser}
                        onAddAnnouncement={(content) => {
                          setAnnouncements((prev) => [
                            {
                              id: `ann-${Date.now()}`,
                              classId: activeClass.id,
                              authorId: activeUser.id,
                              authorName: activeUser.name,
                              authorAvatar: activeUser.avatar,
                              content,
                              createdAt: new Date().toISOString(),
                              comments: [],
                            },
                            ...prev,
                          ]);
                          showToast(tr(language, "Đã đăng thông báo lớp học!", "Posted class announcement!"));
                        }}
                        onAddComment={(annId, content) => {
                          setAnnouncements((prev) =>
                            prev.map((a) =>
                              a.id === annId
                                ? {
                                    ...a,
                                    comments: [
                                      ...a.comments,
                                      {
                                        id: `cmt-${Date.now()}`,
                                        authorId: activeUser.id,
                                        authorName: activeUser.name,
                                        authorAvatar: activeUser.avatar,
                                        content,
                                        createdAt: new Date().toISOString(),
                                      },
                                    ],
                                  }
                                : a
                            )
                          );
                        }}
                        onCopyCode={(code) => showToast(`${tr(language, "Đã copy mã lớp", "Copied class code")} ${code}`)}
                      />
                    )}
                    {selectedTab === "classwork" && (
                      <ClassworkTab
                        classItem={activeClass}
                        classwork={classwork.filter((cw) => cw.classId === activeClass.id)}
                        submissions={submissions}
                        activeUser={activeUser}
                        onCreateClasswork={(cw) => {
                          setClasswork((prev) => [
                            {
                              id: `cw-${Date.now()}`,
                              classId: activeClass.id,
                              title: cw.title || tr(language, "Bài tập mới", "New assignment"),
                              description: cw.description || "",
                              type: cw.type || "assignment",
                              points: cw.points ?? 100,
                              dueDate: cw.dueDate,
                              topic: cw.topic,
                              quizQuestions: cw.quizQuestions,
                              attachments: cw.attachments,
                              createdAt: new Date().toISOString(),
                            },
                            ...prev,
                          ]);
                          showToast(tr(language, "Đã giao bài tập mới!", "Assignment created!"));
                        }}
                        onSubmitWork={(cwId, content, quizAnswers, quizScore) => {
                          setSubmissions((prev) => [
                            ...prev,
                            {
                              id: `sub-${Date.now()}`,
                              classworkId: cwId,
                              studentId: activeUser.id,
                              studentName: activeUser.name,
                              studentAvatar: activeUser.avatar,
                              content,
                              submittedAt: new Date().toISOString(),
                              status: quizScore !== undefined ? "graded" : "turned-in",
                              grade: quizScore,
                              quizAnswers,
                              quizScore,
                            },
                          ]);
                          showToast(tr(language, "Đã nộp bài thành công!", "Submitted successfully!"));
                        }}
                        onOpenGrading={() => setSelectedTab("grades")}
                        onOpenAiHelper={(cw) => {
                          setGeminiContextClasswork(cw);
                          setGeminiMode("qna");
                          setIsGeminiOpen(true);
                        }}
                      />
                    )}
                    {selectedTab === "people" && (
                      <PeopleTab
                        classItem={activeClass}
                        allUsers={DEFAULT_USERS}
                        activeUser={activeUser}
                        onInviteStudent={() => showToast(tr(language, "Đã gửi lời mời học viên", "Invitation sent"))}
                      />
                    )}
                    {selectedTab === "grades" && (
                      <GradesTab
                        classItem={activeClass}
                        classwork={classwork.filter((cw) => cw.classId === activeClass.id)}
                        submissions={submissions}
                        allUsers={DEFAULT_USERS}
                        activeUser={activeUser}
                        onGradeSubmission={(subId, grade, feedback) => {
                          setSubmissions((prev) =>
                            prev.map((s) => (s.id === subId ? { ...s, grade, feedback, status: "graded" } : s))
                          );
                          showToast(tr(language, "Đã chấm điểm!", "Graded!"));
                        }}
                      />
                    )}
                  </div>
                </div>
              ) : (
                <>
                  {activeRoute === "dashboard" && (
                    <HomeDashboard
                      onSelectCourse={(courseId) => {
                        const matched = classes.find((c) => c.id === courseId);
                        if (matched) {
                          setSelectedClassId(matched.id);
                          setSelectedTab("stream");
                        } else {
                          setActiveRoute("courses");
                        }
                      }}
                    />
                  )}
                  {activeRoute === "ai-learning" && <AiLearningCenter />}
                  {(activeRoute === "courses" ||
                    activeRoute === "learning-paths" ||
                    activeRoute === "training-plans" ||
                    activeRoute === "course-builder" ||
                    activeRoute === "learning-library") && (
                    <TrainingAndContentModules
                      route={activeRoute}
                      onOpenCourseDetail={(courseId) => {
                        const matched = classes.find((c) => c.id === courseId);
                        if (matched) {
                          setSelectedClassId(matched.id);
                          setSelectedTab("stream");
                        } else {
                          setActiveRoute("course-builder");
                        }
                      }}
                    />
                  )}
                  {(activeRoute === "users-rbac" || activeRoute === "organizations") && (
                    <UsersAndOrgsModule route={activeRoute} />
                  )}
                  {(activeRoute === "classrooms" || activeRoute === "enrollments") && (
                    <ClassroomAndEnrollmentModule route={activeRoute} />
                  )}
                  {(activeRoute === "assessments" ||
                    activeRoute === "gradebook" ||
                    activeRoute === "certificates" ||
                    activeRoute === "gamification") && <AssessmentsAndCertsModule route={activeRoute} />}
                  {(activeRoute === "training-analytics" ||
                    activeRoute === "community" ||
                    activeRoute === "reports" ||
                    activeRoute === "commerce" ||
                    activeRoute === "integrations" ||
                    activeRoute === "system-admin") && <EnterpriseSystemModules route={activeRoute} />}
                </>
              )}
            </div>
          </main>
        </div>

        {/* Floating Quick AI Tutor Trigger inside the Single Main Card */}
        <button
          onClick={() => {
            playSound("click");
            setGeminiMode("qna");
            setIsGeminiOpen(true);
          }}
          style={{
            background: `linear-gradient(135deg, ${themeMeta.primaryColor}, ${themeMeta.secondaryColor})`,
            color: isDark ? "#081226" : "#ffffff",
          }}
          className="absolute bottom-4 right-4 z-30 px-3.5 py-2.5 rounded-[14px] text-xs font-bold shadow-lg flex items-center gap-1.5 cursor-pointer hover:scale-105 transition-transform"
          title={tr(language, "Mở nhanh Trợ lý AI", "Quick AI Tutor")}
        >
          <Sparkles className="w-4 h-4" /> AI Tutor
        </button>

        {/* Modals & Drawers */}
        <SettingsModal showSettingsModal={showSettingsModal} setShowSettingsModal={setShowSettingsModal} />

        <GeminiDrawer
          isOpen={isGeminiOpen}
          onClose={() => setIsGeminiOpen(false)}
          mode={geminiMode}
          contextClasswork={geminiContextClasswork}
        />

        {toastMessage && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-[14px] bg-slate-900/90 text-white text-xs font-bold shadow-xl backdrop-blur-md max-w-[90%] text-center">
            {toastMessage}
          </div>
        )}
      </div>
    </div>
  );
}
