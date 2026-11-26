import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Sparkles,
  BookOpen,
  Shield,
  Sliders,
  X,
} from "lucide-react";
import { useLms } from "../../contexts/LmsContext";
import { RBAC_ROLES, SIDEBAR_MODULE_GROUPS, hasPermission } from "../../constants/rbac";
import { LmsRouteId } from "../../types/lms";
import { tr } from "../../i18n/translations";
import { THEME_CONFIG_MAP } from "../../themes/themeConfig";

interface SidebarProps {
  isSidebarExpanded: boolean;
  setIsSidebarExpanded: (expanded: boolean) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  selectedClassId: string | null;
  setSelectedClassId: (id: string | null) => void;
  setShowSettingsModal: (show: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isSidebarExpanded,
  setIsSidebarExpanded,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  selectedClassId,
  setSelectedClassId,
  setShowSettingsModal,
}) => {
  const {
    language,
    setLanguage,
    activeRoute,
    setActiveRoute,
    activeRole,
    systemTheme,
    sidebarOpacity,
    playSound,
    showToast,
  } = useLms();

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    g01: true,
    g02: true,
    g03: true,
    g04: false,
    g05: true,
    g06: true,
    g07: false,
    g08: false,
    g09: true,
    g10: false,
    g11: true,
  });

  const toggleGroup = (gid: string) => {
    playSound("click");
    setOpenGroups((prev) => ({ ...prev, [gid]: !prev[gid] }));
  };

  const handleSelectRoute = (route: LmsRouteId, label: string) => {
    playSound("nav");
    setSelectedClassId(null);
    setActiveRoute(route);
    setIsMobileMenuOpen(false);
    showToast(`${language === "vi" ? "Đã mở" : "Opened"}: ${label}`);
  };

  const activeRoleObj = RBAC_ROLES.find((r) => r.id === activeRole);
  const themeMeta = THEME_CONFIG_MAP[systemTheme];
  const isDarkTheme = themeMeta.isDark;

  const getSidebarBg = (): string => {
    const op = Math.max(0.55, Math.min(0.98, sidebarOpacity / 100));
    switch (systemTheme) {
      case "ocean-navy-dark":
        return `rgba(10, 26, 54, ${Math.max(op, 0.84)})`;
      case "dark-neon":
        return `rgba(13, 17, 32, ${Math.max(op, 0.86)})`;
      case "ocean-navy-light":
        return `rgba(232, 247, 255, ${Math.max(op, 0.78)})`;
      case "flat-light":
        return `rgba(255, 255, 255, 0.98)`;
      case "origin-os":
        return `rgba(252, 248, 242, ${Math.max(op, 0.86)})`;
      case "glass-light":
        return `rgba(255, 255, 255, ${Math.max(op, 0.82)})`;
      case "glass-liquid":
      default:
        return `rgba(255, 255, 255, ${Math.max(op, 0.74)})`;
    }
  };

  const showFull = isMobileMenuOpen || isSidebarExpanded;

  return (
    <>
      {/* Mobile / Tablet Drawer Backdrop */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-30 lg:hidden"
        />
      )}

      <aside
        className={`flex flex-col pt-4 pb-3 shrink-0 transition-all duration-300 ease-in-out border-r z-40 h-full select-none
          ${isMobileMenuOpen ? "fixed left-[15px] top-[15px] bottom-[15px] h-[calc(100dvh-30px)] rounded-l-[14px] shadow-2xl" : "hidden lg:flex relative"}
          ${
            systemTheme === "dark-neon"
              ? "border-cyan-400/25 text-slate-100"
              : systemTheme === "ocean-navy-dark"
              ? "border-sky-400/25 text-slate-100"
              : systemTheme === "flat-light"
              ? "border-slate-200 text-slate-800"
              : "border-white/60 text-slate-800"
          }`}
        style={{
          width: isMobileMenuOpen ? "264px" : isSidebarExpanded ? "264px" : "74px",
          backgroundColor: getSidebarBg(),
          backdropFilter: systemTheme === "flat-light" ? "none" : "blur(22px) saturate(160%)",
        }}
      >
        {/* Desktop Collapse / Expand Toggle Button */}
        <button
          onClick={() => {
            playSound("click");
            setIsSidebarExpanded(!isSidebarExpanded);
          }}
          className="hidden lg:flex absolute top-1/2 -right-3 -translate-y-1/2 z-30 w-6 h-6 bg-white rounded-[14px] border border-slate-200 items-center justify-center shadow-sm hover:scale-110 text-slate-600 transition-all cursor-pointer"
          title={isSidebarExpanded ? tr(language, "Thu gọn danh mục", "Collapse menu") : tr(language, "Mở rộng danh mục", "Expand menu")}
        >
          {isSidebarExpanded ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </button>

        {/* Logo Header + Mobile Close Button */}
        <div
          className={`px-4 mb-3 flex items-center justify-between gap-2 ${
            !showFull ? "justify-center" : ""
          }`}
        >
          <div
            onClick={() => handleSelectRoute("dashboard", "Dashboard")}
            className="flex items-center gap-3 cursor-pointer min-w-0"
          >
            <div className="w-10 h-10 flex items-center justify-center shrink-0 rounded-[14px] bg-white/85 p-1 shadow-xs">
              <img
                src="/01_logo_edusmart.png"
                alt="EduSmart Logo"
                className="w-full h-full object-contain rounded-[14px]"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextElementSibling?.classList.remove("hidden");
                }}
              />
              <div className="hidden w-9 h-9 bg-[#0d6efd] rounded-[14px] flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
            </div>
            {showFull && (
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-base text-[#0d6efd] tracking-tight leading-none truncate">
                  EDU LMS
                </span>
                <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase mt-1 leading-none">
                  ENTERPRISE AI-NATIVE
                </span>
              </div>
            )}
          </div>

          {isMobileMenuOpen && (
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-1.5 rounded-[14px] bg-white/80 text-slate-600 hover:text-slate-900 cursor-pointer"
              aria-label="Đóng menu"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Org + Language Quick Selector */}
        {showFull && (
          <div className="px-3 mb-2.5 space-y-2">
            <div className="glass-liquid-card-orange p-2.5 rounded-[14px] flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-[14px] bg-[#f97316] text-white flex items-center justify-center shrink-0 text-[10px] font-bold">
                  ES
                </div>
                <div className="text-left truncate">
                  <p className="text-xs font-bold text-[#9a3412] leading-none truncate">
                    {tr(language, "Học viện EduSmart", "EduSmart Academy")}
                  </p>
                  <p className="text-[9px] text-[#ea580c] font-medium leading-none mt-1 truncate">
                    {language === "en" ? activeRoleObj?.nameEn || "Super Admin" : activeRoleObj?.nameVi || "Quản trị tối cao"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  playSound("click");
                  setLanguage(language === "vi" ? "en" : "vi");
                }}
                className="text-[10px] text-[#ea580c] font-bold px-2 py-1 rounded-[14px] bg-white/85 hover:bg-white cursor-pointer shrink-0"
                title={tr(language, "Đổi ngôn ngữ VI/EN", "Switch Language VI/EN")}
              >
                {language.toUpperCase()}
              </button>
            </div>
          </div>
        )}

        {/* Navigation Modules (11 Enterprise Groups) */}
        <div className="flex-1 overflow-y-auto px-2.5 space-y-1.5 py-1">
          {SIDEBAR_MODULE_GROUPS.map((group) => {
            const visibleItems = group.items.filter((it) => hasPermission(activeRole, it.route, "view"));
            if (visibleItems.length === 0) return null;
            const isOpen = openGroups[group.id] ?? true;

            return (
              <div key={group.id} className="space-y-0.5">
                {showFull && (
                  <button
                    onClick={() => toggleGroup(group.id)}
                    className="w-full flex items-center justify-between px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <span className="truncate">
                      {group.code}. {language === "vi" ? group.labelVi : group.labelEn}
                    </span>
                    <ChevronDown
                      className={`w-3 h-3 transition-transform ${isOpen ? "rotate-0" : "-rotate-90"}`}
                    />
                  </button>
                )}

                {(isOpen || !showFull) &&
                  visibleItems.map((item) => {
                    const isActive = !selectedClassId && activeRoute === item.route;
                    const label = language === "vi" ? item.labelVi : item.labelEn;
                    return (
                      <button
                        key={item.route}
                        onClick={() => handleSelectRoute(item.route, label)}
                        title={label}
                        className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-[14px] text-xs font-bold transition-all cursor-pointer relative ${
                          isActive
                            ? "bg-[#0d6efd] text-white shadow-sm"
                            : isDarkTheme
                            ? "text-slate-300 hover:bg-slate-800/70"
                            : "text-slate-600 hover:bg-white/80 hover:text-slate-900"
                        } ${!showFull ? "justify-center px-0" : ""}`}
                      >
                        <span className={`truncate ${!showFull ? "text-[10px]" : ""}`}>
                          {showFull ? label : label.slice(0, 2).toUpperCase()}
                        </span>
                        {showFull && item.badge && (
                          <span
                            className={`text-[9px] px-2 py-0.5 rounded-[14px] font-bold ${
                              isActive
                                ? isDarkTheme
                                  ? "bg-slate-950/25 text-slate-950"
                                  : "bg-white/25 text-white"
                                : "bg-purple-100 text-purple-700"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
              </div>
            );
          })}
        </div>

        {/* Bottom Quick Actions: AI Center & Appearance */}
        {showFull ? (
          <div className="mx-3 mt-2 space-y-2">
            <button
              onClick={() => handleSelectRoute("ai-learning", "AI Learning Center")}
              className="w-full glass-liquid-card-purple p-2.5 rounded-[14px] flex items-center gap-2.5 text-left cursor-pointer hover:scale-[1.01] transition-transform"
            >
              <div
                className="w-7 h-7 rounded-[14px] text-white flex items-center justify-center shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${themeMeta.primaryColor}, ${themeMeta.secondaryColor})`,
                  color: isDarkTheme ? "#081226" : "#ffffff",
                }}
              >
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-slate-900 truncate">8 AI Agents & RAG</p>
                <p className="text-[9px] text-purple-700 truncate">Gemini Enterprise</p>
              </div>
            </button>

            <div className="flex gap-1.5">
              <button
                onClick={() => handleSelectRoute("users-rbac", "RBAC")}
                className="flex-1 py-1.5 px-2 rounded-[14px] bg-white/80 border border-slate-200/80 text-[10px] font-bold text-slate-700 flex items-center justify-center gap-1 cursor-pointer"
              >
                <Shield className="w-3 h-3 text-[#0d6efd]" /> 12 Roles
              </button>
              <button
                onClick={() => {
                  playSound("click");
                  setIsMobileMenuOpen(false);
                  setShowSettingsModal(true);
                }}
                className="flex-1 py-1.5 px-2 rounded-[14px] bg-white/80 border border-slate-200/80 text-[10px] font-bold text-slate-700 flex items-center justify-center gap-1 cursor-pointer"
              >
                <Sliders className="w-3 h-3 text-[#f97316]" /> {tr(language, "Giao diện", "Theme")}
              </button>
            </div>
          </div>
        ) : (
          <div className="px-2 mt-2 flex flex-col gap-2 items-center">
            <button
              onClick={() => {
                playSound("click");
                setShowSettingsModal(true);
              }}
              className="w-9 h-9 rounded-[14px] bg-white/80 border border-slate-200 flex items-center justify-center text-slate-600 cursor-pointer"
              title={tr(language, "Cài đặt giao diện", "Theme settings")}
            >
              <Sliders className="w-4 h-4" />
            </button>
          </div>
        )}
      </aside>
    </>
  );
};
