import React from 'react';
import { Home, Calendar, BookOpen, Settings } from 'lucide-react';
import { ClassItem } from '../types';

interface SidebarProps {
  isOpen: boolean;
  classes: ClassItem[];
  onClassSelect: (classId: string) => void;
  onHomeSelect: () => void;
  currentClassId: string | null;
}

export function Sidebar({ isOpen, classes, onClassSelect, onHomeSelect, currentClassId }: SidebarProps) {
  if (!isOpen) return null;

  return (
    <aside className="w-72 bg-white border-r border-gray-200 overflow-y-auto h-[calc(100vh-64px)] fixed md:sticky top-16 left-0 z-40 transition-transform shadow-lg md:shadow-none">
      <div className="py-3">
        <NavItem 
          icon={<Home className="w-5 h-5" />} 
          label="Classes" 
          onClick={onHomeSelect}
          isActive={currentClassId === null}
        />
        <NavItem 
          icon={<Calendar className="w-5 h-5" />} 
          label="Calendar" 
          onClick={() => {}}
        />
      </div>
      
      <div className="border-t border-gray-200 py-3">
        <div className="px-6 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Enrolled
        </div>
        {classes.map(cls => (
          <NavItem 
            key={cls.id}
            icon={
              <div className={`w-8 h-8 rounded-full text-white flex items-center justify-center text-sm font-medium ${cls.themeColor}`}>
                {cls.name.charAt(0)}
              </div>
            }
            label={cls.name}
            subLabel={cls.section}
            onClick={() => onClassSelect(cls.id)}
            isActive={currentClassId === cls.id}
          />
        ))}
      </div>

      <div className="border-t border-gray-200 py-3">
        <NavItem 
          icon={<Settings className="w-5 h-5" />} 
          label="Settings" 
          onClick={() => {}}
        />
      </div>
    </aside>
  );
}

function NavItem({ 
  icon, 
  label, 
  subLabel,
  onClick, 
  isActive 
}: { 
  icon: React.ReactNode, 
  label: string, 
  subLabel?: string,
  onClick: () => void, 
  isActive?: boolean 
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-6 px-6 py-3 hover:bg-gray-100 transition-colors text-left ${isActive ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-r-full mr-4 w-[calc(100%-16px)]' : 'text-gray-700'}`}
    >
      <div className={`${isActive ? 'text-blue-700' : 'text-gray-500'}`}>
        {icon}
      </div>
      <div className="flex-1 overflow-hidden">
        <div className={`truncate ${isActive ? 'font-medium' : ''}`}>{label}</div>
        {subLabel && <div className="text-xs text-gray-500 truncate">{subLabel}</div>}
      </div>
    </button>
  );
}
