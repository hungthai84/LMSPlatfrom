import React, { useState } from 'react';
import { ClassItem, Announcement, Assignment, User } from '../types';
import { mockUsers } from '../data';
import { MessageSquare, MoreVertical, FileText } from 'lucide-react';

interface ClassViewProps {
  classItem: ClassItem;
  announcements: Announcement[];
  assignments: Assignment[];
}

type TabType = 'stream' | 'classwork' | 'people';

export function ClassView({ classItem, announcements, assignments }: ClassViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>('stream');

  return (
    <div className="max-w-5xl mx-auto w-full">
      {/* Tabs */}
      <div className="border-b border-gray-200 px-6 pt-2 sticky top-16 bg-white z-30">
        <div className="flex gap-8">
          <TabButton active={activeTab === 'stream'} onClick={() => setActiveTab('stream')}>Stream</TabButton>
          <TabButton active={activeTab === 'classwork'} onClick={() => setActiveTab('classwork')}>Classwork</TabButton>
          <TabButton active={activeTab === 'people'} onClick={() => setActiveTab('people')}>People</TabButton>
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'stream' && (
          <div className="space-y-6">
            {/* Hero Image / Banner */}
            <div className={`${classItem.themeColor} rounded-xl h-48 md:h-64 p-6 flex flex-col justify-end text-white shadow-sm relative overflow-hidden`}>
              <div className="absolute inset-0 bg-black/10 mix-blend-multiply"></div>
              <div className="relative z-10">
                <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">{classItem.name}</h1>
                {classItem.section && <p className="text-lg md:text-xl mt-1 opacity-90">{classItem.section}</p>}
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              {/* Left Column: Upcoming */}
              <div className="md:w-64 flex-shrink-0">
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <h3 className="font-medium text-gray-800 mb-4">Upcoming</h3>
                  {assignments.length > 0 ? (
                    <div className="space-y-3">
                      {assignments.slice(0, 2).map(a => (
                        <div key={a.id} className="text-sm">
                          <p className="text-gray-800 truncate hover:underline cursor-pointer">{a.title}</p>
                          <p className="text-gray-500 text-xs mt-0.5">Due {new Date(a.dueDate || '').toLocaleDateString()}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Woohoo, no work due in soon!</p>
                  )}
                  <div className="mt-4 flex justify-end">
                    <button className="text-sm text-blue-600 font-medium hover:bg-blue-50 px-3 py-2 rounded-md transition-colors">
                      View all
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Feed */}
              <div className="flex-1 space-y-4">
                {/* Announcement Input placeholder */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex items-center gap-4 cursor-text hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div className="text-gray-500 text-sm flex-1">
                    Announce something to your class
                  </div>
                </div>

                {/* Stream Items */}
                {announcements.map(announcement => (
                  <AnnouncementCard key={announcement.id} announcement={announcement} />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'classwork' && (
          <div className="space-y-8 max-w-4xl mx-auto">
             <div className="flex items-center gap-4 border-b border-gray-200 pb-4">
               <button className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium shadow-sm hover:bg-blue-700 transition-colors flex items-center gap-2">
                 <PlusIcon /> Create
               </button>
             </div>
             {/* Group by topics */}
             {['Week 1: Frameworks', 'Week 2: State'].map(topic => (
               <div key={topic} className="space-y-4">
                 <h2 className="text-2xl font-normal text-blue-800 border-b border-blue-600 pb-2">{topic}</h2>
                 <div className="space-y-2">
                   {assignments.filter(a => a.topic === topic).map(assignment => (
                     <div key={assignment.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg border-b border-gray-100 cursor-pointer group">
                       <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                         <FileText className="w-5 h-5" />
                       </div>
                       <div className="flex-1">
                         <h3 className="font-medium text-gray-800">{assignment.title}</h3>
                         <p className="text-sm text-gray-500 line-clamp-1">{assignment.description}</p>
                       </div>
                       <div className="text-sm text-gray-500 font-medium">
                         {assignment.dueDate ? `Due ${new Date(assignment.dueDate).toLocaleDateString()}` : 'No due date'}
                       </div>
                       <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-all">
                         <MoreVertical className="w-5 h-5" />
                       </button>
                     </div>
                   ))}
                 </div>
               </div>
             ))}
          </div>
        )}

        {activeTab === 'people' && (
          <div className="max-w-4xl mx-auto space-y-12">
            <div>
              <h2 className="text-3xl font-normal text-blue-800 border-b border-blue-600 pb-4 mb-4 flex justify-between items-end">
                <span>Teachers</span>
                <span className="text-sm text-blue-800 font-medium">{Object.values(mockUsers).filter(u => u.role === 'teacher').length} teachers</span>
              </h2>
              <div className="space-y-2">
                {Object.values(mockUsers).filter(u => u.role === 'teacher').map(teacher => (
                  <div key={teacher.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg">
                    <img src={teacher.avatarUrl} alt={teacher.name} className="w-10 h-10 rounded-full bg-gray-100" />
                    <span className="font-medium text-gray-800 flex-1">{teacher.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-normal text-blue-800 border-b border-blue-600 pb-4 mb-4 flex justify-between items-end">
                <span>Students</span>
                <span className="text-sm text-blue-800 font-medium">{Object.values(mockUsers).filter(u => u.role === 'student').length} students</span>
              </h2>
              <div className="space-y-2">
                {Object.values(mockUsers).filter(u => u.role === 'student').map(student => (
                  <div key={student.id} className="flex items-center gap-4 p-4 border-b border-gray-100 hover:bg-gray-50">
                    <img src={student.avatarUrl} alt={student.name} className="w-10 h-10 rounded-full bg-gray-100" />
                    <span className="font-medium text-gray-800 flex-1">{student.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TabButton({ children, active, onClick }: { children: React.ReactNode, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-3 font-medium text-sm transition-colors relative ${active ? 'text-blue-600' : 'text-gray-600 hover:bg-gray-100 rounded-t-lg hover:text-gray-900'}`}
    >
      {children}
      {active && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-md" />
      )}
    </button>
  );
}

const AnnouncementCard: React.FC<{ announcement: Announcement }> = ({ announcement }) => {
  const author = mockUsers[announcement.authorId];
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="p-4 flex gap-4">
        <img src={author.avatarUrl} alt={author.name} className="w-10 h-10 rounded-full bg-gray-100 shrink-0" />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-gray-800">{author.name}</h3>
              <p className="text-xs text-gray-500">{new Date(announcement.createdAt).toLocaleDateString()}</p>
            </div>
            <button className="text-gray-400 hover:bg-gray-100 p-2 rounded-full transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
          <p className="mt-3 text-gray-800 whitespace-pre-wrap text-sm">{announcement.content}</p>
        </div>
      </div>
      
      {announcement.comments.length > 0 && (
        <div className="border-t border-gray-100 bg-gray-50/50">
          <div className="p-4 space-y-4">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              {announcement.comments.length} class comment{announcement.comments.length !== 1 ? 's' : ''}
            </div>
            {announcement.comments.map(comment => {
              const commentAuthor = mockUsers[comment.authorId];
              return (
                <div key={comment.id} className="flex gap-3">
                  <img src={commentAuthor.avatarUrl} alt={commentAuthor.name} className="w-8 h-8 rounded-full bg-gray-100 shrink-0" />
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-medium text-sm text-gray-800">{commentAuthor.name}</span>
                      <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-sm text-gray-700 mt-0.5">{comment.content}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div className="p-3 border-t border-gray-100 flex items-center gap-3">
         <img src={mockUsers['u1'].avatarUrl} alt="You" className="w-8 h-8 rounded-full bg-gray-100 shrink-0" />
         <input 
           type="text" 
           placeholder="Add class comment..." 
           className="flex-1 bg-transparent border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500"
         />
      </div>
    </div>
  );
};

function PlusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
