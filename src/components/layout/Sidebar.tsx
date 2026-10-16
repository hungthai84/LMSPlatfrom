import React from 'react';
import { 
  Home, 
  GraduationCap, 
  Calendar, 
  ClipboardList, 
  Award, 
  BookOpen, 
  Bell, 
  Users, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { UserProfile } from '../../types';

interface SidebarProps {
  isSidebarExpanded: boolean;
  setIsSidebarExpanded: (expanded: boolean) => void;
  selectedClassId: string | null;
  setSelectedClassId: (id: string | null) => void;
  setSelectedTab: (tab: "stream" | "classwork" | "people" | "grades") => void;
  showToast: (msg: string) => void;
  handleOpenSyllabusAI: () => void;
  setShowJoinModal: (show: boolean) => void;
  setJoinError: (err: string) => void;
  setJoinCode: (code: string) => void;
  activeUser: UserProfile;
  setActiveUser: (user: UserProfile) => void;
  setShowCreateClassModal: (show: boolean) => void;
  setShowSettingsModal: (show: boolean) => void;
  showProfileSwitcher: boolean;
  setShowProfileSwitcher: (show: boolean) => void;
  sidebarOpacity?: number;
  activeMainTab: "tongquan" | "khoahoc" | "lich" | "baitap" | "chungchi" | "thuvien" | "thongbao" | "congdong" | "caidat";
  setActiveMainTab: (tab: "tongquan" | "khoahoc" | "lich" | "baitap" | "chungchi" | "thuvien" | "thongbao" | "congdong" | "caidat") => void;
}

export const Sidebar = ({
  isSidebarExpanded,
  setIsSidebarExpanded,
  selectedClassId,
  setSelectedClassId,
  setSelectedTab,
  showToast,
  handleOpenSyllabusAI,
  setShowJoinModal,
  setJoinError,
  setJoinCode,
  activeUser,
  setActiveUser,
  setShowCreateClassModal,
  setShowSettingsModal,
  showProfileSwitcher,
  setShowProfileSwitcher,
  sidebarOpacity = 100,
  activeMainTab,
  setActiveMainTab
}: SidebarProps) => {

  // Menu items array matching the image
  const menuItems = [
    { id: "tongquan", label: "Tổng quan", icon: Home },
    { id: "khoahoc", label: "Khóa học của tôi", icon: GraduationCap },
    { id: "lich", label: "Lịch học", icon: Calendar },
    { id: "baitap", label: "Bài tập", icon: ClipboardList },
    { id: "chungchi", label: "Kỳ thi & Chứng chỉ", icon: Award },
    { id: "thuvien", label: "Thư viện", icon: BookOpen },
    { id: "thongbao", label: "Thông báo", icon: Bell },
    { id: "congdong", label: "Cộng đồng", icon: Users },
    { id: "caidat", label: "Cài đặt", icon: Settings },
  ] as const;

  const handleMenuClick = (tabId: typeof menuItems[number]["id"]) => {
    setSelectedClassId(null);
    setActiveMainTab(tabId);
    showToast(`Đã mở mục ${menuItems.find(item => item.id === tabId)?.label}`);
    
    if (tabId === "caidat") {
      setShowSettingsModal(true);
    }
  };

  return (
    <aside 
      className="flex flex-col pt-5 pb-4 shrink-0 relative transition-all duration-300 ease-in-out border-r border-[#f3f4f6] z-20 h-full bg-white select-none"
      style={{ 
        width: isSidebarExpanded ? "256px" : "72px", 
        backgroundColor: `rgba(255, 255, 255, ${sidebarOpacity / 100})`, 
        backdropFilter: sidebarOpacity < 100 ? "blur(10px)" : "none" 
      }}
    >
      {/* Collapse / Expand Toggle Button */}
      <button 
        onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
        className="absolute top-1/2 -right-3 -translate-y-1/2 z-30 w-6 h-6 bg-white rounded-full border border-slate-200 flex items-center justify-center shadow-sm hover:scale-110 text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
        title={isSidebarExpanded ? "Thu gọn danh mục" : "Mở rộng danh mục"}
      >
        {isSidebarExpanded ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
      </button>

      {/* TOP: Company Logo & Slogan (EduSmart - ONLINE LEARNING) */}
      <div 
        onClick={() => {
          setSelectedClassId(null);
          setActiveMainTab("tongquan");
          showToast("Quay về màn hình chính");
        }}
        className={`px-4 mb-4 flex items-center gap-3 cursor-pointer ${!isSidebarExpanded ? "justify-center" : "justify-start"}`}
      >
        {/* Logo Image Wrapper */}
        <div className="w-10 h-10 flex items-center justify-center shrink-0">
          <img src="/01_logo_edusmart.png" alt="EduSmart Logo" className="w-full h-full object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden'); }} />
          <div className="hidden w-10 h-10 bg-[#0d6efd] rounded-xl flex items-center justify-center shadow-md shrink-0">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
        </div>
        {isSidebarExpanded && (
          <div className="flex flex-col animate-in fade-in duration-300">
            <span className="font-extrabold text-base text-[#0d6efd] tracking-tight leading-none">
              EduSmart
            </span>
            <span className="text-[8px] font-black text-slate-400 tracking-widest uppercase mt-1 leading-none">
              ONLINE LEARNING
            </span>
          </div>
        )}
      </div>

      {/* Organization Selector (Spec: orange background #fff7ed, 12px radius) */}
      {isSidebarExpanded && (
        <div className="px-3 mb-3">
          <button 
            onClick={() => showToast("Đang mở bộ chọn học viện / tổ chức")}
            className="w-full bg-[#fff7ed] hover:bg-[#ffedd5] border border-[#ffedd5] rounded-[12px] p-2.5 flex items-center justify-between transition-all duration-300 cursor-pointer shadow-xs"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-lg bg-[#f97316] text-white flex items-center justify-center shrink-0 text-xs font-bold">
                ES
              </div>
              <div className="text-left truncate">
                <p className="text-xs font-extrabold text-[#9a3412] leading-none truncate">Học viện EduSmart</p>
                <p className="text-[9px] text-[#ea580c] font-medium leading-none mt-1">Học kỳ Fall 2026</p>
              </div>
            </div>
            <span className="text-[10px] text-[#ea580c] font-bold px-1.5 py-0.5 rounded-md bg-white/70">
              K26
            </span>
          </button>
        </div>
      )}

      {/* CENTER: Navigation Menu */}
      <div className="flex-1 flex flex-col gap-1 px-3 overflow-y-auto overflow-x-hidden py-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = !selectedClassId && activeMainTab === item.id;
          
          return (
            <div key={item.id} className="relative group w-full">
              <button 
                onClick={() => handleMenuClick(item.id)}
                className={`flex items-center gap-3 py-2.5 px-3 rounded-[12px] transition-all duration-300 text-xs font-semibold w-full cursor-pointer relative ${
                  isActive 
                    ? "bg-blue-50/80 text-[#0d6efd] font-extrabold shadow-xs" 
                    : "text-[#64748b] hover:bg-slate-50 hover:text-[#1e293b]"
                } ${!isSidebarExpanded ? "justify-center px-0" : ""}`}
              >
                {/* Rounded vertical indicator pill for active state */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#0d6efd] rounded-r-full" />
                )}
                <Icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? "text-[#0d6efd]" : "text-[#64748b] group-hover:text-[#1e293b]"}`} />
                {isSidebarExpanded && <span className="truncate">{item.label}</span>}
              </button>
              
              {!isSidebarExpanded && (
                <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-250 z-50 whitespace-nowrap shadow-md">
                  {item.label}
                </div>
              )}
            </div>
          );
        })}

        {/* Floating AI Helper quick action */}
        <div className="relative group w-full mt-2 pt-2 border-t border-slate-50">
          <button 
            onClick={() => {
              handleOpenSyllabusAI();
              showToast("Đã mở trợ lý AI");
            }}
            className={`flex items-center gap-3 py-2.5 rounded-xl text-slate-500 hover:bg-indigo-50/40 hover:text-indigo-700 transition-all text-xs font-semibold w-full cursor-pointer ${!isSidebarExpanded ? "justify-center px-0" : "px-3"}`}
          >
            <Sparkles className="w-4.5 h-4.5 shrink-0 text-indigo-500 animate-pulse" />
            {isSidebarExpanded && <span className="truncate">Trợ lý AI Đề cương</span>}
          </button>
          {!isSidebarExpanded && (
            <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-indigo-900 text-white text-[10px] font-bold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-250 z-50 whitespace-nowrap shadow-md">
              Trợ lý AI Đề cương
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM: Promo Upgrade Account Box */}
      {isSidebarExpanded && (
        <div className="mx-3 mt-auto mb-2 p-3.5 bg-gradient-to-br from-blue-50/70 to-indigo-50/40 rounded-2xl border border-blue-100/40 flex flex-col items-center text-center space-y-2.5">
          {/* Graphic mockup icon */}
          <div className="w-full flex items-center justify-center">
            <img src="/08_upgrade_illustration.png" alt="Upgrade Illustration" className="w-16 h-16 object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden'); }} />
            <div className="hidden w-10 h-10 rounded-full bg-blue-100/80 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-blue-600 fill-none stroke-blue-600 stroke-[2]">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-800 leading-tight">Nâng cấp tài khoản</h4>
            <p className="text-[10px] text-slate-400 font-medium leading-normal px-1">
              Mở khóa tất cả khóa học và tính năng nâng cao.
            </p>
          </div>
          <button 
            onClick={() => showToast("Đã kích hoạt yêu cầu nâng cấp Pro!")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] py-1.5 rounded-lg transition-colors cursor-pointer shadow-sm"
          >
            Nâng cấp ngay
          </button>
        </div>
      )}
    </aside>
  );
};
