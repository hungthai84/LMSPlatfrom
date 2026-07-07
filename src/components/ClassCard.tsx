import React from "react";
import { Folder, MoreVertical, Copy, ClipboardList } from "lucide-react";
import { ClassItem } from "../types";

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
  activeUserRole,
  cardOpacity = 100
}: ClassCardProps) {
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCopyCode(classItem.code);
  };

  return (
    <div 
      onClick={() => onSelect(classItem.id)}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 transition-all duration-200 hover:shadow-md cursor-pointer h-[280px]" style={{ backgroundColor: `rgba(255, 255, 255, ${cardOpacity / 100})`, backdropFilter: cardOpacity < 100 ? "blur(10px)" : "none" }}
    >
      {/* Top Header Banner */}
      <div 
        style={{ background: classItem.bannerGradient }} 
        className="relative flex flex-col justify-between p-6 text-white h-[130px] rounded-t-xl"
      >
        <div className="flex items-start justify-between">
          <div className="pr-4">
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
            className="rounded-full p-1.5 hover:bg-white/15 text-white/90"
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
      <div className="flex-1 p-6 pt-6 text-xs text-[#5f6368] border-b border-gray-100 flex flex-col justify-between select-none">
        <div>
          <p className="font-semibold text-[10px] text-gray-400 uppercase tracking-wider mb-2">
            Sắp diễn ra
          </p>
          <div className="flex items-center gap-2 text-gray-700 hover:text-blue-600 hover:underline">
            <ClipboardList className="h-4 w-4 text-gray-400 shrink-0" />
            <span className="truncate">Kiểm tra & thực hành Chương 1</span>
          </div>
        </div>

        {/* Class Code badge */}
        <div className="flex items-center justify-between mt-3 bg-gray-50 rounded px-2.5 py-1.5 border border-gray-100">
          <span className="font-medium text-[10px] uppercase text-gray-500">Mã lớp:</span>
          <div className="flex items-center gap-1.5">
            <code className="font-mono text-sm font-bold text-gray-800">{classItem.code}</code>
            <button 
              onClick={handleCopy}
              className="rounded p-1 hover:bg-gray-200 text-[#5f6368] transition-colors"
              title="Sao chép mã lớp"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="flex h-12 items-center justify-end px-4 gap-2 text-gray-500">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onSelect(classItem.id);
          }}
          className="rounded-full p-2 hover:bg-gray-100 hover:text-[#1e88e5]"
          title="Xem bài tập"
        >
          <ClipboardList className="h-5 w-5" />
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onSelect(classItem.id);
          }}
          className="rounded-full p-2 hover:bg-gray-100 hover:text-[#1e88e5]"
          title="Thư mục lớp học"
        >
          <Folder className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
