import React, { useEffect, useState } from "react";
import { Video, Calendar, UserCheck, Plus } from "lucide-react";
import { useLms } from "../../contexts/LmsContext";
import { hasPermission } from "../../constants/rbac";
import { fetchServerHealth, ServerHealthResponse } from "../../services/aiService";
import { LmsRouteId } from "../../types/lms";
import { tr } from "../../i18n/translations";

export const ClassroomAndEnrollmentModule: React.FC<{
  route: Extract<LmsRouteId, "classrooms" | "enrollments">;
}> = ({ route }) => {
  const {
    language,
    activeRole,
    courses,
    classSessions,
    enrollments,
    createClassSession,
    enrollCourse,
    updateEnrollmentStatus,
    showToast,
  } = useLms();

  const [health, setHealth] = useState<ServerHealthResponse | null>(null);
  const [sesTitle, setSesTitle] = useState("");
  const [sesCourseId] = useState(courses[0]?.id || "class-1");
  const [sesPlatform, setSesPlatform] = useState<"offline" | "zoom" | "google_meet" | "teams" | "bbb">("offline");
  const [sesTime, setSesTime] = useState("19:30 - 21:30 Thứ 5");
  const [sesRoom] = useState("Phòng Lab A3-402");

  useEffect(() => {
    fetchServerHealth().then(setHealth).catch(() => {});
  }, []);

  const canCreate = hasPermission(activeRole, route, "create");
  const canApprove = hasPermission(activeRole, route, "approve");

  if (route === "classrooms") {
    return (
      <div className="space-y-5 pb-8">
        <div className="glass-liquid-card-blue p-4 sm:p-5 rounded-[14px] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              {tr(language, "Lớp học Trực tiếp & Virtual Classroom", "Live & Virtual Classrooms")}
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              {tr(
                language,
                "Quản lý lịch học, điểm danh buổi học và trạng thái tích hợp Zoom / Google Meet / Microsoft Teams thực tế.",
                "Manage class schedules, attendance, and real Zoom / Google Meet / Microsoft Teams integration status."
              )}
            </p>
          </div>
          <Video className="w-6 h-6 text-[#0d6efd] shrink-0" />
        </div>

        {/* Honest Virtual Classroom Integration Status Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { name: "Zoom Meetings API", info: health?.integrations.zoom },
            { name: "Google Meet Workspace", info: health?.integrations.googleWorkspace },
            { name: "Microsoft Teams Graph", info: health?.integrations.microsoftTeams },
          ].map((item) => (
            <div key={item.name} className="glass-liquid-card p-3.5 rounded-[14px] flex items-center justify-between gap-2">
              <div>
                <p className="text-xs font-bold text-slate-900">{item.name}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {item.info?.configured
                    ? tr(language, "Đã cấu hình OAuth/Webhook", "OAuth/Webhook configured")
                    : tr(language, "Chưa cấu hình API Key trong môi trường", "API Key not configured in environment")}
                </p>
              </div>
              <span
                className={`text-[10px] font-bold px-2.5 py-1 rounded-[14px] shrink-0 ${
                  item.info?.configured ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                }`}
              >
                {item.info?.configured ? tr(language, "Đã kết nối", "Connected") : tr(language, "Chưa cấu hình", "Unconfigured")}
              </span>
            </div>
          ))}
        </div>

        {canCreate && (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!sesTitle.trim()) return;
              const isExternalUnconfigured =
                (sesPlatform === "zoom" && !health?.integrations.zoom.configured) ||
                (sesPlatform === "google_meet" && !health?.integrations.googleWorkspace.configured) ||
                (sesPlatform === "teams" && !health?.integrations.microsoftTeams.configured);

              await createClassSession({
                courseId: sesCourseId || "class-1",
                title: sesTitle.trim(),
                instructorName: tr(language, "Giảng viên EduSmart", "EduSmart Instructor"),
                room: sesRoom,
                platform: sesPlatform,
                meetingStatus: isExternalUnconfigured ? "unconfigured" : "scheduled",
                scheduleTime: sesTime,
                attendanceCount: 0,
              });
              setSesTitle("");
            }}
            className="glass-liquid-card p-4 rounded-[14px] grid grid-cols-1 md:grid-cols-5 gap-2.5"
          >
            <input
              type="text"
              required
              value={sesTitle}
              onChange={(e) => setSesTitle(e.target.value)}
              placeholder={tr(language, "Tên buổi học mới...", "New session title...")}
              className="md:col-span-2 px-3 py-2 rounded-[14px] bg-white border border-slate-200 text-xs"
            />
            <select
              value={sesPlatform}
              onChange={(e) => setSesPlatform(e.target.value as typeof sesPlatform)}
              className="px-3 py-2 rounded-[14px] bg-white border border-slate-200 text-xs"
            >
              <option value="offline">{tr(language, "Trực tiếp tại lớp", "In-Person Classroom")}</option>
              <option value="zoom">Zoom</option>
              <option value="google_meet">Google Meet</option>
              <option value="teams">Microsoft Teams</option>
            </select>
            <input
              type="text"
              value={sesTime}
              onChange={(e) => setSesTime(e.target.value)}
              className="px-3 py-2 rounded-[14px] bg-white border border-slate-200 text-xs"
            />
            <button type="submit" className="px-4 py-2 rounded-[14px] bg-[#0d6efd] text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer">
              <Plus className="w-4 h-4" /> {tr(language, "Tạo buổi học", "Create Session")}
            </button>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classSessions.map((ses) => (
            <div key={ses.id} className="glass-liquid-card p-4 rounded-[14px] flex flex-col justify-between gap-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-[14px] bg-blue-100 text-blue-800">
                    {ses.platform}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-[14px] ${
                      ses.meetingStatus === "unconfigured"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {ses.meetingStatus === "unconfigured"
                      ? tr(language, "Chờ cấu hình API", "API Setup Required")
                      : ses.meetingStatus}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">{ses.title}</h3>
                <p className="text-xs text-slate-600 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#0d6efd]" /> {ses.scheduleTime}
                </p>
                <p className="text-[11px] text-slate-500">
                  {tr(language, "GV:", "Inst:")} {ses.instructorName} • {ses.room} •{" "}
                  {tr(language, "Điểm danh:", "Attendance:")} {ses.attendanceCount ?? 0}
                </p>
              </div>
              <button
                onClick={() =>
                  showToast(
                    ses.meetingStatus === "unconfigured"
                      ? tr(
                          language,
                          `Nền tảng ${ses.platform} chưa cấu hình OAuth/API Key trong Integration Center.`,
                          `Platform ${ses.platform} has no OAuth/API Key configured in Integration Center.`
                        )
                      : tr(
                          language,
                          `Đã ghi nhận điểm danh vào lớp "${ses.title}"`,
                          `Checked in to session "${ses.title}"`
                        )
                  )
                }
                className="w-full py-2 rounded-[14px] bg-[#0d6efd] text-white text-xs font-bold cursor-pointer"
              >
                {ses.meetingStatus === "unconfigured"
                  ? tr(language, "Xem hướng dẫn cấu hình", "View Setup Guide")
                  : tr(language, "Điểm danh / Tham gia", "Check-in / Join")}
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-8">
      <div className="glass-liquid-card-emerald p-4 sm:p-5 rounded-[14px] flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900">
            {tr(language, "Đăng ký, Ghi danh & Điều chuyển Lớp học", "Course Registration & Enrollments")}
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            {tr(
              language,
              "Học viên tự đăng ký, quản lý phê duyệt ghi danh và theo dõi tiến độ từng khóa.",
              "Self-enrollment, approval workflows, and per-course learner progress tracking."
            )}
          </p>
        </div>
        <UserCheck className="w-6 h-6 text-emerald-600 shrink-0" />
      </div>

      {/* Quick self-enroll bar */}
      <div className="glass-liquid-card p-4 rounded-[14px] flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-bold text-slate-700">
          {tr(language, "Ghi danh nhanh vào khóa học hiện có:", "Quick enroll in active courses:")}
        </span>
        <div className="flex flex-wrap gap-2">
          {courses.slice(0, 4).map((c) => (
            <button
              key={c.id}
              onClick={() => enrollCourse(c)}
              className="px-3 py-1.5 rounded-[14px] bg-white border border-slate-200 hover:border-[#0d6efd] text-xs font-bold text-slate-800 cursor-pointer"
            >
              + {c.code}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-liquid-card p-4 sm:p-5 rounded-[14px] overflow-x-auto">
        <table className="w-full text-left text-xs min-w-[620px]">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="py-2.5">{tr(language, "Học viên", "Learner")}</th>
              <th className="py-2.5">{tr(language, "Khóa học", "Course")}</th>
              <th className="py-2.5">{tr(language, "Tiến độ", "Progress")}</th>
              <th className="py-2.5">{tr(language, "Trạng thái", "Status")}</th>
              <th className="py-2.5 text-right">{tr(language, "Thao tác", "Actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {enrollments.map((e) => (
              <tr key={e.id} className="hover:bg-white/50">
                <td className="py-3 font-bold text-slate-900">{e.userName}</td>
                <td className="py-3 text-slate-700">{e.courseTitle}</td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-slate-200 rounded-[14px] overflow-hidden">
                      <div className="h-full bg-[#0d6efd]" style={{ width: `${e.progressPercent}%` }} />
                    </div>
                    <span className="font-bold text-[#0d6efd]">{e.progressPercent}%</span>
                  </div>
                </td>
                <td className="py-3">
                  <span className="px-2.5 py-0.5 rounded-[14px] bg-blue-50 text-[#0d6efd] text-[10px] font-bold uppercase">
                    {e.status}
                  </span>
                </td>
                <td className="py-3 text-right space-x-1.5">
                  <button
                    onClick={() => updateEnrollmentStatus(e.id, e.progressPercent >= 80 ? "completed" : "active", Math.min(100, e.progressPercent + 20))}
                    className="px-2.5 py-1 rounded-[14px] bg-white border border-slate-200 text-[11px] font-bold cursor-pointer"
                  >
                    +20% {tr(language, "Tiến độ", "Progress")}
                  </button>
                  {canApprove && e.status === "pending" && (
                    <button
                      onClick={() => updateEnrollmentStatus(e.id, "approved", e.progressPercent)}
                      className="px-2.5 py-1 rounded-[14px] bg-emerald-600 text-white text-[11px] font-bold cursor-pointer"
                    >
                      {tr(language, "Duyệt ghi danh", "Approve")}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
