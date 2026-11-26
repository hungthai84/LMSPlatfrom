import React, { useState } from "react";
import {
  Bot,
  Sparkles,
  Send,
  BookOpen,
  FileQuestion,
  Languages,
  FileSearch,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  History,
  Save,
  Loader2,
} from "lucide-react";
import { useLms } from "../../contexts/LmsContext";
import { callGeminiAi } from "../../services/aiService";
import { tr } from "../../i18n/translations";

interface AiAgentDef {
  id: string;
  name: string;
  roleLabelVi: string;
  roleLabelEn: string;
  tintClass: string;
  promptHintVi: string;
  promptHintEn: string;
}

const AI_AGENTS: AiAgentDef[] = [
  { id: "learning_assistant", name: "Learning Assistant", roleLabelVi: "Trợ lý học tập", roleLabelEn: "Learning Assistant", tintClass: "glass-liquid-card-blue", promptHintVi: "Gợi ý lộ trình học ReactJS & UI/UX trong 4 tuần tới", promptHintEn: "Suggest a 4-week study roadmap for ReactJS & UI/UX" },
  { id: "ai_tutor", name: "AI Tutor", roleLabelVi: "Gia sư chuyên sâu", roleLabelEn: "Deep Tutor", tintClass: "glass-liquid-card-purple", promptHintVi: "Giải thích useEffect cleanup và tránh memory leak trong React", promptHintEn: "Explain useEffect cleanup and preventing memory leaks in React" },
  { id: "course_creator", name: "Course Creator", roleLabelVi: "Thiết kế đề cương", roleLabelEn: "Syllabus Designer", tintClass: "glass-liquid-card-emerald", promptHintVi: "Tạo đề cương khóa học TypeScript Nâng Cao cho Frontend", promptHintEn: "Create an Advanced TypeScript syllabus for Frontend Engineers" },
  { id: "quiz_generator", name: "Quiz Generator", roleLabelVi: "Sinh câu hỏi thi", roleLabelEn: "Quiz Author", tintClass: "glass-liquid-card-orange", promptHintVi: "Sinh 4 câu hỏi đánh giá về Agile Scrum & Kanban", promptHintEn: "Generate 4 assessment questions on Agile Scrum & Kanban" },
  { id: "training_manager", name: "Training Manager", roleLabelVi: "Hoạch định đào tạo", roleLabelEn: "L&D Planner", tintClass: "glass-liquid-card-pink", promptHintVi: "Đề xuất KPI đo lường Training ROI cho doanh nghiệp 200 nhân sự", promptHintEn: "Propose Training ROI KPIs for a 200-employee enterprise" },
  { id: "knowledge_agent", name: "Knowledge Agent", roleLabelVi: "Tri thức nội bộ RAG", roleLabelEn: "Internal RAG Knowledge", tintClass: "glass-liquid-card-blue", promptHintVi: "Tóm tắt quy định bảo mật dữ liệu & phân quyền RBAC", promptHintEn: "Summarize data security policies & RBAC permissions" },
  { id: "analytics_agent", name: "Analytics Agent", roleLabelVi: "Phân tích rủi ro", roleLabelEn: "Risk Analytics", tintClass: "glass-liquid-card-emerald", promptHintVi: "Phân tích xu hướng hoàn thành bài tập và cảnh báo học viên chậm tiến độ", promptHintEn: "Analyze assignment completion trends and flag at-risk learners" },
  { id: "student_support", name: "Student Support", roleLabelVi: "Hỗ trợ học vụ", roleLabelEn: "Academic Support", tintClass: "glass-liquid-card-purple", promptHintVi: "Hướng dẫn quy trình xin phúc khảo điểm và xác minh chứng chỉ QR", promptHintEn: "Guide through grade appeal and QR certificate verification" },
];

type AiToolTab = "agents" | "course-creator" | "quiz-gen" | "summary-translate" | "rag" | "analytics";

