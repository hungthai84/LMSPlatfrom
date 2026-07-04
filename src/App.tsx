/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ClassView } from './components/ClassView';
import { currentUser, mockClasses, mockAnnouncements, mockAssignments } from './data';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentClassId, setCurrentClassId] = useState<string | null>(null);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  
  const handleHomeClick = () => setCurrentClassId(null);

  const currentClass = currentClassId ? mockClasses.find(c => c.id === currentClassId) : null;
  const classAnnouncements = currentClassId ? mockAnnouncements.filter(a => a.classId === currentClassId) : [];
  const classAssignments = currentClassId ? mockAssignments.filter(a => a.classId === currentClassId) : [];

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <Navbar 
        onMenuClick={toggleSidebar} 
        currentUser={currentUser} 
        onHomeClick={handleHomeClick}
      />
      
      <div className="flex">
        <Sidebar 
          isOpen={sidebarOpen} 
          classes={mockClasses} 
          onClassSelect={setCurrentClassId}
          onHomeSelect={handleHomeClick}
          currentClassId={currentClassId}
        />
        
        <main className={`flex-1 transition-all ${sidebarOpen ? 'w-[calc(100%-18rem)]' : 'w-full'}`}>
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

