import React from 'react';

interface MetricCardProps {
  cardOpacity?: number;
  label: string;
  value: string | number;
  icon: React.ReactNode;
}

export const MetricCard = ({ label, value, icon, cardOpacity = 100 }: MetricCardProps) => {
  return (
    // Card Container: Nền trắng, bo góc 12px (xl), viền xám nhạt, đổ bóng rất nhẹ (shadow-sm)
    <div className="rounded-xl border border-slate-200 p-6 shadow-sm flex items-center justify-between" style={{ backgroundColor: `rgba(255, 255, 255, ${cardOpacity / 100})`, backdropFilter: cardOpacity < 100 ? "blur(10px)" : "none" }}>
      {/* Khối Văn bản (Label & Value) */}
      <div>
        {/* Label: Chữ nhỏ hơn, màu xám, font semi-bold để dễ đọc */}
        <span className="text-[13px] font-semibold text-gray-500 block">
          {label}
        </span>
        {/* Value: Chữ to, nổi bật, màu tối nhất */}
        <span className="text-4xl font-bold text-gray-900 mt-1 block">
          {value}
        </span>
      </div>
      
      {/* Khối Icon: Nền có độ trong suốt thấp (50) kết hợp với màu chính (600) */}
      <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
         {icon}
      </div>
    </div>
  );
};
