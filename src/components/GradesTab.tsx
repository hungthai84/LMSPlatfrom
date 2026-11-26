import React, { useState } from "react";
import {
  Award, Save, Edit2, ClipboardCheck,
  X, BrainCircuit, MessageSquare
} from "lucide-react";
import { ClassItem, Classwork, Submission, UserProfile } from "../types";
import { useLms } from "../contexts/LmsContext";
import { tr } from "../i18n/translations";

interface GradesTabProps {
  classItem: ClassItem;
  activeUser: UserProfile;
  classwork: Classwork[];
  submissions: Submission[];
  allUsers: UserProfile[];
  onGradeSubmission: (subId: string, grade: number, feedback: string) => void;
}

export default function GradesTab({
  classItem,
  activeUser,
  classwork,
  submissions,
  allUsers,
  onGradeSubmission
}: GradesTabProps) {
  const { language } = useLms();
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);
  const [editGrade, setEditGrade] = useState<number | "">("");
  const [editFeedback, setEditFeedback] = useState("");

  const gradableItems = classwork.filter(
    (cw) => cw.classId === classItem.id && cw.type !== "material"
  );

  const classStudents = allUsers.filter((u) => classItem.students.includes(u.id));

  const handleOpenGradingModal = (sub: Submission) => {
    setSelectedSub(sub);
    setEditGrade(sub.grade !== undefined ? sub.grade : (sub.quizScore !== undefined ? sub.quizScore : ""));
    setEditFeedback(sub.feedback || "");
  };

  const handleSaveGrade = () => {
    if (!selectedSub) return;
    const finalGrade = Number(editGrade);
    const cw = gradableItems.find((c) => c.id === selectedSub.classworkId);
    const maxPoints = cw?.points || 100;

    if (isNaN(finalGrade) || finalGrade < 0 || finalGrade > maxPoints) {
      alert(tr(language, `Vui lòng nhập điểm số hợp lệ trong khoảng từ 0 đến ${maxPoints}`, `Please enter a valid score between 0 and ${maxPoints}`));
      return;
    }

    onGradeSubmission(selectedSub.id, finalGrade, editFeedback.trim());
    setSelectedSub(null);
  };

  const renderTeacherView = () => {
    if (gradableItems.length === 0) {
      return (
        <div className="glass-liquid-card text-center py-12 rounded-[14px] border border-white/60">
          <Award className="h-12 w-12 text-slate-300 mx-auto mb-2" />
          <p className="text-sm text-slate-600 font-medium">{tr(language, "Chưa có bài trắc nghiệm hay bài tập tính điểm nào", "No graded assignments or quizzes yet")}</p>
          <p className="text-xs text-slate-400">{tr(language, "Hãy tạo một Bài tập hoặc Bài kiểm tra mới ở mục Bài tập trên lớp.", "Create a new Assignment or Quiz in the Classwork tab.")}</p>
        </div>
      );
    }

    return (
      <div className="glass-liquid-card rounded-[14px] border border-white/60 overflow-hidden shadow-sm">
        <div className="p-4 bg-white/50 border-b border-white/60 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-slate-800 text-sm">{tr(language, "Bảng điểm lớp học", "Class Gradebook")}</h3>
            <p className="text-xs text-slate-500">{tr(language, "Xem danh sách bài tập đã giao và thực hiện chấm điểm nhanh.", "Review assigned work and grade submissions quickly.")}</p>
          </div>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-[14px] border border-blue-100">
            {tr(language, "Chế độ: Giáo viên", "Mode: Instructor")}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/60 bg-white/40 text-[10px] uppercase font-bold text-slate-500 tracking-wider select-none">
                <th className="p-4 min-w-[180px]">{tr(language, "Học viên", "Student")}</th>
                {gradableItems.map((cw) => (
                  <th key={cw.id} className="p-4 min-w-[150px] border-l border-white/50">
                    <p className="truncate max-w-[140px] font-bold text-slate-700" title={cw.title}>
                      {cw.title}
                    </p>
                    <p className="text-[9px] text-slate-400 mt-0.5 normal-case font-medium">
                      {tr(language, "Tối đa:", "Max:")} {cw.points} {tr(language, "đ", "pts")} • {cw.type === "quiz" ? tr(language, "Kiểm tra", "Quiz") : tr(language, "Tự luận", "Written")}
                    </p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/50 text-xs">
              {classStudents.map((student) => (
                <tr key={student.id} className="hover:bg-white/40 transition-colors">
                  <td className="p-4 flex items-center gap-2.5">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="h-8 w-8 rounded-full object-cover border border-white"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 truncate">{student.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{student.email}</p>
                    </div>
                  </td>

                  {gradableItems.map((cw) => {
                    const sub = submissions.find(
                      (s) => s.classworkId === cw.id && s.studentId === student.id
                    );

                    return (
                      <td key={cw.id} className="p-4 border-l border-white/50 align-top">
                        {!sub ? (
                          <div className="text-slate-400 italic text-[10px] py-1">{tr(language, "Chưa nộp bài", "Missing")}</div>
                        ) : (
                          <div className="space-y-1">
                            {sub.status === "graded" ? (
                              <div>
                                <p className="text-sm font-bold text-emerald-700">
                                  {sub.grade} <span className="text-slate-400 text-xs">/ {cw.points}</span>
                                </p>
                                {sub.feedback && (
                                  <p className="text-[10px] text-slate-500 leading-tight italic line-clamp-2 mt-0.5" title={sub.feedback}>
                                    "{sub.feedback}"
                                  </p>
                                )}
                              </div>
                            ) : (
                              <div>
                                <span className="inline-block rounded-[14px] bg-blue-50 px-2.5 py-0.5 text-[9px] font-bold text-blue-700 border border-blue-100">
                                  {tr(language, "Chờ chấm", "Pending")} {sub.quizScore !== undefined && `(${sub.quizScore} quiz)`}
                                </span>
                                <p className="text-[10px] text-slate-400 truncate max-w-[130px] mt-1 italic" title={sub.content}>
                                  {sub.content}
                                </p>
                              </div>
                            )}

                            <button
                              onClick={() => handleOpenGradingModal(sub)}
                              className="mt-1 flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                            >
                              <Edit2 className="h-2.5 w-2.5" />
                              {sub.status === "graded" ? tr(language, "Sửa điểm", "Edit grade") : tr(language, "Chấm điểm", "Grade")}
                            </button>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderStudentView = () => {
    const mySubmissions = submissions.filter((s) => s.studentId === activeUser.id);
    const gradedSubmissions = mySubmissions.filter((s) => s.status === "graded");

    const averageGrade =
      gradedSubmissions.length === 0
        ? "N/A"
        : (
            (gradedSubmissions.reduce((sum, s) => sum + (s.grade || 0), 0) /
              gradedSubmissions.reduce((sum, s) => {
                const cw = gradableItems.find((c) => c.id === s.classworkId);
                return sum + (cw?.points || 100);
              }, 0)) *
            100
          ).toFixed(1) + "%";

    return (
      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="glass-liquid-card-blue rounded-[14px] border border-white/60 p-5 shadow-sm flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-blue-50 text-blue-600 border border-blue-100">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{tr(language, "Điểm số trung bình", "Average grade")}</p>
              <h4 className="text-xl font-extrabold text-slate-800 mt-0.5">{averageGrade}</h4>
            </div>
          </div>
          <div className="glass-liquid-card-emerald rounded-[14px] border border-white/60 p-5 shadow-sm flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-emerald-50 text-emerald-600 border border-emerald-100">
              <ClipboardCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{tr(language, "Bài thi hoàn thành", "Completed work")}</p>
              <h4 className="text-xl font-extrabold text-slate-800 mt-0.5">
                {mySubmissions.length} <span className="text-xs text-slate-400 font-normal">/ {gradableItems.length} {tr(language, "đã giao", "assigned")}</span>
              </h4>
            </div>
          </div>
        </div>

        <div className="glass-liquid-card rounded-[14px] border border-white/60 overflow-hidden shadow-sm">
          <div className="p-4 bg-white/50 border-b border-white/60">
            <h3 className="font-bold text-slate-800 text-sm">{tr(language, "Phiếu điểm cá nhân của bạn", "Your Personal Grade Report")}</h3>
            <p className="text-xs text-slate-400">{tr(language, "Danh sách kết quả các bài kiểm tra đã nộp.", "Scores and feedback for submitted assignments.")}</p>
          </div>

          {gradableItems.length === 0 ? (
            <div className="text-center py-10 text-slate-500">{tr(language, "Không có bài tập hay bài trắc nghiệm nào.", "No assignments or quizzes found.")}</div>
          ) : (
            <div className="divide-y divide-white/50">
              {gradableItems.map((cw) => {
                const sub = mySubmissions.find((s) => s.classworkId === cw.id);

                return (
                  <div key={cw.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-800 truncate">{cw.title}</h4>
                        <span className="text-[9px] bg-white/80 text-slate-500 px-2 py-0.5 rounded-[14px] font-bold uppercase shrink-0 border border-slate-200">
                          {cw.type === "quiz" ? tr(language, "Kiểm tra", "Quiz") : tr(language, "Bài nộp", "Assignment")}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 font-medium">
                        {tr(language, "Hạn nộp:", "Due:")} {cw.dueDate ? new Date(cw.dueDate).toLocaleDateString(language === "vi" ? "vi-VN" : "en-US") : tr(language, "Không có", "None")}
                      </p>
                      {sub && sub.feedback && (
                        <div className="mt-2.5 rounded-[14px] bg-white/70 p-3 text-xs italic text-slate-600 border border-white/70 flex items-start gap-2">
                          <MessageSquare className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-[10px] text-slate-500 uppercase tracking-wide not-italic block mb-0.5">
                              {tr(language, "Nhận xét từ giáo viên:", "Teacher feedback:")}
                            </span>
                            "{sub.feedback}"
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="shrink-0 flex items-center gap-3">
                      {!sub ? (
                        <span className="rounded-[14px] bg-red-50 border border-red-100 text-red-600 px-2.5 py-1 text-xs font-semibold">
                          {tr(language, "Chưa nộp bài", "Missing")}
                        </span>
                      ) : sub.status === "turned-in" ? (
                        <span className="rounded-[14px] bg-blue-50 border border-blue-100 text-blue-600 px-2.5 py-1 text-xs font-semibold">
                          {tr(language, "Đã nộp (Chờ chấm)", "Turned in")}
                        </span>
                      ) : (
                        <div className="text-right">
                          <p className="text-base font-extrabold text-emerald-600 leading-none">
                            {sub.grade} <span className="text-slate-400 text-xs font-normal">/ {cw.points}</span>
                          </p>
                          <span className="text-[9px] text-emerald-500 font-bold uppercase mt-1 inline-block">{tr(language, "Đã chấm điểm", "Graded")}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-4xl px-2 sm:px-4 py-4 sm:py-6">
      {activeUser.role === "teacher" ? renderTeacherView() : renderStudentView()}

      {selectedSub && (() => {
        const cw = gradableItems.find((c) => c.id === selectedSub.classworkId);
        const student = classStudents.find((u) => u.id === selectedSub.studentId);
        if (!cw || !student) return null;

        return (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
            <div className="glass-liquid-card rounded-[14px] shadow-2xl border border-white/60 w-full max-w-2xl overflow-hidden flex flex-col max-h-[85dvh]">
              <div className="bg-slate-900 text-white p-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <img src={student.avatar} className="w-9 h-9 rounded-full object-cover border border-white/25 shadow-sm shrink-0" referrerPolicy="no-referrer" />
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-white leading-tight truncate">{tr(language, "Chấm bài:", "Grading:")} {student.name}</h3>
                    <p className="text-[11px] text-slate-300 truncate mt-0.5">{cw.title}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedSub(null)}
                  className="p-1.5 rounded-[14px] text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 sm:p-5 overflow-y-auto space-y-5 flex-1">
                {cw.type === "quiz" ? (
                  <div className="space-y-4">
                    <div className="bg-amber-50 rounded-[14px] p-3 border border-amber-200 flex items-center gap-3">
                      <BrainCircuit className="w-5 h-5 text-amber-600 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-amber-900">{tr(language, "Chi tiết kết quả làm trắc nghiệm", "Quiz auto-grading breakdown")}</p>
                        <p className="text-[11px] text-amber-700 mt-0.5">
                          {tr(language, "Điểm khách quan tự động chấm:", "Objective score:")} <strong className="text-sm font-black">{selectedSub.quizScore}</strong> / {cw.points}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {cw.quizQuestions?.map((q, idx) => {
                        const studentAns = selectedSub.quizAnswers?.[q.id];
                        let isCorrect = false;
                        if (q.type === "choice" || q.type === "true-false") {
                          isCorrect = studentAns !== undefined && Number(studentAns) === q.correctOptionIndex;
                        }

                        return (
                          <div key={q.id} className="p-3.5 bg-white/80 border border-white/70 rounded-[14px] shadow-sm space-y-2">
                            <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-1.5">
                              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                                {tr(language, "Câu", "Q")} {idx + 1} • {q.type === "choice" ? tr(language, "Trắc nghiệm", "Choice") : q.type === "true-false" ? tr(language, "Đúng/Sai", "True/False") : tr(language, "Tự luận", "Essay")}
                              </span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-[14px] ${
                                q.type === "essay"
                                  ? "bg-slate-100 text-slate-700"
                                  : isCorrect
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : "bg-red-50 text-red-600 border border-red-200"
                              }`}>
                                {q.type === "essay" ? tr(language, "Chờ chấm", "Manual") : isCorrect ? `+${q.points}` : `0 / ${q.points}`}
                              </span>
                            </div>

                            <p className="text-xs font-semibold text-slate-800 leading-normal">{q.questionText}</p>

                            {(q.type === "choice" || q.type === "true-false") && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                                <div className="bg-slate-50 p-2 rounded-[14px]">
                                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">{tr(language, "Đáp án đúng", "Correct answer")}</p>
                                  <p className="font-bold text-slate-700 mt-0.5">{q.options?.[q.correctOptionIndex]}</p>
                                </div>
                                <div className={`p-2 rounded-[14px] ${isCorrect ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"}`}>
                                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">{tr(language, "Học sinh chọn", "Student answer")}</p>
                                  <p className="font-bold mt-0.5">
                                    {studentAns !== undefined ? q.options?.[Number(studentAns)] : tr(language, "Không trả lời", "No answer")}
                                  </p>
                                </div>
                              </div>
                            )}

                            {q.type === "essay" && (
                              <div className="bg-slate-50 p-3 rounded-[14px] border border-slate-100 text-xs">
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">{tr(language, "Bài làm tự luận", "Essay response")}</p>
                                <p className="mt-1 text-slate-700 leading-relaxed font-mono whitespace-pre-wrap">{studentAns || tr(language, "Không có bài nộp.", "No submission.")}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">{tr(language, "Nội dung bài nộp", "Submission Content")}</h4>
                    <div className="bg-white/80 rounded-[14px] border border-white/70 p-4 font-mono text-xs text-slate-700 whitespace-pre-wrap max-h-72 overflow-y-auto shadow-sm leading-relaxed">
                      {selectedSub.content}
                    </div>
                  </div>
                )}

                <div className="bg-white/80 rounded-[14px] border border-white/70 p-4 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      {tr(language, `Điểm (Tối đa ${cw.points})`, `Score (Max ${cw.points})`)}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max={cw.points}
                        value={editGrade}
                        onChange={(e) => setEditGrade(e.target.value === "" ? "" : Number(e.target.value))}
                        placeholder="0"
                        className="w-full rounded-[14px] border border-slate-200 p-2.5 font-bold text-base text-slate-800 outline-none focus:border-blue-500 bg-white"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-semibold select-none">
                        / {cw.points}
                      </span>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      {tr(language, "Lời phê / Nhận xét", "Teacher Feedback")}
                    </label>
                    <textarea
                      value={editFeedback}
                      onChange={(e) => setEditFeedback(e.target.value)}
                      placeholder={tr(language, "Bài làm tốt, chú ý ôn lại...", "Good work, remember to review...")}
                      className="w-full h-[48px] rounded-[14px] border border-slate-200 p-2.5 text-xs outline-none focus:border-blue-500 resize-none bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white/60 border-t border-white/60 flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setSelectedSub(null)}
                  className="px-4 py-2 rounded-[14px] text-xs font-bold text-slate-600 hover:bg-white/80 transition-colors"
                >
                  {tr(language, "Hủy bỏ", "Cancel")}
                </button>
                <button
                  onClick={handleSaveGrade}
                  className="px-5 py-2 rounded-[14px] bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  {tr(language, "Hoàn tất chấm điểm", "Save Grade")}
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
