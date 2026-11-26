import React from "react";
import { Folder, MoreVertical, Copy, ClipboardList } from "lucide-react";
import { ClassItem } from "../types";
import { useLms } from "../contexts/LmsContext";
import { tr } from "../i18n/translations";

interface ClassCardProps {
  cardOpacity?: number;
  key?: string;
  classItem: ClassItem;
  onSelect: (id: string) => void;
  onCopyCode: (code: string) => void;
  activeUserRole: "teacher" | "student";
}

export default function ClassCard({
  classItem,
  onSelect,
  onCopyCode,
  cardOpacity = 100
}: ClassCardProps) {
  const { language } = useLms();
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCopyCode(classItem.code);
  };

  return (
    <div
      onClick={() => onSelect(classItem.id)}
      className="glass-liquid-card group relative flex flex-col overflow-hidden rounded-[14px] border border-white/60 transition-all duration-200 hover:shadow-lg cursor-pointer h-[280px]"
      style={cardOpacity < 100 ? { backgroundColor: `rgba(255, 255, 255, ${cardOpacity / 100})` } : undefined}
    >
      {/* Top Header Banner */}
      <div
        style={{ background: classItem.bannerGradient }}
        className="relative flex flex-col justify-between p-5 sm:p-6 text-white h-[130px] rounded-t-[14px]"
      >
        <div className="flex items-start justify-between">
          <div className="pr-4 min-w-0">
            <h3 className="line-clamp-1 text-lg font-bold hover:underline select-none">
              {classItem.name}
            </h3>
            {classItem.section && (
              <p className="line-clamp-1 text-xs text-blue-50/95 font-medium mt-0.5">
                {classItem.section}
              </p>
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="rounded-[14px] p-1.5 hover:bg-white/15 text-white/90 shrink-0"
          >
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>

        {/* Teacher name */}
        <p className="text-xs text-white/90 font-medium select-none truncate">
          {classItem.teacherName}
        </p>
      </div>

      {/* Teacher Avatar Floats Over Banner Bottom */}
      <div className="absolute right-4 top-[85px] z-10">
        <img
          src={classItem.teacherAvatar}
          alt={classItem.teacherName}
          className="h-[60px] w-[60px] rounded-full border-4 border-white bg-white object-cover shadow-sm"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Card Content - Upcoming Tasks */}
      <div className="flex-1 p-5 pt-6 text-xs text-slate-600 border-b border-white/50 flex flex-col justify-between select-none">
        <div>
          <p className="font-semibold text-[10px] text-slate-400 uppercase tracking-wider mb-1.5">
            {tr(language, "Sắp diễn ra", "Upcoming")}
          </p>
          <div className="flex items-center gap-2 text-slate-700 hover:text-blue-600 hover:underline">
            <ClipboardList className="h-4 w-4 text-slate-400 shrink-0" />
            <span className="truncate">{tr(language, "Kiểm tra & thực hành Chương 1", "Chapter 1 Quiz & Practice")}</span>
          </div>
        </div>

        {/* Class Code badge */}
        <div className="flex items-center justify-between mt-3 bg-white/70 rounded-[14px] px-3 py-1.5 border border-white/70">
          <span className="font-medium text-[10px] uppercase text-slate-500">{tr(language, "Mã lớp:", "Code:")}</span>
          <div className="flex items-center gap-1.5">
            <code className="font-mono text-sm font-bold text-slate-800">{classItem.code}</code>
            <button
              onClick={handleCopy}
              className="rounded-[14px] p-1 hover:bg-slate-200/70 text-slate-600 transition-colors"
              title={tr(language, "Sao chép mã lớp", "Copy class code")}
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="flex h-12 items-center justify-end px-4 gap-2 text-slate-500">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(classItem.id);
          }}
          className="rounded-[14px] p-2 hover:bg-white/70 hover:text-blue-600 transition-colors"
          title={tr(language, "Xem bài tập", "View classwork")}
        >
          <ClipboardList className="h-5 w-5" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(classItem.id);
          }}
          className="rounded-[14px] p-2 hover:bg-white/70 hover:text-blue-600 transition-colors"
          title={tr(language, "Thư mục lớp học", "Class folder")}
        >
          <Folder className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
