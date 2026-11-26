import React, { useState } from "react";
import {
  FileCheck2,
  Award,
  Trophy,
  Plus,
  Download,
  QrCode,
  ShieldCheck,
  XCircle,
  Flame,
} from "lucide-react";
import { useLms } from "../../contexts/LmsContext";
import { hasPermission } from "../../constants/rbac";
import { LmsRouteId } from "../../types/lms";
import { tr } from "../../i18n/translations";

export const AssessmentsAndCertsModule: React.FC<{
  route: Extract<LmsRouteId, "assessments" | "gradebook" | "certificates" | "gamification">;
}> = ({ route }) => {
  const {
    language,
    activeRole,
    currentProfile,
    courses,
    assessments,
    submissions,
    certificates,
    users,
    createAssessment,
    submitAssessment,
    gradeSubmission,
    issueCertificate,
    revokeCertificate,
    showToast,
  } = useLms();

  const [asmTitle, setAsmTitle] = useState("");
  const [asmCourseId] = useState(courses[0]?.id || "class-1");
  const [asmType, setAsmType] = useState<"quiz" | "assignment" | "exam" | "practice">("quiz");

  const [activeExamId, setActiveExamId] = useState<string | null>(null);
  const [examAnswer, setExamAnswer] = useState("");

  const [gradeInputs, setGradeInputs] = useState<Record<string, { score: number; feedback: string }>>({});
  const [verifyInput, setVerifyInput] = useState("EDU-REACT-2026-8841");

  const canCreate = hasPermission(activeRole, route, "create");
  const canGrade = hasPermission(activeRole, "gradebook", "edit") || hasPermission(activeRole, "gradebook", "approve");

  if (route === "assessments") {
    return (
      <div className="space-y-5 pb-8">
        <div className="glass-liquid-card-orange p-4 sm:p-5 rounded-[14px] flex items-center justify-between gap-3">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              {tr(language, "Đề thi, Kiểm tra & Ngân hàng Câu hỏi", "Assessments & Question Bank")}
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              {tr(
                language,
                "Tổ chức thi trực tuyến có giới hạn thời gian, chống gian lận cơ bản và nộp bài tự động lên Firestore.",
                "Timed online assessments with tab monitoring and direct Firestore submission."
              )}
            </p>
          </div>
          <FileCheck2 className="w-6 h-6 text-orange-600 shrink-0" />
        </div>

        {canCreate && (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!asmTitle.trim()) return;
              await createAssessment({
                courseId: asmCourseId || "class-1",
                title: asmTitle.trim(),
                assessmentType: asmType,
                durationMinutes: 45,
                passingScore: 70,
                maxScore: 100,
                status: "published",
                isPublic: true,
              });
              setAsmTitle("");
            }}
            className="glass-liquid-card p-4 rounded-[14px] grid grid-cols-1 sm:grid-cols-4 gap-2.5"
          >
            <input
              type="text"
              required
              value={asmTitle}
              onChange={(e) => setAsmTitle(e.target.value)}
              placeholder={tr(language, "Tên bài kiểm tra / đề thi...", "Assessment / exam title...")}
              className="sm:col-span-2 px-3 py-2 rounded-[14px] bg-white border border-slate-200 text-xs"
            />
            <select
              value={asmType}
              onChange={(e) => setAsmType(e.target.value as typeof asmType)}
              className="px-3 py-2 rounded-[14px] bg-white border border-slate-200 text-xs"
            >
              <option value="quiz">{tr(language, "Quiz Trắc nghiệm", "Multiple Choice Quiz")}</option>
              <option value="assignment">{tr(language, "Bài tập lớn", "Assignment Project")}</option>
              <option value="exam">{tr(language, "Thi cuối kỳ", "Final Exam")}</option>
              <option value="practice">{tr(language, "Luyện tập", "Practice Test")}</option>
            </select>
            <button type="submit" className="px-4 py-2 rounded-[14px] bg-[#0d6efd] text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer">
              <Plus className="w-4 h-4" /> {tr(language, "Tạo đề thi", "Create Assessment")}
            </button>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {assessments.map((asm) => (
            <div key={asm.id} className="glass-liquid-card p-4 rounded-[14px] flex flex-col justify-between gap-3">
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-[14px] bg-orange-100 text-orange-800">
                  {asm.assessmentType} • {asm.durationMinutes || 30} {tr(language, "phút", "mins")}
                </span>
                <h3 className="text-sm font-bold text-slate-900">{asm.title}</h3>
                <p className="text-xs text-slate-600">
                  {tr(language, "Điểm đạt:", "Passing score:")} {asm.passingScore}/{asm.maxScore}
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveExamId(asm.id);
                  setExamAnswer("");
                }}
                className="w-full py-2 rounded-[14px] bg-[#0d6efd] text-white text-xs font-bold cursor-pointer"
              >
                {tr(language, "Làm bài / Nộp bài", "Take / Submit")}
              </button>
            </div>
          ))}
        </div>

        {activeExamId && (
          <div className="glass-liquid-card-blue p-4 sm:p-5 rounded-[14px] space-y-3 border-2 border-[#0d6efd]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-slate-900">
                {tr(language, "Phòng thi Trực tuyến —", "Online Exam Room —")}{" "}
                {assessments.find((a) => a.id === activeExamId)?.title}
              </h3>
              <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-[14px] self-start sm:self-auto">
                {tr(language, "Chế độ Giám sát Tab đang bật", "Tab Proctoring Active")}
              </span>
            </div>
            <textarea
              rows={4}
              value={examAnswer}
              onChange={(e) => setExamAnswer(e.target.value)}
              placeholder={tr(language, "Nhập câu trả lời hoặc liên kết bài làm của bạn...", "Enter your answer or submission link...")}
              className="w-full p-3 rounded-[14px] bg-white border border-slate-200 text-xs outline-none"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setActiveExamId(null)}
                className="px-4 py-2 rounded-[14px] bg-white border border-slate-200 text-xs font-bold cursor-pointer"
              >
                {tr(language, "Đóng", "Close")}
              </button>
              <button
                onClick={async () => {
                  const asm = assessments.find((a) => a.id === activeExamId);
                  if (!asm || !examAnswer.trim()) return;
                  await submitAssessment({
                    assessmentId: asm.id,
                    courseId: asm.courseId,
                    content: examAnswer.trim(),
                    maxScore: asm.maxScore,
                    status: "submitted",
                  });
                  setActiveExamId(null);
                }}
                className="px-4 py-2 rounded-[14px] bg-[#10b981] text-white text-xs font-bold cursor-pointer"
              >
                {tr(language, "Nộp bài ngay", "Submit Now")}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (route === "gradebook") {
    const handleExportGrades = () => {
      const csv =
        "Student,Assessment,Score,MaxScore,Status,Feedback\n" +
        submissions
          .map((s) => `"${s.studentName}",${s.assessmentId},${s.score ?? ""},${s.maxScore},${s.status},"${s.feedback ?? ""}"`)
          .join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "edusmart_gradebook.csv";
      a.click();
      URL.revokeObjectURL(url);
      showToast(tr(language, "Đã xuất Bảng điểm ra CSV!", "Exported Gradebook to CSV!"));
    };

    return (
      <div className="space-y-5 pb-8">
        <div className="glass-liquid-card-purple p-4 sm:p-5 rounded-[14px] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              {tr(language, "Bảng điểm, Rubric & Phúc khảo", "Gradebook, Rubric & Appeals")}
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              {tr(language, "Chấm điểm trực tiếp bài nộp học viên theo Rubric chuẩn và xuất bảng điểm.", "Grade learner submissions using standard Rubrics and export grades.")}
            </p>
          </div>
          <button
            onClick={handleExportGrades}
            className="px-4 py-2 rounded-[14px] bg-[#0d6efd] text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shrink-0 self-start sm:self-auto"
          >
            <Download className="w-4 h-4" /> {tr(language, "Xuất Bảng điểm", "Export Grades")}
          </button>
        </div>

        <div className="space-y-3">
          {submissions.map((sub) => {
            const draft = gradeInputs[sub.id] || {
              score: sub.score ?? 85,
              feedback: sub.feedback ?? tr(language, "Đạt chuẩn đầu ra.", "Meets learning outcomes."),
            };
            return (
              <div key={sub.id} className="glass-liquid-card p-4 rounded-[14px] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{sub.studentName}</span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-[14px] bg-white text-[#0d6efd]">
                      {sub.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700">{sub.content}</p>
                  {sub.score !== undefined && (
                    <p className="text-xs font-bold text-emerald-700">
                      {tr(language, "Điểm:", "Score:")} {sub.score}/{sub.maxScore} — {sub.feedback}
                    </p>
                  )}
                </div>

                {canGrade && (
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      max={sub.maxScore}
                      value={draft.score}
                      onChange={(e) =>
                        setGradeInputs((prev) => ({
                          ...prev,
                          [sub.id]: { ...draft, score: Number(e.target.value) },
                        }))
                      }
                      className="w-20 px-2.5 py-1.5 rounded-[14px] bg-white border border-slate-200 text-xs font-bold"
                    />
                    <input
                      type="text"
                      value={draft.feedback}
                      onChange={(e) =>
                        setGradeInputs((prev) => ({
                          ...prev,
                          [sub.id]: { ...draft, feedback: e.target.value },
                        }))
                      }
                      placeholder={tr(language, "Nhận xét Rubric...", "Rubric feedback...")}
                      className="w-48 px-3 py-1.5 rounded-[14px] bg-white border border-slate-200 text-xs"
                    />
                    <button
                      onClick={() => gradeSubmission(sub.id, draft.score, draft.feedback)}
                      className="px-3.5 py-1.5 rounded-[14px] bg-[#10b981] text-white text-xs font-bold cursor-pointer"
                    >
                      {tr(language, "Lưu điểm", "Save Grade")}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (route === "certificates") {
    const matchedCert = certificates.find((c) => c.verifyCode.toUpperCase() === verifyInput.trim().toUpperCase());

    return (
      <div className="space-y-5 pb-8">
        <div className="glass-liquid-card-blue p-4 sm:p-5 rounded-[14px] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              {tr(language, "Chứng chỉ Số & Cổng Xác minh Trực tuyến QR", "Digital Certificates & QR Verification")}
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              {tr(language, "Cấp phát chứng chỉ tự động, tra cứu mã xác thực công khai và thu hồi khi cần.", "Automated issuance, public verification lookup, and revocation control.")}
            </p>
          </div>
          {hasPermission(activeRole, "certificates", "create") && (
            <button
              onClick={() =>
                issueCertificate({
                  userId: currentProfile.uid,
                  userName: currentProfile.displayName,
                  courseId: courses[0]?.id || "class-1",
                  courseTitle: courses[0]?.title || "ReactJS Enterprise",
                })
              }
              className="px-4 py-2 rounded-[14px] bg-[#0d6efd] text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shrink-0 self-start sm:self-auto"
            >
              <Award className="w-4 h-4" /> {tr(language, "Cấp chứng chỉ mới", "Issue Certificate")}
            </button>
          )}
        </div>

        {/* QR Verify Lookup */}
        <div className="glass-liquid-card-emerald p-4 rounded-[14px] space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <QrCode className="w-5 h-5 text-emerald-700 shrink-0" />
            <span className="text-xs font-bold text-slate-800">
              {tr(language, "Tra cứu xác minh mã chứng chỉ:", "Verify certificate code:")}
            </span>
            <input
              type="text"
              value={verifyInput}
              onChange={(e) => setVerifyInput(e.target.value)}
              className="flex-1 px-3 py-1.5 rounded-[14px] bg-white border border-emerald-200 text-xs font-bold"
              placeholder={tr(language, "Nhập mã xác minh (VD: EDU-REACT-2026-8841)", "Enter verify code (e.g. EDU-REACT-2026-8841)")}
            />
          </div>
          {matchedCert ? (
            <div className="bg-white/90 p-3 rounded-[14px] flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-800 font-bold">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                {tr(language, "Hợp lệ:", "Valid:")} {matchedCert.userName} — {matchedCert.courseTitle} ({matchedCert.verifyCode})
              </div>
              <span className="uppercase font-bold text-[10px] px-2 py-0.5 rounded-[14px] bg-emerald-100 text-emerald-800">
                {matchedCert.status}
              </span>
            </div>
          ) : (
            <p className="text-xs text-slate-600">{tr(language, "Không tìm thấy mã chứng chỉ khớp.", "No matching certificate found.")}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certificates.map((cert) => (
            <div key={cert.id} className="glass-liquid-card p-4 sm:p-5 rounded-[14px] flex flex-col justify-between gap-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-500">
                    {tr(language, "Chứng chỉ hoàn thành", "Certificate of Completion")}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">{cert.courseTitle}</h3>
                  <p className="text-xs text-slate-600 mt-1">
                    {tr(language, "Học viên:", "Recipient:")} <span className="font-bold">{cert.userName}</span>
                  </p>
                  <p className="text-[11px] font-mono text-[#0d6efd] mt-1">Verify: {cert.verifyCode}</p>
                </div>
                <img src="/09_certificate_thumbnail.png" alt="Cert" className="w-16 h-16 rounded-[14px] object-contain bg-white/80 p-1 shrink-0" />
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-200/70">
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-[14px] uppercase ${
                    cert.status === "valid" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {cert.status}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 rounded-[14px] bg-[#0d6efd] text-white text-xs font-bold cursor-pointer"
                  >
                    {tr(language, "In / Tải PDF", "Print / PDF")}
                  </button>
                  {hasPermission(activeRole, "certificates", "delete") && cert.status === "valid" && (
                    <button
                      onClick={() => revokeCertificate(cert.id)}
                      className="px-3 py-1.5 rounded-[14px] bg-red-50 text-red-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" /> {tr(language, "Thu hồi", "Revoke")}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // gamification
  const sortedLeaderboard = [...users].sort((a, b) => b.xp - a.xp);
  return (
    <div className="space-y-5 pb-8">
      <div className="glass-liquid-card-pink p-4 sm:p-5 rounded-[14px] flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900">
            {tr(language, "Gamification, Huy hiệu & Bảng xếp hạng", "Gamification, Badges & Leaderboard")}
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            {tr(language, "Tích lũy điểm kinh nghiệm XP, chuỗi ngày học liên tiếp (Streak) và thi đua theo bảng xếp hạng.", "Earn XP, maintain study streaks, and climb the organization leaderboard.")}
          </p>
        </div>
        <Trophy className="w-6 h-6 text-pink-600 shrink-0" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-liquid-card-blue p-4 rounded-[14px]">
          <p className="text-xs text-slate-600">{tr(language, "Điểm XP hiện tại", "Current XP")}</p>
          <p className="text-2xl font-bold text-[#0d6efd] mt-1">{currentProfile.xp} XP</p>
        </div>
        <div className="glass-liquid-card-orange p-4 rounded-[14px]">
          <p className="text-xs text-slate-600">{tr(language, "Chuỗi ngày học (Streak)", "Study Streak")}</p>
          <p className="text-2xl font-bold text-[#f97316] mt-1 flex items-center gap-1.5">
            <Flame className="w-5 h-5" /> 14 {tr(language, "ngày", "days")}
          </p>
        </div>
        <div className="glass-liquid-card-emerald p-4 rounded-[14px]">
          <p className="text-xs text-slate-600">{tr(language, "Cấp bậc", "Level")}</p>
          <p className="text-2xl font-bold text-emerald-700 mt-1">Level {currentProfile.level}</p>
        </div>
      </div>

      <div className="glass-liquid-card p-4 sm:p-5 rounded-[14px] space-y-3">
        <h3 className="text-sm font-bold text-slate-900">
          {tr(language, "Bảng xếp hạng Học viên & Chuyên gia", "Learners & Experts Leaderboard")}
        </h3>
        <div className="space-y-2">
          {sortedLeaderboard.map((u, idx) => (
            <div key={u.uid} className="p-3 rounded-[14px] bg-white/80 flex items-center justify-between gap-2">
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-7 h-7 rounded-[14px] bg-[#0d6efd]/10 text-[#0d6efd] font-bold text-xs flex items-center justify-center shrink-0">
                  #{idx + 1}
                </span>
                <img src={u.avatar} alt={u.displayName} className="w-8 h-8 rounded-[14px] object-cover shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">{u.displayName}</p>
                  <p className="text-[10px] text-slate-500 uppercase truncate">{u.role}</p>
                </div>
              </div>
              <span className="text-xs font-bold text-[#0d6efd] shrink-0">{u.xp} XP • Lv.{u.level}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
