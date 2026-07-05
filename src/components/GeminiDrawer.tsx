import React, { useState, useEffect, useRef } from "react";
import { Sparkles, X, Send, Bot, User, BrainCircuit, Copy, Check } from "lucide-react";
import { Classwork } from "../types";

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
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-generate syllabus when opened in syllabus mode
  useEffect(() => {
    if (isOpen) {
      if (mode === "syllabus") {
        setMessages([
          {
            sender: "ai",
            text: `Xin chào! Tôi là Trợ lý AI giáo dục. Hãy nhập tên môn học hoặc nhấn nút bên dưới để tôi giúp soạn thảo một đề cương học tập 5 bài chi tiết cho môn học **"${subjectName || "Lập trình ReactJS"}"** nhé!`,
            timestamp: new Date()
          }
        ]);
        setInputValue(`Hãy soạn thảo đề cương môn học chi tiết cho: ${subjectName || "Lập trình ReactJS"}`);
      } else if (mode === "qna" && contextClasswork) {
        setMessages([
          {
            sender: "ai",
            text: `Xin chào! Tôi thấy bạn đang tìm hiểu về bài tập: **"${contextClasswork.title}"**.\n\nBạn có gặp khó khăn hay thắc mắc gì về lý thuyết hay cách triển khai bài tập này không? Hãy nhắn câu hỏi dưới đây, tôi sẽ hướng dẫn từng bước tư duy cho bạn nhé! (Tôi sẽ gợi ý hướng giải thay vì cung cấp lời giải trực tiếp để giúp bạn học tập tốt nhất)`,
            timestamp: new Date()
          }
        ]);
        setInputValue("");
      }
    }
  }, [isOpen, mode, contextClasswork, subjectName]);

  // Scroll to bottom on new message
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
      let bodyData: any = {};

      if (mode === "syllabus") {
        bodyData = {
          action: "generate-syllabus",
          context: { subjectName: subjectName || "Lập trình ReactJS" },
          prompt: userText
        };
      } else {
        bodyData = {
          action: "ask-ai",
          context: { assignmentTitle: contextClasswork?.title || "Bài tập lớp học" },
          prompt: userText
        };
      }

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
          { sender: "ai", text: `Lỗi AI: ${data.error}`, timestamp: new Date() }
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Đã xảy ra lỗi khi kết nối với máy chủ AI. Vui lòng kiểm tra lại kết nối mạng.",
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
      {/* Backdrop overlay */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/30 z-40 animate-in fade-in duration-200"
      />

      {/* Drawer Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-gray-900 text-gray-100 z-50 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200 border-l border-gray-800">
        
        {/* Header */}
        <div className="p-4 bg-[#1a2035] border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-indigo-600 text-white shadow">
              <Sparkles className="h-4 w-4 animate-pulse text-yellow-300" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">
                {mode === "syllabus" ? "Trợ lý AI Soạn Đề Cương" : "Trợ lý Học Tập AI"}
              </h3>
              <p className="text-[10px] text-gray-400">Powered by Gemini 3.5 Flash</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopyAll}
              className="rounded p-1.5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              title="Sao chép nội dung hội thoại"
            >
              {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
            </button>
            <button
              onClick={onClose}
              className="rounded p-1.5 hover:bg-white/10 text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mode context description banner */}
        <div className="px-4 py-2 bg-[#1e293b] text-xs text-indigo-200 border-b border-gray-800 flex items-center gap-2">
          <BrainCircuit className="h-4 w-4 text-indigo-400 shrink-0" />
          <span className="truncate">
            {mode === "syllabus"
              ? `Chủ đề soạn thảo: "${subjectName || "Tổng quan lớp học"}"`
              : `Bối cảnh: Bài tập "${contextClasswork?.title}"`}
          </span>
        </div>

        {/* Chat Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 max-w-[85%] ${
                msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
              }`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full text-xs font-bold ${
                  msg.sender === "user" ? "bg-indigo-600 text-white" : "bg-gray-800 text-[#1e88e5]"
                }`}
              >
                {msg.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4 text-indigo-400" />}
              </div>

              <div
                className={`rounded-lg p-3 text-xs leading-relaxed whitespace-pre-line border ${
                  msg.sender === "user"
                    ? "bg-indigo-700/85 text-white border-indigo-600"
                    : "bg-gray-800 text-gray-200 border-gray-700/80"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* AI Loading state */}
          {isLoading && (
            <div className="flex gap-3 max-w-[85%] mr-auto">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-800 text-[#1e88e5]">
                <Bot className="h-4 w-4 text-indigo-400 animate-bounce" />
              </div>
              <div className="rounded-lg p-3 text-xs bg-gray-800 text-gray-400 border border-gray-700 flex items-center gap-2">
                <div className="flex space-x-1.5">
                  <div className="h-2 w-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.3s]" />
                  <div className="h-2 w-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.15s]" />
                  <div className="h-2 w-2 rounded-full bg-indigo-500 animate-bounce" />
                </div>
                <span>Trợ lý AI đang soạn câu trả lời...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input box form */}
        <form onSubmit={handleSendMessage} className="p-4 bg-[#141b2d] border-t border-gray-800">
          <div className="flex items-center gap-2 bg-gray-800 rounded-full px-4 py-2 border border-gray-700 focus-within:border-indigo-500 transition-colors">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={
                mode === "syllabus"
                  ? "Ấn Gửi để AI bắt đầu viết đề cương..."
                  : "Nhập câu hỏi học thuật tại đây..."
              }
              className="flex-1 bg-transparent border-0 outline-none text-xs text-white placeholder-gray-500"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className={`rounded-full p-1.5 transition-colors ${
                inputValue.trim() && !isLoading
                  ? "bg-indigo-600 text-white hover:bg-indigo-500"
                  : "bg-gray-700 text-gray-500"
              }`}
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="text-[10px] text-gray-500 text-center mt-2">
            Mẹo: Bạn có thể yêu cầu AI dịch sang Tiếng Anh, giải thích mã code hoặc lấy ví dụ minh họa.
          </p>
        </form>
      </div>
    </>
  );
}
