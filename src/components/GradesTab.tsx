import React, { useState } from "react";
import { 
  Award, CheckCircle, HelpCircle, Save, Edit2, ClipboardCheck, 
  X, Check, AlertCircle, FileText, BrainCircuit, MessageSquare 
} from "lucide-react";
import { ClassItem, Classwork, Submission, UserProfile } from "../types";

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
  // Grading Modal State
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);
  const [editGrade, setEditGrade] = useState<number | "">("");
  const [editFeedback, setEditFeedback] = useState("");

  // Get only gradable items (assignments/questions/quizzes)
  const gradableItems = classwork.filter(
    (cw) => cw.classId === classItem.id && cw.type !== "material"
  );

  // Get students of this class
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
      alert(`Vui lòng nhập điểm số hợp lệ trong khoảng từ 0 đến ${maxPoints}`);
      return;
    }

    onGradeSubmission(selectedSub.id, finalGrade, editFeedback.trim());
    setSelectedSub(null);
  };

  // --- TEACHER VIEW ---
  const renderTeacherView = () => {
    if (gradableItems.length === 0) {
      return (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Award className="h-12 w-12 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500 font-medium">Chưa có bài trắc nghiệm hay bài tập tính điểm nào</p>
          <p className="text-xs text-gray-400">Hãy tạo một Bài tập hoặc Bài kiểm tra mới ở mục Bài tập trên lớp.</p>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl border border-[#dadce0] overflow-hidden shadow-sm">
        <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-800 text-sm">Bảng điểm lớp học</h3>
            <p className="text-xs text-gray-400">Xem danh sách bài tập đã giao và thực hiện chấm điểm nhanh.</p>
          </div>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
            Chế độ: Giáo viên
          </span>
        </div>

        {/* Grades Grid Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-[10px] uppercase font-bold text-gray-500 tracking-wider select-none">
                <th className="p-4 min-w-[180px]">Học viên</th>
                {gradableItems.map((cw) => (
                  <th key={cw.id} className="p-4 min-w-[150px] border-l border-gray-100">
                    <p className="truncate max-w-[140px] font-bold text-gray-700" title={cw.title}>
                      {cw.title}
                    </p>
                    <p className="text-[9px] text-gray-400 mt-0.5 normal-case font-medium">
                      Tối đa: {cw.points}đ • {cw.type === "quiz" ? "Kiểm tra" : "Tự luận"}
                    </p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {classStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50/40 transition-colors">
                  <td className="p-4 flex items-center gap-2.5">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="h-8 w-8 rounded-full object-cover border border-gray-100"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-gray-800 truncate">{student.name}</p>
                      <p className="text-[10px] text-gray-400 truncate">{student.email}</p>
                    </div>
                  </td>

                  {gradableItems.map((cw) => {
                    const sub = submissions.find(
                      (s) => s.classworkId === cw.id && s.studentId === student.id
                    );

                    return (
                      <td key={cw.id} className="p-4 border-l border-gray-100 align-top">
                        {!sub ? (
                          <div className="text-gray-450 italic text-[10px] py-1">Chưa nộp bài</div>
                        ) : (
                          <div className="space-y-1">
                            {sub.status === "graded" ? (
                              <div>
                                <p className="text-sm font-bold text-green-700">
                                  {sub.grade} <span className="text-gray-400 text-xs">/ {cw.points}đ</span>
                                </p>
                                {sub.feedback && (
                                  <p className="text-[10px] text-gray-500 leading-tight italic line-clamp-2 mt-0.5" title={sub.feedback}>
                                    "{sub.feedback}"
                                  </p>
                                )}
                              </div>
                            ) : (
                              <div>
                                <span className="inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-[9px] font-bold text-blue-700 border border-blue-100">
                                  Chờ chấm {sub.quizScore !== undefined && `(${sub.quizScore}đ trắc nghiệm)`}
                                </span>
                                <p className="text-[10px] text-gray-400 truncate max-w-[130px] mt-1 italic" title={sub.content}>
                                  {sub.content}
                                </p>
                              </div>
                            )}

                            <button
                              onClick={() => handleOpenGradingModal(sub)}
                              className="mt-1 flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                            >
                              <Edit2 className="h-2.5 w-2.5" />
                              {sub.status === "graded" ? "Sửa điểm" : "Chấm điểm"}
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

  // --- STUDENT VIEW ---
  const renderStudentView = () => {
    // Get student's submissions
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
      <div className="space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-[#dadce0] bg-white p-5 shadow-sm flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 border border-blue-100">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Điểm số trung bình</p>
              <h4 className="text-xl font-extrabold text-gray-800 mt-0.5">{averageGrade}</h4>
            </div>
          </div>
          <div className="rounded-xl border border-[#dadce0] bg-white p-5 shadow-sm flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-600 border border-green-100">
              <ClipboardCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Bài thi hoàn thành</p>
              <h4 className="text-xl font-extrabold text-gray-800 mt-0.5">
                {mySubmissions.length} <span className="text-xs text-gray-400 font-normal">/ {gradableItems.length} đã giao</span>
              </h4>
            </div>
          </div>
        </div>

        {/* Detailed Grade Report list */}
        <div className="rounded-xl border border-[#dadce0] bg-white overflow-hidden shadow-sm">
          <div className="p-4 bg-gray-50 border-b border-gray-100">
            <h3 className="font-bold text-gray-800 text-sm">Phiếu điểm cá nhân của bạn</h3>
            <p className="text-xs text-gray-400">Danh sách kết quả các bài kiểm tra đã nộp.</p>
          </div>

          {gradableItems.length === 0 ? (
            <div className="text-center py-10 text-gray-500">Không có bài tập hay bài trắc nghiệm nào.</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {gradableItems.map((cw) => {
                const sub = mySubmissions.find((s) => s.classworkId === cw.id);

                return (
                  <div key={cw.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-gray-800 truncate">{cw.title}</h4>
                        <span className="text-[9px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-bold uppercase shrink-0">
                          {cw.type === "quiz" ? "Kiểm tra" : "Bài nộp"}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1 font-medium">
                        Hạn nộp: {cw.dueDate ? new Date(cw.dueDate).toLocaleDateString("vi-VN") : "Không có"}
                      </p>
                      {sub && sub.feedback && (
                        <div className="mt-2.5 rounded-lg bg-gray-50 p-3 text-xs italic text-gray-600 border border-gray-100 flex items-start gap-2">
                          <MessageSquare className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-[10px] text-gray-500 uppercase tracking-wide not-italic block mb-0.5">
                              Nhận xét từ giáo viên:
                            </span>
                            "{sub.feedback}"
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="shrink-0 flex items-center gap-3">
                      {!sub ? (
                        <span className="rounded bg-red-50 border border-red-100 text-red-600 px-2.5 py-1 text-xs font-semibold">
                          Chưa nộp bài
                        </span>
                      ) : sub.status === "turned-in" ? (
                        <span className="rounded bg-blue-50 border border-blue-100 text-blue-600 px-2.5 py-1 text-xs font-semibold">
                          Đã nộp (Chờ chấm)
                        </span>
                      ) : (
                        <div className="text-right">
                          <p className="text-base font-extrabold text-green-600 leading-none">
                            {sub.grade} <span className="text-gray-400 text-xs font-normal">/ {cw.points}đ</span>
                          </p>
                          <span className="text-[9px] text-green-500 font-bold uppercase mt-1 inline-block">Đã chấm điểm</span>
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
    <div className="mx-auto max-w-4xl px-4 py-8">
      {activeUser.role === "teacher" ? renderTeacherView() : renderStudentView()}

      {/* --- ELITE GRADING WORKSPACE MODAL --- */}
      {selectedSub && (() => {
        const cw = gradableItems.find((c) => c.id === selectedSub.classworkId);
        const student = classStudents.find((u) => u.id === selectedSub.studentId);
        if (!cw || !student) return null;

        return (
          <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="bg-slate-900 text-white p-4.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={student.avatar} className="w-9 h-9 rounded-full object-cover border border-white/25 shadow-sm" referrerPolicy="no-referrer" />
                  <div>
                    <h3 className="font-bold text-sm text-white leading-tight">Chấm bài: {student.name}</h3>
                    <p className="text-[11px] text-slate-350 truncate mt-0.5 max-w-[400px]">Bài thi: {cw.title}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedSub(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="p-5 overflow-y-auto space-y-5 flex-1 bg-slate-50/50">
                
                {/* QUIZ SCORECARD DETAIL */}
                {cw.type === "quiz" ? (
                  <div className="space-y-4">
                    <div className="bg-amber-50 rounded-xl p-3 border border-amber-200 flex items-center gap-3">
                      <BrainCircuit className="w-5 h-5 text-amber-600 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-amber-900">Chi tiết kết quả làm trắc nghiệm của học sinh</p>
                        <p className="text-[11px] text-amber-700 mt-0.5">
                          Điểm số các câu hỏi khách quan được tự động chấm: <strong className="text-sm font-black">{selectedSub.quizScore}đ</strong> / {cw.points}đ
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
                          <div key={q.id} className="p-3.5 bg-white border border-gray-200 rounded-xl shadow-sm space-y-2">
                            <div className="flex items-center justify-between gap-2 border-b border-gray-50 pb-1.5">
                              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                                Câu {idx + 1} • {q.type === "choice" ? "Trắc nghiệm" : q.type === "true-false" ? "Đúng/Sai" : "Tự luận"}
                              </span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                q.type === "essay" 
                                  ? "bg-slate-100 text-slate-700" 
                                  : isCorrect 
                                    ? "bg-green-50 text-green-700 border border-green-200" 
                                    : "bg-red-50 text-red-600 border border-red-200"
                              }`}>
                                {q.type === "essay" ? "Chờ cô chấm" : isCorrect ? `Đúng (+${q.points}đ)` : `Sai (0 / ${q.points}đ)`}
                              </span>
                            </div>

                            <p className="text-xs font-semibold text-gray-800 leading-normal">{q.questionText}</p>

                            {/* choice & true-false answer comparisons */}
                            {(q.type === "choice" || q.type === "true-false") && (
                              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                                <div className="bg-slate-50 p-2 rounded">
                                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Đáp án đúng</p>
                                  <p className="font-bold text-gray-700 mt-0.5">{q.options?.[q.correctOptionIndex]}</p>
                                </div>
                                <div className={`p-2 rounded ${isCorrect ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
                                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Học sinh chọn</p>
                                  <p className="font-bold mt-0.5">
                                    {studentAns !== undefined ? q.options?.[Number(studentAns)] : "Không trả lời"}
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* essay question responses */}
                            {q.type === "essay" && (
                              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs">
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Bài làm tự luận của học sinh</p>
                                <p className="mt-1 text-gray-700 leading-relaxed font-mono whitespace-pre-wrap">{studentAns || "Không có bài nộp tự luận."}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  /* STANDARD SUBMISSION PREVIEW */
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nội dung bài nộp</h4>
                    <div className="bg-white rounded-xl border border-gray-200 p-4 font-mono text-xs text-gray-700 whitespace-pre-wrap max-h-72 overflow-y-auto shadow-sm leading-relaxed">
                      {selectedSub.content}
                    </div>
                  </div>
                )}

                {/* GRADING ACTION PANEL */}
                <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                      Điểm thi chính thức (Tối đa {cw.points}đ)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max={cw.points}
                        value={editGrade}
                        onChange={(e) => setEditGrade(e.target.value === "" ? "" : Number(e.target.value))}
                        placeholder="Nhập số..."
                        className="w-full rounded-xl border border-gray-300 p-2.5 font-bold text-base text-gray-800 outline-none focus:border-blue-500 bg-white"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-semibold select-none">
                        / {cw.points}đ
                      </span>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                      Lời phê / Nhận xét của giáo viên
                    </label>
                    <textarea
                      value={editFeedback}
                      onChange={(e) => setEditFeedback(e.target.value)}
                      placeholder="Bài làm tốt, chú ý ôn lại hook useMemo..."
                      className="w-full h-[45px] sm:h-[48px] rounded-xl border border-gray-300 p-2.5 text-xs outline-none focus:border-blue-500 resize-none bg-white"
                    />
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setSelectedSub(null)}
                  className="px-4 py-2 rounded text-xs font-bold text-gray-500 hover:bg-gray-150 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleSaveGrade}
                  className="px-5 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  Hoàn tất chấm điểm
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