export const AiLearningCenter: React.FC = () => {
  const { language, assets, courses, enrollments, createCourse, addLesson, showToast } = useLms();
  const [activeTool, setActiveTool] = useState<AiToolTab>("agents");
  const [selectedAgent, setSelectedAgent] = useState<AiAgentDef>(AI_AGENTS[0]);
  const [promptInput, setPromptInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resultText, setResultText] = useState<string>("");
  const [history, setHistory] = useState<Array<{ id: string; tool: string; prompt: string; output: string; time: string }>>([]);

  // Course Creator structured state
  const [courseTopic, setCourseTopic] = useState("Kiến trúc Micro-Frontend & Design System");
  const [generatedOutline, setGeneratedOutline] = useState<{
    title?: string;
    category?: string;
    level?: string;
    durationHours?: number;
    objectives?: string[];
    chapters?: Array<{
      chapterTitle: string;
      lessons: Array<{ title: string; lessonType: string; durationMinutes: number; summary: string }>;
    }>;
  } | null>(null);

  // Quiz Generator state
  const [quizTopic, setQuizTopic] = useState("React Hooks, Context API & Firestore Security");
  const [quizCount, setQuizCount] = useState(3);
  const [generatedQuiz, setGeneratedQuiz] = useState<
    Array<{ type: string; questionText: string; options?: string[]; correctOptionIndex?: number; explanation?: string; difficulty?: string; points?: number }>
  >([]);

  // Summary & Translate state
  const [sourceContent, setSourceContent] = useState(
    "Cloud Firestore là cơ sở dữ liệu NoSQL theo tài liệu cho phép đồng bộ dữ liệu thời gian thực và áp dụng Security Rules ở cấp độ document."
  );
  const [targetLang, setTargetLang] = useState("English");

  // RAG state
  const [ragQuery, setRagQuery] = useState("Tài liệu quy định những nội dung gì về ReactJS và Design System?");
  const [customDocText, setCustomDocText] = useState(
    "Quy chuẩn kỹ thuật EduSmart 2026: Mọi giao diện Dashboard sử dụng bo góc 14px, font chữ Play, thẻ Glass Liquid đa màu sắc và kết nối Gemini qua server-side API /api/gemini/generate."
  );

  const pushHistory = (tool: string, p: string, output: string) => {
    setHistory((prev) => [
      { id: `${Date.now()}`, tool, prompt: p, output, time: new Date().toLocaleTimeString("vi-VN") },
      ...prev.slice(0, 14),
    ]);
  };

  const handleRunAgentChat = async () => {
    const fallbackHint = language === "en" ? selectedAgent.promptHintEn : selectedAgent.promptHintVi;
    const q = promptInput.trim() || fallbackHint;
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await callGeminiAi({
        action: "agent-chat",
        agentId: selectedAgent.id,
        prompt: q,
        language,
      });
      setResultText(res.text);
      pushHistory(selectedAgent.name, q, res.text);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : tr(language, "Lỗi gọi Gemini AI", "Gemini AI request failed"));
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateOutline = async () => {
    if (!courseTopic.trim()) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await callGeminiAi({
        action: "generate-course-outline",
        prompt: courseTopic,
        context: { subjectName: courseTopic },
        language,
      });
      const parsed = JSON.parse(res.text);
      setGeneratedOutline(parsed);
      pushHistory("AI Course Creator", courseTopic, res.text);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Lỗi tạo đề cương AI");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGeneratedCourseDraft = async () => {
    if (!generatedOutline?.title) return;
    const code = `AI-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    await createCourse({
      code,
      title: generatedOutline.title,
      category: generatedOutline.category || "Công nghệ",
      description: (generatedOutline.objectives || []).join(" • ").slice(0, 400),
      level:
        generatedOutline.level === "advanced" || generatedOutline.level === "beginner"
          ? generatedOutline.level
          : "intermediate",
      durationHours: Number(generatedOutline.durationHours) || 12,
      price: 0,
      passingScore: 75,
      status: "draft",
      isPublic: false,
      instructorName: "AI Draft (Chờ giảng viên duyệt)",
      thumbnailUrl: "/04_course_reactjs_thumbnail.png",
    });
    if (Array.isArray(generatedOutline.chapters)) {
      let idx = 1;
      for (const ch of generatedOutline.chapters.slice(0, 2)) {
        for (const les of (ch.lessons || []).slice(0, 2)) {
          await addLesson({
            courseId: "class-1",
            chapterTitle: ch.chapterTitle || "Chương AI",
            title: les.title || `Bài ${idx}`,
            lessonType: "document",
            durationMinutes: Number(les.durationMinutes) || 20,
            orderIndex: idx++,
            content: les.summary || "",
          });
        }
      }
    }
    showToast(
      tr(
        language,
        "Đã lưu bản Nháp đề cương AI vào Danh mục Khóa học (trạng thái draft chờ duyệt)!",
        "Saved AI course outline draft to Courses Catalog (pending instructor approval)!"
      )
    );
  };

  const handleGenerateQuiz = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await callGeminiAi({
        action: "generate-quiz",
        prompt: quizTopic,
        context: { topic: quizTopic, count: quizCount },
        language,
      });
      const parsed = JSON.parse(res.text);
      setGeneratedQuiz(Array.isArray(parsed) ? parsed : []);
      pushHistory("AI Quiz Generator", `${quizTopic} (${quizCount} câu)`, res.text);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Lỗi sinh đề thi AI");
    } finally {
      setLoading(false);
    }
  };

  const handleSummarizeOrTranslate = async (mode: "summarize-content" | "translate-content") => {
    if (!sourceContent.trim()) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await callGeminiAi({
        action: mode,
        prompt: sourceContent,
        context: { targetLang },
        language,
      });
      setResultText(res.text);
      pushHistory(mode === "summarize-content" ? "AI Tóm tắt" : `AI Dịch (${targetLang})`, sourceContent, res.text);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Lỗi xử lý nội dung AI");
    } finally {
      setLoading(false);
    }
  };

  const handleRagSearch = async () => {
    if (!ragQuery.trim()) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const docs = [
        { title: "Tài liệu nội bộ người dùng nhập", content: customDocText },
        ...assets.slice(0, 4).map((a) => ({
          title: a.name,
          content: `Thư mục: ${a.folder}. Loại học liệu: ${a.assetType}. Dung lượng: ${a.sizeLabel || "N/A"}.`,
        })),
      ];
      const res = await callGeminiAi({
        action: "rag-search",
        prompt: ragQuery,
        context: { documents: docs },
        language,
      });
      setResultText(res.text);
      pushHistory("AI RAG Knowledge", ragQuery, res.text);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Lỗi tìm kiếm RAG AI");
    } finally {
      setLoading(false);
    }
  };

  const handleRunAnalytics = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const statsSummary = `Tổng khóa học: ${courses.length}. Tổng ghi danh: ${enrollments.length}. Danh sách tiến độ: ${enrollments
        .map((e) => `${e.userName} - ${e.courseTitle}: ${e.progressPercent}% (${e.status})`)
        .join("; ")}`;
      const res = await callGeminiAi({
        action: "learning-analytics",
        prompt: `Hãy phân tích dữ liệu học tập thực tế sau và đề xuất giải pháp cho học viên có nguy cơ chậm tiến độ:\n${statsSummary}`,
        language,
      });
      setResultText(res.text);
      pushHistory("AI Learning Analytics", "Phân tích dữ liệu toàn hệ thống", res.text);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Lỗi phân tích AI");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5 pb-8">
      {/* Header Banner */}
      <div className="glass-liquid-card-purple p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-[14px]">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-[14px] bg-gradient-to-br from-[#0d6efd] to-[#a855f7] text-white flex items-center justify-center shadow-md shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              {tr(language, "Trung tâm Học tập AI (8 AI Agents & RAG)", "AI Learning Center (8 AI Agents & RAG)")}
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              {tr(
                language,
                "Thực thi Gemini API bảo mật phía máy chủ (/api/gemini/generate). Nội dung AI tạo mới luôn ở trạng thái Nháp chờ giảng viên duyệt.",
                "Powered by server-side Gemini API (/api/gemini/generate). AI-generated drafts always await instructor review."
              )}
            </p>
          </div>
        </div>
        <span className="text-[11px] font-bold px-3 py-1.5 rounded-[14px] bg-white/80 text-purple-700 border border-purple-200 shrink-0 self-start lg:self-auto">
          Model: gemini-4-hydrogen • Server-Side Only
        </span>
      </div>

      {/* Tool Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: "agents", label: tr(language, "8 AI Agents", "8 AI Agents"), icon: Bot },
          { id: "course-creator", label: tr(language, "AI Tạo Khóa học", "AI Course Creator"), icon: BookOpen },
          { id: "quiz-gen", label: tr(language, "AI Sinh Đề Thi", "AI Quiz Generator"), icon: FileQuestion },
          { id: "summary-translate", label: tr(language, "Tóm tắt & Dịch", "Summarize & Translate"), icon: Languages },
          { id: "rag", label: tr(language, "Hỏi đáp Tài liệu RAG", "RAG Knowledge Q&A"), icon: FileSearch },
          { id: "analytics", label: tr(language, "AI Phân tích Học tập", "AI Learning Analytics"), icon: BarChart3 },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTool === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTool(tab.id as AiToolTab);
                setErrorMsg(null);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-[14px] text-xs font-bold transition-all cursor-pointer ${
                active
                  ? "bg-[#0d6efd] text-white shadow-md"
                  : "glass-liquid-card text-slate-700 hover:bg-white/90"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {errorMsg && (
        <div className="glass-liquid-card-orange p-3.5 rounded-[14px] border border-orange-300 flex items-center gap-2.5 text-xs text-orange-900 font-bold">
          <AlertTriangle className="w-4 h-4 text-orange-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Main Interactive Area */}
        <div className="xl:col-span-8 space-y-4">
          {activeTool === "agents" && (
            <div className="glass-liquid-card p-4 sm:p-5 rounded-[14px] space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {AI_AGENTS.map((ag) => (
                  <button
                    key={ag.id}
                    onClick={() => {
                      setSelectedAgent(ag);
                      setPromptInput(language === "en" ? ag.promptHintEn : ag.promptHintVi);
                    }}
                    className={`${ag.tintClass} p-3 rounded-[14px] text-left transition-all cursor-pointer border ${
                      selectedAgent.id === ag.id ? "ring-2 ring-[#0d6efd] scale-[1.01]" : "opacity-85 hover:opacity-100"
                    }`}
                  >
                    <p className="text-xs font-bold text-slate-900 truncate">{ag.name}</p>
                    <p className="text-[10px] text-slate-600 truncate mt-0.5">
                      {language === "en" ? ag.roleLabelEn : ag.roleLabelVi}
                    </p>
                  </button>
                ))}
              </div>

              <div className="space-y-2.5">
                <label className="text-xs font-bold text-slate-700 block">
                  {tr(language, "Trao đổi với", "Chat with")} <span className="text-[#0d6efd]">{selectedAgent.name}</span> (
                  {language === "en" ? selectedAgent.roleLabelEn : selectedAgent.roleLabelVi})
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={promptInput}
                    onChange={(e) => setPromptInput(e.target.value)}
                    placeholder={language === "en" ? selectedAgent.promptHintEn : selectedAgent.promptHintVi}
                    className="flex-1 px-3.5 py-2.5 rounded-[14px] bg-white/90 border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-[#0d6efd]"
                  />
                  <button
                    onClick={handleRunAgentChat}
                    disabled={loading}
                    className="px-4 py-2.5 rounded-[14px] bg-[#0d6efd] hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {tr(language, "Gửi AI", "Send to AI")}
                  </button>
                </div>
              </div>

              {resultText && (
                <div className="glass-liquid-card-blue p-4 rounded-[14px] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#0d6efd]">
                      {tr(language, "Phản hồi từ", "Response from")} {selectedAgent.name}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-[14px] bg-white/80 text-slate-600 font-bold">
                      Draft Pending Review
                    </span>
                  </div>
                  <pre className="whitespace-pre-wrap font-sans text-xs text-slate-800 leading-relaxed">{resultText}</pre>
                </div>
              )}
            </div>
          )}

          {activeTool === "course-creator" && (
            <div className="glass-liquid-card p-4 sm:p-5 rounded-[14px] space-y-4">
              <h3 className="text-sm font-bold text-slate-900">
                {tr(language, "AI Course Creator — Sinh Đề cương & Bài học có cấu trúc", "AI Course Creator — Structured Syllabus & Lessons")}
              </h3>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={courseTopic}
                  onChange={(e) => setCourseTopic(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-[14px] bg-white/90 border border-slate-200 text-xs outline-none"
                  placeholder={tr(language, "Nhập chủ đề khóa học cần thiết kế...", "Enter course topic to design...")}
                />
                <button
                  onClick={handleGenerateOutline}
                  disabled={loading}
                  className="px-4 py-2.5 rounded-[14px] bg-[#10b981] hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  {tr(language, "Tạo đề cương", "Generate Outline")}
                </button>
              </div>

              {generatedOutline && (
                <div className="glass-liquid-card-emerald p-4 rounded-[14px] space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{generatedOutline.title}</h4>
                      <p className="text-[11px] text-slate-600">
                        {generatedOutline.category} • {generatedOutline.level} • {generatedOutline.durationHours || 12}{" "}
                        {tr(language, "giờ", "hrs")}
                      </p>
                    </div>
                    <button
                      onClick={handleSaveGeneratedCourseDraft}
                      className="px-3.5 py-2 rounded-[14px] bg-[#0d6efd] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      {tr(language, "Lưu Nháp vào Khóa học", "Save Course Draft")}
                    </button>
                  </div>
                  <div className="space-y-2">
                    {(generatedOutline.chapters || []).map((ch, idx) => (
                      <div key={idx} className="bg-white/80 p-3 rounded-[14px] border border-emerald-100">
                        <p className="text-xs font-bold text-emerald-900">{ch.chapterTitle}</p>
                        <ul className="mt-1 space-y-1">
                          {(ch.lessons || []).map((les, j) => (
                            <li key={j} className="text-[11px] text-slate-700 flex items-center justify-between">
                              <span>• {les.title}</span>
                              <span className="text-slate-500">{les.durationMinutes} phút</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTool === "quiz-gen" && (
            <div className="glass-liquid-card p-4 sm:p-5 rounded-[14px] space-y-4">
              <h3 className="text-sm font-bold text-slate-900">
                {tr(language, "AI Quiz Generator — Sinh Câu hỏi Trắc nghiệm, Đúng/Sai & Tự luận", "AI Quiz Generator — MCQ, True/False & Essay")}
              </h3>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={quizTopic}
                  onChange={(e) => setQuizTopic(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-[14px] bg-white/90 border border-slate-200 text-xs outline-none"
                />
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={quizCount}
                  onChange={(e) => setQuizCount(Number(e.target.value))}
                  className="w-24 px-3 py-2.5 rounded-[14px] bg-white/90 border border-slate-200 text-xs font-bold"
                />
                <button
                  onClick={handleGenerateQuiz}
                  disabled={loading}
                  className="px-4 py-2.5 rounded-[14px] bg-[#f97316] hover:bg-orange-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileQuestion className="w-4 h-4" />}
                  {tr(language, "Sinh Bộ Câu Hỏi", "Generate Quiz")}
                </button>
              </div>

              {generatedQuiz.length > 0 && (
                <div className="space-y-2.5">
                  {generatedQuiz.map((q, idx) => (
                    <div key={idx} className="glass-liquid-card-orange p-3.5 rounded-[14px] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-[14px] bg-white/80 text-orange-700">
                          {tr(language, "Câu", "Q")} {idx + 1} • {q.type} • {q.difficulty || "medium"}
                        </span>
                        <span className="text-[10px] font-bold text-slate-600">{q.points || 10} {tr(language, "điểm", "pts")}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-900">{q.questionText}</p>
                      {Array.isArray(q.options) && q.options.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                          {q.options.map((opt, oi) => (
                            <div
                              key={oi}
                              className={`text-[11px] px-2.5 py-1.5 rounded-[14px] border ${
                                oi === q.correctOptionIndex
                                  ? "bg-emerald-50 border-emerald-300 text-emerald-900 font-bold"
                                  : "bg-white/80 border-slate-200 text-slate-700"
                              }`}
                            >
                              {opt}
                            </div>
                          ))}
                        </div>
                      )}
                      {q.explanation && (
                        <p className="text-[11px] text-slate-600 italic">
                          {tr(language, "Giải thích:", "Explanation:")} {q.explanation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTool === "summary-translate" && (
            <div className="glass-liquid-card p-4 sm:p-5 rounded-[14px] space-y-4">
              <h3 className="text-sm font-bold text-slate-900">
                {tr(language, "AI Tóm tắt Học liệu & Dịch đa ngôn ngữ", "AI Content Summarizer & Translator")}
              </h3>
              <textarea
                rows={4}
                value={sourceContent}
                onChange={(e) => setSourceContent(e.target.value)}
                className="w-full p-3.5 rounded-[14px] bg-white/90 border border-slate-200 text-xs outline-none"
              />
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleSummarizeOrTranslate("summarize-content")}
                  disabled={loading}
                  className="px-4 py-2 rounded-[14px] bg-[#0d6efd] text-white text-xs font-bold cursor-pointer"
                >
                  {tr(language, "Tóm tắt Ý chính", "Summarize Key Points")}
                </button>
                <select
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                  className="px-3 py-2 rounded-[14px] bg-white border border-slate-200 text-xs font-bold"
                >
                  <option value="English">{tr(language, "Dịch sang Tiếng Anh", "Translate to English")}</option>
                  <option value="Tiếng Việt">{tr(language, "Dịch sang Tiếng Việt", "Translate to Vietnamese")}</option>
                  <option value="Japanese">{tr(language, "Dịch sang Tiếng Nhật", "Translate to Japanese")}</option>
                </select>
                <button
                  onClick={() => handleSummarizeOrTranslate("translate-content")}
                  disabled={loading}
                  className="px-4 py-2 rounded-[14px] bg-[#a855f7] text-white text-xs font-bold cursor-pointer"
                >
                  {tr(language, "Dịch Thuật Ngữ", "Translate Terminology")}
                </button>
              </div>
              {resultText && (
                <div className="glass-liquid-card-purple p-4 rounded-[14px]">
                  <pre className="whitespace-pre-wrap font-sans text-xs text-slate-800">{resultText}</pre>
                </div>
              )}
            </div>
          )}

          {activeTool === "rag" && (
            <div className="glass-liquid-card p-4 sm:p-5 rounded-[14px] space-y-4">
              <h3 className="text-sm font-bold text-slate-900">
                {tr(language, "AI Knowledge Base / RAG (Grounding trên Tài liệu được phép)", "AI Knowledge Base / RAG (Permitted Document Grounding)")}
              </h3>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-600">
                  {tr(
                    language,
                    `Nội dung tài liệu nguồn bổ sung (kết hợp ${assets.length} học liệu trong Thư viện):`,
                    `Supplemental source content (combined with ${assets.length} library assets):`
                  )}
                </label>
                <textarea
                  rows={3}
                  value={customDocText}
                  onChange={(e) => setCustomDocText(e.target.value)}
                  className="w-full p-3 rounded-[14px] bg-white/90 border border-slate-200 text-xs outline-none"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={ragQuery}
                  onChange={(e) => setRagQuery(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-[14px] bg-white/90 border border-slate-200 text-xs outline-none"
                />
                <button
                  onClick={handleRagSearch}
                  disabled={loading}
                  className="px-4 py-2.5 rounded-[14px] bg-[#0d6efd] text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSearch className="w-4 h-4" />}
                  {tr(language, "Truy xuất RAG", "Query RAG")}
                </button>
              </div>
              {resultText && (
                <div className="glass-liquid-card-blue p-4 rounded-[14px]">
                  <pre className="whitespace-pre-wrap font-sans text-xs text-slate-800">{resultText}</pre>
                </div>
              )}
            </div>
          )}

          {activeTool === "analytics" && (
            <div className="glass-liquid-card p-4 sm:p-5 rounded-[14px] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {tr(language, "AI Learning Analytics — Cảnh báo rủi ro & Can thiệp sớm", "AI Learning Analytics — Risk Alerts & Early Intervention")}
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {tr(
                      language,
                      `Phân tích ${courses.length} khóa học & ${enrollments.length} lượt ghi danh hiện tại.`,
                      `Analyze ${courses.length} courses & ${enrollments.length} active enrollments.`
                    )}
                  </p>
                </div>
                <button
                  onClick={handleRunAnalytics}
                  disabled={loading}
                  className="px-4 py-2.5 rounded-[14px] bg-[#10b981] text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <BarChart3 className="w-4 h-4" />}
                  {tr(language, "Chạy Phân tích AI", "Run AI Analytics")}
                </button>
              </div>
              {resultText && (
                <div className="glass-liquid-card-emerald p-4 rounded-[14px]">
                  <pre className="whitespace-pre-wrap font-sans text-xs text-slate-800">{resultText}</pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Side: Conversation & Audit History */}
        <div className="xl:col-span-4 space-y-4">
          <div className="glass-liquid-card p-4 rounded-[14px] space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <History className="w-4 h-4 text-[#0d6efd]" />
                {tr(language, "Lịch sử tương tác AI phiên này", "Session AI Interaction History")}
              </h3>
              <span className="text-[10px] font-bold text-slate-500">
                {history.length} {tr(language, "mục", "items")}
              </span>
            </div>
            {history.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">
                {tr(
                  language,
                  "Chưa có tương tác AI nào. Chọn một Agent hoặc công cụ để bắt đầu.",
                  "No AI interactions yet. Pick an Agent or tool to get started."
                )}
              </p>
            ) : (
              <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                {history.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setResultText(item.output)}
                    className="p-3 rounded-[14px] bg-white/80 border border-slate-200/80 hover:border-[#0d6efd] cursor-pointer transition-all space-y-1"
                  >
                    <div className="flex items-center justify-between text-[10px] font-bold">
                      <span className="text-[#0d6efd]">{item.tool}</span>
                      <span className="text-slate-400">{item.time}</span>
                    </div>
                    <p className="text-xs font-bold text-slate-800 line-clamp-1">{item.prompt}</p>
                    <p className="text-[11px] text-slate-600 line-clamp-2">{item.output}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="glass-liquid-card-pink p-4 rounded-[14px] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-pink-900">
              <CheckCircle2 className="w-4 h-4 text-pink-600" />
              {tr(language, "Nguyên tắc Kiểm soát Con người", "Human-in-the-Loop Governance")}
            </div>
            <p className="text-[11px] text-pink-800 leading-relaxed">
              {tr(
                language,
                "Mọi đề cương khóa học, bài giảng và câu hỏi do AI sinh ra đều gắn nhãn Nháp (draft_pending_review), không tự động xuất bản trước khi Giảng viên xác nhận.",
                "All AI-generated course outlines, lessons, and quizzes are tagged as drafts (draft_pending_review) and never auto-publish without instructor approval."
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
