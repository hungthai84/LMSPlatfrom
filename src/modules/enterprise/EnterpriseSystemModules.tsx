import React, { useEffect, useState } from "react";
import {
  MessageSquare,
  ThumbsUp,
  Send,
  BarChart3,
  ShoppingBag,
  Plug,
  Settings2,
  Download,
  Database,
  Trash2,
  ShieldAlert,
  CheckCircle2,
  Palette,
  Languages,
  Volume2,
  VolumeX,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useLms } from "../../contexts/LmsContext";
import {
  fetchServerHealth,
  ServerHealthResponse,
  validateXapiStatement,
  XapiValidationResponse,
} from "../../services/aiService";
import { LmsRouteId } from "../../types/lms";
import { tr } from "../../i18n/translations";
import { SYSTEM_THEMES_CONFIG } from "../../themes/themeConfig";

export const EnterpriseSystemModules: React.FC<{
  route: Extract<LmsRouteId, "training-analytics" | "community" | "reports" | "commerce" | "integrations" | "system-admin">;
}> = ({ route }) => {
  const {
    language,
    setLanguage,
    courses,
    enrollments,
    trainingPlans,
    discussions,
    orders,
    auditLogs,
    systemTheme,
    setSystemTheme,
    fontSizeScale,
    setFontSizeScale,
    reduceMotion,
    setReduceMotion,
    highContrast,
    setHighContrast,
    soundEnabled,
    setSoundEnabled,
    playSound,
    createDiscussion,
    likeDiscussion,
    createOrder,
    seedDemoToFirestore,
    clearDemoFromFirestore,
    showToast,
  } = useLms();

  const [discTitle, setDiscTitle] = useState("");
  const [discContent, setDiscContent] = useState("");
  const [discCategory, setDiscCategory] = useState("Trao đổi học tập");
  const [couponCode, setCouponCode] = useState("EDU2026");

  const [health, setHealth] = useState<ServerHealthResponse | null>(null);
  const [xapiJson, setXapiJson] = useState(
    JSON.stringify(
      {
        actor: { mbox: "mailto:nguyenvana@edusmart.vn" },
        verb: { id: "http://adlnet.gov/expapi/verbs/completed" },
        object: { id: "https://edusmart.vn/courses/react-2026" },
      },
      null,
      2
    )
  );
  const [xapiResult, setXapiResult] = useState<XapiValidationResponse | null>(null);

  useEffect(() => {
    if (route === "integrations") {
      fetchServerHealth().then(setHealth).catch(() => {});
    }
  }, [route]);

  if (route === "community") {
    return (
      <div className="space-y-5 pb-8">
        <div className="glass-liquid-card-purple p-4 sm:p-5 rounded-[14px] flex items-center justify-between gap-3">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              {tr(language, "Cộng đồng, Diễn đàn Q&A & Thông báo", "Community, Q&A Forum & Announcements")}
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              {tr(language, "Trao đổi trực tiếp giữa học viên và giảng viên, đồng bộ bài viết thời gian thực.", "Collaborate with instructors and peers with real-time post sync.")}
            </p>
          </div>
          <MessageSquare className="w-6 h-6 text-purple-600 shrink-0" />
        </div>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!discTitle.trim() || !discContent.trim()) return;
            await createDiscussion({ title: discTitle.trim(), content: discContent.trim(), category: discCategory });
            setDiscTitle("");
            setDiscContent("");
          }}
          className="glass-liquid-card p-4 rounded-[14px] space-y-2.5"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              required
              value={discTitle}
              onChange={(e) => setDiscTitle(e.target.value)}
              placeholder={tr(language, "Tiêu đề thảo luận...", "Discussion topic...")}
              className="sm:col-span-2 px-3 py-2 rounded-[14px] bg-white border border-slate-200 text-xs"
            />
            <input
              type="text"
              value={discCategory}
              onChange={(e) => setDiscCategory(e.target.value)}
              className="px-3 py-2 rounded-[14px] bg-white border border-slate-200 text-xs"
            />
          </div>
          <textarea
            rows={2}
            required
            value={discContent}
            onChange={(e) => setDiscContent(e.target.value)}
            placeholder={tr(language, "Nội dung câu hỏi hoặc chia sẻ kinh nghiệm...", "Share a question or insight...")}
            className="w-full p-3 rounded-[14px] bg-white border border-slate-200 text-xs"
          />
          <div className="flex justify-end">
            <button type="submit" className="px-4 py-2 rounded-[14px] bg-[#0d6efd] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer">
              <Send className="w-3.5 h-3.5" /> {tr(language, "Đăng bài viết", "Publish Post")}
            </button>
          </div>
        </form>

        <div className="space-y-3">
          {discussions.map((post) => (
            <div key={post.id} className="glass-liquid-card p-4 rounded-[14px] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-[14px] bg-purple-100 text-purple-800">{post.category}</span>
                <span className="text-[11px] font-bold text-slate-500">{post.authorName}</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">{post.title}</h3>
              <p className="text-xs text-slate-700 leading-relaxed">{post.content}</p>
              <button
                onClick={() => likeDiscussion(post.id, post.likesCount)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[14px] bg-white border border-slate-200 text-xs font-bold text-[#0d6efd] cursor-pointer"
              >
                <ThumbsUp className="w-3.5 h-3.5" /> {tr(language, "Thích", "Like")} ({post.likesCount})
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (route === "reports" || route === "training-analytics") {
    const chartData = courses.map((c) => {
      const courseEnrs = enrollments.filter((e) => e.courseId === c.id);
      const avgProgress =
        courseEnrs.length > 0
          ? Math.round(courseEnrs.reduce((sum, e) => sum + e.progressPercent, 0) / courseEnrs.length)
          : 55;
      return {
        name: c.code,
        tienDo: avgProgress,
        ghiDanh: Math.max(courseEnrs.length * 12, 18),
      };
    });

    const totalBudget = trainingPlans.reduce((s, p) => s + p.budgetAllocated, 0);
    const totalSpent = trainingPlans.reduce((s, p) => s + (p.budgetSpent || 0), 0);

    return (
      <div className="space-y-5 pb-8">
        <div className="glass-liquid-card-emerald p-4 sm:p-5 rounded-[14px] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              {route === "training-analytics"
                ? tr(language, "Thống kê Học tập & Cảnh báo Tiến độ", "Training Analytics & Alerts")
                : tr(language, "Báo cáo Quản trị & Training ROI", "Management Reports & Training ROI")}
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              {tr(language, "Phân tích hiệu suất đào tạo theo khóa học, ngân sách và tiến độ thực tế.", "Analyze training performance by course, budget, and completion rate.")}
            </p>
          </div>
          <button
            onClick={() => {
              const csv = "Code,Title,Status,Price\n" + courses.map((c) => `${c.code},"${c.title}",${c.status},${c.price || 0}`).join("\n");
              const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "edusmart_training_roi.csv";
              a.click();
              URL.revokeObjectURL(url);
              showToast(tr(language, "Đã xuất báo cáo Training ROI ra CSV!", "Exported Training ROI report to CSV!"));
            }}
            className="px-4 py-2 rounded-[14px] bg-[#0d6efd] text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shrink-0 self-start sm:self-auto"
          >
            <Download className="w-4 h-4" /> {tr(language, "Xuất CSV", "Export CSV")}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-liquid-card-blue p-4 rounded-[14px]">
            <p className="text-xs text-slate-600">{tr(language, "Tổng ngân sách kế hoạch", "Total Planned Budget")}</p>
            <p className="text-xl font-bold text-[#0d6efd] mt-1">{totalBudget.toLocaleString("vi-VN")}đ</p>
          </div>
          <div className="glass-liquid-card-emerald p-4 rounded-[14px]">
            <p className="text-xs text-slate-600">{tr(language, "Đã giải ngân thực tế", "Actual Disbursed")}</p>
            <p className="text-xl font-bold text-emerald-700 mt-1">{totalSpent.toLocaleString("vi-VN")}đ</p>
          </div>
          <div className="glass-liquid-card-orange p-4 rounded-[14px]">
            <p className="text-xs text-slate-600">{tr(language, "Lượt ghi danh đang theo dõi", "Active Enrollments")}</p>
            <p className="text-xl font-bold text-orange-700 mt-1">
              {enrollments.length} {tr(language, "học viên", "learners")}
            </p>
          </div>
        </div>

        <div className="glass-liquid-card p-4 sm:p-5 rounded-[14px] space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#0d6efd]" />{" "}
            {tr(language, "Tiến độ trung bình & Mức độ tham gia theo Khóa học", "Average Progress & Engagement by Course")}
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="tienDo" name={tr(language, "Tiến độ TB (%)", "Avg Progress (%)")} fill="#0d6efd" radius={[14, 14, 0, 0]} />
                <Bar dataKey="ghiDanh" name={tr(language, "Chỉ số tham gia", "Engagement Index")} fill="#10b981" radius={[14, 14, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  }

  if (route === "commerce") {
    return (
      <div className="space-y-5 pb-8">
        <div className="glass-liquid-card-orange p-4 sm:p-5 rounded-[14px] flex items-center justify-between gap-3">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              {tr(language, "Thương mại & Thanh toán Khóa học (E-Commerce)", "Course E-Commerce & Orders")}
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              {tr(
                language,
                "Đơn hàng được lưu với trạng thái pending_webhook và chỉ xác nhận thanh toán khi nhận webhook hợp lệ từ cổng thanh toán.",
                "Orders stay in pending_webhook until verified by a signed payment gateway webhook."
              )}
            </p>
          </div>
          <ShoppingBag className="w-6 h-6 text-orange-600 shrink-0" />
        </div>

        <div className="glass-liquid-card p-4 rounded-[14px] flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold text-slate-700">
            {tr(language, "Mã giảm giá áp dụng (EDU2026 = giảm 15%):", "Promo Code (EDU2026 = 15% off):")}
          </span>
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="px-3 py-1.5 rounded-[14px] bg-white border border-slate-200 text-xs font-bold"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {courses.filter((c) => (c.price || 0) > 0).map((c) => {
            const discount = couponCode.toUpperCase() === "EDU2026" ? 0.85 : 1;
            const finalAmount = Math.round((c.price || 0) * discount);
            return (
              <div key={c.id} className="glass-liquid-card p-4 rounded-[14px] flex flex-col justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold text-[#0d6efd]">{c.code}</span>
                  <h3 className="text-sm font-bold text-slate-900 mt-0.5">{c.title}</h3>
                  <p className="text-base font-bold text-emerald-700 mt-2">{finalAmount.toLocaleString("vi-VN")}đ</p>
                </div>
                <button
                  onClick={() =>
                    createOrder({
                      courseId: c.id,
                      courseTitle: c.title,
                      amount: finalAmount,
                      couponCode: couponCode.trim() || undefined,
                    })
                  }
                  className="w-full py-2 rounded-[14px] bg-[#f97316] hover:bg-orange-600 text-white text-xs font-bold cursor-pointer"
                >
                  {tr(language, "Đặt mua khóa học", "Order Course")}
                </button>
              </div>
            );
          })}
        </div>

        <div className="glass-liquid-card p-4 sm:p-5 rounded-[14px] space-y-3">
          <h3 className="text-sm font-bold text-slate-900">
            {tr(language, `Lịch sử Đơn hàng (${orders.length})`, `Order History (${orders.length})`)}
          </h3>
          <div className="space-y-2">
            {orders.map((ord) => (
              <div key={ord.id} className="p-3 rounded-[14px] bg-white/85 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div>
                  <p className="font-bold text-slate-900">{ord.courseTitle}</p>
                  <p className="text-[11px] text-slate-500">
                    {tr(language, "Số tiền:", "Amount:")} {ord.amount.toLocaleString("vi-VN")}đ{" "}
                    {ord.couponCode ? `• ${tr(language, "Mã:", "Code:")} ${ord.couponCode}` : ""}
                  </p>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-[14px] text-[10px] font-bold uppercase ${
                    ord.paymentStatus === "verified" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {ord.paymentStatus === "pending_webhook"
                    ? tr(language, "Chờ xác nhận Webhook", "Pending Webhook")
                    : ord.paymentStatus}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (route === "integrations") {
    return (
      <div className="space-y-5 pb-8">
        <div className="glass-liquid-card-blue p-4 sm:p-5 rounded-[14px] flex items-center justify-between gap-3">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              {tr(language, "Integration Center & Kiểm định xAPI / SCORM", "Integration Center & xAPI / SCORM Validator")}
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              {tr(language, "Kiểm tra trạng thái kết nối thực tế từ /api/health và kiểm định chuẩn Experience API.", "Inspect live connectivity from /api/health and validate Experience API statements.")}
            </p>
          </div>
          <Plug className="w-6 h-6 text-[#0d6efd] shrink-0" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { label: "Gemini AI Server Proxy", ok: health?.capabilities.geminiAi },
            { label: "Google Workspace OAuth", ok: health?.integrations.googleWorkspace.configured },
            { label: "Zoom Meetings API", ok: health?.integrations.zoom.configured },
            { label: "Microsoft Teams Graph", ok: health?.integrations.microsoftTeams.configured },
            { label: "Payment Gateway Webhook", ok: health?.integrations.paymentWebhook.configured },
            { label: "SMTP Email Service", ok: health?.integrations.smtpEmail.configured },
          ].map((item) => (
            <div key={item.label} className="glass-liquid-card p-4 rounded-[14px] flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-900">{item.label}</span>
              <span
                className={`text-[10px] font-bold px-2.5 py-1 rounded-[14px] shrink-0 ${
                  item.ok ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                }`}
              >
                {item.ok ? tr(language, "Đã kết nối", "Connected") : tr(language, "Chưa cấu hình", "Unconfigured")}
              </span>
            </div>
          ))}
        </div>

        <div className="glass-liquid-card p-4 sm:p-5 rounded-[14px] space-y-3">
          <h3 className="text-sm font-bold text-slate-900">
            {tr(language, "Trình kiểm định xAPI Statement 1.0.3 (/api/xapi/validate)", "xAPI Statement 1.0.3 Validator (/api/xapi/validate)")}
          </h3>
          <textarea
            rows={6}
            value={xapiJson}
            onChange={(e) => setXapiJson(e.target.value)}
            className="w-full p-3 rounded-[14px] bg-white border border-slate-200 text-xs font-mono"
          />
          <button
            onClick={async () => {
              try {
                const parsed = JSON.parse(xapiJson);
                const res = await validateXapiStatement(parsed);
                setXapiResult(res);
              } catch (err: unknown) {
                showToast(err instanceof Error ? err.message : tr(language, "JSON xAPI không hợp lệ", "Invalid xAPI JSON"));
              }
            }}
            className="px-4 py-2 rounded-[14px] bg-[#0d6efd] text-white text-xs font-bold cursor-pointer"
          >
            {tr(language, "Kiểm tra Statement xAPI", "Validate xAPI Statement")}
          </button>
          {xapiResult && (
            <p className={`text-xs font-bold p-3 rounded-[14px] ${xapiResult.valid ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"}`}>
              {xapiResult.message}
            </p>
          )}
        </div>
      </div>
    );
  }

  // system-admin
  return (
    <div className="space-y-5 pb-8">
      <div className="glass-liquid-card-purple p-4 sm:p-5 rounded-[14px] flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900">
            {tr(language, "Quản trị Hệ thống, Giao diện & Nhật ký Audit", "System Admin, Theme, Language & Audit Logs")}
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            {tr(
              language,
              "Tuỳ chỉnh Theme hệ thống (Mặc định Glass Liquid đa màu sắc), ngôn ngữ VI/EN, trợ năng WCAG 2.2 AA và dữ liệu Firestore.",
              "Customize System Theme (default multi-color Glass Liquid), VI/EN language, WCAG 2.2 AA accessibility, and Firestore demo data."
            )}
          </p>
        </div>
        <Settings2 className="w-6 h-6 text-purple-600 shrink-0" />
      </div>

      {/* Language Selector Card */}
      <div className="glass-liquid-card-blue p-4 sm:p-5 rounded-[14px] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[14px] bg-white/85 text-[#0d6efd] flex items-center justify-center shrink-0">
            <Languages className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {tr(language, "Ngôn ngữ Hệ thống (Mặc định Tiếng Việt)", "System Language (Vietnamese Default)")}
            </h3>
            <p className="text-xs text-slate-600">
              {tr(
                language,
                "Chuyển đổi song ngữ Tiếng Việt & Tiếng Anh tức thì trên toàn bộ ứng dụng.",
                "Instantly switch between Vietnamese (default) and English across the entire app."
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              setLanguage("vi");
              showToast("Đã chọn Tiếng Việt (Mặc định)");
            }}
            className={`px-3.5 py-2 rounded-[14px] text-xs font-bold cursor-pointer ${
              language === "vi" ? "bg-[#0d6efd] text-white" : "bg-white/90 text-slate-700 border border-slate-200"
            }`}
          >
            Tiếng Việt (VI)
          </button>
          <button
            onClick={() => {
              setLanguage("en");
              showToast("Switched interface to English");
            }}
            className={`px-3.5 py-2 rounded-[14px] text-xs font-bold cursor-pointer ${
              language === "en" ? "bg-[#0d6efd] text-white" : "bg-white/90 text-slate-700 border border-slate-200"
            }`}
          >
            English (EN)
          </button>
        </div>
      </div>

      {/* System Theme Selector */}
      <div className="glass-liquid-card p-4 sm:p-5 rounded-[14px] space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Palette className="w-4 h-4 text-[#0d6efd]" />{" "}
          {tr(language, "Giao diện Hệ thống, Hình nền, Màu chính & Âm thanh (7 Themes)", "System Themes, Wallpapers, Colors & Sound (7 Themes)")}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SYSTEM_THEMES_CONFIG.map((t) => {
            const name = language === "en" ? t.nameEn : t.nameVi;
            const desc = language === "en" ? t.descEn : t.descVi;
            const cardStyle = language === "en" ? t.cardStyleEn : t.cardStyleVi;
            const soundLabel = language === "en" ? t.soundDescEn : t.soundDescVi;
            return (
              <button
                key={t.id}
                onClick={() => {
                  setSystemTheme(t.id);
                  showToast(tr(language, `Đã kích hoạt giao diện: ${name}`, `Activated theme: ${name}`));
                }}
                className={`p-3 rounded-[14px] border text-left transition-all cursor-pointer bg-white/85 ${
                  systemTheme === t.id ? "ring-2 ring-[#0d6efd] border-[#0d6efd]" : "border-slate-200"
                }`}
              >
                <div
                  className="h-14 w-full rounded-[14px] mb-2 border border-white/60 relative overflow-hidden"
                  style={{
                    backgroundImage: `url(${t.wallpaperUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundColor: t.primaryColor,
                  }}
                >
                  <div className="absolute bottom-1 left-1 flex items-center gap-1 bg-slate-950/60 px-1.5 py-0.5 rounded-[14px]">
                    <span className="w-2 h-2 rounded-[14px]" style={{ backgroundColor: t.primaryColor }} />
                    <span className="w-2 h-2 rounded-[14px]" style={{ backgroundColor: t.secondaryColor }} />
                    <span className="text-[8px] font-bold text-white">{cardStyle}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 truncate pr-1">{name}</span>
                  {systemTheme === t.id && <CheckCircle2 className="w-4 h-4 text-[#0d6efd] shrink-0" />}
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">{desc}</p>
                <p className="text-[9px] text-[#0d6efd] font-bold mt-1">🔊 {soundLabel}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Accessibility, Sound & Demo Seed/Clear */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-liquid-card p-4 sm:p-5 rounded-[14px] space-y-3">
          <h3 className="text-sm font-bold text-slate-900">
            {tr(language, "Trợ năng WCAG 2.2 AA, Hiển thị & Âm thanh", "WCAG 2.2 AA Accessibility, Display & Sound")}
          </h3>
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between gap-2 p-2.5 rounded-[14px] bg-white/80">
              <label className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer">
                {soundEnabled ? <Volume2 className="w-4 h-4 text-[#0d6efd]" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
                <span>{tr(language, "Âm thanh tương tác theo giao diện", "Theme Interactive Sound Effects")}</span>
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={(e) => {
                    const next = e.target.checked;
                    setSoundEnabled(next);
                    if (next) playSound("success");
                  }}
                />
              </label>
              <button
                type="button"
                onClick={() => playSound("switch")}
                className="px-2.5 py-1 rounded-[14px] bg-[#0d6efd] text-white text-[10px] font-bold cursor-pointer shrink-0"
              >
                {tr(language, "Nghe thử", "Test")}
              </button>
            </div>
            <label className="flex items-center justify-between p-2.5 rounded-[14px] bg-white/80 cursor-pointer">
              <span className="font-bold text-slate-700">{tr(language, "Cỡ chữ lớn (Large Text Scale)", "Large Text Scale")}</span>
              <input
                type="checkbox"
                checked={fontSizeScale === "large"}
                onChange={(e) => {
                  playSound("click");
                  setFontSizeScale(e.target.checked ? "large" : "normal");
                }}
              />
            </label>
            <label className="flex items-center justify-between p-2.5 rounded-[14px] bg-white/80 cursor-pointer">
              <span className="font-bold text-slate-700">{tr(language, "Giảm hiệu ứng chuyển động (Reduce Motion)", "Reduce Motion")}</span>
              <input
                type="checkbox"
                checked={reduceMotion}
                onChange={(e) => {
                  playSound("click");
                  setReduceMotion(e.target.checked);
                }}
              />
            </label>
            <label className="flex items-center justify-between p-2.5 rounded-[14px] bg-white/80 cursor-pointer">
              <span className="font-bold text-slate-700">{tr(language, "Độ tương phản cao (High Contrast)", "High Contrast Mode")}</span>
              <input
                type="checkbox"
                checked={highContrast}
                onChange={(e) => {
                  playSound("click");
                  setHighContrast(e.target.checked);
                }}
              />
            </label>
          </div>
        </div>

        <div className="glass-liquid-card-orange p-4 sm:p-5 rounded-[14px] space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Database className="w-4 h-4 text-orange-600" />{" "}
            {tr(language, "Quản lý Dữ liệu Demo trên Cloud Firestore", "Cloud Firestore Demo Data Control")}
          </h3>
          <p className="text-xs text-slate-600">
            {tr(
              language,
              "Nạp bộ dữ liệu mẫu EDU LMS (6 khóa học, tổ chức, phòng ban, đề thi, chứng chỉ) vào Firestore hoặc dọn sạch các bản ghi gắn cờ isDemo=true.",
              "Seed sample EDU LMS records into Cloud Firestore or purge all records flagged with isDemo=true."
            )}
          </p>
          <div className="flex flex-wrap gap-2.5 pt-1">
            <button
              onClick={seedDemoToFirestore}
              className="px-4 py-2 rounded-[14px] bg-[#0d6efd] text-white text-xs font-bold cursor-pointer"
            >
              {tr(language, "Nạp dữ liệu Demo lên Firestore", "Seed Demo Data to Firestore")}
            </button>
            <button
              onClick={clearDemoFromFirestore}
              className="px-4 py-2 rounded-[14px] bg-red-600 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> {tr(language, "Xóa sạch dữ liệu Demo", "Clear Demo Data")}
            </button>
          </div>
        </div>
      </div>

      {/* Audit Logs */}
      <div className="glass-liquid-card p-4 sm:p-5 rounded-[14px] space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-[#0d6efd]" />{" "}
          {tr(language, "Nhật ký Bảo mật & Audit Logs (Chỉ đọc)", "Security & Audit Logs (Read-Only)")}
        </h3>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {auditLogs.map((log) => (
            <div key={log.id} className="p-2.5 rounded-[14px] bg-white/80 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div>
                <span className="font-bold text-[#0d6efd]">{log.action}</span> •{" "}
                <span className="font-bold text-slate-800">{log.actorName}</span>
                {log.details ? <span className="text-slate-600"> — {log.details}</span> : null}
              </div>
              <span className="text-[10px] text-slate-400">{log.createdAt || "Firestore"}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
