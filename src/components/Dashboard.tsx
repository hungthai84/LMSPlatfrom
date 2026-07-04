import React from 'react';
import { Folder, TrendingUp, MoreVertical } from 'lucide-react';
import { ClassItem, User } from '../types';
import { mockUsers } from '../data';

interface DashboardProps {
  classes: ClassItem[];
  onClassSelect: (classId: string) => void;
}

export function Dashboard({ classes, onClassSelect }: DashboardProps) {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {classes.map(cls => (
          <ClassCard 
            key={cls.id} 
            classItem={cls} 
            teacher={mockUsers[cls.teacherId]}
            onClick={() => onClassSelect(cls.id)} 
          />
        ))}
      </div>
    </div>
  );
}

const ClassCard: React.FC<{ classItem: ClassItem, teacher: User, onClick: () => void }> = ({ classItem, teacher, onClick }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group cursor-pointer flex flex-col h-72">
      <div 
        className={`${classItem.themeColor} h-24 p-4 relative flex justify-between`}
        onClick={onClick}
      >
        <div className="text-white w-full pr-8">
          <h2 className="text-xl font-medium truncate hover:underline">{classItem.name}</h2>
          <p className="text-sm opacity-90 truncate">{classItem.section}</p>
        </div>
        <button 
          className="absolute top-3 right-2 p-2 rounded-full text-white hover:bg-black/10 transition-colors"
          onClick={(e) => { e.stopPropagation(); }}
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
      
      <div className="flex-1 p-4 relative">
        <div className="absolute -top-10 right-4">
          <img 
            src={teacher.avatarUrl} 
            alt={teacher.name}
            className="w-20 h-20 rounded-full border-4 border-white bg-white object-cover shadow-sm"
          />
        </div>
        <div className="mt-8">
          {/* Due soon would go here */}
        </div>
      </div>
      
      <div className="border-t border-gray-100 p-3 flex justify-end gap-2 text-gray-500">
        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors" title="Open folder">
          <Folder className="w-5 h-5" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors" title="Open grades">
          <TrendingUp className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
