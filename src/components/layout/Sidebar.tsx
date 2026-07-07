import React from 'react';
import { Home, GraduationCap, Sparkles, Bookmark, Search, Plus, Settings, Sliders, ChevronLeft, ChevronRight } from 'lucide-react';
import { UserProfile } from '../../types';
import { DEFAULT_USERS } from '../../initialData';

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
  sidebarOpacity = 100
}: SidebarProps) => {
  return (
    <aside 
      className="flex flex-col pt-5 pb-5 shrink-0 relative transition-all duration-300 ease-in-out border-r border-gray-200 z-20 h-full"
      style={{ width: "200px", backgroundColor: `rgba(255, 255, 255, ${sidebarOpacity / 100})`, backdropFilter: sidebarOpacity < 100 ? "blur(10px)" : "none" }}
    >
      {/* Collapse / Expand Toggle Button */}
      <button 
        onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
        className="absolute top-1/2 -right-3 -translate-y-1/2 z-30 w-6 h-6 bg-white rounded-full border border-gray-200 flex items-center justify-center shadow-sm hover:scale-110 text-gray-500 hover:text-gray-800 transition-all cursor-pointer"
        title={isSidebarExpanded ? "Thu gọn danh mục" : "Mở rộng danh mục"}
      >
        {isSidebarExpanded ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
      </button>

      {/* TOP: Company Logo & Slogan */}
      <div 
        onClick={() => {
          setSelectedClassId(null);
          showToast("Quay về màn hình chính");
        }}
        className={`px-4 mb-8 flex items-center gap-3 cursor-pointer select-none ${!isSidebarExpanded ? "justify-center" : "justify-start"}`}
      >
        <img 
          src="https://i.ibb.co/GvcmMgD3/Logo-Tr-ng.png" 
          alt="Logo" 
          className="h-8 w-8 object-contain rounded bg-blue-600 p-1 shadow-sm shrink-0"
        />
        {isSidebarExpanded && (
          <span className="font-bold text-base text-gray-800 tracking-tight whitespace-nowrap animate-in fade-in duration-300">
            Power Service
          </span>
        )}
      </div>

      {/* CENTER: Vertically & Horizontally Centered Menu Icons */}
      <div className="flex-1 flex flex-col justify-center gap-2 relative overflow-y-auto overflow-x-hidden">
        
        {/* Menu Item 1: Trang chủ */}
        <div className="relative group w-full px-2">
          <button 
            onClick={() => {
              setSelectedClassId(null);
              showToast("Màn hình chính Lớp học");
            }}
            className={`flex items-center gap-4 py-3 rounded-xl transition-all text-sm w-full ${
              !selectedClassId 
                ? "bg-blue-50 text-blue-700 font-bold" 
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            } ${!isSidebarExpanded ? "justify-center px-0" : "px-4"}`}
          >
            <Home className="w-5 h-5 shrink-0" />
            {isSidebarExpanded && <span className="truncate">Trang chủ</span>}
          </button>
          {!isSidebarExpanded && (
            <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 whitespace-nowrap">
              Trang chủ
            </div>
          )}
        </div>

        {/* Menu Item 2: Danh sách lớp học */}
        <div className="relative group w-full px-2">
          <button 
            onClick={() => {
               setSelectedClassId(null); // Or open a full class list page
               showToast("Danh sách tất cả lớp học");
            }}
            className={`flex items-center gap-4 py-3 rounded-xl transition-all text-sm w-full text-gray-600 hover:bg-gray-100 hover:text-gray-900 ${!isSidebarExpanded ? "justify-center px-0" : "px-4"}`}
          >
            <GraduationCap className="w-5 h-5 shrink-0" />
            {isSidebarExpanded && <span className="truncate">Danh sách lớp học</span>}
          </button>
          {!isSidebarExpanded && (
            <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 whitespace-nowrap">
              Danh sách lớp học
            </div>
          )}
        </div>

        {/* Menu Item 3: Trợ lý AI */}
        <div className="relative group w-full px-2">
          <button 
            onClick={() => {
              handleOpenSyllabusAI();
              showToast("Kích hoạt Trợ lý Đề cương AI");
            }}
            className={`flex items-center gap-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all text-sm w-full ${!isSidebarExpanded ? "justify-center px-0" : "px-4"}`}
          >
            <Sparkles className="w-5 h-5 shrink-0 text-indigo-500 animate-pulse" />
            {isSidebarExpanded && <span className="truncate">Trợ lý AI Đề cương</span>}
          </button>
          {!isSidebarExpanded && (
            <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 whitespace-nowrap">
              Trợ lý AI Đề cương
            </div>
          )}
        </div>

        {/* Menu Item 4: Bài tập lớp học */}
        <div className="relative group w-full px-2">
          <button 
            onClick={() => {
              if (selectedClassId) {
                setSelectedTab("classwork");
                showToast("Mở danh mục Bài tập");
              } else {
                showToast("Vui lòng chọn một lớp học từ danh sách trước!");
              }
            }}
            className={`flex items-center gap-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all text-sm w-full ${!isSidebarExpanded ? "justify-center px-0" : "px-4"}`}
          >
            <Bookmark className="w-5 h-5 shrink-0 text-emerald-500" />
            {isSidebarExpanded && <span className="truncate">Bài tập lớp học</span>}
          </button>
          {!isSidebarExpanded && (
            <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 whitespace-nowrap">
              Bài tập lớp học
            </div>
          )}
        </div>

        {/* Menu Item 5: Tham gia lớp học */}
        <div className="relative group w-full px-2">
          <button 
            onClick={() => {
              setJoinError("");
              setJoinCode("");
              setShowJoinModal(true);
            }}
            className={`flex items-center gap-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all text-sm w-full ${!isSidebarExpanded ? "justify-center px-0" : "px-4"}`}
          >
            <Search className="w-5 h-5 shrink-0 text-gray-500" />
            {isSidebarExpanded && <span className="truncate">Tham gia lớp học</span>}
          </button>
          {!isSidebarExpanded && (
            <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 whitespace-nowrap">
              Tham gia lớp học
            </div>
          )}
        </div>

        {/* Menu Item 6: Tạo lớp học */}
        <div className="relative group w-full px-2">
          <button 
            onClick={() => {
              if (activeUser.role !== "teacher") {
                const upgradedUser = { ...activeUser, role: "teacher" as const };
                setActiveUser(upgradedUser);
                localStorage.setItem("activeUser", JSON.stringify(upgradedUser));
                showToast("Đã tự động chuyển đổi vai trò sang Giáo viên để tạo lớp học!");
              }
              setShowCreateClassModal(true);
            }}
            className={`flex items-center gap-4 py-3 rounded-xl text-blue-600 hover:bg-blue-50 transition-all text-sm w-full font-semibold ${!isSidebarExpanded ? "justify-center px-0" : "px-4"}`}
          >
            <Plus className="w-5 h-5 shrink-0 text-blue-500" />
            {isSidebarExpanded && <span className="truncate">Tạo lớp học mới</span>}
          </button>
          {!isSidebarExpanded && (
            <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 whitespace-nowrap">
              Tạo lớp học mới
            </div>
          )}
        </div>

      </div>

      {/* BOTTOM: Notifications, Settings, Profile */}
      <div className="flex flex-col gap-4 px-2 mt-auto border-t border-gray-100 pt-4 items-center">
        
        {/* Bottom 1: Settings */}
        <div className="relative group w-full px-1">
          <button 
            onClick={() => setShowSettingsModal(true)}
            className={`flex items-center gap-4 py-2.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-all text-sm w-full ${!isSidebarExpanded ? "justify-center px-0" : "px-4"}`}
          >
            <Settings className="w-5 h-5 shrink-0 text-gray-600" />
            {isSidebarExpanded && <span className="truncate font-medium">Cài đặt hiển thị</span>}
          </button>
          {!isSidebarExpanded && (
            <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 whitespace-nowrap">
              Cài đặt hiển thị
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
