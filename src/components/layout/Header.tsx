import React from 'react';
import { Search, Bell } from 'lucide-react';
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
    <header className="h-[68px] flex-none border-b border-gray-200 flex items-center justify-between px-6 z-10 shrink-0" style={{ backgroundColor: `rgba(255, 255, 255, ${headerOpacity / 100})`, backdropFilter: headerOpacity < 100 ? "blur(10px)" : "none" }}>
      <div className="flex items-center gap-4">
        <span className="text-6xl font-display font-semibold tracking-tight">{title}</span>
      </div>

      {/* Công cụ bên phải Header */}
      <div className="flex items-center gap-4 relative">
        {/* Thanh tìm kiếm tinh tế */}
        <div className="relative hidden md:flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Tìm kiếm..." 
            className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-[10px] text-[13px] w-64 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-colors"
          />
        </div>
        
        
        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotificationsPanel(!showNotificationsPanel)}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
          </button>
          
          {showNotificationsPanel && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotificationsPanel(false)} />
              <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 p-4 z-[999] w-80 max-h-96 flex flex-col">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-2 shrink-0">
                  <h3 className="font-bold text-gray-800">Thông báo</h3>
                  <span className="text-xs text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full">3 mới</span>
                </div>
                <div className="flex-1 overflow-y-auto space-y-3">
                  <div className="flex gap-3 items-start p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Giáo viên đã đăng bài tập mới</p>
                      <p className="text-xs text-gray-500 mt-0.5">Vừa xong</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Bùi Minh Cường đã bình luận</p>
                      <p className="text-xs text-gray-500 mt-0.5">2 giờ trước</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer opacity-60">
                    <div className="w-2 h-2 rounded-full bg-transparent mt-1.5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Bài tập của bạn đã được chấm</p>
                      <p className="text-xs text-gray-500 mt-0.5">Hôm qua</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Avatar Người dùng */}
        <button 
          onClick={() => setShowProfileSwitcher(!showProfileSwitcher)}
          className="flex items-center gap-2 hover:bg-gray-50 p-1.5 pr-3 rounded-[10px] transition-colors"
        >
          <img 
            src={activeUser.avatar} 
            alt={activeUser.name} 
            className="w-8 h-8 rounded-full object-cover border border-white shadow-sm shrink-0"
            referrerPolicy="no-referrer"
          />
          <div className="hidden sm:block text-left">
            <div className="text-[13px] font-semibold text-gray-900 leading-tight">{activeUser.name}</div>
            <div className="text-[11px] text-gray-500 leading-tight capitalize">{activeUser.role === 'teacher' ? 'Giáo viên' : 'Học sinh'}</div>
          </div>
        </button>

        {showProfileSwitcher && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowProfileSwitcher(false)} />
            <div 
              className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 p-2 z-[999] flex flex-col gap-1 min-w-[220px]"
            >
              <p className="px-2.5 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-1 mb-1 select-none">
                Chuyển đổi vai trò giả lập
              </p>
              {DEFAULT_USERS.map((user) => (
                <button
                  key={user.id}
                  onClick={() => {
                    setActiveUser(user);
                    localStorage.setItem("activeUser", JSON.stringify(user));
                    setShowProfileSwitcher(false);
                  }}
                  className={`flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-xs text-left w-full transition-all hover:bg-gray-50 ${
                    activeUser.id === user.id ? "bg-blue-50 text-blue-700 font-bold border border-blue-100" : "text-gray-700 border border-transparent"
                  }`}
                >
                  <img src={user.avatar} className="w-5 h-5 rounded-full object-cover shrink-0" referrerPolicy="no-referrer" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{user.name}</p>
                    <p className="text-[9px] text-gray-400 capitalize leading-none mt-0.5">{user.role === "teacher" ? "Giáo viên" : "Học sinh"}</p>
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
