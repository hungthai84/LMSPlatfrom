import React from 'react';
import { Menu, Plus, User as UserIcon } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  onMenuClick: () => void;
  currentUser: User;
  onHomeClick: () => void;
}

export function Navbar({ onMenuClick, currentUser, onHomeClick }: NavbarProps) {
  return (
    <nav className="flex items-center justify-between px-4 h-16 border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="p-3 -ml-3 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={onHomeClick}
        >
          <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center text-white font-bold text-lg">
            E
          </div>
          <span className="text-xl font-medium text-gray-800 hidden sm:block hover:underline decoration-transparent hover:decoration-gray-400 underline-offset-4 transition-all">EduClass</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <button className="p-3 rounded-full hover:bg-gray-100 transition-colors text-gray-600" title="Create or join a class">
          <Plus className="w-6 h-6" />
        </button>
        <button className="p-1 rounded-full hover:bg-gray-100 transition-colors">
          {currentUser.avatarUrl ? (
            <img 
              src={currentUser.avatarUrl} 
              alt={currentUser.name} 
              className="w-8 h-8 rounded-full border border-gray-200 bg-gray-50"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
              <UserIcon className="w-5 h-5" />
            </div>
          )}
        </button>
      </div>
    </nav>
  );
}
