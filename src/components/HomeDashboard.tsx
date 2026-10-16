import React, { useState } from "react";
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  Award, 
  ChevronRight, 
  MessageSquare,
  TrendingUp,
  FileText,
  Star,
  Search,
  Calendar as CalendarIcon,
  Check,
  Flame,
  ArrowRight,
  Filter,
  BarChart3,
  LineChart as LineChartIcon
} from "lucide-react";
import { motion } from "motion/react";

interface HomeDashboardProps {
  userName: string;
  onSelectCourse: (courseId: string) => void;
  showToast: (msg: string) => void;
}

export default function HomeDashboard({ userName, onSelectCourse, showToast }: HomeDashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("7 ngày qua");
  const [chartMode, setChartMode] = useState<"bar" | "line">("bar");
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [joinCodeInput, setJoinCodeInput] = useState("");
  const [selectedCalendarDay, setSelectedCalendarDay] = useState(16);

  // Todo list items with interactive custom checkboxes
  const [todos, setTodos] = useState([
    { id: 1, title: "Làm quiz React Hooks & Lifecycle", course: "ReactJS", done: true, time: "14:00 Hôm nay" },
    { id: 2, title: "Hoàn thiện Wireframe Mobile UI", course: "UI/UX", done: false, time: "17:30 Hôm nay" },
    { id: 3, title: "Nộp bài phân tích thị trường GenZ", course: "Marketing", done: false, time: "23:59 Ngày mai" },
    { id: 4, title: "Xem video bài giảng Agile/Scrum", course: "Quản trị dự án", done: false, time: "Chủ nhật" },
  ]);

  const toggleTodo = (id: number) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
    showToast("Đã cập nhật trạng thái nhiệm vụ!");
  };

  // Mini Calendar horizontal days of current week
  const weekDays = [
    { dayName: "T2", date: 12 },
    { dayName: "T3", date: 13 },
    { dayName: "T4", date: 14 },
    { dayName: "T5", date: 15 },
    { dayName: "T6", date: 16 }, // Active today
    { dayName: "T7", date: 17 },
    { dayName: "CN", date: 18 },
  ];

  // Custom CSS Bar Chart Data matching spec:
  // Colors vary by data type: #f97316 (orange), #0d6efd (blue), #10b981 (green)
  // Highlighted bar includes floating tooltip at top with emoji
  const barChartData = [
    { day: "Thứ 2", hours: 4.2, duration: "4h 12m", color: "#0d6efd", type: "Lập trình" },
    { day: "Thứ 3", hours: 6.5, duration: "6h 30m", color: "#f97316", type: "Thiết kế" },
    { day: "Thứ 4", hours: 3.8, duration: "3h 48m", color: "#10b981", type: "Marketing" },
    { day: "Thứ 5", hours: 5.4, duration: "5h 24m", color: "#0d6efd", type: "Lập trình" },
    { day: "Thứ 6", hours: 7.8, duration: "7h 48m", color: "#0d6efd", type: "Lập trình", isHighlighted: true },
    { day: "Thứ 7", hours: 8.5, duration: "8h 30m", color: "#f97316", type: "Thiết kế" },
    { day: "Chủ nhật", hours: 6.0, duration: "6h 00m", color: "#10b981", type: "Kinh doanh" },
  ];

  const maxBarHeight = 10; // max 10 hours for bar scaling

  // Courses data matching the uploaded image exactly
  const activeCourses = [
    {
      id: "class-1",
      title: "Lập trình ReactJS cơ bản đến nâng cao",
      category: "Lập trình",
      progress: 70,
      color: "from-blue-500 to-indigo-600",
      textColor: "text-[#0d6efd]",
      bgColor: "bg-blue-50",
      imageUrl: "/04_course_reactjs_thumbnail.png",
      tagColor: "bg-blue-100 text-blue-800",
      accentHex: "#0d6efd"
    },
    {
      id: "class-3",
      title: "UI/UX Design Toàn tập",
      category: "Thiết kế",
      progress: 45,
      color: "from-teal-400 to-emerald-500",
      textColor: "text-teal-600",
      bgColor: "bg-teal-50",
      imageUrl: "/05_course_uiux_thumbnail.png",
      tagColor: "bg-teal-100 text-teal-800",
      accentHex: "#10b981"
    },
    {
      id: "class-2",
      title: "Digital Marketing từ A đến Z",
      category: "Marketing",
      progress: 80,
      color: "from-purple-500 to-pink-500",
      textColor: "text-purple-600",
      bgColor: "bg-purple-50",
      imageUrl: "/06_course_marketing_thumbnail.png",
      tagColor: "bg-purple-100 text-purple-800",
      accentHex: "#a855f7"
    },
    {
      id: "class-11",
      title: "Quản trị dự án chuyên nghiệp",
      category: "Kinh doanh",
      progress: 30,
      color: "from-orange-400 to-amber-500",
      textColor: "text-[#f97316]",
      bgColor: "bg-orange-50",
      imageUrl: "/07_course_project_thumbnail.png",
      tagColor: "bg-orange-100 text-orange-800",
      accentHex: "#f97316"
    }
  ];

  // Learning stats line chart coordinates
  const daysOfWeek = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];
  const studyHours = [6.0, 7.8, 5.8, 7.5, 8.8, 10.2, 9.5];
  const maxHours = 15;
  const chartHeight = 160;
  const chartWidth = 520;
  const paddingX = 40;
  const paddingY = 20;

  const points = studyHours.map((hours, index) => {
    const x = paddingX + (index * (chartWidth - paddingX * 2)) / (studyHours.length - 1);
    const y = chartHeight - paddingY - (hours / maxHours) * (chartHeight - paddingY * 2);
    return { x, y, hours, day: daysOfWeek[index] };
  });

  const linePath = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, "");

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`;

  // Circular Chart (Donut) parameters
  const radius = 60;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  
  const completedPercent = 75;
  const learningPercent = 15;
  const remainingPercent = 10;

  const doneStrokeDashoffset = circumference - (completedPercent / 100) * circumference;
  const learningStrokeDashoffset = circumference - (learningPercent / 100) * circumference;
  const remainingStrokeDashoffset = circumference - (remainingPercent / 100) * circumference;

  const handleJoinClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCodeInput.trim()) {
      showToast("Vui lòng nhập mã lớp học!");
      return;
    }
    showToast(`Đã tham gia thành công lớp học với mã: ${joinCodeInput.toUpperCase()}`);
    setJoinCodeInput("");
  };

  return (
    <div className="space-y-7 pb-10">
      
      {/* 1. HERO BANNER: Chào mừng trở lại & 4 Thẻ chỉ số & 3D Student Illustration */}
      <div className="bg-white rounded-[24px] border border-[#f3f4f6] p-6 lg:p-7 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-6 relative overflow-hidden transition-all duration-300 hover:shadow-md">
        {/* Soft Ambient Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-50/50 rounded-full blur-3xl -z-0 pointer-events-none" />

        {/* Left Side: Greet & Stats Row Grid */}
        <div className="flex-1 space-y-5 z-10 w-full">
          <div>
            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-[#1e293b]">
              Chào mừng trở lại, <span className="text-[#0d6efd]">{userName}</span> 👋
            </h1>
            <p className="text-xs text-[#64748b] mt-1 font-medium leading-relaxed">
              Bạn đang có <span className="font-bold text-[#1e293b]">4</span> khóa học đang học dở. Hãy tiếp tục hành trình học tập hôm nay!
            </p>
          </div>

          {/* Quick Metrics 4 Cards Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 w-full">
            
            {/* Metric Card 1 */}
            <div className="bg-white hover:scale-[1.02] transition-all duration-300 p-4 rounded-[20px] border border-[#f3f4f6] shadow-xs flex flex-col items-start space-y-2">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-[#0d6efd] shrink-0">
                <BookOpen className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-xl font-extrabold text-[#1e293b] leading-none">4</span>
                <p className="text-[11px] text-[#64748b] font-medium tracking-tight mt-0.5">Khóa học đang học</p>
                <div className="flex items-center gap-1 text-[11px] text-[#10b981] font-bold mt-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>↑ 2</span>
                </div>
              </div>
            </div>

            {/* Metric Card 2 */}
            <div className="bg-white hover:scale-[1.02] transition-all duration-300 p-4 rounded-[20px] border border-[#f3f4f6] shadow-xs flex flex-col items-start space-y-2">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-[#0d6efd] shrink-0">
                <Clock className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-xl font-extrabold text-[#1e293b] leading-none">12h 30m</span>
                <p className="text-[11px] text-[#64748b] font-medium tracking-tight mt-0.5">Thời gian học</p>
                <div className="flex items-center gap-1 text-[11px] text-[#10b981] font-bold mt-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>↑ 18%</span>
                </div>
              </div>
            </div>

            {/* Metric Card 3 */}
            <div className="bg-white hover:scale-[1.02] transition-all duration-300 p-4 rounded-[20px] border border-[#f3f4f6] shadow-xs flex flex-col items-start space-y-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-[#10b981] shrink-0">
                <CheckCircle className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-xl font-extrabold text-[#1e293b] leading-none">15</span>
                <p className="text-[11px] text-[#64748b] font-medium tracking-tight mt-0.5">Bài tập hoàn thành</p>
                <div className="flex items-center gap-1 text-[11px] text-[#10b981] font-bold mt-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>↑ 22%</span>
                </div>
              </div>
            </div>

            {/* Metric Card 4 */}
            <div className="bg-white hover:scale-[1.02] transition-all duration-300 p-4 rounded-[20px] border border-[#f3f4f6] shadow-xs flex flex-col items-start space-y-2">
              <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center text-[#a855f7] shrink-0">
                <Award className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-xl font-extrabold text-[#1e293b] leading-none">860</span>
                <p className="text-[11px] text-[#64748b] font-medium tracking-tight mt-0.5">Điểm tích lũy</p>
                <div className="flex items-center gap-1 text-[11px] text-[#10b981] font-bold mt-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>↑ 15%</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Side: Illustration of Mascot Coding at MacBook */}
        <div className="relative w-full lg:w-[320px] h-[220px] flex items-center justify-center shrink-0">
          <img 
            src="/02_hero_student_illustration.png" 
            alt="Student Illustration" 
            className="w-full h-full object-contain relative z-10 transition-transform duration-500 hover:scale-105" 
          />
        </div>

      </div>

      {/* 2. MAIN 3-PANE LAYOUT: Left 70% Content & Right 30% Sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-7">
        
        {/* LEFT COLUMN (8/12 = ~67%): Course Grid, Interactive Custom CSS Bar Chart, Assignment Table */}
        <div className="xl:col-span-8 space-y-7">
          
          {/* SECTION: Course Cards Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-[#1e293b] flex items-center gap-2.5">
                <span className="w-1.5 h-5 bg-[#0d6efd] rounded-full" />
                Khóa học đang học
              </h2>
              <button 
                onClick={() => {
                  onSelectCourse("class-1");
                  showToast("Khám phá danh sách khóa học đầy đủ");
                }}
                className="text-xs font-bold text-[#0d6efd] hover:text-blue-700 transition-colors flex items-center gap-1 cursor-pointer"
              >
                Xem tất cả 
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Responsive Cards Layout (4 Columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {activeCourses.map((course) => (
                <div 
                  key={course.id}
                  onClick={() => {
                    onSelectCourse(course.id);
                    showToast(`Mở khóa học: ${course.title}`);
                  }}
                  className="bg-white rounded-[24px] border border-[#f3f4f6] overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full group"
                >
                  {/* Thumbnail Image */}
                  <div className="h-28 relative overflow-hidden shrink-0">
                    <img 
                      src={course.imageUrl} 
                      alt={course.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                    
                    {/* Category Tag */}
                    <span className={`absolute top-3 left-3 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${course.tagColor} border border-white/20 shadow-xs`}>
                      {course.category}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex flex-col justify-between flex-1 space-y-4">
                    <h3 className="text-xs font-bold text-[#1e293b] leading-snug line-clamp-2 h-9 group-hover:text-[#0d6efd] transition-colors">
                      {course.title}
                    </h3>
                    
                    {/* Linear Progress */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="text-[#64748b]">Tiến độ</span>
                        <span className={course.textColor}>{course.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full bg-gradient-to-r ${course.color}`}
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* SECTION: Custom CSS Bar Chart & Learning Analytics */}
          <div className="bg-white rounded-[24px] border border-[#f3f4f6] p-6 shadow-sm space-y-5 transition-all duration-300 hover:shadow-md">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-extrabold text-[#1e293b]">Thống kê thời lượng học tập</h3>
                <p className="text-xs text-[#64748b] font-medium mt-0.5">Biểu đồ phân bổ giờ học theo chuyên đề & tiến độ thực tế</p>
              </div>

              <div className="flex items-center gap-2">
                {/* Switch between Custom CSS Bar Chart and Smooth Line Curve */}
                <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                  <button 
                    onClick={() => setChartMode("bar")}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      chartMode === "bar" ? "bg-white text-[#0d6efd] shadow-xs" : "text-[#64748b] hover:text-[#1e293b]"
                    }`}
                  >
                    <BarChart3 className="w-3.5 h-3.5" />
                    Cột
                  </button>
                  <button 
                    onClick={() => setChartMode("line")}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      chartMode === "line" ? "bg-white text-[#0d6efd] shadow-xs" : "text-[#64748b] hover:text-[#1e293b]"
                    }`}
                  >
                    <LineChartIcon className="w-3.5 h-3.5" />
                    Đường
                  </button>
                </div>

                <select 
                  value={selectedPeriod}
                  onChange={(e) => {
                    setSelectedPeriod(e.target.value);
                    showToast(`Đã lọc: ${e.target.value}`);
                  }}
                  className="bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-[#64748b] px-3 py-1.5 outline-none focus:ring-1 focus:ring-[#0d6efd] cursor-pointer"
                >
                  <option value="7 ngày qua">7 ngày qua</option>
                  <option value="Tháng này">Tháng này</option>
                  <option value="Học kỳ">Học kỳ</option>
                </select>
              </div>
            </div>

            {/* CUSTOM CSS BAR CHART (Spec: div with 12px radius, colors #f97316, #0d6efd, #10b981, floating tooltip & hover dark tooltip) */}
            {chartMode === "bar" ? (
              <div className="pt-8 pb-3">
                <div className="h-56 flex items-end justify-between gap-3 sm:gap-6 px-4 border-b border-slate-100 relative">
                  
                  {/* Subtle background guide lines */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
                    <div className="border-b border-dashed border-slate-200 w-full" />
                    <div className="border-b border-dashed border-slate-200 w-full" />
                    <div className="border-b border-dashed border-slate-200 w-full" />
                    <div className="border-b border-dashed border-slate-200 w-full" />
                  </div>

                  {barChartData.map((item, index) => {
                    const heightPercent = (item.hours / maxBarHeight) * 100;
                    const isHovered = hoveredBarIndex === index;

                    return (
                      <div 
                        key={item.day}
                        className="flex-1 flex flex-col items-center h-full justify-end relative group cursor-pointer"
                        onMouseEnter={() => setHoveredBarIndex(index)}
                        onMouseLeave={() => setHoveredBarIndex(null)}
                      >
                        {/* Highlighted Bar Floating Badge (Spec: floating tooltip at top, bg-white, shadow-md, bold font, emoji icon) */}
                        {item.isHighlighted && (
                          <div className="absolute -top-7 bg-white text-[#1e293b] border border-blue-100 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 whitespace-nowrap z-20 animate-bounce">
                            <span>🔥 Đỉnh điểm: {item.duration}</span>
                          </div>
                        )}

                        {/* Interactive Dark Tooltip on Hover (Spec: dark #111827 tooltip with duration text) */}
                        {isHovered && (
                          <div className="absolute -top-10 bg-[#111827] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-xl z-30 whitespace-nowrap animate-in fade-in zoom-in-95 pointer-events-none">
                            <span className="text-[#0d6efd] mr-1.5">•</span>
                            {item.day}: <span className="text-white font-extrabold">{item.duration}</span> ({item.type})
                          </div>
                        )}

                        {/* Custom CSS Bar (Spec: div with 12px radius, ease-in-out transition) */}
                        <div 
                          className="w-full max-w-[48px] rounded-[12px] transition-all duration-300 ease-in-out relative overflow-hidden group-hover:scale-y-[1.03] origin-bottom shadow-xs"
                          style={{ 
                            height: `${heightPercent}%`,
                            backgroundColor: item.color,
                            opacity: isHovered ? 1 : (item.isHighlighted ? 0.95 : 0.85)
                          }}
                        >
                          {/* Inner subtle glass gradient highlight */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-white/20" />
                        </div>

                        {/* Label below bar */}
                        <span className={`text-[11px] font-semibold mt-3 transition-colors ${
                          isHovered || item.isHighlighted ? "text-[#0d6efd] font-bold" : "text-[#64748b]"
                        }`}>
                          {item.day}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Legend matching colors */}
                <div className="flex flex-wrap items-center justify-center gap-6 mt-4 pt-2 text-xs font-semibold text-[#64748b]">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#0d6efd]" />
                    <span>Lập trình (#0d6efd)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#f97316]" />
                    <span>Thiết kế (#f97316)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#10b981]" />
                    <span>Marketing & Kinh doanh (#10b981)</span>
                  </div>
                </div>

              </div>
            ) : (
              /* SMOOTH SVG LINE GRAPH */
              <div className="relative w-full overflow-hidden flex flex-col items-center pt-4">
                <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto">
                  <defs>
                    <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0d6efd" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#0d6efd" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {[0, 5, 10, 15].map((hourVal) => {
                    const y = chartHeight - paddingY - (hourVal / maxHours) * (chartHeight - paddingY * 2);
                    return (
                      <g key={hourVal}>
                        <line 
                          x1={paddingX} 
                          y1={y} 
                          x2={chartWidth - paddingX} 
                          y2={y} 
                          stroke="#f1f5f9" 
                          strokeWidth="1" 
                          strokeDasharray="4 4" 
                        />
                        <text 
                          x={paddingX - 10} 
                          y={y + 3} 
                          textAnchor="end" 
                          className="text-[9px] font-bold fill-slate-400"
                        >
                          {hourVal}h
                        </text>
                      </g>
                    );
                  })}

                  <path d={areaPath} fill="url(#curveGradient)" />
                  <path 
                    d={linePath} 
                    fill="none" 
                    stroke="#0d6efd" 
                    strokeWidth="3.5" 
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {points.map((p, index) => (
                    <g 
                      key={index}
                      onMouseEnter={() => setHoveredPoint(index)}
                      onMouseLeave={() => setHoveredPoint(null)}
                      className="cursor-pointer"
                    >
                      <circle 
                        cx={p.x} 
                        cy={p.y} 
                        r={hoveredPoint === index ? "7" : "4.5"} 
                        fill="#ffffff" 
                        stroke="#0d6efd" 
                        strokeWidth="3" 
                        className="transition-all duration-150"
                      />
                    </g>
                  ))}

                  {points.map((p, index) => (
                    <text 
                      key={index}
                      x={p.x} 
                      y={chartHeight - 4} 
                      textAnchor="middle" 
                      className={`text-[10px] font-bold ${hoveredPoint === index ? "fill-[#0d6efd]" : "fill-slate-400"}`}
                    >
                      {p.day}
                    </text>
                  ))}
                </svg>

                {hoveredPoint !== null && (
                  <div 
                    className="absolute bg-[#111827] text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg shadow-md -translate-x-1/2 pointer-events-none"
                    style={{ 
                      left: `${(points[hoveredPoint].x / chartWidth) * 100}%`,
                      top: `${((points[hoveredPoint].y - 28) / chartHeight) * 100}%`
                    }}
                  >
                    {points[hoveredPoint].hours} giờ học
                  </div>
                )}
              </div>
            )}

          </div>

          {/* SECTION: Course Joining Card (Spec: 24px rounded card, bg-color #fff7ed, abstract organic blob SVG #f97316 at 20% opacity, input field wrapper with embedded CTA button inside right-hand side) */}
          <div className="bg-[#fff7ed] rounded-[24px] border border-[#fed7aa]/60 p-6 lg:p-7 relative overflow-hidden shadow-sm">
            {/* Abstract Organic Blob SVG (color #f97316 at 20% opacity) */}
            <svg 
              className="absolute right-0 top-0 bottom-0 w-80 h-full pointer-events-none" 
              viewBox="0 0 300 200" 
              fill="none"
            >
              <path 
                d="M 120 20 C 180 -10, 260 20, 280 80 C 300 140, 240 190, 180 185 C 120 180, 80 140, 90 90 C 100 40, 60 50, 120 20 Z" 
                fill="#f97316" 
                fillOpacity="0.20" 
              />
              <circle cx="240" cy="50" r="30" fill="#f97316" fillOpacity="0.15" />
            </svg>

            <div className="relative z-10 max-w-xl space-y-3">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#ea580c] bg-white/80 px-2.5 py-0.5 rounded-full border border-[#fed7aa]">
                Gia nhập lớp học mới
              </span>
              <h3 className="text-lg lg:text-xl font-extrabold text-[#9a3412]">
                Bạn có mã tham gia lớp học từ Giảng viên?
              </h3>
              <p className="text-xs text-[#c2410c] font-medium leading-relaxed">
                Nhập mã khóa học để truy cập ngay tài liệu độc quyền, bài tập thực hành và tham gia thảo luận cùng bạn học.
              </p>

              {/* White Input Field Wrapper with embedded CTA button inside right-hand side */}
              <form onSubmit={handleJoinClass} className="pt-2">
                <div className="relative flex items-center bg-white rounded-[14px] p-1.5 border border-[#fed7aa] shadow-xs max-w-md focus-within:ring-2 focus-within:ring-[#f97316]/50">
                  <Search className="w-4.5 h-4.5 text-[#f97316] ml-3 shrink-0" />
                  <input 
                    type="text" 
                    value={joinCodeInput}
                    onChange={(e) => setJoinCodeInput(e.target.value)}
                    placeholder="Nhập mã lớp (vd: REACT2026, UIUX99)..." 
                    className="w-full bg-transparent pl-3 pr-2 py-2 text-xs font-bold text-[#1e293b] outline-none placeholder:text-slate-400"
                  />
                  {/* Embedded CTA Button (bg-secondary #f97316, white text, 12px radius) */}
                  <button 
                    type="submit"
                    className="bg-[#f97316] hover:bg-[#ea580c] text-white text-xs font-bold px-4 py-2 rounded-[10px] shrink-0 transition-colors duration-300 shadow-sm cursor-pointer"
                  >
                    Tham gia ngay
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* SECTION: Assignment Table (Full width responsive) */}
          <div className="bg-white rounded-[24px] border border-[#f3f4f6] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-[#1e293b]">Nhiệm vụ & Bài tập cần nộp</h3>
                <p className="text-xs text-[#64748b]">Bảng phân công công việc các khóa học đang theo học</p>
              </div>
              <button 
                onClick={() => showToast("Mở danh sách bài tập đầy đủ")}
                className="text-xs font-bold text-[#0d6efd] hover:underline cursor-pointer"
              >
                Xem tất cả bài tập
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[550px]">
                <thead>
                  <tr className="border-b border-slate-100 text-[#64748b] font-bold text-[11px]">
                    <th className="pb-3 pl-2">Tên bài tập</th>
                    <th className="pb-3">Khóa học</th>
                    <th className="pb-3">Hạn nộp</th>
                    <th className="pb-3">Trạng thái</th>
                    <th className="pb-3 text-right pr-2">Điểm</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <tr className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 pl-2 font-bold text-[#1e293b]">Tìm hiểu về React Hooks & State Management</td>
                    <td className="py-3 text-[#0d6efd] font-bold">Lập trình ReactJS</td>
                    <td className="py-3 text-[#64748b]">23:59 Hôm nay</td>
                    <td className="py-3"><span className="bg-amber-50 text-amber-600 px-2.5 py-0.5 rounded-full font-bold text-[10px]">Đang làm</span></td>
                    <td className="py-3 text-right pr-2 font-extrabold text-[#1e293b]">100 đ</td>
                  </tr>
                  <tr className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 pl-2 font-bold text-[#1e293b]">Thiết kế bộ UI Design System Figma</td>
                    <td className="py-3 text-teal-600 font-bold">UI/UX Design</td>
                    <td className="py-3 text-[#64748b]">18/10/2026</td>
                    <td className="py-3"><span className="bg-blue-50 text-[#0d6efd] px-2.5 py-0.5 rounded-full font-bold text-[10px]">Chưa nộp</span></td>
                    <td className="py-3 text-right pr-2 font-extrabold text-[#1e293b]">100 đ</td>
                  </tr>
                  <tr className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 pl-2 font-bold text-[#1e293b]">Phân tích chiến dịch Email Marketing</td>
                    <td className="py-3 text-purple-600 font-bold">Digital Marketing</td>
                    <td className="py-3 text-[#64748b]">Đã nộp</td>
                    <td className="py-3"><span className="bg-emerald-50 text-[#10b981] px-2.5 py-0.5 rounded-full font-bold text-[10px]">Đã chấm</span></td>
                    <td className="py-3 text-right pr-2 font-extrabold text-[#10b981]">95 đ</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (4/12 = ~33%): Profile, Mini-Calendar Widget, Upcoming Classes, Todo List, Donut Ring, Certificate */}
        <div className="xl:col-span-4 space-y-7">
          
          {/* 1. USER PROFILE CARD (Spec: 300px circular/rounded image, stats list) */}
          <div className="bg-white rounded-[24px] border border-[#f3f4f6] p-6 shadow-sm flex flex-col items-center text-center space-y-3.5 transition-all duration-300 hover:shadow-md">
            <div className="relative">
              <img 
                src="/03_avatar_student.png" 
                alt="Student Profile" 
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-50 shadow-md"
              />
              <span className="absolute bottom-1 right-1 w-4 h-4 bg-[#10b981] rounded-full border-2 border-white" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#1e293b]">{userName}</h3>
              <p className="text-xs text-[#64748b] font-medium">Học viên xuất sắc • K26 EduSmart</p>
            </div>

            {/* Quick stats grid */}
            <div className="grid grid-cols-3 gap-2 w-full pt-2 border-t border-slate-100">
              <div className="p-2 bg-slate-50 rounded-xl">
                <span className="text-xs font-extrabold text-[#1e293b]">4</span>
                <p className="text-[10px] text-[#64748b] font-medium">Lớp học</p>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl">
                <span className="text-xs font-extrabold text-[#0d6efd]">98%</span>
                <p className="text-[10px] text-[#64748b] font-medium">Chuyên cần</p>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl">
                <span className="text-xs font-extrabold text-[#10b981]">Top 5%</span>
                <p className="text-[10px] text-[#64748b] font-medium">Xếp hạng</p>
              </div>
            </div>
          </div>

          {/* 2. MINI CALENDAR WIDGET (Spec: Horizontal row of day-dates. Non-active days: #64748b text. Active day: High-contrast pink background #ec4899, white text, 12px rounded-xl, vertical offset -4px transform, and a soft pink shadow) */}
          <div className="bg-white rounded-[24px] border border-[#f3f4f6] p-6 shadow-sm space-y-4 transition-all duration-300 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-[#1e293b]">Lịch tuần học tập</h3>
                <p className="text-[11px] text-[#64748b] font-medium">Tháng 10, 2026</p>
              </div>
              <span className="text-xs font-bold text-[#ec4899] bg-pink-50 px-2.5 py-1 rounded-full border border-pink-100">
                Tuần 42
              </span>
            </div>

            {/* Horizontal Day Scroller */}
            <div className="flex items-center justify-between gap-1.5 pt-2">
              {weekDays.map((item) => {
                const isActive = item.date === selectedCalendarDay;

                return (
                  <button
                    key={item.date}
                    onClick={() => {
                      setSelectedCalendarDay(item.date);
                      showToast(`Đã chọn lịch ngày ${item.date}/10/2026`);
                    }}
                    className={`flex flex-col items-center justify-center flex-1 py-2.5 rounded-[12px] transition-all duration-300 cursor-pointer ${
                      isActive
                        ? "bg-[#ec4899] text-white -translate-y-1 shadow-[0_8px_16px_rgba(236,72,153,0.35)] font-extrabold"
                        : "text-[#64748b] hover:bg-slate-50 hover:text-[#1e293b]"
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase">{item.dayName}</span>
                    <span className="text-sm font-extrabold mt-0.5">{item.date}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. UPCOMING CLASSES VERTICAL LIST */}
          <div className="bg-white rounded-[24px] border border-[#f3f4f6] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-[#1e293b]">Lớp học sắp tới</h3>
              <span className="text-[10px] text-[#0d6efd] font-bold bg-blue-50 px-2 py-0.5 rounded-full">
                Hôm nay
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 bg-blue-50/60 rounded-[16px] border border-blue-100/60 flex items-start gap-3 transition-transform hover:-translate-y-0.5">
                <div className="w-2.5 h-2.5 bg-[#0d6efd] rounded-full mt-1.5 shrink-0" />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-[#1e293b] leading-tight">Lập trình ReactJS Thực chiến</h4>
                  <p className="text-[11px] text-[#64748b] mt-1">18:00 - 20:00 • Phòng Lab A3</p>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50/60 rounded-[16px] border border-emerald-100/60 flex items-start gap-3 transition-transform hover:-translate-y-0.5">
                <div className="w-2.5 h-2.5 bg-[#10b981] rounded-full mt-1.5 shrink-0" />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-[#1e293b] leading-tight">Workshop UX Research & Personas</h4>
                  <p className="text-[11px] text-[#64748b] mt-1">20:30 - 22:00 • Trực tuyến Google Meet</p>
                </div>
              </div>
            </div>
          </div>

          {/* 4. TODO LIST WITH CUSTOM CHECKBOXES */}
          <div className="bg-white rounded-[24px] border border-[#f3f4f6] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-[#1e293b]">Danh sách việc cần làm</h3>
              <span className="text-[11px] text-[#64748b] font-bold">
                {todos.filter(t => t.done).length}/{todos.length}
              </span>
            </div>

            <div className="space-y-2.5">
              {todos.map((todo) => (
                <div 
                  key={todo.id}
                  onClick={() => toggleTodo(todo.id)}
                  className={`flex items-start gap-3 p-3 rounded-[16px] border transition-all cursor-pointer ${
                    todo.done ? "bg-slate-50/80 border-slate-100 opacity-60" : "bg-white border-[#f3f4f6] hover:border-blue-100"
                  }`}
                >
                  {/* Custom Checkbox */}
                  <div className={`w-5 h-5 rounded-[8px] border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    todo.done ? "bg-[#0d6efd] border-[#0d6efd] text-white" : "border-slate-300 bg-white"
                  }`}>
                    {todo.done && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className={`text-xs font-bold leading-snug ${todo.done ? "line-through text-[#64748b]" : "text-[#1e293b]"}`}>
                      {todo.title}
                    </p>
                    <p className="text-[10px] text-[#64748b] mt-0.5">{todo.time} • {todo.course}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. DONUT RING: Tiến độ học tập 75% */}
          <div className="bg-white rounded-[24px] border border-[#f3f4f6] p-6 shadow-sm space-y-4.5">
            <div>
              <h3 className="text-sm font-extrabold text-[#1e293b]">Tiến độ học tập tổng quan</h3>
              <p className="text-xs text-[#64748b]">Tỉ lệ hoàn thiện các bài giảng trong khóa</p>
            </div>

            <div className="flex flex-col items-center justify-center relative py-1">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
                  <circle cx="80" cy="80" r={radius} fill="transparent" stroke="#f1f5f9" strokeWidth={strokeWidth} />
                  <circle cx="80" cy="80" r={radius} fill="transparent" stroke="#0d6efd" strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={doneStrokeDashoffset} strokeLinecap="round" />
                  <circle cx="80" cy="80" r={radius} fill="transparent" stroke="#10b981" strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={learningStrokeDashoffset} transform={`rotate(${completedPercent * 3.6} 80 80)`} strokeLinecap="round" />
                  <circle cx="80" cy="80" r={radius} fill="transparent" stroke="#f97316" strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={remainingStrokeDashoffset} transform={`rotate(${(completedPercent + learningPercent) * 3.6} 80 80)`} strokeLinecap="round" />
                </svg>

                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-[#1e293b]">75%</span>
                  <span className="text-[9px] font-bold text-[#64748b] uppercase tracking-widest mt-0.5">Hoàn thành</span>
                </div>
              </div>

              <div className="space-y-2 mt-4.5 w-full px-2.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#64748b]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0d6efd] shrink-0" />
                  <span>Hoàn thành</span>
                  <span className="font-extrabold text-[#1e293b] ml-auto">75%</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#64748b]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] shrink-0" />
                  <span>Đang học</span>
                  <span className="font-extrabold text-[#1e293b] ml-auto">15%</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#64748b]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f97316] shrink-0" />
                  <span>Chưa bắt đầu</span>
                  <span className="font-extrabold text-[#1e293b] ml-auto">10%</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-50 space-y-1.5">
              <div className="flex justify-between text-[11px] font-bold text-[#64748b]">
                <span>Bạn đã hoàn thành 18/24 khóa học</span>
                <span className="text-[#0d6efd]">75%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#0d6efd] rounded-full" style={{ width: "75%" }} />
              </div>
            </div>
          </div>

          {/* 6. CHỨNG CHỈ PREVIEW */}
          <div className="bg-white rounded-[24px] border border-[#f3f4f6] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-[#1e293b]">Chứng chỉ của bạn</h3>
              <button 
                onClick={() => showToast("Mở kho chứng chỉ của bạn")}
                className="text-xs font-bold text-[#0d6efd] hover:underline flex items-center cursor-pointer"
              >
                Xem tất cả
                <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </button>
            </div>

            <div className="rounded-[16px] overflow-hidden shadow-xs border border-slate-150">
              <img 
                src="/09_certificate_thumbnail.png" 
                alt="Certificate" 
                className="w-full h-auto object-cover" 
              />
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
