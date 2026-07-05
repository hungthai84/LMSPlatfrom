import React, { useState } from "react";
import { 
  ClipboardList, BookOpen, HelpCircle, Plus, ChevronDown, ChevronUp, 
  Clock, Sparkles, FileText, Send, CheckCircle2, AlertCircle, Award,
  Trash2, PlusCircle, Check, BrainCircuit, Folder, FolderPlus, Link2, 
  Youtube, UploadCloud, Play, File, X, Save, FolderOpen, ExternalLink,
  ChevronRight, AlignLeft, Bold, Italic, Underline, List, RotateCcw, HelpCircle as HelpIcon,
  Paperclip
} from "lucide-react";
import { ClassItem, Classwork, UserProfile, Submission, QuizQuestion, Attachment } from "../types";

interface ClassworkTabProps {
  classItem: ClassItem;
  activeUser: UserProfile;
  classwork: Classwork[];
  submissions: Submission[];
  onCreateClasswork: (cw: Partial<Classwork>) => void;
  onSubmitWork: (
    classworkId: string, 
    content: string, 
    quizAnswers?: Record<string, string>, 
    quizScore?: number, 
    autoGrade?: boolean
  ) => void;
  onOpenGrading: (classworkId: string) => void;
  onOpenAiHelper: (classwork: Classwork) => void;
}

