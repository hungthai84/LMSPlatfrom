import { SystemThemeId } from "../types/lms";
import bgGlassLiquid from "../assets/images/bg_glass_liquid_1795721307450.jpg";
import bgGlassLight from "../assets/images/bg_glass_light_1795721306947.jpg";
import bgOceanLight from "../assets/images/bg_ocean_light_1795721307033.jpg";
import bgOceanDark from "../assets/images/bg_ocean_dark_1795721308048.jpg";
import bgDarkNeon from "../assets/images/bg_dark_neon_1795721307836.jpg";
import bgFlatLight from "../assets/images/bg_flat_light_1795721309818.jpg";
import bgOriginOs from "../assets/images/bg_origin_os_1795721309429.jpg";

export interface SystemThemeMeta {
  id: SystemThemeId;
  nameVi: string;
  nameEn: string;
  descVi: string;
  descEn: string;
  cardStyleVi: string;
  cardStyleEn: string;
  soundDescVi: string;
  soundDescEn: string;
  primaryColor: string;
  secondaryColor: string;
  websiteBgTint: string;
  cardBgTint: string;
  isDark: boolean;
  wallpaperUrl: string;
  previewGradient: string;
}

export const SYSTEM_THEMES_CONFIG: SystemThemeMeta[] = [
  {
    id: "glass-liquid",
    nameVi: "Glass Liquid Đa Màu Sắc (Mặc định)",
    nameEn: "Glass Liquid Multi-Color (Default)",
    descVi: "Kính lỏng nổi đa sắc, bo góc 14px lấp lánh ánh sáng",
    descEn: "Elevated multi-color liquid glass cards with luminous rims",
    cardStyleVi: "Hiệu ứng nổi kính lỏng",
    cardStyleEn: "Floating Liquid Glass",
    soundDescVi: "Âm giọt nước pha lê",
    soundDescEn: "Crystal Water Chime",
    primaryColor: "#0d6efd",
    secondaryColor: "#a855f7",
    websiteBgTint: "rgba(244, 248, 255, 0.56)",
    cardBgTint: "rgba(255, 255, 255, 0.72)",
    isDark: false,
    wallpaperUrl: bgGlassLiquid,
    previewGradient: "linear-gradient(135deg, #bae6fd 0%, #e9d5ff 50%, #fbcfe8 100%)",
  },
  {
    id: "glass-light",
    nameVi: "Glass Light Pha Lê",
    nameEn: "Glass Light Crystal",
    descVi: "Kính mờ sáng trắng tinh khiết, nổi thanh thoát nhẹ nhàng",
    descEn: "Pure frosted daylight crystal with clean airy lift",
    cardStyleVi: "Kính mờ nổi thanh thoát",
    cardStyleEn: "Elevated Frosted Pearl",
    soundDescVi: "Âm chạm kính thanh mảnh",
    soundDescEn: "Crisp Glass Ping",
    primaryColor: "#0284c7",
    secondaryColor: "#64748b",
    websiteBgTint: "rgba(255, 255, 255, 0.64)",
    cardBgTint: "rgba(255, 255, 255, 0.86)",
    isDark: false,
    wallpaperUrl: bgGlassLight,
    previewGradient: "linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)",
  },
  {
    id: "ocean-navy-light",
    nameVi: "Ocean Navy Light",
    nameEn: "Ocean Navy Light",
    descVi: "Xanh đại dương rạng rỡ, thẻ nổi ánh ngọc bích tươi mát",
    descEn: "Radiant coastal azure with buoyant aqua-tinted cards",
    cardStyleVi: "Nổi gợn sóng đại dương",
    cardStyleEn: "Buoyant Aqua Lift",
    soundDescVi: "Âm gợn sóng biển",
    soundDescEn: "Aqua Wave Pop",
    primaryColor: "#0369a1",
    secondaryColor: "#06b6d4",
    websiteBgTint: "rgba(232, 246, 255, 0.62)",
    cardBgTint: "rgba(240, 249, 255, 0.84)",
    isDark: false,
    wallpaperUrl: bgOceanLight,
    previewGradient: "linear-gradient(135deg, #7dd3fc 0%, #bae6fd 55%, #e0f2fe 100%)",
  },
  {
    id: "ocean-navy-dark",
    nameVi: "Ocean Navy Dark",
    nameEn: "Ocean Navy Dark",
    descVi: "Xanh hải quân biển sâu, thẻ lún trầm tĩnh dịu mắt ban đêm",
    descEn: "Deep abyssal sapphire with calm recessed night cards",
    cardStyleVi: "Hiệu ứng lún sâu biển đêm",
    cardStyleEn: "Recessed Deep Sapphire",
    soundDescVi: "Âm sonar đại dương",
    soundDescEn: "Deep Sonar Pulse",
    primaryColor: "#38bdf8",
    secondaryColor: "#0ea5e9",
    websiteBgTint: "rgba(8, 22, 46, 0.72)",
    cardBgTint: "rgba(15, 35, 68, 0.82)",
    isDark: true,
    wallpaperUrl: bgOceanDark,
    previewGradient: "linear-gradient(135deg, #061224 0%, #0f2954 55%, #1e3a8a 100%)",
  },
  {
    id: "dark-neon",
    nameVi: "Dark Neon Cyber",
    nameEn: "Dark Neon Cyber",
    descVi: "Nền đêm obsidian sắc nét, thẻ nổi viền phát sáng Cyan & Magenta",
    descEn: "Sharp obsidian dark canvas with glowing neon cyan-magenta cards",
    cardStyleVi: "Nổi viền phát sáng Neon",
    cardStyleEn: "Glowing Neon Rim",
    soundDescVi: "Âm tổng hợp Cyber Neon",
    soundDescEn: "Cyber Synth Blip",
    primaryColor: "#06b6d4",
    secondaryColor: "#d946ef",
    websiteBgTint: "rgba(10, 14, 26, 0.76)",
    cardBgTint: "rgba(17, 24, 39, 0.86)",
    isDark: true,
    wallpaperUrl: bgDarkNeon,
    previewGradient: "linear-gradient(135deg, #090d16 0%, #1e1b4b 55%, #701a75 100%)",
  },
  {
    id: "flat-light",
    nameVi: "Flat Light Tối Giản",
    nameEn: "Flat Light Minimal",
    descVi: "Thiết kế phẳng hiện đại, sắc nét không đổ bóng rườm rà",
    descEn: "Crisp zero-blur architectural flat surfaces with hairline borders",
    cardStyleVi: "Hiệu ứng phẳng hoàn toàn",
    cardStyleEn: "Pure Crisp Flat",
    soundDescVi: "Âm chạm cơ học tối giản",
    soundDescEn: "Minimal Tactile Tap",
    primaryColor: "#2563eb",
    secondaryColor: "#10b981",
    websiteBgTint: "rgba(241, 245, 249, 0.90)",
    cardBgTint: "rgba(255, 255, 255, 0.98)",
    isDark: false,
    wallpaperUrl: bgFlatLight,
    previewGradient: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
  },
  {
    id: "origin-os",
    nameVi: "Origin OS Tactile",
    nameEn: "Origin OS Tactile",
    descVi: "Phong cách Origin OS chạm nổi-lún mềm mại, tông ấm áp sang trọng",
    descEn: "Warm clay neomorphic tactile cards with soft light-shadow bevels",
    cardStyleVi: "Hiệu ứng nổi-lún Origin Clay",
    cardStyleEn: "Tactile Soft Bevel",
    soundDescVi: "Âm gỗ Marimba ấm áp",
    soundDescEn: "Warm Marimba Pop",
    primaryColor: "#ea580c",
    secondaryColor: "#6366f1",
    websiteBgTint: "rgba(251, 247, 240, 0.78)",
    cardBgTint: "rgba(255, 252, 247, 0.92)",
    isDark: false,
    wallpaperUrl: bgOriginOs,
    previewGradient: "linear-gradient(135deg, #fef3c7 0%, #fed7aa 50%, #e0e7ff 100%)",
  },
];

export const THEME_CONFIG_MAP: Record<SystemThemeId, SystemThemeMeta> =
  SYSTEM_THEMES_CONFIG.reduce((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {} as Record<SystemThemeId, SystemThemeMeta>);
