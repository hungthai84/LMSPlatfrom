import React, { useState } from "react";
import { Menu, Plus, GraduationCap, ChevronDown, Sparkles, User, LogOut } from "lucide-react";
import { UserProfile } from "../types";

interface NavbarProps {
  activeUser: UserProfile;
  allUsers: UserProfile[];
  onUserChange: (user: UserProfile) => void;
  onOpenJoinClass: () => void;
  onOpenCreateClass: () => void;
  onGoHome: () => void;
  currentClassName?: string;
  onOpenSyllabusAI: () => void;
}

export default function Navbar({
  activeUser,
  allUsers,
  onUserChange,
  onOpenJoinClass,
  onOpenCreateClass,
  onGoHome,
  currentClassName,
  onOpenSyllabusAI
}: NavbarProps) {
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-[#dadce0] bg-white px-4">
      {/* Left side: Menu icon & Logo */}
      <div className="flex items-center gap-3">
        <button className="rounded-full p-2 text-[#5f6368] hover:bg-gray-100">
          <Menu className="h-6 w-6" />
        </button>
        <div 
          onClick={onGoHome}
          className="flex cursor-pointer items-center gap-2 select-none"
        >
          {/* Logo Badge like Google Classroom */}
          <div className="flex h-9 w-9 items-center justify-center rounded bg-[#1e88e5] text-white shadow-sm">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="hidden text-xl font-medium text-[#5f6368] sm:block">
            <span className="font-semibold text-gray-800">Google</span> Lớp học
          </span>
          {currentClassName && (
            <div className="flex items-center gap-2 text-sm text-[#5f6368]">
              <span className="text-[#dadce0]">/</span>
              <span className="font-medium max-w-[120px] truncate md:max-w-[200px]">
                {currentClassName}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Right side: AI Helper, Add Button, Active Role Switcher, Profile */}
      <div className="flex items-center gap-2">
        {/* Quick Syllabus AI Tool (Simulated Teacher Assistance or Helper) */}
        {activeUser.role === "teacher" && (
          <button 
            onClick={onOpenSyllabusAI}
            className="flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-500 animate-pulse" />
            <span className="hidden md:inline">Trợ lý AI Đề cương</span>
          </button>
        )}

        {/* Plus menu (Create/Join Class) */}
        <div className="relative">
          <button
            onClick={() => {
              setShowPlusMenu(!showPlusMenu);
              setShowUserMenu(false);
            }}
            className="rounded-full p-2 text-[#5f6368] hover:bg-gray-100"
            title="Tạo hoặc tham gia lớp học"
          >
            <Plus className="h-6 w-6" />
          </button>

          {showPlusMenu && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowPlusMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 z-20">
                <button
                  onClick={() => {
                    setShowPlusMenu(false);
                    onOpenJoinClass();
                  }}
                  className="flex w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  Tham gia lớp học
                </button>
                <button
                  onClick={() => {
                    setShowPlusMenu(false);
                    onOpenCreateClass();
                  }}
                  className="flex w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  Tạo lớp học
                </button>
              </div>
            </>
          )}
        </div>

        {/* User Switching Dropdown - Simulated Experience */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowPlusMenu(false);
            }}
            className="flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 py-1 pl-2 pr-3 text-xs font-medium hover:bg-gray-100"
          >
            <img
              src={activeUser.avatar}
              alt={activeUser.name}
              className="h-6 w-6 rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="text-left hidden sm:block max-w-[100px] truncate">
              <p className="font-semibold leading-tight text-gray-800">{activeUser.name}</p>
              <p className="text-[10px] text-gray-500 capitalize">{activeUser.role === "teacher" ? "Giáo viên" : "Học viên"}</p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
          </button>

          {showUserMenu && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-72 origin-top-right rounded-lg bg-white p-2 shadow-xl ring-1 ring-black/5 z-20">
                <div className="border-b border-gray-100 p-3 text-center">
                  <img
                    src={activeUser.avatar}
                    alt={activeUser.name}
                    className="mx-auto h-12 w-12 rounded-full object-cover border-2 border-[#1e88e5]"
                    referrerPolicy="no-referrer"
                  />
                  <h4 className="mt-2 text-sm font-bold text-gray-800">{activeUser.name}</h4>
                  <p className="text-xs text-gray-500">{activeUser.email}</p>
                  <span className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                    activeUser.role === "teacher" ? "bg-red-50 text-red-700 border border-red-200" : "bg-green-50 text-green-700 border border-green-200"
                  }`}>
                    {activeUser.role === "teacher" ? "Giáo Viên" : "Học Viên"}
                  </span>
                </div>
                
                <div className="p-1">
                  <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                    Chuyển đổi vai trò giả lập:
                  </p>
                  <div className="max-h-56 overflow-y-auto">
                    {allUsers.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => {
                          onUserChange(user);
                          setShowUserMenu(false);
                        }}
                        className={`flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-xs transition-colors hover:bg-gray-100 ${
                          user.id === activeUser.id ? "bg-blue-50 font-semibold text-blue-700" : "text-gray-700"
                        }`}
                      >
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="h-6 w-6 rounded-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="truncate">
                          <p className="text-gray-900 font-medium">{user.name}</p>
                          <p className="text-[10px] text-gray-500">
                            {user.role === "teacher" ? "Giáo viên" : "Học viên"} • {user.email}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