export default function ClassworkTab({
  classItem,
  activeUser,
  classwork,
  submissions,
  onCreateClasswork,
  onSubmitWork,
  onOpenGrading,
  onOpenAiHelper
}: ClassworkTabProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCreateDropdown, setShowCreateDropdown] = useState(false);
  const [showAddTopicModal, setShowAddTopicModal] = useState(false);
  const [newTopicName, setNewTopicName] = useState("");
  
  const [availableTopics, setAvailableTopics] = useState<string[]>([
    "Chương 1: Kiến thức nền tảng & Hooks",
    "Chương 2: Tối ưu hiệu năng & Context",
    "Chương 3: State Management nâng cao",
    "Chung / Khác"
  ]);

  // Creation form states
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newType, setNewType] = useState<"assignment" | "material" | "question" | "quiz">("assignment");
  const [newPoints, setNewPoints] = useState(100);
  const [newDueDate, setNewDueDate] = useState("");
  const [newTopic, setNewTopic] = useState("Chương 1: Kiến thức nền tảng & Hooks");
  const [isAiDrafting, setIsAiDrafting] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  // Attachment input states
  const [activeAttachType, setActiveAttachType] = useState<"link" | "file" | "youtube" | "drive" | null>(null);
  const [attachUrl, setAttachUrl] = useState("");
  const [attachName, setAttachName] = useState("");

  // Quiz Builder states
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [qType, setQType] = useState<"choice" | "true-false" | "essay">("choice");
  const [qText, setQText] = useState("");
  const [qOptions, setQOptions] = useState<string[]>(["", "", "", ""]);
  const [qCorrectIndex, setQCorrectIndex] = useState(0);
  const [qPoints, setQPoints] = useState(2);
  const [isAiQuizDrafting, setIsAiQuizDrafting] = useState(false);

  // Student quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [submitText, setSubmitText] = useState("");

  // Filter classwork for this class
  const classworkItems = classwork.filter((cw) => cw.classId === classItem.id);

  // Group classwork by topic including any custom created topics
  const topics = Array.from(new Set([...availableTopics, ...classworkItems.map((cw) => cw.topic || "Chung")]));

  const handleToggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
    setSubmitText(""); // Reset student input
    setQuizAnswers({}); // Reset student quiz answers
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    // Sum up quiz points automatically
    const finalPoints = newType === "quiz" 
      ? quizQuestions.reduce((sum, q) => sum + q.points, 0)
      : newPoints;

    onCreateClasswork({
      classId: classItem.id,
      title: newTitle.trim(),
      description: newDesc.trim(),
      type: newType,
      points: newType !== "material" ? finalPoints : undefined,
      dueDate: newType !== "material" && newDueDate ? newDueDate : undefined,
      topic: newTopic.trim() || "Chung",
      createdAt: new Date().toISOString(),
      quizQuestions: newType === "quiz" ? quizQuestions : undefined,
      attachments: attachments
    });

    // Reset Form
    setNewTitle("");
    setNewDesc("");
    setNewType("assignment");
    setNewPoints(100);
    setNewDueDate("");
    setQuizQuestions([]);
    setAttachments([]);
    setActiveAttachType(null);
    setShowCreateModal(false);
  };

  // Call server-side Gemini API to generate classwork instructions/draft
  const handleAiDraftAssignment = async () => {
    if (!newTitle.trim()) {
      alert("Vui lòng nhập Tiêu đề trước để AI hiểu chủ đề bạn cần soạn.");
      return;
    }
    setIsAiDrafting(true);
    try {
      const response = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate-assignment",
          context: { topic: newTitle }
        })
      });
      const data = await response.json();
      if (data.text) {
        setNewDesc(data.text);
      } else if (data.error) {
        alert("Lỗi AI: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Đã xảy ra lỗi khi soạn đề bằng AI.");
    } finally {
      setIsAiDrafting(false);
    }
  };

  const handleInsertFormat = (formatType: "bold" | "italic" | "underline" | "list" | "clear") => {
    let textToInsert = "";
    if (formatType === "bold") textToInsert = " **văn bản bôi đậm** ";
    else if (formatType === "italic") textToInsert = " *văn bản in nghiêng* ";
    else if (formatType === "underline") textToInsert = " <u>văn bản gạch chân</u> ";
    else if (formatType === "list") textToInsert = "\n- Mục danh sách 1\n- Mục danh sách 2";
    else if (formatType === "clear") {
      setNewDesc("");
      return;
    }
    setNewDesc(prev => prev + textToInsert);
  };

  const handleAddAttachment = () => {
    if (!attachName.trim()) {
      alert("Vui lòng nhập tên tài liệu đính kèm.");
      return;
    }
    const finalUrl = attachUrl.trim() || "#";
    setAttachments([...attachments, {
      type: activeAttachType || "link",
      name: attachName.trim(),
      url: finalUrl
    }]);
    
    // Clear
    setAttachUrl("");
    setAttachName("");
    setActiveAttachType(null);
  };

  // One-click AI Quiz Generation using Gemini
  const handleAiGenerateQuiz = async () => {
    if (!newTitle.trim()) {
      alert("Vui lòng nhập Tiêu đề bài viết để AI định hướng soạn thảo bộ câu hỏi phù hợp.");
      return;
    }
    setIsAiQuizDrafting(true);
    try {
      const response = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate-quiz",
          context: { topic: newTitle }
        })
      });
      const data = await response.json();
      if (data.text) {
        try {
          let cleanJson = data.text.trim();
          if (cleanJson.startsWith("```json")) {
            cleanJson = cleanJson.substring(7);
          }
          if (cleanJson.endsWith("```")) {
            cleanJson = cleanJson.substring(0, cleanJson.length - 3);
          }
          cleanJson = cleanJson.trim();
          
          const parsed = JSON.parse(cleanJson);
          if (Array.isArray(parsed)) {
            const formatted = parsed.map((q: any, index: number) => ({
              id: `ai-q-${Date.now()}-${index}`,
              type: q.type || "choice",
              questionText: q.questionText || "Nội dung câu hỏi mẫu?",
              options: q.options || (q.type === "true-false" ? ["Đúng", "Sai"] : []),
              correctOptionIndex: q.correctOptionIndex !== undefined ? q.correctOptionIndex : 0,
              points: q.points || 2
            }));
            setQuizQuestions(formatted);
            // Sum points
            const totalP = formatted.reduce((sum, q) => sum + q.points, 0);
            setNewPoints(totalP);
          } else {
            alert("Dữ liệu AI trả về không đúng định dạng mảng mẫu.");
          }
        } catch (parseErr) {
          console.error("Parse JSON error", parseErr, data.text);
          alert("Lỗi đồng bộ cấu trúc câu hỏi AI. Vui lòng thử lại bằng cách ấn lại nút AI.");
        }
      } else if (data.error) {
        alert("Lỗi AI: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Không kết nối được server AI soạn trắc nghiệm.");
    } finally {
      setIsAiQuizDrafting(false);
    }
  };

  const handleAddQuestionManual = () => {
    if (!qText.trim()) return;
    
    const newQ: QuizQuestion = {
      id: `manual-q-${Date.now()}`,
      type: qType,
      questionText: qText.trim(),
      options: qType === "choice" 
        ? qOptions.map(o => o.trim() || "Phương án") 
        : (qType === "true-false" ? ["Đúng", "Sai"] : []),
      correctOptionIndex: qCorrectIndex,
      points: qPoints
    };

    setQuizQuestions([...quizQuestions, newQ]);
    
    // Clear state
    setQText("");
    setQOptions(["", "", "", ""]);
    setQCorrectIndex(0);
    setQPoints(2);
    setShowAddQuestion(false);
  };

  const handleWorkSubmit = (cwId: string) => {
    if (!submitText.trim()) return;
    onSubmitWork(cwId, submitText.trim());
    setSubmitText("");
  };

  const handleQuizSubmit = (cw: Classwork) => {
    const questions = cw.quizQuestions || [];
    let objectiveScore = 0;
    
    // Auto-calculate score
    questions.forEach((q) => {
      const studentAns = quizAnswers[q.id];
      if (q.type === "choice" || q.type === "true-false") {
        if (studentAns !== undefined && Number(studentAns) === q.correctOptionIndex) {
          objectiveScore += q.points;
        }
      }
    });

    // Structure student summary content
    let summaryText = `--- KẾT QUẢ TRẮC NGHIỆM TỰ ĐỘNG ---\n`;
    questions.forEach((q, idx) => {
      const ans = quizAnswers[q.id] || "Không trả lời";
      if (q.type === "choice" || q.type === "true-false") {
        const isCorrect = Number(ans) === q.correctOptionIndex;
        const selectedText = q.options ? q.options[Number(ans)] : "N/A";
        summaryText += `Câu ${idx + 1}: ${q.questionText}\n=> Đã chọn: ${selectedText} (${isCorrect ? "ĐÚNG" : "SAI"})\n\n`;
      } else {
        summaryText += `Câu ${idx + 1} (Tự luận): ${q.questionText}\n=> Bài làm: ${ans}\n\n`;
      }
    });

    const hasEssay = questions.some(q => q.type === "essay");
    onSubmitWork(cw.id, summaryText, quizAnswers, objectiveScore, !hasEssay);
    setQuizAnswers({});
  };

  const renderIcon = (type: "assignment" | "material" | "question" | "quiz") => {
    switch (type) {
      case "assignment":
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <ClipboardList className="h-5 w-5" />
          </div>
        );
      case "material":
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
            <BookOpen className="h-5 w-5" />
          </div>
        );
      case "question":
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600">
            <HelpCircle className="h-5 w-5" />
          </div>
        );
      case "quiz":
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-700">
            <BrainCircuit className="h-5 w-5" />
          </div>
        );
    }
  };

  const translateType = (type: string) => {
    if (type === "assignment") return "Bài tập";
    if (type === "material") return "Tài liệu";
    if (type === "question") return "Hỏi nhanh";
    return "Trắc nghiệm & Tự luận";
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Top action header */}
      <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-blue-600" />
          Nội dung học tập
        </h2>
        {activeUser.role === "teacher" && (
          <div className="relative">
            <button
              onClick={() => setShowCreateDropdown(!showCreateDropdown)}
              className="flex items-center gap-2 rounded-full bg-[#1e88e5] px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-[#1565c0] active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4 stroke-[3px]" />
              Tạo
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {showCreateDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-20 cursor-default" 
                  onClick={() => setShowCreateDropdown(false)} 
                />
                <div className="absolute right-0 mt-2 w-64 rounded-xl border border-gray-200 bg-white py-1.5 shadow-xl z-30 animate-in fade-in slide-in-from-top-2 duration-150">
                  <button
                    onClick={() => {
                      setNewType("assignment");
                      setShowCreateModal(true);
                      setShowCreateDropdown(false);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <ClipboardList className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Bài tập</span>
                  </button>
                  <button
                    onClick={() => {
                      setNewType("quiz");
                      setShowCreateModal(true);
                      setShowCreateDropdown(false);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <BrainCircuit className="h-4 w-4 text-amber-600" />
                    <span className="font-medium">Bài kiểm tra</span>
                  </button>
                  <button
                    onClick={() => {
                      setNewType("question");
                      setShowCreateModal(true);
                      setShowCreateDropdown(false);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <HelpCircle className="h-4 w-4 text-purple-600" />
                    <span className="font-medium">Câu hỏi</span>
                  </button>
                  <button
                    onClick={() => {
                      setNewType("material");
                      setShowCreateModal(true);
                      setShowCreateDropdown(false);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <BookOpen className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Tài liệu</span>
                  </button>
                  
                  <div className="border-t border-gray-100 my-1.5"></div>
                  
                  <button
                    onClick={() => {
                      setShowCreateDropdown(false);
                      const prev = classworkItems[0];
                      if (prev) {
                        setNewTitle(prev.title);
                        setNewDesc(prev.description);
                        setNewType(prev.type);
                        setNewPoints(prev.points || 100);
                        setNewTopic(prev.topic || "Chung / Khác");
                        if (prev.quizQuestions) {
                          setQuizQuestions(prev.quizQuestions);
                        }
                        if (prev.attachments) {
                          setAttachments(prev.attachments);
                        }
                        setShowCreateModal(true);
                      } else {
                        alert("Chưa có bài đăng nào trước đó để tái sử dụng.");
                      }
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <RotateCcw className="h-4 w-4 text-teal-600" />
                    <span className="font-medium">Sử dụng lại bài đăng</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowCreateDropdown(false);
                      setShowAddTopicModal(true);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <FolderPlus className="h-4 w-4 text-pink-600" />
                    <span className="font-medium">Chủ đề</span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Main List grouped by topic */}
      {classworkItems.length === 0 ? (
        <div className="rounded-xl border border-[#dadce0] bg-white p-16 text-center text-gray-500 shadow-sm max-w-2xl mx-auto mt-10">
          <div className="flex justify-center mb-6">
            <svg className="w-56 h-36 text-gray-300" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="50" y="30" width="100" height="60" rx="4" fill="#e8eaed" stroke="#dadce0" strokeWidth="2" />
              <rect x="58" y="36" width="84" height="48" rx="2" fill="white" />
              <path d="M40 90H160C164 90 164 96 160 96H40C36 96 36 90 40 90Z" fill="#bdc1c6" />
              <rect x="92" y="90" width="16" height="4" fill="#9aa0a6" />
              <path d="M125 50 C125 40, 135 40, 135 50 C135 55, 145 55, 145 50 C145 40, 155 40, 155 50 L155 75 L125 75 Z" fill="#e8eaed" />
              <circle cx="132" cy="52" r="2" fill="#5f6368" />
              <circle cx="148" cy="52" r="2" fill="#5f6368" />
              <path d="M136 60 Q140 64 144 60" stroke="#5f6368" strokeWidth="1.5" strokeLinecap="round" />
              <rect x="18" y="42" width="24" height="30" rx="2" transform="rotate(-15 18 42)" fill="#dadce0" stroke="#9aa0a6" strokeWidth="1.5" />
              <line x1="24" y1="50" x2="36" y2="47" stroke="#bdc1c6" strokeWidth="2" transform="rotate(-15 24 50)" />
              <line x1="26" y1="56" x2="38" y2="53" stroke="#bdc1c6" strokeWidth="2" transform="rotate(-15 26 56)" />
              <path d="M165 25 L167 29 L171 31 L167 33 L165 37 L163 33 L159 31 L163 29 Z" fill="#fbbc05" />
              <path d="M35 15 L36.5 18 L39.5 19.5 L36.5 21 L35 24 L33.5 21 L30.5 19.5 L33.5 18 Z" fill="#4285f4" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-gray-800">Đây là nơi giao bài tập</h3>
          <p className="text-xs text-gray-400 mt-2 max-w-md mx-auto leading-relaxed">
            Bạn có thể thêm bài tập và các công việc khác cho lớp rồi sắp xếp thành các chủ đề
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {topics.map((topic) => {
            const topicItems = classworkItems.filter((cw) => (cw.topic || "Chung") === topic);
            return (
              <div key={topic} className="space-y-3">
                {/* Topic Header */}
                <h3 className="border-b border-[#1e88e5] pb-2 text-sm font-bold text-[#1e88e5] select-none flex items-center justify-between">
                  <span>{topic}</span>
                  {topicItems.length === 0 && (
                    <span className="text-[10px] font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Chủ đề trống</span>
                  )}
                </h3>

                {/* Items in Topic */}
                <div className="divide-y divide-gray-100 rounded-xl border border-[#dadce0] bg-white overflow-hidden shadow-sm">
                  {topicItems.length === 0 ? (
                    <div className="p-6 text-center text-xs text-gray-400 select-none">
                      Học viên sẽ thấy chủ đề này sau khi có bài đăng được thêm vào đây
                    </div>
                  ) : (
                    topicItems.map((cw) => {
                    const isExpanded = expandedId === cw.id;
                    const isGradable = cw.type !== "material";
                    
                    // For Teacher: calculate statuses
                    const itemSubmissions = submissions.filter((s) => s.classworkId === cw.id);
                    const turnedInCount = itemSubmissions.filter((s) => s.status === "turned-in").length;
                    const gradedCount = itemSubmissions.filter((s) => s.status === "graded").length;
                    const assignedCount = classItem.students.length - turnedInCount - gradedCount;

                    // For Student: find own submission
                    const mySubmission = submissions.find(
                      (s) => s.classworkId === cw.id && s.studentId === activeUser.id
                    );

                    return (
                      <div key={cw.id} className="transition-colors hover:bg-gray-50/50">
                        {/* Summary Header Row */}
                        <div
                          onClick={() => handleToggleExpand(cw.id)}
                          className="flex items-center justify-between p-4 cursor-pointer select-none"
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            {renderIcon(cw.type)}
                            <div className="min-w-0 flex-1">
                              <h4 className="text-sm font-semibold text-gray-800 hover:text-blue-600 truncate">
                                {cw.title}
                              </h4>
                              <div className="mt-1 flex items-center gap-3 text-[10px] text-gray-400 font-medium">
                                <span className="rounded bg-gray-100 px-1.5 py-0.5 text-gray-500 capitalize">
                                  {translateType(cw.type)}
                                </span>
                                {cw.dueDate && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    Hạn nộp: {new Date(cw.dueDate).toLocaleDateString("vi-VN")}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 ml-4 shrink-0">
                            {/* Student Badge Status */}
                            {activeUser.role === "student" && isGradable && (
                              <div>
                                {!mySubmission ? (
                                  <span className="flex items-center gap-1 rounded bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600 border border-red-100">
                                    <AlertCircle className="h-3.5 w-3.5" />
                                    Đã giao
                                  </span>
                                ) : mySubmission.status === "turned-in" ? (
                                  <span className="flex items-center gap-1 rounded bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600 border border-blue-100">
                                    <Send className="h-3.5 w-3.5" />
                                    Đã nộp (Đợi chấm)
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1 rounded bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-600 border border-green-100">
                                    <Award className="h-3.5 w-3.5" />
                                    Đạt {mySubmission.grade}/{cw.points} điểm
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Chevron Toggle */}
                            {isExpanded ? (
                              <ChevronUp className="h-5 w-5 text-gray-400" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                        </div>

                        {/* Collapsible Detail Section */}
                        {isExpanded && (
                          <div className="border-t border-gray-100 bg-[#fbfcfd] p-5 text-sm text-gray-700 animate-in slide-in-from-top-1 duration-150">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                              {/* Left Side: Body Description */}
                              <div className="md:col-span-2 space-y-4">
                                {cw.points && (
                                  <p className="text-xs font-bold text-gray-500 border-b border-gray-100 pb-2">
                                    Điểm số tối đa: <span className="text-[#1e88e5] text-sm">{cw.points} điểm</span>
                                  </p>
                                )}
                                <div className="prose prose-sm text-gray-600 leading-relaxed whitespace-pre-line pl-1">
                                  {cw.description}
                                </div>

                                {cw.attachments && cw.attachments.length > 0 && (
                                  <div className="mt-4 pt-3 border-t border-dashed border-gray-150 space-y-2">
                                    <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Tài liệu đính kèm</h5>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                      {cw.attachments.map((att, attIdx) => {
                                        return (
                                          <a
                                            key={attIdx}
                                            href={att.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-blue-350 transition-all shadow-sm cursor-pointer"
                                          >
                                            <div className="p-2 rounded-lg bg-gray-50 text-blue-600 shrink-0">
                                              {att.type === "youtube" ? (
                                                <Youtube className="w-5 h-5 text-red-600" />
                                              ) : att.type === "link" ? (
                                                <Link2 className="w-5 h-5 text-blue-600" />
                                              ) : att.type === "drive" ? (
                                                <FolderOpen className="w-5 h-5 text-yellow-600" />
                                              ) : (
                                                <FileText className="w-5 h-5 text-green-600" />
                                              )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                              <p className="text-xs font-bold text-gray-700 truncate">{att.name}</p>
                                              <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">{att.type === "drive" ? "Google Drive" : att.type === "youtube" ? "Video YouTube" : att.type === "file" ? "File đính kèm" : "Liên kết"}</p>
                                            </div>
                                            <ExternalLink className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                                          </a>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}

                                {/* Student Study Q&A AI Button */}
                                {activeUser.role === "student" && (
                                  <button
                                    onClick={() => onOpenAiHelper(cw)}
                                    className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:from-indigo-600 hover:to-purple-700 transition-colors cursor-pointer"
                                  >
                                    <Sparkles className="h-4 w-4 animate-pulse" />
                                    Hỏi Trợ lý Học tập AI về bài này
                                  </button>
                                )}
                              </div>

                              {/* Right Side: Action Work panel */}
                              <div className="md:col-span-1">
                                {/* Teacher Grading Overview Grid */}
                                {activeUser.role === "teacher" && isGradable && (
                                  <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                                    <h5 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                                      Trạng thái nộp bài
                                    </h5>
                                    <div className="grid grid-cols-3 gap-2 text-center mb-4">
                                      <div className="border-r border-gray-100 py-1">
                                        <p className="text-lg font-bold text-blue-600">{turnedInCount}</p>
                                        <p className="text-[9px] text-gray-400 font-bold uppercase">Đã nộp</p>
                                      </div>
                                      <div className="border-r border-gray-100 py-1">
                                        <p className="text-lg font-bold text-green-600">{gradedCount}</p>
                                        <p className="text-[9px] text-gray-400 font-bold uppercase">Đã chấm</p>
                                      </div>
                                      <div className="py-1">
                                        <p className="text-lg font-bold text-red-500">{assignedCount}</p>
                                        <p className="text-[9px] text-gray-400 font-bold uppercase">Chưa nộp</p>
                                      </div>
                                    </div>
                                    <button
                                      onClick={() => onOpenGrading(cw.id)}
                                      className="w-full flex justify-center items-center gap-1.5 rounded bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer"
                                    >
                                      <FileText className="h-3.5 w-3.5" />
                                      Xem bài làm & chấm điểm
                                    </button>
                                  </div>
                                )}

                                {/* Student Submit Panel - Multi-Format Switcher */}
                                {activeUser.role === "student" && isGradable && (
                                  <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                                    <h5 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 border-b border-gray-50 pb-2">
                                      {cw.type === "quiz" ? "Làm bài kiểm tra" : "Bài làm của bạn"}
                                    </h5>

                                    {cw.type === "quiz" ? (
                                      /* quiz interactive test taker */
                                      !mySubmission ? (
                                        <div className="space-y-4">
                                          {cw.quizQuestions?.map((q, idx) => (
                                            <div key={q.id} className="space-y-2 border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                                              <p className="text-xs font-bold text-gray-700 leading-normal">
                                                Câu {idx + 1}: {q.questionText} <span className="text-blue-500 text-[10px]">({q.points}đ)</span>
                                              </p>

                                              {/* choice */}
                                              {q.type === "choice" && q.options && (
                                                <div className="flex flex-col gap-1">
                                                  {q.options.map((opt, oIdx) => {
                                                    const isChecked = quizAnswers[q.id] === String(oIdx);
                                                    return (
                                                      <button
                                                        key={oIdx}
                                                        type="button"
                                                        onClick={() => setQuizAnswers({ ...quizAnswers, [q.id]: String(oIdx) })}
                                                        className={`flex items-center gap-2 p-2 rounded text-left text-xs border transition-colors ${
                                                          isChecked 
                                                            ? "bg-blue-50 border-blue-300 text-blue-800 font-semibold" 
                                                            : "bg-white hover:bg-gray-50 border-gray-150 text-gray-600"
                                                        }`}
                                                      >
                                                        <span className={`w-4 h-4 rounded-full border text-[9px] font-bold flex items-center justify-center shrink-0 ${
                                                          isChecked ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-gray-350 text-gray-450"
                                                        }`}>
                                                          {String.fromCharCode(65 + oIdx)}
                                                        </span>
                                                        <span className="truncate">{opt}</span>
                                                      </button>
                                                    );
                                                  })}
                                                </div>
                                              )}

                                              {/* true-false */}
                                              {q.type === "true-false" && q.options && (
                                                <div className="flex gap-2">
                                                  {q.options.map((opt, oIdx) => {
                                                    const isChecked = quizAnswers[q.id] === String(oIdx);
                                                    return (
                                                      <button
                                                        key={oIdx}
                                                        type="button"
                                                        onClick={() => setQuizAnswers({ ...quizAnswers, [q.id]: String(oIdx) })}
                                                        className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded text-xs border transition-colors font-bold ${
                                                          isChecked 
                                                            ? oIdx === 0 
                                                              ? "bg-emerald-50 border-emerald-300 text-emerald-800" 
                                                              : "bg-rose-50 border-rose-300 text-rose-800"
                                                            : "bg-white hover:bg-gray-50 border-gray-150 text-gray-600"
                                                        }`}
                                                      >
                                                        <span className={`w-2 h-2 rounded-full ${isChecked ? (oIdx === 0 ? "bg-emerald-500" : "bg-rose-500") : "bg-gray-300"}`} />
                                                        {opt}
                                                      </button>
                                                    );
                                                  })}
                                                </div>
                                              )}

                                              {/* essay */}
                                              {q.type === "essay" && (
                                                <textarea
                                                  value={quizAnswers[q.id] || ""}
                                                  onChange={(e) => setQuizAnswers({ ...quizAnswers, [q.id]: e.target.value })}
                                                  placeholder="Nhập phần giải thích hoặc mã nguồn ngắn..."
                                                  className="w-full h-16 p-2 text-xs border border-gray-250 rounded outline-none focus:border-blue-500 resize-none"
                                                />
                                              )}
                                            </div>
                                          ))}

                                          <button
                                            onClick={() => handleQuizSubmit(cw)}
                                            className="w-full flex items-center justify-center gap-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded py-2 transition-colors cursor-pointer"
                                          >
                                            <CheckCircle2 className="h-4 w-4" />
                                            Nộp bài & Tính điểm ngay
                                          </button>
                                        </div>
                                      ) : (
                                        <div className="space-y-3.5">
                                          <div className="rounded bg-gray-50 p-2.5 text-[11px] font-mono text-gray-600 border border-gray-100 max-h-40 overflow-y-auto whitespace-pre-line">
                                            <p className="font-bold text-[9px] text-gray-400 uppercase mb-1">Kết quả bài làm:</p>
                                            {mySubmission.content}
                                          </div>
                                          
                                          {mySubmission.status === "graded" ? (
                                            <div className="rounded bg-green-50/70 p-3 border border-green-150 text-xs text-green-800 space-y-1">
                                              <p className="font-bold">Điểm số chính thức: {mySubmission.grade}/{cw.points}đ</p>
                                              {mySubmission.feedback && (
                                                <p className="text-[10px] text-gray-600 leading-relaxed">
                                                  <span className="font-bold">Nhận xét:</span> {mySubmission.feedback}
                                                </p>
                                              )}
                                            </div>
                                          ) : (
                                            <div className="rounded bg-blue-50/70 p-3 border border-blue-150 text-xs text-blue-800 space-y-1">
                                              <p className="font-bold">Điểm trắc nghiệm: {mySubmission.quizScore}/{cw.points}đ</p>
                                              <p className="text-[10px] text-blue-600">Phần tự luận đang chờ giáo viên chấm điểm chính thức.</p>
                                            </div>
                                          )}
                                        </div>
                                      )
                                    ) : (
                                      /* Standard text assignments submit box */
                                      !mySubmission ? (
                                        <div className="space-y-3">
                                          <textarea
                                            value={submitText}
                                            onChange={(e) => setSubmitText(e.target.value)}
                                            placeholder="Nhập câu trả lời hoặc dán link bài làm của bạn..."
                                            className="w-full h-24 rounded border border-gray-300 p-2 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                                          />
                                          <button
                                            onClick={() => handleWorkSubmit(cw.id)}
                                            disabled={!submitText.trim()}
                                            className={`w-full flex items-center justify-center gap-1 rounded py-2 text-xs font-bold text-white transition-colors cursor-pointer ${
                                              submitText.trim() ? "bg-green-600 hover:bg-green-700" : "bg-gray-300 cursor-not-allowed"
                                            }`}
                                          >
                                            <CheckCircle2 className="h-4 w-4" />
                                            Nộp bài tập
                                          </button>
                                        </div>
                                      ) : (
                                        <div className="space-y-3">
                                          <div className="rounded bg-gray-50 p-3 text-xs text-gray-600 border border-gray-100 max-h-36 overflow-y-auto whitespace-pre-line">
                                            <p className="font-bold text-[10px] text-gray-400 uppercase mb-1">Nội dung bài nộp:</p>
                                            {mySubmission.content}
                                          </div>
                                          <p className="text-[10px] text-gray-400">
                                            Nộp vào: {mySubmission.submittedAt ? new Date(mySubmission.submittedAt).toLocaleString("vi-VN") : "Hôm nay"}
                                          </p>
                                          
                                          {mySubmission.status === "graded" && (
                                            <div className="rounded bg-green-50/50 p-3 border border-green-100 text-xs text-green-800">
                                              <p className="font-bold">Điểm đạt được: {mySubmission.grade}/{cw.points}</p>
                                              {mySubmission.feedback && (
                                                <p className="mt-1 text-gray-600"><span className="font-semibold">Phản hồi của cô:</span> {mySubmission.feedback}</p>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      )
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. Teacher's Create New Classwork Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-50 z-[999] flex flex-col overflow-hidden animate-in fade-in duration-200">
          <form onSubmit={handleCreateSubmit} className="flex flex-col h-full">
            {/* Fullscreen top header */}
            <div className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between shadow-sm shrink-0">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setAttachments([]);
                    setActiveAttachType(null);
                  }}
                  className="p-1.5 rounded-full hover:bg-gray-150 text-gray-500 hover:text-gray-800 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  {newType === "assignment" ? (
                    <ClipboardList className="h-5 w-5" />
                  ) : newType === "quiz" ? (
                    <BrainCircuit className="h-5 w-5" />
                  ) : newType === "question" ? (
                    <HelpIcon className="h-5 w-5" />
                  ) : (
                    <BookOpen className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm sm:text-base leading-none">
                    {newType === "assignment" ? "Bài tập" : newType === "quiz" ? "Bài kiểm tra" : newType === "question" ? "Câu hỏi" : "Tài liệu"}
                  </h3>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="flex items-center gap-1.5 bg-[#1e88e5] text-white px-5 py-2 rounded-full font-bold text-xs shadow-sm hover:bg-[#1565c0] active:scale-95 transition-all cursor-pointer"
                >
                  <Save className="h-3.5 w-3.5" />
                  {newType === "assignment" ? "Giao bài" : newType === "quiz" ? "Giao bài" : newType === "question" ? "Hỏi" : "Đăng"}
                </button>
              </div>
            </div>

            {/* Fullscreen workspace body */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
              {/* Left panel: Form fields & Attachments (takes ~70% width) */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 space-y-5 shadow-sm">
                  {/* Tiêu đề */}
                  <div className="space-y-1">
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Tiêu đề"
                      className="w-full bg-[#f0f4f9] rounded-t-lg border-b-2 border-gray-300 focus:border-blue-600 focus:bg-[#e8f0fe] px-4 py-3.5 text-sm sm:text-base font-medium outline-none transition-all"
                    />
                    <span className="text-[10px] text-gray-400 pl-1">* Tiêu đề là bắt buộc</span>
                  </div>

                  {/* Hướng dẫn / Mô tả */}
                  <div className="space-y-1.5">
                    <textarea
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      placeholder={newType === "quiz" ? "Hướng dẫn thi (ví dụ: Thời gian làm bài, cấu trúc bài thi, lưu ý tự luận...)" : "Hướng dẫn (không bắt buộc)"}
                      className="w-full bg-[#f0f4f9] rounded-t-lg px-4 py-3 text-sm outline-none focus:border-blue-600 focus:bg-[#e8f0fe] h-40 resize-none border-b-2 border-gray-300 transition-all"
                    />
                    
                    {/* Formatting tools & Gemini Draft trigger */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border border-gray-200 rounded-lg p-1.5 bg-white shadow-sm">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleInsertFormat("bold")}
                          className="p-1.5 rounded hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
                          title="Chữ đậm"
                        >
                          <Bold className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInsertFormat("italic")}
                          className="p-1.5 rounded hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
                          title="Chữ nghiêng"
                        >
                          <Italic className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInsertFormat("underline")}
                          className="p-1.5 rounded hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
                          title="Gạch chân"
                        >
                          <Underline className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInsertFormat("list")}
                          className="p-1.5 rounded hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
                          title="Danh sách"
                        >
                          <List className="w-4 h-4" />
                        </button>
                        <div className="h-4 w-px bg-gray-200 mx-1"></div>
                        <button
                          type="button"
                          onClick={() => handleInsertFormat("clear")}
                          className="p-1.5 rounded hover:bg-gray-100 text-red-500 hover:text-red-700 transition-colors text-[10px] font-bold"
                          title="Xóa hết mô tả"
                        >
                          Clear
                        </button>
                      </div>
                      
                      {newType !== "quiz" && (
                        <button
                          type="button"
                          disabled={isAiDrafting}
                          onClick={handleAiDraftAssignment}
                          className="flex items-center gap-1 text-[11px] text-indigo-700 font-bold bg-indigo-50 border border-indigo-150 px-3 py-1.5 rounded-lg hover:bg-indigo-100 disabled:opacity-50 transition-colors cursor-pointer"
                          title="Nhập tiêu đề và ấn nút này để Gemini AI tự động soạn thảo bản thảo bài học đầy đủ"
                        >
                          <Sparkles className={`h-3 w-3 ${isAiDrafting ? "animate-spin" : ""}`} />
                          {isAiDrafting ? "AI đang soạn thảo..." : "Soạn bằng AI"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Embedded Quiz builder (Only when quiz is selected) */}
                {newType === "quiz" && (
                  <div className="bg-amber-50/40 rounded-xl border border-amber-200 p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-250">
                      <div>
                        <h4 className="text-xs font-bold uppercase text-amber-800 tracking-wider flex items-center gap-1.5">
                          <BrainCircuit className="w-4.5 h-4.5" />
                          Danh sách câu hỏi kiểm tra ({quizQuestions.length})
                        </h4>
                        <p className="text-[10px] text-amber-600 mt-0.5">Tổng điểm hiện tại: {quizQuestions.reduce((sum, q) => sum + q.points, 0)}đ</p>
                      </div>
                      
                      <button
                        type="button"
                        onClick={handleAiGenerateQuiz}
                        disabled={isAiQuizDrafting}
                        className="flex items-center justify-center gap-1 text-[11px] text-white font-bold bg-amber-600 px-3.5 py-2 rounded-lg hover:bg-amber-700 disabled:opacity-50 transition-all cursor-pointer shadow-sm"
                      >
                        <Sparkles className={`h-3.5 w-3.5 ${isAiQuizDrafting ? "animate-spin" : ""}`} />
                        {isAiQuizDrafting ? "AI đang soạn..." : "Tự động soạn bằng AI"}
                      </button>
                    </div>

                    {/* Questions render */}
                    {quizQuestions.length === 0 ? (
                      <div className="text-center p-6 bg-white/70 rounded-lg border border-amber-100">
                        <p className="text-xs text-amber-800/60 italic font-medium">Chưa có câu hỏi nào. Hãy ấn nút "Tự động soạn bằng AI" ở trên hoặc điền thủ công phía dưới.</p>
                      </div>
                    ) : (
                      <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                        {quizQuestions.map((q, qIdx) => (
                          <div key={q.id} className="flex items-center justify-between bg-white border border-amber-150 rounded-xl p-3 shadow-sm hover:border-amber-350 transition-all">
                            <div className="min-w-0 flex-1 pr-3">
                              <p className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                                <span className="bg-amber-100 text-amber-800 rounded-full w-5 h-5 flex items-center justify-center text-[10px] shrink-0">{qIdx + 1}</span>
                                <span className="truncate">{q.questionText}</span>
                                <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100 shrink-0 font-semibold">{q.type === "choice" ? "Trắc nghiệm" : q.type === "true-false" ? "Đúng/Sai" : "Tự luận"} • {q.points}đ</span>
                              </p>
                              {q.options && q.options.length > 0 && (
                                <p className="text-[10px] text-gray-400 mt-1 truncate pl-6 font-medium">Lựa chọn: {q.options.join(" | ")}</p>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const list = quizQuestions.filter(item => item.id !== q.id);
                                setQuizQuestions(list);
                                setNewPoints(list.reduce((sum, item) => sum + item.points, 0));
                              }}
                              className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg shrink-0 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Manual adding form */}
                    {showAddQuestion ? (
                      <div className="bg-white p-4 border border-amber-200 rounded-xl space-y-3.5 animate-in fade-in duration-150 shadow-sm">
                        <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">Thêm câu hỏi mới</p>
                        
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { val: "choice", label: "Trắc nghiệm" },
                            { val: "true-false", label: "Đúng / Sai" },
                            { val: "essay", label: "Tự luận" }
                          ].map((x) => (
                            <button
                              key={x.val}
                              type="button"
                              onClick={() => setQType(x.val as any)}
                              className={`py-2 px-2 rounded-lg text-xs font-bold text-center border transition-all ${
                                qType === x.val ? "bg-amber-50 border-amber-400 text-amber-800" : "bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-600"
                              }`}
                            >
                              {x.label}
                            </button>
                          ))}
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-gray-400 uppercase">Câu hỏi</label>
                          <input
                            type="text"
                            value={qText}
                            onChange={(e) => setQText(e.target.value)}
                            placeholder="Ví dụ: React Virtual DOM hoạt động như thế nào?"
                            className="w-full text-xs rounded-lg border border-gray-300 p-2.5 focus:border-amber-400 outline-none"
                          />
                        </div>

                        {qType === "choice" && (
                          <div className="space-y-2">
                            <label className="block text-[10px] font-bold text-gray-400 uppercase">4 Phương án trả lời & Chọn đáp án đúng</label>
                            {qOptions.map((opt, oIdx) => (
                              <div key={oIdx} className="flex items-center gap-2">
                                <span className="text-xs font-bold text-amber-700">{String.fromCharCode(65 + oIdx)}</span>
                                <input
                                  type="text"
                                  value={opt}
                                  onChange={(e) => {
                                    const next = [...qOptions];
                                    next[oIdx] = e.target.value;
                                    setQOptions(next);
                                  }}
                                  placeholder={`Phương án ${String.fromCharCode(65 + oIdx)}`}
                                  className="flex-1 text-xs rounded-lg border border-gray-300 p-2 focus:border-amber-400 outline-none"
                                />
                                <input
                                  type="radio"
                                  name="correctOptionIndex"
                                  checked={qCorrectIndex === oIdx}
                                  onChange={() => setQCorrectIndex(oIdx)}
                                  className="h-4 w-4 text-amber-600 focus:ring-amber-400 cursor-pointer"
                                />
                              </div>
                            ))}
                          </div>
                        )}

                        {qType === "true-false" && (
                          <div className="space-y-1.5 bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <label className="block text-[10px] font-bold text-gray-400 uppercase">Chọn đáp án đúng</label>
                            <div className="flex gap-6 mt-1">
                              <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 cursor-pointer">
                                <input
                                  type="radio"
                                  name="tf_correct"
                                  checked={qCorrectIndex === 0}
                                  onChange={() => setQCorrectIndex(0)}
                                  className="text-emerald-600 focus:ring-emerald-400 cursor-pointer"
                                />
                                Đúng
                              </label>
                              <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 cursor-pointer">
                                <input
                                  type="radio"
                                  name="tf_correct"
                                  checked={qCorrectIndex === 1}
                                  onChange={() => setQCorrectIndex(1)}
                                  className="text-rose-600 focus:ring-rose-400 cursor-pointer"
                                />
                                Sai
                              </label>
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-4 pt-2">
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase">Điểm của câu này</label>
                            <input
                              type="number"
                              value={qPoints}
                              onChange={(e) => setQPoints(Number(e.target.value))}
                              className="w-full text-xs rounded-lg border border-gray-300 p-2 mt-1 focus:border-amber-400 outline-none"
                            />
                          </div>
                          <div className="flex items-end justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setShowAddQuestion(false)}
                              className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-bold text-gray-600 transition-colors"
                            >
                              Hủy bỏ
                            </button>
                            <button
                              type="button"
                              onClick={handleAddQuestionManual}
                              className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
                            >
                              Lưu câu hỏi
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowAddQuestion(true)}
                        className="w-full py-2.5 border border-dashed border-amber-300 rounded-xl text-xs font-bold text-amber-800 bg-white hover:bg-amber-100/30 flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                      >
                        <PlusCircle className="w-4 h-4 text-amber-700" />
                        Thêm câu hỏi thi thủ công
                      </button>
                    )}
                  </div>
                )}

                {/* Đính kèm Container */}
                <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 space-y-4 shadow-sm">
                  <h4 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                    <Paperclip className="w-4.5 h-4.5 text-blue-600" />
                    Tài liệu đính kèm ({attachments.length})
                  </h4>
                  
                  {/* Circular tools bar */}
                  <div className="grid grid-cols-5 gap-1.5 py-1 max-w-lg">
                    {[
                      { type: "drive", label: "Drive", color: "hover:bg-blue-50 text-blue-600 hover:border-blue-200", icon: FolderOpen },
                      { type: "youtube", label: "YouTube", color: "hover:bg-red-50 text-red-600 hover:border-red-200", icon: Youtube },
                      { type: "link", label: "Liên kết", color: "hover:bg-indigo-50 text-indigo-600 hover:border-indigo-200", icon: Link2 },
                      { type: "file", label: "Tải lên", color: "hover:bg-emerald-50 text-emerald-600 hover:border-emerald-200", icon: UploadCloud },
                      { type: "create", label: "Tạo Doc", color: "hover:bg-purple-50 text-purple-600 hover:border-purple-200", icon: Plus }
                    ].map((item) => (
                      <button
                        key={item.type}
                        type="button"
                        onClick={() => {
                          if (item.type === "drive") {
                            const mockDriveDocs = [
                              { name: "📑 Giáo trình React Hooks cơ bản.pdf", url: "https://react.dev" },
                              { name: "📊 Báo cáo phân tích hiệu năng.xlsx", url: "https://react.dev" },
                              { name: "📁 Lab 4 - Redux Toolkit Boilerplate.zip", url: "https://react.dev" }
                            ];
                            const randomDoc = mockDriveDocs[Math.floor(Math.random() * mockDriveDocs.length)];
                            setAttachments([...attachments, { type: "drive", name: randomDoc.name, url: randomDoc.url }]);
                          } else if (item.type === "create") {
                            const docTypes = ["Docs", "Sheets", "Slides", "Forms"];
                            const randomDocType = docTypes[Math.floor(Math.random() * docTypes.length)];
                            setAttachments([...attachments, { 
                              type: "file", 
                              name: `📝 Google ${randomDocType} chưa có tiêu đề`, 
                              url: "https://docs.google.com" 
                            }]);
                          } else if (item.type === "file") {
                            const fileInput = document.createElement("input");
                            fileInput.type = "file";
                            fileInput.onchange = (e: any) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setAttachments([...attachments, { 
                                  type: "file", 
                                  name: `📎 ${file.name}`, 
                                  url: "#" 
                                }]);
                              }
                            };
                            fileInput.click();
                          } else {
                            setActiveAttachType(item.type as any);
                            setAttachName("");
                            setAttachUrl("");
                          }
                        }}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl border border-gray-150 transition-all cursor-pointer ${item.color}`}
                      >
                        <div className="p-2 rounded-full bg-gray-50 mb-1.5">
                          <item.icon className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-bold tracking-tight">{item.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Active inline attachment input form */}
                  {activeAttachType && (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3.5 animate-in slide-in-from-top-2 duration-150 shadow-inner">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-700 uppercase flex items-center gap-1">
                          Thêm {activeAttachType === "youtube" ? "Video YouTube" : "Liên kết trang web"}
                        </span>
                        <button 
                          type="button" 
                          onClick={() => setActiveAttachType(null)} 
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase">Tên hiển thị</label>
                          <input 
                            type="text" 
                            value={attachName} 
                            onChange={(e) => setAttachName(e.target.value)} 
                            placeholder={activeAttachType === "youtube" ? "Ví dụ: Video hướng dẫn học React" : "Ví dụ: Trang chủ React.dev"}
                            className="w-full text-xs rounded-lg border border-gray-300 p-2 bg-white outline-none focus:border-blue-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase">Đường dẫn URL</label>
                          <input 
                            type="text" 
                            value={attachUrl} 
                            onChange={(e) => setAttachUrl(e.target.value)} 
                            placeholder="https://..."
                            className="w-full text-xs rounded-lg border border-gray-300 p-2 bg-white outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2.5 pt-1">
                        <button 
                          type="button" 
                          onClick={() => setActiveAttachType(null)}
                          className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          Hủy
                        </button>
                        <button 
                          type="button" 
                          onClick={handleAddAttachment}
                          className="px-3.5 py-1.5 text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
                        >
                          Đồng ý
                    </button>
                      </div>
                    </div>
                  )}

                  {/* Attachments List */}
                  {attachments.length > 0 && (
                    <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {attachments.map((att, index) => (
                        <div 
                          key={index} 
                          className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-250 rounded-xl shadow-sm relative group"
                        >
                          <div className="p-2 rounded-lg bg-white text-blue-600 shrink-0 shadow-sm">
                            {att.type === "youtube" ? (
                              <Youtube className="w-5 h-5 text-red-600" />
                            ) : att.type === "link" ? (
                              <Link2 className="w-5 h-5 text-blue-600" />
                            ) : att.type === "drive" ? (
                              <FolderOpen className="w-5 h-5 text-yellow-600" />
                            ) : (
                              <FileText className="w-5 h-5 text-green-600" />
                            )}
                          </div>
                          
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-gray-700 truncate pr-6">{att.name}</p>
                            <p className="text-[10px] text-gray-400 uppercase font-medium">{att.type === "drive" ? "Google Drive" : att.type === "youtube" ? "Video YouTube" : att.type === "file" ? "File tải lên" : "Liên kết"}</p>
                          </div>

                          <button
                            type="button"
                            onClick={() => setAttachments(attachments.filter((_, idx) => idx !== index))}
                            className="absolute right-2 top-2 p-1 rounded-full bg-white text-gray-400 hover:text-red-600 hover:bg-red-50 border border-gray-150 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-sm"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right panel: Class details sidebar (takes ~30% width) */}
              <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-gray-200 bg-white p-5 sm:p-6 flex flex-col space-y-5 overflow-y-auto shrink-0 select-none">
                {/* Dành cho */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Dành cho
                  </label>
                  <select
                    disabled
                    className="w-full rounded-lg border border-gray-300 p-2.5 text-xs bg-gray-50 text-gray-600 outline-none cursor-not-allowed font-medium"
                  >
                    <option>{classItem.name}</option>
                  </select>
                </div>

                {/* Học viên */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Học viên
                  </label>
                  <div className="w-full rounded-lg border border-gray-300 p-2.5 text-xs bg-gray-50 text-gray-600 flex items-center justify-between font-medium">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                      Tất cả học viên ({classItem.students.length} bạn)
                    </span>
                  </div>
                </div>

                {/* Điểm */}
                {newType !== "material" && (
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Thang điểm {newType === "quiz" && "(Tự động tính)"}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={newType === "quiz" ? quizQuestions.reduce((sum, q) => sum + q.points, 0) : newPoints}
                        disabled={newType === "quiz"}
                        onChange={(e) => setNewPoints(Number(e.target.value))}
                        className="w-full rounded-lg border border-gray-300 p-2.5 text-xs outline-none focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 font-bold"
                      />
                    </div>
                  </div>
                )}

                {/* Hạn nộp */}
                {newType !== "material" && (
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Hạn nộp bài
                    </label>
                    <input
                      type="date"
                      value={newDueDate}
                      onChange={(e) => setNewDueDate(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 p-2.5 text-xs outline-none focus:border-blue-500 text-gray-700 font-medium"
                    />
                  </div>
                )}

                {/* Chủ đề */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Chủ đề
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowAddTopicModal(true)}
                      className="text-[10px] text-blue-600 font-bold hover:underline cursor-pointer"
                    >
                      + Thêm chủ đề mới
                    </button>
                  </div>
                  <select
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 p-2.5 text-xs bg-white outline-none focus:border-blue-500 text-gray-700 font-medium cursor-pointer"
                  >
                    {availableTopics.map((t, idx) => (
                      <option key={idx} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                {/* Tiêu chí chấm điểm (Rubric) */}
                <div className="pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => alert("Tính năng thêm tiêu chí chấm điểm tự động bằng Rubrics đang được liên kết với hệ thống!")}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 border border-dashed border-gray-300 rounded-lg text-xs font-semibold text-gray-500 hover:bg-gray-50 hover:text-blue-600 hover:border-blue-300 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Tiêu chí chấm điểm (Rubric)
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* 4. Add Topic Modal Overlay */}
      {showAddTopicModal && (
        <div className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-5 space-y-4">
              <h4 className="text-sm font-bold text-gray-800">Thêm chủ đề mới</h4>
              <input
                type="text"
                value={newTopicName}
                onChange={(e) => setNewTopicName(e.target.value)}
                placeholder="Tên chủ đề"
                className="w-full rounded-lg border border-gray-300 p-2.5 text-xs outline-none focus:border-blue-500"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddTopicModal(false);
                    setNewTopicName("");
                  }}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-100"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (newTopicName.trim()) {
                      const updated = [...availableTopics, newTopicName.trim()];
                      setAvailableTopics(updated);
                      setNewTopic(newTopicName.trim());
                      setNewTopicName("");
                      setShowAddTopicModal(false);
                    }
                  }}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold shadow hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  Thêm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
