import React from 'react';
import { Search, Bell, Mail, ChevronDown } from 'lucide-react';
import { UserProfile } from '../../types';
import { DEFAULT_USERS } from '../../initialData';

interface HeaderProps {
  showNotificationsPanel: boolean;
  setShowNotificationsPanel: (show: boolean) => void;
  headerOpacity?: number;
  activeUser: UserProfile;
  setActiveUser: (user: UserProfile) => void;
  showProfileSwitcher: boolean;
  setShowProfileSwitcher: (show: boolean) => void;
  title: string;
}

export const Header = ({
  activeUser,
  setActiveUser,
  showProfileSwitcher,
  setShowProfileSwitcher,
  title,
  headerOpacity = 100,
  showNotificationsPanel,
  setShowNotificationsPanel
}: HeaderProps) => {
  return (
    <header 
      className="h-[68px] flex-none border-b border-slate-100 flex items-center justify-between px-6 z-10 shrink-0 bg-white" 
      style={{ 
        backgroundColor: `rgba(255, 255, 255, ${headerOpacity / 100})`, 
        backdropFilter: headerOpacity < 100 ? "blur(10px)" : "none" 
      }}
    >
      {/* LEFT / CENTER: Pill-shaped Search Bar (Spec: bg-white, rounded-full, px-11) */}
      <div className="flex-1 flex items-center max-w-md relative">
        <Search className="absolute left-4 w-4 h-4 text-[#64748b]" />
        <input 
          type="text" 
          placeholder="Tìm kiếm khóa học, bài học, tài liệu..." 
          className="pl-11 pr-5 py-2.5 w-full bg-white hover:bg-slate-50/50 border border-[#f3f4f6] rounded-full text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0d6efd]/30 transition-all text-[#1e293b] shadow-xs"
        />
      </div>

      {/* RIGHT: Notifications, Messages & User Profile */}
      <div className="flex items-center gap-3.5 relative">
        
        {/* Messages / Mail Icon */}
        <div className="relative">
          <button 
            onClick={() => setShowNotificationsPanel(!showNotificationsPanel)}
            className="p-2.5 text-[#64748b] hover:bg-slate-50 hover:text-[#1e293b] rounded-full transition-all relative cursor-pointer"
            title="Hộp thư thông báo"
          >
            <Mail className="w-4.5 h-4.5" />
            <span className="absolute top-1.5 right-1.5 bg-[#ec4899] text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white">
              2
            </span>
          </button>
        </div>

        {/* Notifications Icon */}
        <div className="relative">
          <button 
            onClick={() => setShowNotificationsPanel(!showNotificationsPanel)}
            className="p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-all relative cursor-pointer"
            title="Thông báo"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 bg-red-500 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white">
              3
            </span>
          </button>
          
          {showNotificationsPanel && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotificationsPanel(false)} />
              <div className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 p-4.5 z-[999] w-80 max-h-96 flex flex-col animate-in fade-in slide-in-from-top-3 duration-200">
                <div className="flex items-center justify-between border-b border-slate-50 pb-2 mb-2 shrink-0">
                  <h3 className="font-extrabold text-xs text-slate-800">Thông báo gần đây</h3>
                  <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full">3 mới</span>
                </div>
                <div className="flex-1 overflow-y-auto space-y-3 py-1">
                  <div className="flex gap-3 items-start p-2 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-slate-800">Cô Nguyễn Thu Hà đã đăng bài tập mới</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Vừa xong</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start p-2 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-slate-800">Bạn học đã tham gia bình luận nhóm</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">2 giờ trước</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start p-2 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-slate-800">Bài tập của bạn đã được chấm</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Hôm qua</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Profile Info with Switcher */}
        <button 
          onClick={() => setShowProfileSwitcher(!showProfileSwitcher)}
          className="flex items-center gap-2.5 hover:bg-slate-50 p-1.5 pr-2.5 rounded-xl transition-all cursor-pointer"
        >
          <img 
            src="/03_avatar_student.png" 
            alt={activeUser.name} 
            className="w-8.5 h-8.5 rounded-full object-cover border border-blue-100 shadow-sm shrink-0 bg-blue-50"
            onError={(e) => { e.currentTarget.src = activeUser.avatar; }}
            referrerPolicy="no-referrer"
          />
          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-slate-800 leading-tight flex items-center gap-1">
              {activeUser.name}
            </div>
            <div className="text-[10px] text-slate-400 leading-tight font-medium capitalize mt-0.5">
              {activeUser.role === 'teacher' ? 'Giáo viên' : 'Học viên'}
            </div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        </button>

        {showProfileSwitcher && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowProfileSwitcher(false)} />
            <div 
              className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-[999] flex flex-col gap-1 min-w-[220px] animate-in fade-in slide-in-from-top-3 duration-200"
            >
              <p className="px-2.5 py-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-1.5 mb-1 select-none">
                Chuyển đổi vai trò giả lập
              </p>
              {DEFAULT_USERS.slice(0, 3).map((user) => (
                <button
                  key={user.id}
                  onClick={() => {
                    setActiveUser(user);
                    localStorage.setItem("activeUser", JSON.stringify(user));
                    setShowProfileSwitcher(false);
                  }}
                  className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs text-left w-full transition-all hover:bg-slate-50 cursor-pointer ${
                    activeUser.id === user.id ? "bg-blue-50 text-blue-700 font-extrabold border border-blue-100" : "text-slate-600 border border-transparent"
                  }`}
                >
                  <img src={user.avatar} className="w-6 h-6 rounded-full object-cover shrink-0" referrerPolicy="no-referrer" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-[11px]">{user.name}</p>
                    <p className="text-[9px] text-slate-400 font-medium capitalize leading-none mt-0.5">{user.role === "teacher" ? "Giáo viên" : "Học viên"}</p>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </header>
  );
};
