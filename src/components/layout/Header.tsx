import React, { useEffect, useState } from "react";
import {
  Search,
  Bell,
  ChevronDown,
  LogIn,
  LogOut,
  Clock,
  Sliders,
  ShieldCheck,
  Menu,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useLms } from "../../contexts/LmsContext";
import { RBAC_ROLES } from "../../constants/rbac";
import { tr } from "../../i18n/translations";
import { THEME_CONFIG_MAP } from "../../themes/themeConfig";

interface HeaderProps {
  showNotificationsPanel: boolean;
  setShowNotificationsPanel: (show: boolean) => void;
  showProfileSwitcher: boolean;
  setShowProfileSwitcher: (show: boolean) => void;
  setShowSettingsModal: (show: boolean) => void;
  onOpenMobileMenu: () => void;
  title: string;
}

export const Header: React.FC<HeaderProps> = ({
  showNotificationsPanel,
  setShowNotificationsPanel,
  showProfileSwitcher,
  setShowProfileSwitcher,
  setShowSettingsModal,
  onOpenMobileMenu,
  title,
}) => {
  const {
    firebaseUser,
    isSignedIn,
    isSuperAdmin,
    signInWithGoogle,
    logout,
    currentProfile,
    activeRole,
    setActiveRole,
    globalSearch,
    setGlobalSearch,
    language,
    setLanguage,
    systemTheme,
    wrapperOpacity,
    soundEnabled,
    setSoundEnabled,
    playSound,
    setActiveRoute,
    showToast,
  } = useLms();

  const [focusRunning, setFocusRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);

  useEffect(() => {
    if (!focusRunning) return;
    const t = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 25 * 60));
    }, 1000);
    return () => clearInterval(t);
  }, [focusRunning]);

  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const secs = String(secondsLeft % 60).padStart(2, "0");
  const themeMeta = THEME_CONFIG_MAP[systemTheme];
  const isDarkTheme = themeMeta.isDark;

  const getHeaderBg = (): string => {
    const op = Math.max(0.55, Math.min(0.98, wrapperOpacity / 100));
    switch (systemTheme) {
      case "ocean-navy-dark":
        return `rgba(10, 26, 54, ${Math.max(op, 0.80)})`;
      case "dark-neon":
        return `rgba(13, 17, 32, ${Math.max(op, 0.84)})`;
      case "ocean-navy-light":
        return `rgba(232, 247, 255, ${Math.max(op, 0.78)})`;
      case "flat-light":
        return `rgba(255, 255, 255, 0.98)`;
      case "origin-os":
        return `rgba(252, 248, 242, ${Math.max(op, 0.84)})`;
      case "glass-light":
        return `rgba(255, 255, 255, ${Math.max(op, 0.80)})`;
      case "glass-liquid":
      default:
        return `rgba(255, 255, 255, ${Math.min(op + 0.08, 0.84)})`;
    }
  };

  return (
    <header
      className={`min-h-[62px] flex-none border-b flex items-center justify-between gap-2 sm:gap-3 px-3 sm:px-5 py-2 z-20 shrink-0 ${
        systemTheme === "dark-neon"
          ? "border-cyan-400/25 text-white"
          : systemTheme === "ocean-navy-dark"
          ? "border-sky-400/25 text-white"
          : systemTheme === "flat-light"
          ? "border-slate-200 text-slate-900"
          : "border-white/60 text-slate-900"
      }`}
      style={{
        backgroundColor: getHeaderBg(),
        backdropFilter: systemTheme === "flat-light" ? "none" : "blur(18px) saturate(150%)",
      }}
    >
      {/* Mobile Hamburger + Current Title + Responsive Search Bar */}
      <div className="flex-1 flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          onClick={() => {
            playSound("click");
            onOpenMobileMenu();
          }}
          className="lg:hidden p-2 rounded-[14px] bg-white/85 border border-slate-200 text-slate-700 hover:text-[#0d6efd] cursor-pointer shrink-0"
          aria-label={tr(language, "Mở menu điều hướng", "Open navigation menu")}
        >
          <Menu className="w-4 h-4" />
        </button>

        <span
          className="hidden xl:inline-flex items-center px-3 py-1.5 rounded-[14px] text-xs font-bold shrink-0"
          style={{
            backgroundColor: isDarkTheme ? "rgba(56, 189, 248, 0.14)" : "rgba(13, 110, 253, 0.09)",
            color: themeMeta.primaryColor,
          }}
        >
          {title}
        </span>

        <div className="flex-1 relative min-w-[110px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder={
              language === "vi"
                ? "Tìm khóa học, tài liệu..."
                : "Search courses, assets..."
            }
            className="pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 w-full bg-white/90 border border-slate-200/80 rounded-[14px] text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#0d6efd]/40 text-slate-800"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2 relative shrink-0">
        {/* Focus Timer */}
        <button
          onClick={() => {
            playSound("click");
            setFocusRunning(!focusRunning);
          }}
          className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-[14px] text-xs font-bold border cursor-pointer transition-all ${
            focusRunning
              ? "bg-emerald-50 border-emerald-300 text-emerald-800"
              : "bg-white/80 border-slate-200 text-slate-700"
          }`}
          title="Pomodoro Focus Timer"
        >
          <Clock className="w-3.5 h-3.5 text-[#0d6efd]" />
          <span>{mins}:{secs}</span>
        </button>

        {/* Sound Effects Toggle */}
        <button
          onClick={() => {
            const next = !soundEnabled;
            setSoundEnabled(next);
            if (next) {
              playSound("success");
            }
            showToast(
              next
                ? tr(language, "Đã bật âm thanh theo giao diện", "Enabled theme sound effects")
                : tr(language, "Đã tắt âm thanh giao diện", "Muted theme sound effects")
            );
          }}
          className={`p-2 rounded-[14px] border cursor-pointer transition-all ${
            soundEnabled
              ? "bg-white/85 border-slate-200 text-[#0d6efd]"
              : "bg-white/60 border-slate-200 text-slate-400"
          }`}
          title={tr(language, "Bật/tắt âm thanh giao diện", "Toggle theme sound effects")}
          aria-label={tr(language, "Âm thanh giao diện", "Theme sound effects")}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Language Toggle (visible on all screens including mobile) */}
        <button
          onClick={() => {
            playSound("click");
            const next = language === "vi" ? "en" : "vi";
            setLanguage(next);
            showToast(next === "en" ? "Language switched to English" : "Đã chuyển ngôn ngữ sang Tiếng Việt");
          }}
          className="inline-flex items-center px-2.5 py-1.5 rounded-[14px] bg-white/85 border border-slate-200 text-xs font-bold text-slate-700 hover:text-[#0d6efd] cursor-pointer"
          title={tr(language, "Đổi ngôn ngữ (Tiếng Việt / English)", "Switch language (VI / EN)")}
        >
          {language === "vi" ? "VI" : "EN"}
        </button>

        {/* Appearance Settings Button */}
        <button
          onClick={() => {
            playSound("click");
            setShowSettingsModal(true);
          }}
          className="p-2 rounded-[14px] bg-white/80 border border-slate-200 text-slate-600 hover:text-[#0d6efd] cursor-pointer"
          title={tr(language, "Cài đặt Giao diện & Âm thanh", "Theme, Wallpaper & Sound Settings")}
        >
          <Sliders className="w-4 h-4" />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              playSound("click");
              setShowNotificationsPanel(!showNotificationsPanel);
            }}
            className="p-2 rounded-[14px] bg-white/80 border border-slate-200 text-slate-600 hover:text-[#0d6efd] relative cursor-pointer"
            title={tr(language, "Thông báo", "Notifications")}
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 bg-[#ec4899] text-white text-[9px] font-bold w-4 h-4 rounded-[14px] flex items-center justify-center">
              3
            </span>
          </button>

          {showNotificationsPanel && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotificationsPanel(false)} />
              <div className="absolute right-0 top-full mt-2 glass-liquid-card bg-white/95 rounded-[14px] shadow-xl border border-slate-200 p-4 z-50 w-72 sm:w-80 space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold text-slate-900">
                    {tr(language, "Thông báo Hệ thống", "System Notifications")}
                  </span>
                  <span className="text-[10px] font-bold text-[#0d6efd] bg-blue-50 px-2 py-0.5 rounded-[14px]">
                    {isSignedIn ? "Firestore Sync" : "Demo Mode"}
                  </span>
                </div>
                <div className="text-xs space-y-2 text-slate-700">
                  <div className="p-2.5 rounded-[14px] bg-blue-50/70">
                    <p className="font-bold">
                      {tr(language, "AI Learning Center đã sẵn sàng", "AI Learning Center is Ready")}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {tr(
                        language,
                        "8 AI Agents & RAG hoạt động qua Server Proxy.",
                        "8 AI Agents & RAG running securely via Server Proxy."
                      )}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-[14px] bg-emerald-50/70">
                    <p className="font-bold">
                      {tr(language, "Giao diện Glass Liquid Đa Màu Sắc", "Multi-Color Glass Liquid UI")}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {tr(
                        language,
                        "Font Play, bo góc 14px & Responsive đa màn hình.",
                        "Play font, 14px corners & full responsive layout."
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Google Auth Sign-In */}
        {!isSignedIn && (
          <button
            onClick={() => {
              playSound("click");
              signInWithGoogle();
            }}
            className="px-2.5 sm:px-3.5 py-2 rounded-[14px] bg-[#0d6efd] hover:opacity-90 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
            title={tr(language, "Đăng nhập Google", "Sign in with Google")}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{tr(language, "Đăng nhập Google", "Google Sign In")}</span>
          </button>
        )}

        {/* Profile & RBAC Switcher */}
        <button
          onClick={() => {
            playSound("click");
            setShowProfileSwitcher(!showProfileSwitcher);
          }}
          className="flex items-center gap-1.5 sm:gap-2 bg-white/85 border border-slate-200 p-1 sm:pr-2.5 rounded-[14px] cursor-pointer"
        >
          <img
            src={currentProfile.avatar || "/03_avatar_student.png"}
            alt={currentProfile.displayName}
            className="w-7 h-7 rounded-[14px] object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="hidden md:block text-left">
            <div className="text-[11px] font-bold text-slate-900 leading-none flex items-center gap-1">
              {currentProfile.displayName}
              {isSuperAdmin && <ShieldCheck className="w-3 h-3 text-[#0d6efd]" />}
            </div>
            <div className="text-[9px] text-slate-500 font-bold mt-0.5 leading-none">
              {RBAC_ROLES.find((r) => r.id === activeRole)?.nameEn || activeRole}
            </div>
          </div>
          <ChevronDown className="hidden sm:block w-3.5 h-3.5 text-slate-400" />
        </button>

        {showProfileSwitcher && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowProfileSwitcher(false)} />
            <div className="absolute right-0 top-full mt-2 glass-liquid-card bg-white/95 backdrop-blur-xl rounded-[14px] shadow-xl border border-slate-200 p-3 z-50 w-72 space-y-2 max-h-[420px] overflow-y-auto">
              <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">{currentProfile.displayName}</p>
                  <p className="text-[10px] text-slate-500">
                    {firebaseUser?.email || tr(language, "Chế độ Demo Preview", "Demo Preview Mode")}
                  </p>
                </div>
                {isSignedIn && (
                  <button
                    onClick={() => {
                      playSound("click");
                      logout();
                      setShowProfileSwitcher(false);
                    }}
                    className="p-1.5 rounded-[14px] bg-red-50 text-red-600 cursor-pointer"
                    title={tr(language, "Đăng xuất", "Sign Out")}
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <p className="text-[10px] font-bold uppercase text-slate-400">
                {tr(language, "Xem thử 12 Vai trò RBAC", "Preview 12 RBAC Roles")}
              </p>
              <div className="space-y-1">
                {RBAC_ROLES.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      playSound("switch");
                      setActiveRole(r.id);
                      setShowProfileSwitcher(false);
                      showToast(
                        tr(
                          language,
                          `Đã chuyển vai trò hiển thị: ${r.nameVi}`,
                          `Switched active RBAC role: ${r.nameEn}`
                        )
                      );
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-[14px] text-[11px] font-bold transition-colors cursor-pointer ${
                      activeRole === r.id
                        ? "bg-[#0d6efd] text-white"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {r.code}. {language === "en" ? r.nameEn : r.nameVi}
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  playSound("nav");
                  setActiveRoute("system-admin");
                  setShowProfileSwitcher(false);
                }}
                className="w-full py-2 rounded-[14px] bg-slate-100 text-xs font-bold text-slate-800 cursor-pointer"
              >
                {tr(language, "Mở Quản trị Hệ thống & Theme", "Open System Admin & Theme")}
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
};
