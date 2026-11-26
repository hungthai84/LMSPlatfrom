import React, { useState } from "react";
import { Sliders, X, Image as ImageIcon, Palette, CheckCircle, Volume2, VolumeX } from "lucide-react";
import { useLms } from "../../contexts/LmsContext";
import { tr } from "../../i18n/translations";
import { SYSTEM_THEMES_CONFIG, THEME_CONFIG_MAP } from "../../themes/themeConfig";

interface SettingsModalProps {
  showSettingsModal: boolean;
  setShowSettingsModal: (show: boolean) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  showSettingsModal,
  setShowSettingsModal,
}) => {
  const {
    language,
    systemTheme,
    setSystemTheme,
    wrapperOpacity,
    setWrapperOpacity,
    sidebarOpacity,
    setSidebarOpacity,
    cardOpacity,
    setCardOpacity,
    currentWallpaper,
    setCurrentWallpaper,
    wallpaperType,
    setWallpaperType,
    soundEnabled,
    setSoundEnabled,
    playSound,
    showToast,
  } = useLms();

  const [activeTab, setActiveTab] = useState<"theme" | "transparency" | "wallpaper">("theme");

  const gradientWallpapers = [
    "radial-gradient(at 10% 15%, rgba(56, 189, 248, 0.35) 0px, transparent 50%), radial-gradient(at 88% 12%, rgba(168, 85, 247, 0.32) 0px, transparent 52%), radial-gradient(at 82% 85%, rgba(236, 72, 153, 0.28) 0px, transparent 50%), radial-gradient(at 18% 88%, rgba(16, 185, 129, 0.28) 0px, transparent 50%), linear-gradient(135deg, #e0f2fe 0%, #ede9fe 48%, #fce7f3 100%)",
    "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
    "linear-gradient(135deg, #13547a 0%, #80d0c7 100%)",
    "linear-gradient(135deg, #ed6ea0 0%, #ec8c69 100%)",
    "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
    "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
  ];

  const activeThemeMeta = THEME_CONFIG_MAP[systemTheme];

  if (!showSettingsModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="glass-liquid-card bg-white/95 rounded-[14px] shadow-2xl border border-white/75 w-full max-w-3xl overflow-hidden flex flex-col max-h-[88dvh] sm:h-[580px]">
        <div className="border-b border-slate-200/70 p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 text-slate-900">
            <div className="p-2 bg-blue-50 text-[#0d6efd] rounded-[14px]">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">
                {tr(language, "Giao diện, Hiệu ứng Thẻ, Hình nền & Âm thanh", "Themes, Card Effects, Wallpapers & Sound")}
              </h3>
              <p className="text-[11px] text-slate-500">
                {language === "en" ? activeThemeMeta.nameEn : activeThemeMeta.nameVi} •{" "}
                {language === "en" ? activeThemeMeta.cardStyleEn : activeThemeMeta.cardStyleVi}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              playSound("click");
              setShowSettingsModal(false);
            }}
            className="text-slate-500 hover:bg-slate-100 p-2 rounded-[14px] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row flex-1 min-h-0">
          <div className="sm:w-48 border-b sm:border-b-0 sm:border-r border-slate-200/60 p-2.5 sm:p-3 flex flex-row sm:flex-col gap-1.5 shrink-0 overflow-x-auto">
            <button
              onClick={() => {
                playSound("click");
                setActiveTab("theme");
              }}
              className={`flex items-center gap-2 px-3 py-2 sm:py-2.5 rounded-[14px] text-xs font-bold cursor-pointer shrink-0 ${
                activeTab === "theme" ? "bg-[#0d6efd] text-white" : "text-slate-700 hover:bg-white/80"
              }`}
            >
              <Palette className="w-4 h-4" /> {tr(language, "7 Giao diện", "7 Themes")}
            </button>
            <button
              onClick={() => {
                playSound("click");
                setActiveTab("wallpaper");
              }}
              className={`flex items-center gap-2 px-3 py-2 sm:py-2.5 rounded-[14px] text-xs font-bold cursor-pointer shrink-0 ${
                activeTab === "wallpaper" ? "bg-[#0d6efd] text-white" : "text-slate-700 hover:bg-white/80"
              }`}
            >
              <ImageIcon className="w-4 h-4" /> {tr(language, "Hình nền (7+)", "Wallpapers (7+)")}
            </button>
            <button
              onClick={() => {
                playSound("click");
                setActiveTab("transparency");
              }}
              className={`flex items-center gap-2 px-3 py-2 sm:py-2.5 rounded-[14px] text-xs font-bold cursor-pointer shrink-0 ${
                activeTab === "transparency" ? "bg-[#0d6efd] text-white" : "text-slate-700 hover:bg-white/80"
              }`}
            >
              <Sliders className="w-4 h-4" /> {tr(language, "Độ trong suốt", "Transparency")}
            </button>

            <div className="hidden sm:block mt-auto pt-3 border-t border-slate-200/60 space-y-2">
              <button
                onClick={() => {
                  const next = !soundEnabled;
                  setSoundEnabled(next);
                  if (next) playSound("success");
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-[14px] bg-white/80 border border-slate-200 text-[11px] font-bold text-slate-700 cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#0d6efd]" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
                  {tr(language, "Âm thanh", "Sound")}
                </span>
                <span className={soundEnabled ? "text-[#0d6efd]" : "text-slate-400"}>
                  {soundEnabled ? "ON" : "OFF"}
                </span>
              </button>
              <button
                onClick={() => playSound("switch")}
                className="w-full py-1.5 px-3 rounded-[14px] bg-[#0d6efd]/10 text-[#0d6efd] text-[11px] font-bold cursor-pointer"
              >
                {tr(language, "Nghe thử âm thanh", "Test Theme Sound")}
              </button>
            </div>
          </div>

          <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4">
            {activeTab === "theme" && (
              <>
                <div className="flex sm:hidden items-center justify-between gap-2 p-2.5 rounded-[14px] bg-white/80 border border-slate-200">
                  <button
                    onClick={() => {
                      const next = !soundEnabled;
                      setSoundEnabled(next);
                      if (next) playSound("success");
                    }}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-800 cursor-pointer"
                  >
                    {soundEnabled ? <Volume2 className="w-4 h-4 text-[#0d6efd]" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
                    {tr(language, "Âm thanh giao diện", "Theme Sound")}: {soundEnabled ? "ON" : "OFF"}
                  </button>
                  <button
                    onClick={() => playSound("switch")}
                    className="px-2.5 py-1 rounded-[14px] bg-[#0d6efd] text-white text-[11px] font-bold cursor-pointer"
                  >
                    {tr(language, "Nghe thử", "Test")}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SYSTEM_THEMES_CONFIG.map((t) => {
                    const lbl = language === "en" ? t.nameEn : t.nameVi;
                    const cardStyle = language === "en" ? t.cardStyleEn : t.cardStyleVi;
                    const soundLabel = language === "en" ? t.soundDescEn : t.soundDescVi;
                    const isSelected = systemTheme === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => {
                          setSystemTheme(t.id);
                          showToast(tr(language, `Đã kích hoạt: ${lbl}`, `Activated: ${lbl}`));
                        }}
                        className={`p-3 rounded-[14px] border text-left cursor-pointer bg-white/90 transition-all hover:scale-[1.01] ${
                          isSelected ? "ring-2 ring-[#0d6efd] border-[#0d6efd]" : "border-slate-200"
                        }`}
                      >
                        <div
                          className="h-16 rounded-[14px] mb-2.5 relative overflow-hidden border border-white/60"
                          style={{
                            backgroundImage: `url(${t.wallpaperUrl})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundColor: t.primaryColor,
                          }}
                        >
                          <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 bg-slate-950/60 backdrop-blur-xs px-2 py-0.5 rounded-[14px]">
                            <span className="w-2.5 h-2.5 rounded-[14px]" style={{ backgroundColor: t.primaryColor }} />
                            <span className="w-2.5 h-2.5 rounded-[14px]" style={{ backgroundColor: t.secondaryColor }} />
                            <span className="text-[9px] font-bold text-white ml-0.5">{cardStyle}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                          <span className="truncate pr-1">{lbl}</span>
                          {isSelected && <CheckCircle className="w-4 h-4 text-[#0d6efd] shrink-0" />}
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                          🔊 {soundLabel}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {activeTab === "transparency" && (
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between mb-1.5 text-xs font-bold">
                    <span>{tr(language, "Độ đục Sidebar", "Sidebar Opacity")}</span>
                    <span className="text-[#0d6efd]">{sidebarOpacity}%</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="100"
                    value={sidebarOpacity}
                    onChange={(e) => setSidebarOpacity(Number(e.target.value))}
                    className="w-full accent-[#0d6efd] cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1.5 text-xs font-bold">
                    <span>{tr(language, "Độ đục Khung chính (Shell)", "Main Shell Opacity")}</span>
                    <span className="text-[#0d6efd]">{wrapperOpacity}%</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="100"
                    value={wrapperOpacity}
                    onChange={(e) => setWrapperOpacity(Number(e.target.value))}
                    className="w-full accent-[#0d6efd] cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1.5 text-xs font-bold">
                    <span>{tr(language, "Độ đục Thẻ Card", "Card Surface Opacity")}</span>
                    <span className="text-[#0d6efd]">{cardOpacity}%</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="100"
                    value={cardOpacity}
                    onChange={(e) => setCardOpacity(Number(e.target.value))}
                    className="w-full accent-[#0d6efd] cursor-pointer"
                  />
                </div>
              </div>
            )}

            {activeTab === "wallpaper" && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 mb-2">
                    {tr(language, "7 Hình nền Độ phân giải cao theo từng Giao diện", "7 Theme-Matched Crisp Wallpapers")}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {SYSTEM_THEMES_CONFIG.map((t) => {
                      const isActive = wallpaperType === "image" && currentWallpaper === t.wallpaperUrl;
                      return (
                        <button
                          key={t.id}
                          onClick={() => {
                            playSound("click");
                            setWallpaperType("image");
                            setCurrentWallpaper(t.wallpaperUrl);
                            showToast(
                              tr(
                                language,
                                `Đã áp dụng hình nền: ${t.nameVi}`,
                                `Applied wallpaper: ${t.nameEn}`
                              )
                            );
                          }}
                          className={`h-24 rounded-[14px] cursor-pointer border-2 relative overflow-hidden text-left transition-all ${
                            isActive ? "border-[#0d6efd] ring-2 ring-[#0d6efd]/30 scale-[1.01]" : "border-white/70"
                          }`}
                          style={{
                            backgroundImage: `url(${t.wallpaperUrl})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                        >
                          <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-slate-950/75 to-transparent flex items-center justify-between">
                            <span className="text-[11px] font-bold text-white truncate">
                              {language === "en" ? t.nameEn : t.nameVi}
                            </span>
                            {isActive && <CheckCircle className="w-4 h-4 text-white shrink-0" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-900 mb-2">
                    {tr(language, "Nền Gradient Bổ sung", "Gradient Backdrops")}
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {gradientWallpapers.map((grad, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          playSound("click");
                          setWallpaperType("gradient");
                          setCurrentWallpaper(grad);
                        }}
                        className={`h-16 rounded-[14px] cursor-pointer border-2 flex items-center justify-center ${
                          wallpaperType === "gradient" && currentWallpaper === grad
                            ? "border-[#0d6efd] scale-[1.02]"
                            : "border-white/70"
                        }`}
                        style={{ background: grad }}
                      >
                        {wallpaperType === "gradient" && currentWallpaper === grad && (
                          <CheckCircle className="w-5 h-5 text-white drop-shadow" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
