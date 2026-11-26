import React, { useState } from "react";
import {
  BookOpen,
  Clock,
  CheckCircle,
  Award,
  ChevronRight,
  TrendingUp,
  Search,
  Check,
  BarChart3,
  LineChart as LineChartIcon,
  Sparkles,
} from "lucide-react";
import { useLms } from "../contexts/LmsContext";
import { tr } from "../i18n/translations";
import { THEME_CONFIG_MAP } from "../themes/themeConfig";

interface HomeDashboardProps {
  onSelectCourse: (courseId: string) => void;
}

export default function HomeDashboard({ onSelectCourse }: HomeDashboardProps) {
  const {
    language,
    currentProfile,
    courses,
    enrollments,
    assessments,
    certificates,
    systemTheme,
    playSound,
    setActiveRoute,
    showToast,
  } = useLms();

  const themeMeta = THEME_CONFIG_MAP[systemTheme];
  const isDark = themeMeta.isDark;

  const [selectedPeriod, setSelectedPeriod] = useState("7d");
  const [chartMode, setChartMode] = useState<"bar" | "line">("bar");
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [joinCodeInput, setJoinCodeInput] = useState("");
  const [selectedCalendarDay, setSelectedCalendarDay] = useState(16);

  const [todos, setTodos] = useState([
    {
      id: 1,
      titleVi: "Làm quiz React Hooks & Lifecycle",
      titleEn: "Complete React Hooks & Lifecycle quiz",
      course: "ReactJS",
      done: true,
      timeVi: "14:00 Hôm nay",
      timeEn: "14:00 Today",
    },
    {
      id: 2,
      titleVi: "Hoàn thiện Wireframe Mobile UI",
      titleEn: "Finish Mobile UI Wireframe",
      course: "UI/UX",
      done: false,
      timeVi: "17:30 Hôm nay",
      timeEn: "17:30 Today",
    },
    {
      id: 3,
      titleVi: "Nộp bài phân tích thị trường GenZ",
      titleEn: "Submit GenZ market analysis",
      course: "Marketing",
      done: false,
      timeVi: "23:59 Ngày mai",
      timeEn: "23:59 Tomorrow",
    },
    {
      id: 4,
      titleVi: "Xem video bài giảng Agile/Scrum",
      titleEn: "Watch Agile/Scrum lecture",
      course: "PMO",
      done: false,
      timeVi: "Chủ nhật",
      timeEn: "Sunday",
    },
  ]);

  const toggleTodo = (id: number) => {
    playSound("success");
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
    showToast(tr(language, "Đã cập nhật trạng thái nhiệm vụ!", "Updated task status!"));
  };

  const weekDays = [
    { dayName: language === "en" ? "Mon" : "T2", date: 12 },
    { dayName: language === "en" ? "Tue" : "T3", date: 13 },
    { dayName: language === "en" ? "Wed" : "T4", date: 14 },
    { dayName: language === "en" ? "Thu" : "T5", date: 15 },
    { dayName: language === "en" ? "Fri" : "T6", date: 16 },
    { dayName: language === "en" ? "Sat" : "T7", date: 17 },
    { dayName: language === "en" ? "Sun" : "CN", date: 18 },
  ];

  const barChartData = [
    { day: language === "en" ? "Mon" : "T2", hours: 4.2, duration: "4h 12m", color: themeMeta.primaryColor, type: language === "en" ? "Coding" : "Lập trình" },
    { day: language === "en" ? "Tue" : "T3", hours: 6.5, duration: "6h 30m", color: "#f97316", type: language === "en" ? "Design" : "Thiết kế" },
    { day: language === "en" ? "Wed" : "T4", hours: 3.8, duration: "3h 48m", color: "#10b981", type: "Marketing" },
    { day: language === "en" ? "Thu" : "T5", hours: 5.4, duration: "5h 24m", color: themeMeta.primaryColor, type: language === "en" ? "Coding" : "Lập trình" },
    { day: language === "en" ? "Fri" : "T6", hours: 7.8, duration: "7h 48m", color: themeMeta.secondaryColor, type: language === "en" ? "Coding" : "Lập trình", isHighlighted: true },
    { day: language === "en" ? "Sat" : "T7", hours: 8.5, duration: "8h 30m", color: "#f97316", type: language === "en" ? "Design" : "Thiết kế" },
    { day: language === "en" ? "Sun" : "CN", hours: 6.0, duration: "6h 00m", color: "#10b981", type: language === "en" ? "Business" : "Kinh doanh" },
  ];
  const maxBarHeight = 10;

  const displayCourses = courses.slice(0, 4).map((c, idx) => {
    const enr = enrollments.find((e) => e.courseId === c.id);
    const cardTints = [
      "glass-liquid-card-blue",
      "glass-liquid-card-emerald",
      "glass-liquid-card-purple",
      "glass-liquid-card-orange",
    ];
    const progressValues = [70, 45, 80, 30];
    return {
      ...c,
      progress: enr?.progressPercent ?? progressValues[idx % progressValues.length],
      tint: cardTints[idx % cardTints.length],
      fallbackImg: [
        "/04_course_reactjs_thumbnail.png",
        "/05_course_uiux_thumbnail.png",
        "/06_course_marketing_thumbnail.png",
        "/07_course_project_thumbnail.png",
      ][idx % 4],
    };
  });

  const daysOfWeek = weekDays.map((d) => d.dayName);
  const studyHours = [6.0, 7.8, 5.8, 7.5, 8.8, 10.2, 9.5];
  const maxHours = 15;
  const chartHeight = 150;
  const chartWidth = 520;
  const paddingX = 40;
  const paddingY = 20;

  const points = studyHours.map((hours, index) => {
    const x = paddingX + (index * (chartWidth - paddingX * 2)) / (studyHours.length - 1);
    const y = chartHeight - paddingY - (hours / maxHours) * (chartHeight - paddingY * 2);
    return { x, y, hours, day: daysOfWeek[index] };
  });

  const linePath = points.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), "");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`;

  const radius = 58;
  const strokeWidth = 13;
  const circumference = 2 * Math.PI * radius;
  const completedPercent = 75;
  const learningPercent = 15;
  const remainingPercent = 10;

  const handleJoinClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCodeInput.trim()) {
      showToast(tr(language, "Vui lòng nhập mã lớp học!", "Please enter a class code!"));
      return;
    }
    showToast(`${tr(language, "Đã tham gia lớp học với mã:", "Joined class with code:")} ${joinCodeInput.toUpperCase()}`);
    setJoinCodeInput("");
  };

  return (
    <div className="space-y-5 sm:space-y-6 pb-10">
      {/* 1. HERO BANNER */}
      <div className="glass-liquid-card p-4 sm:p-6 rounded-[14px] flex flex-col lg:flex-row items-center justify-between gap-5 relative overflow-hidden">
        <div className="flex-1 space-y-4 sm:space-y-5 z-10 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">
                {tr(language, "Chào mừng trở lại,", "Welcome back,")}{" "}
                <span className="text-[#0d6efd]">{currentProfile.displayName}</span> 👋
              </h1>
              <p className="text-xs text-slate-600 mt-1 font-medium">
                {tr(
                  language,
                  `Hệ thống có ${courses.length} khóa học & ${enrollments.length} lượt ghi danh đang hoạt động.`,
                  `System has ${courses.length} active courses & ${enrollments.length} enrollments.`
                )}
              </p>
            </div>
            <button
              onClick={() => {
                playSound("nav");
                setActiveRoute("ai-learning");
              }}
              style={{
                background: `linear-gradient(135deg, ${themeMeta.primaryColor}, ${themeMeta.secondaryColor})`,
                color: isDark ? "#081226" : "#ffffff",
              }}
              className="self-start sm:self-auto px-3.5 py-2 rounded-[14px] text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer shrink-0"
            >
              <Sparkles className="w-4 h-4" /> {tr(language, "Mở 8 AI Agents", "Open 8 AI Agents")}
            </button>
          </div>

          {/* 4 Glass Liquid Multi-Color Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-3.5 w-full">
            <div className="glass-liquid-card-blue p-3.5 sm:p-4 rounded-[14px] flex flex-col space-y-1.5 hover:scale-[1.02] transition-all">
              <div className="w-8 h-8 rounded-[14px] bg-white/80 flex items-center justify-center text-[#0d6efd]">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-slate-900">{courses.length}</span>
              <p className="text-[11px] text-slate-600 font-medium">{tr(language, "Khóa học hiện có", "Active Courses")}</p>
              <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold">
                <TrendingUp className="w-3 h-3" /> ↑ 2 {tr(language, "mới", "new")}
              </div>
            </div>

            <div className="glass-liquid-card-orange p-3.5 sm:p-4 rounded-[14px] flex flex-col space-y-1.5 hover:scale-[1.02] transition-all">
              <div className="w-8 h-8 rounded-[14px] bg-white/80 flex items-center justify-center text-[#f97316]">
                <Clock className="w-4 h-4" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-slate-900">12h 30m</span>
              <p className="text-[11px] text-slate-600 font-medium">{tr(language, "Thời gian học", "Study Time")}</p>
              <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold">
                <TrendingUp className="w-3 h-3" /> ↑ 18%
              </div>
            </div>

            <div className="glass-liquid-card-emerald p-3.5 sm:p-4 rounded-[14px] flex flex-col space-y-1.5 hover:scale-[1.02] transition-all">
              <div className="w-8 h-8 rounded-[14px] bg-white/80 flex items-center justify-center text-[#10b981]">
                <CheckCircle className="w-4 h-4" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-slate-900">{assessments.length}</span>
              <p className="text-[11px] text-slate-600 font-medium">{tr(language, "Bài đánh giá", "Assessments")}</p>
              <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold">
                <TrendingUp className="w-3 h-3" /> ↑ 22%
              </div>
            </div>

            <div className="glass-liquid-card-purple p-3.5 sm:p-4 rounded-[14px] flex flex-col space-y-1.5 hover:scale-[1.02] transition-all">
              <div className="w-8 h-8 rounded-[14px] bg-white/80 flex items-center justify-center text-[#a855f7]">
                <Award className="w-4 h-4" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-slate-900">{currentProfile.xp}</span>
              <p className="text-[11px] text-slate-600 font-medium">{tr(language, "Điểm tích lũy XP", "Total XP")}</p>
              <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold">
                <TrendingUp className="w-3 h-3" /> {certificates.length} {tr(language, "Chứng chỉ", "Certs")}
              </div>
            </div>
          </div>
        </div>

        <div className="relative w-full max-w-[240px] sm:max-w-[280px] lg:w-[270px] h-[160px] sm:h-[200px] flex items-center justify-center shrink-0">
          <img
            src="/02_hero_student_illustration.png"
            alt="Student Illustration"
            className="w-full h-full object-contain rounded-[14px]"
          />
        </div>
      </div>

      {/* 2. MAIN TWO-PANE BODY */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 sm:gap-6">
        <div className="xl:col-span-8 space-y-5 sm:space-y-6">
          {/* Course Cards Grid */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">
                {tr(language, "Khóa học nổi bật & đang học", "Featured & Active Courses")}
              </h2>
              <button
                onClick={() => setActiveRoute("courses")}
                className="text-xs font-bold text-[#0d6efd] flex items-center gap-1 cursor-pointer"
              >
                {tr(language, "Xem tất cả", "View all")} <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
              {displayCourses.map((course) => (
                <div
                  key={course.id}
                  onClick={() => {
                    playSound("nav");
                    onSelectCourse(course.id);
                  }}
                  className={`${course.tint} rounded-[14px] overflow-hidden hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full group`}
                >
                  <div className="h-28 relative overflow-hidden shrink-0">
                    <img
                      src={course.thumbnailUrl || course.fallbackImg}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2.5 left-2.5 text-[10px] font-bold px-2.5 py-0.5 rounded-[14px] bg-white/90 text-slate-900">
                      {course.category}
                    </span>
                  </div>
                  <div className="p-3.5 flex flex-col justify-between flex-1 space-y-3">
                    <h3 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2 h-9">
                      {course.title}
                    </h3>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="text-slate-600">{tr(language, "Tiến độ", "Progress")}</span>
                        <span className="text-[#0d6efd]">{course.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/80 rounded-[14px] overflow-hidden">
                        <div className="h-full rounded-[14px] bg-[#0d6efd]" style={{ width: `${course.progress}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Analytics Chart */}
          <div className="glass-liquid-card p-4 sm:p-5 rounded-[14px] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {tr(language, "Thống kê thời lượng học tập", "Study Duration Analytics")}
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  {tr(language, "Phân bổ giờ học theo chuyên đề & tiến độ thực tế", "Weekly study hours by topic & progress")}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center bg-white/80 p-1 rounded-[14px] border border-slate-200/70">
                  <button
                    onClick={() => setChartMode("bar")}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-[14px] text-xs font-bold cursor-pointer ${
                      chartMode === "bar" ? "bg-[#0d6efd] text-white" : "text-slate-600"
                    }`}
                  >
                    <BarChart3 className="w-3.5 h-3.5" /> {tr(language, "Cột", "Bar")}
                  </button>
                  <button
                    onClick={() => setChartMode("line")}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-[14px] text-xs font-bold cursor-pointer ${
                      chartMode === "line" ? "bg-[#0d6efd] text-white" : "text-slate-600"
                    }`}
                  >
                    <LineChartIcon className="w-3.5 h-3.5" /> {tr(language, "Đường", "Line")}
                  </button>
                </div>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="bg-white/90 border border-slate-200 rounded-[14px] text-xs font-bold text-slate-700 px-3 py-1.5"
                >
                  <option value="7d">{tr(language, "7 ngày qua", "Last 7 days")}</option>
                  <option value="month">{tr(language, "Tháng này", "This month")}</option>
                  <option value="term">{tr(language, "Học kỳ", "Semester")}</option>
                </select>
              </div>
            </div>

            {chartMode === "bar" ? (
              <div className="pt-7 pb-2 overflow-x-auto">
                <div className="h-48 sm:h-52 min-w-[340px] flex items-end justify-between gap-2 sm:gap-5 px-2 sm:px-3 border-b border-slate-200/70 relative">
                  {barChartData.map((item, index) => {
                    const heightPercent = (item.hours / maxBarHeight) * 100;
                    const isHovered = hoveredBarIndex === index;
                    return (
                      <div
                        key={item.day}
                        className="flex-1 flex flex-col items-center h-full justify-end relative cursor-pointer"
                        onMouseEnter={() => setHoveredBarIndex(index)}
                        onMouseLeave={() => setHoveredBarIndex(null)}
                      >
                        {item.isHighlighted && (
                          <div className="absolute -top-6 bg-white text-slate-900 border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded-[14px] shadow-sm whitespace-nowrap z-20">
                            🔥 {item.duration}
                          </div>
                        )}
                        {isHovered && (
                          <div className="absolute -top-9 bg-[#111827] text-white text-[11px] font-bold px-2.5 py-1 rounded-[14px] shadow-lg z-30 whitespace-nowrap pointer-events-none">
                            {item.day}: {item.duration} ({item.type})
                          </div>
                        )}
                        <div
                          className="w-full max-w-[44px] rounded-[14px] transition-all duration-300 ease-in-out"
                          style={{
                            height: `${heightPercent}%`,
                            backgroundColor: item.color,
                            opacity: isHovered ? 1 : 0.88,
                          }}
                        />
                        <span className="text-[11px] font-bold mt-2 text-slate-600">{item.day}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="relative w-full pt-3">
                <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto">
                  <path d={areaPath} fill={themeMeta.primaryColor} fillOpacity="0.16" />
                  <path d={linePath} fill="none" stroke={themeMeta.primaryColor} strokeWidth="3.5" strokeLinecap="round" />
                  {points.map((p, idx) => (
                    <circle
                      key={idx}
                      cx={p.x}
                      cy={p.y}
                      r={hoveredPoint === idx ? "7" : "4.5"}
                      fill="#ffffff"
                      stroke={themeMeta.primaryColor}
                      strokeWidth="3"
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredPoint(idx)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                  ))}
                  {points.map((p, idx) => (
                    <text key={idx} x={p.x} y={chartHeight - 4} textAnchor="middle" className="text-[10px] font-bold fill-slate-500">
                      {p.day}
                    </text>
                  ))}
                </svg>
              </div>
            )}
          </div>

          {/* Course Joining Card */}
          <div className="glass-liquid-card-orange p-4 sm:p-6 rounded-[14px] relative overflow-hidden">
            <svg className="absolute right-0 top-0 bottom-0 w-72 h-full pointer-events-none opacity-60 sm:opacity-100" viewBox="0 0 300 200" fill="none">
              <path
                d="M 120 20 C 180 -10, 260 20, 280 80 C 300 140, 240 190, 180 185 C 120 180, 80 140, 90 90 C 100 40, 60 50, 120 20 Z"
                fill="#f97316"
                fillOpacity="0.20"
              />
            </svg>
            <div className="relative z-10 max-w-xl space-y-2.5">
              <span className="text-[10px] font-bold uppercase text-[#ea580c] bg-white/85 px-2.5 py-0.5 rounded-[14px]">
                {tr(language, "Gia nhập lớp học mới", "Join a new class")}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-[#9a3412]">
                {tr(language, "Bạn có mã tham gia lớp học từ Giảng viên?", "Have a class invitation code?")}
              </h3>
              <form onSubmit={handleJoinClass} className="pt-1">
                <div className="flex items-center bg-white rounded-[14px] p-1.5 border border-orange-200 max-w-md">
                  <Search className="w-4 h-4 text-[#f97316] ml-2.5 shrink-0" />
                  <input
                    type="text"
                    value={joinCodeInput}
                    onChange={(e) => setJoinCodeInput(e.target.value)}
                    placeholder={tr(language, "Nhập mã lớp (vd: REACT-2026)...", "Enter class code (e.g. REACT-2026)...")}
                    className="w-full min-w-0 bg-transparent px-2.5 py-1.5 text-xs font-bold text-slate-800 outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-[#f97316] hover:bg-[#ea580c] text-white text-xs font-bold px-3.5 sm:px-4 py-2 rounded-[14px] shrink-0 cursor-pointer"
                  >
                    {tr(language, "Tham gia", "Join")}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Assignment Table */}
          <div className="glass-liquid-card p-4 sm:p-5 rounded-[14px] space-y-3 overflow-x-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                {tr(language, "Nhiệm vụ & Bài tập cần nộp", "Upcoming Tasks & Assessments")}
              </h3>
              <button onClick={() => setActiveRoute("assessments")} className="text-xs font-bold text-[#0d6efd] cursor-pointer">
                {tr(language, "Xem tất cả", "View all")}
              </button>
            </div>
            <table className="w-full text-left text-xs min-w-[460px]">
              <thead>
                <tr className="border-b border-slate-200/70 text-slate-500">
                  <th className="pb-2.5">{tr(language, "Tên bài tập", "Title")}</th>
                  <th className="pb-2.5">{tr(language, "Loại", "Type")}</th>
                  <th className="pb-2.5">{tr(language, "Điểm đạt", "Pass Score")}</th>
                  <th className="pb-2.5 text-right">{tr(language, "Điểm tối đa", "Max Score")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {assessments.map((asm) => (
                  <tr key={asm.id} className="hover:bg-white/50">
                    <td className="py-2.5 font-bold text-slate-900">{asm.title}</td>
                    <td className="py-2.5 uppercase text-[10px] font-bold text-[#0d6efd]">{asm.assessmentType}</td>
                    <td className="py-2.5 text-slate-600">{asm.passingScore}</td>
                    <td className="py-2.5 text-right font-bold text-emerald-700">{asm.maxScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT SIDEBAR COLUMN */}
        <div className="xl:col-span-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-5 sm:gap-6">
          {/* Profile Card */}
          <div className="glass-liquid-card-blue p-5 rounded-[14px] flex flex-col items-center text-center space-y-3">
            <img
              src={currentProfile.avatar || "/03_avatar_student.png"}
              alt={currentProfile.displayName}
              className="w-20 h-20 rounded-[14px] object-cover border-2 border-white shadow-md"
              referrerPolicy="no-referrer"
            />
            <div>
              <h3 className="text-base font-bold text-slate-900">{currentProfile.displayName}</h3>
              <p className="text-xs text-slate-600">Level {currentProfile.level} • {currentProfile.xp} XP</p>
            </div>
            <div className="grid grid-cols-3 gap-2 w-full pt-2 border-t border-white/70">
              <div className="p-2 bg-white/80 rounded-[14px]">
                <span className="text-xs font-bold text-slate-900">{courses.length}</span>
                <p className="text-[10px] text-slate-500">{tr(language, "Khóa học", "Courses")}</p>
              </div>
              <div className="p-2 bg-white/80 rounded-[14px]">
                <span className="text-xs font-bold text-[#0d6efd]">98%</span>
                <p className="text-[10px] text-slate-500">{tr(language, "Chuyên cần", "Attendance")}</p>
              </div>
              <div className="p-2 bg-white/80 rounded-[14px]">
                <span className="text-xs font-bold text-[#10b981]">Top 5%</span>
                <p className="text-[10px] text-slate-500">{tr(language, "Xếp hạng", "Rank")}</p>
              </div>
            </div>
          </div>

          {/* Mini Calendar Widget */}
          <div className="glass-liquid-card-pink p-5 rounded-[14px] space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{tr(language, "Lịch tuần học tập", "Weekly Schedule")}</h3>
                <p className="text-[11px] text-slate-600">{tr(language, "Tháng 10, 2026", "October 2026")}</p>
              </div>
              <span className="text-xs font-bold text-[#ec4899] bg-white/85 px-2.5 py-1 rounded-[14px]">
                {tr(language, "Tuần 42", "Week 42")}
              </span>
            </div>
            <div className="flex items-center justify-between gap-1.5 pt-1">
              {weekDays.map((item) => {
                const isActive = item.date === selectedCalendarDay;
                return (
                  <button
                    key={item.date}
                    onClick={() => {
                      playSound("click");
                      setSelectedCalendarDay(item.date);
                    }}
                    className={`flex flex-col items-center justify-center flex-1 py-2 rounded-[14px] transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#ec4899] text-white -translate-y-1 shadow-md font-bold"
                        : "text-slate-600 bg-white/60 hover:bg-white"
                    }`}
                  >
                    <span className="text-[10px] font-bold">{item.dayName}</span>
                    <span className="text-xs font-bold mt-0.5">{item.date}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Todo List */}
          <div className="glass-liquid-card p-5 rounded-[14px] space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">{tr(language, "Danh sách việc cần làm", "Study To-Do List")}</h3>
              <span className="text-xs font-bold text-slate-500">
                {todos.filter((t) => t.done).length}/{todos.length}
              </span>
            </div>
            <div className="space-y-2">
              {todos.map((todo) => (
                <div
                  key={todo.id}
                  onClick={() => toggleTodo(todo.id)}
                  className={`flex items-start gap-2.5 p-2.5 rounded-[14px] cursor-pointer transition-all ${
                    todo.done ? "bg-white/50 opacity-65" : "bg-white/85 hover:bg-white"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-[14px] border flex items-center justify-center shrink-0 mt-0.5 ${
                      todo.done ? "bg-[#0d6efd] border-[#0d6efd] text-white" : "border-slate-300 bg-white"
                    }`}
                  >
                    {todo.done && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs font-bold ${todo.done ? "line-through text-slate-500" : "text-slate-900"}`}>
                      {language === "en" ? todo.titleEn : todo.titleVi}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {language === "en" ? todo.timeEn : todo.timeVi} • {todo.course}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Donut */}
          <div className="glass-liquid-card-emerald p-5 rounded-[14px] space-y-3">
            <h3 className="text-sm font-bold text-slate-900">{tr(language, "Tiến độ học tập tổng quan", "Overall Progress")}</h3>
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
                  <circle cx="80" cy="80" r={radius} fill="transparent" stroke="rgba(255,255,255,0.6)" strokeWidth={strokeWidth} />
                  <circle cx="80" cy="80" r={radius} fill="transparent" stroke={themeMeta.primaryColor} strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={circumference - (completedPercent / 100) * circumference} strokeLinecap="round" />
                  <circle cx="80" cy="80" r={radius} fill="transparent" stroke="#10b981" strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={circumference - (learningPercent / 100) * circumference} transform={`rotate(${completedPercent * 3.6} 80 80)`} strokeLinecap="round" />
                  <circle cx="80" cy="80" r={radius} fill="transparent" stroke="#f97316" strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={circumference - (remainingPercent / 100) * circumference} transform={`rotate(${(completedPercent + learningPercent) * 3.6} 80 80)`} strokeLinecap="round" />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-xl font-bold text-slate-900">75%</span>
                  <span className="text-[9px] font-bold text-slate-500 uppercase">{tr(language, "Hoàn thành", "Completed")}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-white/70">
              <img src="/08_upgrade_illustration.png" alt="Upgrade" className="w-10 h-10 object-contain rounded-[14px]" />
              <button
                onClick={() => setActiveRoute("certificates")}
                className="px-3 py-1.5 rounded-[14px] bg-[#0d6efd] text-white text-xs font-bold cursor-pointer"
              >
                {tr(language, "Chứng chỉ", "Certificates")} ({certificates.length})
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
