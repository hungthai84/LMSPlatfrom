import React, { useState } from 'react';
import { Sliders, X, Image as ImageIcon, Video, Palette, Sparkles, CheckCircle } from 'lucide-react';

interface SettingsModalProps {
  showSettingsModal: boolean;
  setShowSettingsModal: (show: boolean) => void;
  wrapperOpacity: number;
  setWrapperOpacity: (val: number) => void;
  sidebarOpacity: number;
  setSidebarOpacity: (val: number) => void;
  cardOpacity: number;
  setCardOpacity: (val: number) => void;
  currentWallpaper: string;
  setCurrentWallpaper: (val: string) => void;
  wallpaperType: 'none' | 'image' | 'video' | 'gradient' | 'pattern';
  setWallpaperType: (val: 'none' | 'image' | 'video' | 'gradient' | 'pattern') => void;
}

export const SettingsModal = ({
  showSettingsModal, setShowSettingsModal,
  wrapperOpacity, setWrapperOpacity,
  sidebarOpacity, setSidebarOpacity,
  cardOpacity, setCardOpacity,
  currentWallpaper, setCurrentWallpaper,
  wallpaperType, setWallpaperType
}: SettingsModalProps) => {
  const [activeTab, setActiveTab] = useState<'transparency' | 'wallpaper'>('transparency');
  const [wallpaperSubTab, setWallpaperSubTab] = useState<'image' | 'video' | 'gradient' | 'pattern'>('image');

  const imageWallpapers = [
    "https://i.ibb.co/G47jTb1g/minimalist-white-background-3840x2160-bright-space-clean-aesthetic-27644.jpg",
    "https://i.ibb.co/q2X19rq/geometric-mountain-wallpaper-3840x2160-calming-visuals-simple-patterns-26760.jpg",
    "https://i.ibb.co/R4P1zff0/ta-i-xu-ng-15.jpg",
    "https://i.ibb.co/TDnD5NB1/ta-i-xu-ng-14.jpg",
    "https://i.ibb.co/S49fBKcv/ta-i-xu-ng-13.jpg",
    "https://i.ibb.co/04qypw8/ta-i-xu-ng-12.jpg",
    "https://i.ibb.co/ch1yf4Dz/AVv-Xs-Egn6ve-Lq-M6aj-Fr-XO6-YYuy-NTs-Wt-x9-qxb2w-O8-Xt-OWdn-JECETXTri7-Ps-rnb2-Td-Jnln6xu-kddyc-Yisi1xf.jpg",
    "https://i.ibb.co/d0Fw0xdW/Best-wallpaper-1.jpg",
    "https://i.ibb.co/rKL4ffH2/2.jpg",
    "https://i.ibb.co/nq9GHB11/ta-i-xu-ng-12.jpg",
    "https://i.ibb.co/PZhKjDjP/Abstract-minimalistic-background-image-with-minimal-details-in-silvery-pearlescent-hues-subtle-tex.jpg",
    "https://i.ibb.co/Fc1dczn/Wallpaper.jpg",
    "https://i.ibb.co/DDCj9TBk/ta-i-xu-ng-15.jpg",
    "https://i.ibb.co/jPN1bS9c/Pastel-Minimal-Wallpaper-Clean-Aesthetic-for-Mac-Book.jpg",
    "https://i.ibb.co/chRZYCFs/ta-i-xu-ng-14.jpg",
    "https://i.ibb.co/k2jTwnTp/ta-i-xu-ng-13.jpg",
    "https://i.ibb.co/G4tGQZbB/ta-i-xu-ng-16.jpg",
    "https://i.ibb.co/r2w5qZCT/Download-Abstract-Gradient-Circle-Background-for-free.jpg",
    "https://i.ibb.co/zhc5bK7G/Ton-mental-a-aussi-besoin-de-repos.jpg"
  ];

  const videoWallpapers = [
    { url: "https://www.w3schools.com/html/mov_bbb.mp4", thumbnail: "https://i.ibb.co/G47jTb1g/minimalist-white-background-3840x2160-bright-space-clean-aesthetic-27644.jpg" } // Mock
  ];

  const gradientWallpapers = [
    "linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)",
    "linear-gradient(45deg, #6a11cb 0%, #2575fc 100%)",
    "linear-gradient(45deg, #13547a 0%, #80d0c7 100%)",
    "linear-gradient(45deg, #ed6ea0 0%, #ec8c69 100%)",
    "linear-gradient(45deg, #000428 0%, #004e92 100%)",
    "linear-gradient(45deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
    "linear-gradient(45deg, #373b44 0%, #4286f4 100%)",
    "linear-gradient(45deg, #7028e4 0%, #e5b2ca 100%)",
    "linear-gradient(45deg, #1e3c72 0%, #2a5298 100%)",
    "linear-gradient(45deg, #a8edea 0%, #fed6e3 100%)",
    "linear-gradient(45deg, #0250c5 0%, #d43f8d 100%)"
  ];

  const patternWallpapers = [
    { name: "Orbiting Planets", css: "radial-gradient(circle, transparent 20%, #ffffff 20%, #ffffff 80%, transparent 80%, transparent), radial-gradient(circle, transparent 20%, #ffffff 20%, #ffffff 80%, transparent 80%, transparent) 25px 25px", bg: "#f3f4f6", size: "50px 50px" },
    { name: "Dotted Pattern", css: "radial-gradient(#cbd5e1 1px, transparent 1px)", bg: "#f8fafc", size: "20px 20px" },
    { name: "Dark Dotted Pattern", css: "radial-gradient(#475569 1px, transparent 1px)", bg: "#1e293b", size: "20px 20px" }
  ];

  if (!showSettingsModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-100 w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col h-[600px]">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 text-gray-800">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Sliders className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg">Cài đặt Giao diện</h3>
          </div>
          <button onClick={() => setShowSettingsModal(false)} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-1 min-h-0">
          {/* Sidebar */}
          <div className="w-48 border-r border-gray-100 bg-gray-50/50 p-4 flex flex-col gap-2 shrink-0">
            <button 
              onClick={() => setActiveTab('transparency')}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'transparency' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <Sliders className="w-4 h-4" />
              Độ trong suốt
            </button>
            <button 
              onClick={() => setActiveTab('wallpaper')}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'wallpaper' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <ImageIcon className="w-4 h-4" />
              Hình nền
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'transparency' && (
              <div className="space-y-6">
                <h4 className="font-bold text-gray-800 border-b border-gray-100 pb-2 mb-4">Độ trong suốt</h4>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <label className="text-sm font-semibold text-gray-700">Sidebar</label>
                      <span className="text-xs font-bold text-blue-600">{sidebarOpacity}%</span>
                    </div>
                    <input type="range" min="0" max="100" value={sidebarOpacity} onChange={(e) => setSidebarOpacity(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1.5">
                      <label className="text-sm font-semibold text-gray-700">Nền trắng nội dung (Wrapper)</label>
                      <span className="text-xs font-bold text-blue-600">{wrapperOpacity}%</span>
                    </div>
                    <input type="range" min="0" max="100" value={wrapperOpacity} onChange={(e) => setWrapperOpacity(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1.5">
                      <label className="text-sm font-semibold text-gray-700">Thẻ (Cards)</label>
                      <span className="text-xs font-bold text-blue-600">{cardOpacity}%</span>
                    </div>
                    <input type="range" min="0" max="100" value={cardOpacity} onChange={(e) => setCardOpacity(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'wallpaper' && (
              <div className="space-y-4 h-full flex flex-col">
                <div className="flex gap-2 border-b border-gray-100 pb-3 shrink-0">
                  <button onClick={() => setWallpaperSubTab('image')} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${wallpaperSubTab === 'image' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Images</button>
                  <button onClick={() => setWallpaperSubTab('video')} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${wallpaperSubTab === 'video' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Videos</button>
                  <button onClick={() => setWallpaperSubTab('gradient')} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${wallpaperSubTab === 'gradient' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Gradients</button>
                  <button onClick={() => setWallpaperSubTab('pattern')} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${wallpaperSubTab === 'pattern' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Patterns</button>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 pb-10">
                  {wallpaperSubTab === 'image' && (
                    <div className="grid grid-cols-3 gap-3">
                      {imageWallpapers.map((url, i) => (
                        <div key={i} onClick={() => { setWallpaperType('image'); setCurrentWallpaper(url); }} className={`relative aspect-video rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${wallpaperType === 'image' && currentWallpaper === url ? 'border-blue-600 shadow-md scale-105 z-10' : 'border-transparent hover:border-blue-300'}`}>
                          <img src={url} alt={`Wallpaper ${i}`} className="w-full h-full object-cover" />
                          {wallpaperType === 'image' && currentWallpaper === url && <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center"><CheckCircle className="w-6 h-6 text-white drop-shadow-md" /></div>}
                        </div>
                      ))}
                    </div>
                  )}

                  {wallpaperSubTab === 'video' && (
                    <div className="grid grid-cols-2 gap-3">
                      {videoWallpapers.map((v, i) => (
                         <div key={i} onClick={() => { setWallpaperType('video'); setCurrentWallpaper(v.url); }} className={`relative aspect-video rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${wallpaperType === 'video' && currentWallpaper === v.url ? 'border-blue-600 shadow-md scale-105 z-10' : 'border-transparent hover:border-blue-300'}`}>
                           <img src={v.thumbnail} alt={`Video Thumbnail ${i}`} className="w-full h-full object-cover" />
                           <div className="absolute inset-0 flex items-center justify-center bg-black/20"><Video className="w-8 h-8 text-white/80" /></div>
                           {wallpaperType === 'video' && currentWallpaper === v.url && <div className="absolute inset-0 bg-blue-600/40 flex items-center justify-center"><CheckCircle className="w-8 h-8 text-white drop-shadow-md" /></div>}
                         </div>
                      ))}
                    </div>
                  )}

                  {wallpaperSubTab === 'gradient' && (
                    <div className="grid grid-cols-3 gap-3">
                      {gradientWallpapers.map((grad, i) => (
                         <div key={i} onClick={() => { setWallpaperType('gradient'); setCurrentWallpaper(grad); }} className={`relative aspect-video rounded-lg cursor-pointer border-2 transition-all ${wallpaperType === 'gradient' && currentWallpaper === grad ? 'border-blue-600 shadow-md scale-105 z-10' : 'border-transparent hover:border-blue-300'}`} style={{ background: grad }}>
                           {wallpaperType === 'gradient' && currentWallpaper === grad && <div className="absolute inset-0 bg-black/10 flex items-center justify-center"><CheckCircle className="w-6 h-6 text-white drop-shadow-md" /></div>}
                         </div>
                      ))}
                    </div>
                  )}

                  {wallpaperSubTab === 'pattern' && (
                    <div className="grid grid-cols-2 gap-3">
                      {patternWallpapers.map((pat, i) => (
                         <div key={i} onClick={() => { setWallpaperType('pattern'); setCurrentWallpaper(JSON.stringify(pat)); }} className={`relative aspect-video rounded-lg cursor-pointer border-2 transition-all flex flex-col items-center justify-center ${wallpaperType === 'pattern' && currentWallpaper === JSON.stringify(pat) ? 'border-blue-600 shadow-md scale-105 z-10' : 'border-gray-200 hover:border-blue-300'}`} style={{ backgroundColor: pat.bg, backgroundImage: pat.css, backgroundSize: pat.size }}>
                           <span className="bg-white/80 px-2 py-1 rounded text-[10px] font-bold text-gray-700 shadow-sm">{pat.name}</span>
                           {wallpaperType === 'pattern' && currentWallpaper === JSON.stringify(pat) && <div className="absolute top-2 right-2"><CheckCircle className="w-5 h-5 text-blue-600 drop-shadow-sm" /></div>}
                         </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
