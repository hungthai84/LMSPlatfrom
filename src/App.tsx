/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ClassView } from './components/ClassView';
import { currentUser, mockClasses, mockAnnouncements, mockAssignments } from './data';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Default collapsed
  const [currentClassId, setCurrentClassId] = useState<string | null>(null);
  const [cardOpacity, setCardOpacity] = useState(90);
  const [borderColorIndex, setBorderColorIndex] = useState(0);

  const borderColors = ['border-red-500', 'border-blue-500', 'border-green-500', 'border-yellow-500', 'border-purple-500'];

  useEffect(() => {
    const interval = setInterval(() => {
      setBorderColorIndex((prev) => (prev + 1) % borderColors.length);
    }, 60000); // 1 minute
    return () => clearInterval(interval);
  }, []);
  
  const handleHomeClick = () => setCurrentClassId(null);

  const currentClass = currentClassId ? mockClasses.find(c => c.id === currentClassId) : null;
  const classAnnouncements = currentClassId ? mockAnnouncements.filter(a => a.classId === currentClassId) : [];
  const classAssignments = currentClassId ? mockAssignments.filter(a => a.classId === currentClassId) : [];

  return (
    <div className="p-[15px] h-screen w-screen bg-gray-100 overflow-hidden">
      <div className={`h-full w-full rounded-[10px] border-4 ${borderColors[borderColorIndex]} shadow-[0_0_30px_rgba(0,0,0,0.3)] overflow-hidden flex bg-white`} style={{ '--tw-bg-opacity': cardOpacity / 100 } as React.CSSProperties}>
        <Sidebar 
          isOpen={sidebarOpen} 
          setIsOpen={setSidebarOpen}
          classes={mockClasses} 
          onClassSelect={setCurrentClassId}
          onHomeSelect={handleHomeClick}
          currentClassId={currentClassId}
        />
        
        <main className={`flex-1 transition-all overflow-y-auto`}>
          <Navbar 
            onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
            currentUser={currentUser} 
            onHomeClick={handleHomeClick}
          />
          {currentClassId && currentClass ? (
            <ClassView 
              classItem={currentClass} 
              announcements={classAnnouncements}
              assignments={classAssignments}
            />
          ) : (
            <Dashboard 
              classes={mockClasses} 
              onClassSelect={setCurrentClassId} 
            />
          )}
        </main>
      </div>
    </div>
  );
}

