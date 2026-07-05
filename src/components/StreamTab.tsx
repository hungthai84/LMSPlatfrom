import React, { useState } from "react";
import { Copy, Sparkles, Send, Share2, ClipboardList, MessageSquare } from "lucide-react";
import { ClassItem, Announcement, UserProfile, Comment, Classwork } from "../types";

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
  const [isPosting, setIsPosting] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [commentInputs, setCommentInputs] = useState<{ [annId: string]: string }>({});
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // Filter announcements for this class
  const classAnnouncements = announcements
    .filter((a) => a.classId === classItem.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Filter classwork for upcoming deadlines
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

  // Call server-side Gemini API to optimize or expand teacher announcement
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
        alert("Lỗi AI: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Đã xảy ra lỗi khi kết nối với trợ lý AI.");
    } finally {
      setIsAiGenerating(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      {/* 1. Large Class Banner */}
      <div
        style={{ background: classItem.bannerGradient }}
        className="relative mb-6 overflow-hidden rounded-lg p-6 text-white md:p-8 shadow-sm flex flex-col justify-end min-h-[160px] md:min-h-[200px]"
      >
        <div className="relative z-10">
          <h1 className="text-2xl font-bold leading-tight md:text-3xl lg:text-4xl">
            {classItem.name}
          </h1>
          {classItem.section && (
            <p className="mt-1.5 text-sm font-medium text-blue-50/90 md:text-base">
              {classItem.section}
            </p>
          )}
        </div>
        
        {/* Subtle decorative grid/overlay */}
        <div className="absolute inset-0 bg-black/10 mix-blend-multiply" />
      </div>

      {/* 2. Grid Columns */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {/* Left column: Class Code & Upcoming Deadlines (Desktop) */}
        <div className="md:col-span-1 space-y-4">
          {/* Class Code Card */}
          <div className="rounded-lg border border-[#dadce0] bg-white p-4 shadow-sm select-none">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Mã lớp học
            </h3>
            <div className="flex items-center justify-between">
              <code className="font-mono text-lg font-bold text-gray-900">
                {classItem.code}
              </code>
              <button
                onClick={() => onCopyCode(classItem.code)}
                className="rounded p-1.5 hover:bg-gray-100 text-[#1e88e5] transition-colors"
                title="Sao chép mã lớp"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-[10px] text-gray-400">
              Chia sẻ mã này với học sinh để họ tự tham gia vào lớp học.
            </p>
          </div>

          {/* Upcoming Tasks Card */}
          <div className="rounded-lg border border-[#dadce0] bg-white p-4 shadow-sm">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              Sắp diễn ra
            </h3>
            {upcomingAssignments.length === 0 ? (
              <p className="text-xs text-gray-400"> tuyệt vời, không có bài tập nào sắp đến hạn!</p>
            ) : (
              <div className="space-y-3.5">
                {upcomingAssignments.map((cw) => (
                  <div key={cw.id} className="text-xs">
                    <p className="font-semibold text-gray-700 hover:underline cursor-pointer truncate">
                      {cw.title}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      Hạn nộp: {cw.dueDate ? new Date(cw.dueDate).toLocaleDateString("vi-VN") : "Không có"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column: Post Announcement & Announcements Feed */}
        <div className="md:col-span-3 space-y-4">
          {/* Post Box */}
          {!isPosting ? (
            <div
              onClick={() => setIsPosting(true)}
              className="flex items-center gap-3 rounded-lg border border-[#dadce0] bg-white p-4 shadow-sm hover:shadow-md cursor-pointer transition-shadow"
            >
              <img
                src={activeUser.avatar}
                alt={activeUser.name}
                className="h-10 w-10 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="text-xs text-gray-500 font-medium">
                Thông báo nội dung nào đó cho lớp học của bạn...
              </span>
            </div>
          ) : (
            <form
              onSubmit={handlePostSubmit}
              className="rounded-lg border-2 border-blue-500 bg-white p-4 shadow-md transition-all animate-in fade-in-50 duration-200"
            >
              <div className="flex items-start gap-3">
                <img
                  src={activeUser.avatar}
                  alt={activeUser.name}
                  className="h-10 w-10 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1">
                  <textarea
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    placeholder="Hãy viết thông báo, lời dặn dò, hoặc một chủ đề thảo luận..."
                    className="w-full resize-none border-0 p-1 text-sm outline-none focus:ring-0 min-h-[100px]"
                    autoFocus
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                {/* AI Helper for Post */}
                <button
                  type="button"
                  disabled={!postContent.trim() || isAiGenerating}
                  onClick={handleAiRefineAnnouncement}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold border transition-all ${
                    postContent.trim()
                      ? "border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                      : "border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed"
                  }`}
                  title="Sử dụng Gemini AI để mở rộng và trau chuốt lời văn"
                >
                  <Sparkles className={`h-3.5 w-3.5 ${isAiGenerating ? "animate-spin text-indigo-500" : "text-indigo-600"}`} />
                  {isAiGenerating ? "AI đang viết..." : "Tối ưu bằng AI"}
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsPosting(false);
                      setPostContent("");
                    }}
                    className="rounded px-4 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-100"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={!postContent.trim()}
                    className={`flex items-center gap-1 rounded px-5 py-2 text-xs font-semibold text-white shadow-sm transition-colors ${
                      postContent.trim() ? "bg-[#1e88e5] hover:bg-[#1565c0]" : "bg-gray-300 cursor-not-allowed"
                    }`}
                  >
                    <Send className="h-3 w-3" />
                    Đăng
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Announcements Feed */}
          <div className="space-y-4">
            {classAnnouncements.length === 0 ? (
              <div className="rounded-lg border border-[#dadce0] bg-white p-8 text-center text-gray-500 shadow-sm">
                <Share2 className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                <p className="text-sm font-medium">Bảng tin lớp học đang trống</p>
                <p className="text-xs text-gray-400 mt-1">Các thông báo mới nhất sẽ xuất hiện ở đây.</p>
              </div>
            ) : (
              classAnnouncements.map((ann) => (
                <div
                  key={ann.id}
                  className="rounded-lg border border-[#dadce0] bg-white p-4 shadow-sm"
                >
                  {/* Announcement Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={ann.authorAvatar}
                        alt={ann.authorName}
                        className="h-10 w-10 rounded-full object-cover border border-gray-100"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-gray-800">{ann.authorName}</h4>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {new Date(ann.createdAt).toLocaleString("vi-VN", {
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

                  {/* Announcement Content */}
                  <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line pl-1 mb-4">
                    {ann.content}
                  </div>

                  {/* Comments Section */}
                  <div className="border-t border-gray-100 pt-3 mt-4">
                    {ann.comments.length > 0 && (
                      <div className="space-y-3.5 mb-4 pl-1">
                        <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-semibold uppercase tracking-wider">
                          <MessageSquare className="h-3 w-3" />
                          <span>Nhận xét lớp học ({ann.comments.length})</span>
                        </div>
                        {ann.comments.map((comment) => (
                          <div key={comment.id} className="flex gap-2.5 items-start">
                            <img
                              src={comment.authorAvatar}
                              alt={comment.authorName}
                              className="h-7 w-7 rounded-full object-cover border border-gray-100 mt-0.5"
                              referrerPolicy="no-referrer"
                            />
                            <div className="bg-gray-50 rounded-lg p-2.5 flex-1 text-xs">
                              <div className="flex items-center justify-between mb-0.5">
                                <span className="font-bold text-gray-800">{comment.authorName}</span>
                                <span className="text-[9px] text-gray-400">
                                  {new Date(comment.createdAt).toLocaleDateString("vi-VN")}
                                </span>
                              </div>
                              <p className="text-gray-700 mt-0.5">{comment.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Write a Comment box */}
                    <div className="flex items-center gap-2.5">
                      <img
                        src={activeUser.avatar}
                        alt={activeUser.name}
                        className="h-8 w-8 rounded-full object-cover border border-gray-100"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 flex items-center border border-[#dadce0] rounded-full px-3 py-1.5 bg-gray-50 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-1 focus-within:ring-blue-500 transition-all">
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
                          placeholder="Thêm nhận xét lớp học..."
                          className="flex-1 bg-transparent border-0 outline-none text-xs text-gray-700 placeholder-gray-400"
                        />
                        <button
                          onClick={() => handleCommentSubmit(ann.id)}
                          className={`rounded-full p-1 transition-colors ${
                            (commentInputs[ann.id] || "").trim()
                              ? "text-[#1e88e5] hover:bg-blue-50"
                              : "text-gray-300"
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
