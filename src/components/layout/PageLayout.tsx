import React from 'react';

interface PageLayoutProps {
  banner: React.ReactNode;
  tabs?: React.ReactNode;
  statistics?: React.ReactNode;
  toolbar: React.ReactNode;
  content: React.ReactNode;
}

export const PageLayout = ({
  banner,
  tabs,
  statistics,
  toolbar,
  content,
}: PageLayoutProps) => {
  return (
    <div className="flex flex-col gap-4 h-full overflow-hidden p-2">
      {/* 1. Banner */}
      <div className="flex flex-row justify-between items-start bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
        <div className="w-[70%]">{banner}</div>
        <div className="w-[30%] flex justify-end">
            {/* The Document button should be passed as part of the banner or handled separately */}
        </div>
      </div>

      {/* 2. Tab */}
      {tabs && <div className="border-b border-slate-200">{tabs}</div>}

      {/* 3. Statistics Cards Container */}
      {statistics && (
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          {statistics}
        </div>
      )}

      {/* 4. Feature Toolbar */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between">
        {toolbar}
      </div>

      {/* 5. Main Content */}
      <div className="flex-1 bg-white p-6 rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        {content}
      </div>
    </div>
  );
};
