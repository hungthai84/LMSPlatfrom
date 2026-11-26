import React, { useState } from "react";
import { Copy, Sparkles, Send, Share2, MessageSquare } from "lucide-react";
import { ClassItem, Announcement, UserProfile, Classwork } from "../types";
import { useLms } from "../contexts/LmsContext";
import { tr } from "../i18n/translations";

interface StreamTabProps {
  classItem: ClassItem;
  activeUser: UserProfile;
  announcements: Announcement[];
  classwork: Classwork[];
  onAddAnnouncement: (content: string) => void;
  onAddComment: (announcementId: string, content: string) => void;
  onCopyCode: (code: string) => void;
}

export default function StreamTab({
  classItem,
  activeUser,
  announcements,
  classwork,
  onAddAnnouncement,
  onAddComment,
  onCopyCode
}: StreamTabProps) {
  const { language } = useLms();
  const [isPosting, setIsPosting] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [commentInputs, setCommentInputs] = useState<{ [annId: string]: string }>({});
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  const classAnnouncements = announcements
    .filter((a) => a.classId === classItem.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const upcomingAssignments = classwork
    .filter((cw) => cw.classId === classItem.id && cw.type !== "material" && cw.dueDate)
    .slice(0, 3);

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;
    onAddAnnouncement(postContent);
    setPostContent("");
    setIsPosting(false);
  };

  const handleCommentSubmit = (announcementId: string) => {
    const text = commentInputs[announcementId];
    if (!text || !text.trim()) return;
    onAddComment(announcementId, text.trim());
    setCommentInputs((prev) => ({ ...prev, [announcementId]: "" }));
  };

  const handleAiRefineAnnouncement = async () => {
    if (!postContent.trim()) return;
    setIsAiGenerating(true);
    try {
      const response = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate-announcement",
          context: { announcementTopic: postContent }
        })
      });
      const data = await response.json();
      if (data.text) {
        setPostContent(data.text);
      } else if (data.error) {
        alert(tr(language, "Lỗi AI: ", "AI Error: ") + data.error);
      }
    } catch (err) {
      console.error(err);
      alert(tr(language, "Đã xảy ra lỗi khi kết nối với trợ lý AI.", "Failed to connect to the AI assistant."));
    } finally {
      setIsAiGenerating(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-2 sm:px-4 py-4 sm:py-6">
      {/* 1. Large Class Banner */}
      <div
        style={{ background: classItem.bannerGradient }}
        className="relative mb-6 overflow-hidden rounded-[14px] p-5 sm:p-8 text-white shadow-sm flex flex-col justify-end min-h-[150px] md:min-h-[200px]"
      >
        <div className="relative z-10">
          <h1 className="text-xl sm:text-2xl font-bold leading-tight md:text-3xl lg:text-4xl">
            {classItem.name}
          </h1>
          {classItem.section && (
            <p className="mt-1.5 text-xs sm:text-sm font-medium text-blue-50/90 md:text-base">
              {classItem.section}
            </p>
          )}
        </div>
        <div className="absolute inset-0 bg-black/10 mix-blend-multiply" />
      </div>

      {/* 2. Grid Columns */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
        {/* Left column: Class Code & Upcoming Deadlines */}
        <div className="md:col-span-1 space-y-4">
          <div className="glass-liquid-card-blue rounded-[14px] border border-white/60 p-4 shadow-sm select-none">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              {tr(language, "Mã lớp học", "Class code")}
            </h3>
            <div className="flex items-center justify-between">
              <code className="font-mono text-lg font-bold text-slate-900">
                {classItem.code}
              </code>
              <button
                onClick={() => onCopyCode(classItem.code)}
                className="rounded-[14px] p-1.5 hover:bg-white/70 text-blue-600 transition-colors"
                title={tr(language, "Sao chép mã lớp", "Copy class code")}
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-[11px] text-slate-500">
              {tr(language, "Chia sẻ mã này với học sinh để tự tham gia lớp học.", "Share this code with students so they can join the class.")}
            </p>
          </div>

          <div className="glass-liquid-card-orange rounded-[14px] border border-white/60 p-4 shadow-sm">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              {tr(language, "Sắp diễn ra", "Upcoming")}
            </h3>
            {upcomingAssignments.length === 0 ? (
              <p className="text-xs text-slate-500">{tr(language, "Tuyệt vời, không có bài tập nào sắp đến hạn!", "No work due soon!")}</p>
            ) : (
              <div className="space-y-3">
                {upcomingAssignments.map((cw) => (
                  <div key={cw.id} className="text-xs">
                    <p className="font-semibold text-slate-800 hover:underline cursor-pointer truncate">
                      {cw.title}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {tr(language, "Hạn nộp:", "Due:")} {cw.dueDate ? new Date(cw.dueDate).toLocaleDateString(language === "vi" ? "vi-VN" : "en-US") : tr(language, "Không có", "None")}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column: Post Announcement & Announcements Feed */}
        <div className="md:col-span-3 space-y-4">
          {!isPosting ? (
            <div
              onClick={() => setIsPosting(true)}
              className="glass-liquid-card flex items-center gap-3 rounded-[14px] border border-white/60 p-4 shadow-sm hover:shadow-md cursor-pointer transition-all"
            >
              <img
                src={activeUser.avatar}
                alt={activeUser.name}
                className="h-10 w-10 rounded-full object-cover shrink-0"
                referrerPolicy="no-referrer"
              />
              <span className="text-xs sm:text-sm text-slate-500 font-medium">
                {tr(language, "Thông báo nội dung nào đó cho lớp học của bạn...", "Announce something to your class...")}
              </span>
            </div>
          ) : (
            <form
              onSubmit={handlePostSubmit}
              className="glass-liquid-card rounded-[14px] border-2 border-blue-500 p-4 shadow-md transition-all"
            >
              <div className="flex items-start gap-3">
                <img
                  src={activeUser.avatar}
                  alt={activeUser.name}
                  className="h-10 w-10 rounded-full object-cover shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1">
                  <textarea
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    placeholder={tr(language, "Hãy viết thông báo, lời dặn dò, hoặc một chủ đề thảo luận...", "Write an announcement, reminder, or discussion topic...")}
                    className="w-full resize-none rounded-[14px] border border-white/60 bg-white/70 p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 min-h-[100px]"
                    autoFocus
                  />
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-white/50 pt-3">
                <button
                  type="button"
                  disabled={!postContent.trim() || isAiGenerating}
                  onClick={handleAiRefineAnnouncement}
                  className={`flex items-center gap-1.5 rounded-[14px] px-3 py-1.5 text-xs font-semibold border transition-all ${
                    postContent.trim()
                      ? "border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                      : "border-slate-200 bg-white/60 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  <Sparkles className={`h-3.5 w-3.5 ${isAiGenerating ? "animate-spin text-indigo-500" : "text-indigo-600"}`} />
                  {isAiGenerating ? tr(language, "AI đang viết...", "AI writing...") : tr(language, "Tối ưu bằng AI", "Refine with AI")}
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsPosting(false);
                      setPostContent("");
                    }}
                    className="rounded-[14px] px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-white/70"
                  >
                    {tr(language, "Hủy", "Cancel")}
                  </button>
                  <button
                    type="submit"
                    disabled={!postContent.trim()}
                    className={`flex items-center gap-1 rounded-[14px] px-5 py-2 text-xs font-semibold text-white shadow-sm transition-colors ${
                      postContent.trim() ? "bg-blue-600 hover:bg-blue-700" : "bg-slate-300 cursor-not-allowed"
                    }`}
                  >
                    <Send className="h-3 w-3" />
                    {tr(language, "Đăng", "Post")}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Announcements Feed */}
          <div className="space-y-4">
            {classAnnouncements.length === 0 ? (
              <div className="glass-liquid-card rounded-[14px] border border-white/60 p-8 text-center text-slate-500 shadow-sm">
                <Share2 className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                <p className="text-sm font-medium">{tr(language, "Bảng tin lớp học đang trống", "Class stream is empty")}</p>
                <p className="text-xs text-slate-400 mt-1">{tr(language, "Các thông báo mới nhất sẽ xuất hiện ở đây.", "Latest announcements will appear here.")}</p>
              </div>
            ) : (
              classAnnouncements.map((ann) => (
                <div
                  key={ann.id}
                  className="glass-liquid-card rounded-[14px] border border-white/60 p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={ann.authorAvatar}
                        alt={ann.authorName}
                        className="h-10 w-10 rounded-full object-cover border border-white"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">{ann.authorName}</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {new Date(ann.createdAt).toLocaleString(language === "vi" ? "vi-VN" : "en-US", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line pl-1 mb-4">
                    {ann.content}
                  </div>

                  <div className="border-t border-white/50 pt-3 mt-4">
                    {ann.comments.length > 0 && (
                      <div className="space-y-3 mb-4 pl-1">
                        <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-semibold uppercase tracking-wider">
                          <MessageSquare className="h-3 w-3" />
                          <span>{tr(language, `Nhận xét lớp học (${ann.comments.length})`, `Class comments (${ann.comments.length})`)}</span>
                        </div>
                        {ann.comments.map((comment) => (
                          <div key={comment.id} className="flex gap-2.5 items-start">
                            <img
                              src={comment.authorAvatar}
                              alt={comment.authorName}
                              className="h-7 w-7 rounded-full object-cover border border-white mt-0.5"
                              referrerPolicy="no-referrer"
                            />
                            <div className="bg-white/75 rounded-[14px] p-2.5 flex-1 text-xs border border-white/60">
                              <div className="flex items-center justify-between mb-0.5">
                                <span className="font-bold text-slate-800">{comment.authorName}</span>
                                <span className="text-[9px] text-slate-400">
                                  {new Date(comment.createdAt).toLocaleDateString(language === "vi" ? "vi-VN" : "en-US")}
                                </span>
                              </div>
                              <p className="text-slate-700 mt-0.5">{comment.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-2.5">
                      <img
                        src={activeUser.avatar}
                        alt={activeUser.name}
                        className="h-8 w-8 rounded-full object-cover border border-white"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 flex items-center border border-white/70 rounded-[14px] px-3 py-1.5 bg-white/75 focus-within:border-blue-500 focus-within:bg-white transition-all">
                        <input
                          type="text"
                          value={commentInputs[ann.id] || ""}
                          onChange={(e) =>
                            setCommentInputs((prev) => ({ ...prev, [ann.id]: e.target.value }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleCommentSubmit(ann.id);
                            }
                          }}
                          placeholder={tr(language, "Thêm nhận xét lớp học...", "Add a class comment...")}
                          className="flex-1 bg-transparent border-0 outline-none text-xs text-slate-700 placeholder-slate-400"
                        />
                        <button
                          onClick={() => handleCommentSubmit(ann.id)}
                          className={`rounded-[14px] p-1 transition-colors ${
                            (commentInputs[ann.id] || "").trim()
                              ? "text-blue-600 hover:bg-blue-50"
                              : "text-slate-300"
                          }`}
                        >
                          <Send className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
