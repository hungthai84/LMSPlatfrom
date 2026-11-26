import React, { useState, useEffect, useRef } from "react";
import { Sparkles, X, Send, Bot, User, BrainCircuit, Copy, Check } from "lucide-react";
import { Classwork } from "../types";
import { useLms } from "../contexts/LmsContext";
import { tr } from "../i18n/translations";

interface GeminiDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "syllabus" | "qna";
  contextClasswork?: Classwork | null;
  subjectName?: string;
}

interface Message {
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
}

export default function GeminiDrawer({
  isOpen,
  onClose,
  mode,
  contextClasswork,
  subjectName = ""
}: GeminiDrawerProps) {
  const { language } = useLms();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (mode === "syllabus") {
        setMessages([
          {
            sender: "ai",
            text: tr(
              language,
              `Xin chào! Tôi là Trợ lý AI giáo dục. Hãy nhập tên môn học hoặc nhấn nút bên dưới để tôi giúp soạn thảo một đề cương học tập 5 bài chi tiết cho môn học **"${subjectName || "Lập trình ReactJS"}"** nhé!`,
              `Hello! I'm your AI Educational Assistant. Enter a subject or press Send below to generate a detailed 5-lesson syllabus for **"${subjectName || "ReactJS Development"}"**!`
            ),
            timestamp: new Date()
          }
        ]);
        setInputValue(
          tr(
            language,
            `Hãy soạn thảo đề cương môn học chi tiết cho: ${subjectName || "Lập trình ReactJS"}`,
            `Create a detailed course syllabus for: ${subjectName || "ReactJS Development"}`
          )
        );
      } else if (mode === "qna") {
        setMessages([
          {
            sender: "ai",
            text: contextClasswork
              ? tr(
                  language,
                  `Xin chào! Tôi thấy bạn đang tìm hiểu về bài tập: **"${contextClasswork.title}"**.\n\nBạn có thắc mắc gì về lý thuyết hay cách triển khai bài tập này không? Hãy nhắn câu hỏi dưới đây!`,
                  `Hello! I see you're working on **"${contextClasswork.title}"**.\n\nAsk any question about concepts or implementation steps below!`
                )
              : tr(
                  language,
                  `Xin chào! Tôi là AI Tutor của EDU LMS. Hãy đặt câu hỏi học thuật, lập trình, thiết kế hoặc quản trị dự án để tôi gợi ý từng bước tư duy cho bạn!`,
                  `Hello! I'm the EDU LMS AI Tutor. Ask any question about programming, design, or project management and I'll guide you step by step!`
                ),
            timestamp: new Date()
          }
        ]);
        setInputValue("");
      }
    }
  }, [isOpen, mode, contextClasswork, subjectName, language]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userText, timestamp: new Date() }]);
    setInputValue("");
    setIsLoading(true);

    try {
      const bodyData =
        mode === "syllabus"
          ? {
              action: "generate-syllabus",
              context: { subjectName: subjectName || "Lập trình ReactJS" },
              prompt: userText
            }
          : {
              action: "ask-ai",
              context: { assignmentTitle: contextClasswork?.title || "Bài tập lớp học" },
              prompt: userText
            };

      const response = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData)
      });

      const data = await response.json();

      if (data.text) {
        setMessages((prev) => [
          ...prev,
          { sender: "ai", text: data.text, timestamp: new Date() }
        ]);
      } else if (data.error) {
        setMessages((prev) => [
          ...prev,
          { sender: "ai", text: `${tr(language, "Lỗi AI:", "AI Error:")} ${data.error}`, timestamp: new Date() }
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: tr(
            language,
            "Đã xảy ra lỗi khi kết nối với máy chủ AI. Vui lòng kiểm tra lại kết nối mạng.",
            "Failed to connect to the AI server. Please check your connection."
          ),
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyAll = () => {
    const aiTexts = messages
      .filter((m) => m.sender === "ai")
      .map((m) => m.text)
      .join("\n\n---\n\n");
    navigator.clipboard.writeText(aiTexts);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40"
      />

      <div className="fixed right-[15px] top-[15px] bottom-[15px] w-[calc(100vw-30px)] sm:w-full sm:max-w-lg rounded-[14px] overflow-hidden bg-slate-900/95 backdrop-blur-xl text-slate-100 z-50 shadow-2xl flex flex-col border border-white/15">
        {/* Header */}
        <div className="p-4 bg-[#1a2035] border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-[14px] bg-indigo-600 text-white shadow">
              <Sparkles className="h-4 w-4 animate-pulse text-yellow-300" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">
                {mode === "syllabus"
                  ? tr(language, "Trợ lý AI Soạn Đề Cương", "AI Syllabus Generator")
                  : tr(language, "Trợ lý Học Tập AI", "AI Study Tutor")}
              </h3>
              <p className="text-[10px] text-slate-400">EDU LMS Intelligence</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopyAll}
              className="rounded-[14px] p-1.5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              title={tr(language, "Sao chép nội dung hội thoại", "Copy conversation")}
            >
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            </button>
            <button
              onClick={onClose}
              className="rounded-[14px] p-1.5 hover:bg-white/10 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mode context banner */}
        <div className="px-4 py-2 bg-[#1e293b] text-xs text-indigo-200 border-b border-slate-800 flex items-center gap-2 shrink-0">
          <BrainCircuit className="h-4 w-4 text-indigo-400 shrink-0" />
          <span className="truncate">
            {mode === "syllabus"
              ? tr(language, `Chủ đề soạn thảo: "${subjectName || "Tổng quan lớp học"}"`, `Syllabus topic: "${subjectName || "Course overview"}"`)
              : tr(language, `Bối cảnh: "${contextClasswork?.title || "Học tập tổng quát"}"`, `Context: "${contextClasswork?.title || "General study"}"`)}
          </span>
        </div>

        {/* Chat Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 max-w-[88%] ${
                msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
              }`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-[14px] text-xs font-bold ${
                  msg.sender === "user" ? "bg-indigo-600 text-white" : "bg-slate-800 text-blue-400"
                }`}
              >
                {msg.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4 text-indigo-400" />}
              </div>

              <div
                className={`rounded-[14px] p-3 text-xs leading-relaxed whitespace-pre-line border ${
                  msg.sender === "user"
                    ? "bg-indigo-700/85 text-white border-indigo-600"
                    : "bg-slate-800 text-slate-200 border-slate-700/80"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 max-w-[85%] mr-auto">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[14px] bg-slate-800 text-blue-400">
                <Bot className="h-4 w-4 text-indigo-400 animate-bounce" />
              </div>
              <div className="rounded-[14px] p-3 text-xs bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-2">
                <div className="flex space-x-1.5">
                  <div className="h-2 w-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.3s]" />
                  <div className="h-2 w-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.15s]" />
                  <div className="h-2 w-2 rounded-full bg-indigo-500 animate-bounce" />
                </div>
                <span>{tr(language, "Trợ lý AI đang soạn câu trả lời...", "AI Assistant is typing...")}</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input box form */}
        <form onSubmit={handleSendMessage} className="p-4 bg-[#141b2d] border-t border-slate-800 shrink-0">
          <div className="flex items-center gap-2 bg-slate-800 rounded-[14px] px-4 py-2 border border-slate-700 focus-within:border-indigo-500 transition-colors">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={
                mode === "syllabus"
                  ? tr(language, "Ấn Gửi để AI bắt đầu viết đề cương...", "Press Send to generate syllabus...")
                  : tr(language, "Nhập câu hỏi học thuật tại đây...", "Enter your academic question here...")
              }
              className="flex-1 bg-transparent border-0 outline-none text-xs text-white placeholder-slate-500"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className={`rounded-[14px] p-1.5 transition-colors ${
                inputValue.trim() && !isLoading
                  ? "bg-indigo-600 text-white hover:bg-indigo-500"
                  : "bg-slate-700 text-slate-500"
              }`}
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="text-[10px] text-slate-500 text-center mt-2">
            {tr(language, "Mẹo: Yêu cầu AI dịch sang Tiếng Anh, giải thích mã code hoặc lấy ví dụ.", "Tip: Ask AI to translate, explain code, or give examples.")}
          </p>
        </form>
      </div>
    </>
  );
}
