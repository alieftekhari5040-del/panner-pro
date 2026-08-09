import React from 'react';
import { Calendar, Target, BarChart3 } from 'lucide-react';

export type TabId = 'today' | 'habits' | 'stats';

interface TabsProps {
  activeTab: TabId;
  onChange: (tab: TabId) => void;
}

export const Tabs: React.FC<TabsProps> = ({ activeTab, onChange }) => {
  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    {
      id: 'today',
      label: 'برنامه‌ی روزانه',
      icon: <Calendar className="w-4 h-4" />,
    },
    {
      id: 'habits',
      label: 'ردیاب عادت‌ها',
      icon: <Target className="w-4 h-4" />,
    },
    {
      id: 'stats',
      label: 'آمار و عملکرد',
      icon: <BarChart3 className="w-4 h-4" />,
    },
  ];

  return (
    <div className="no-print w-full mb-6 flex items-center justify-center">
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-purple-950/50 border border-purple-500/30 backdrop-blur-md shadow-sm">
        {tabs.map((t) => {
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-purple-600 border border-purple-300 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                  : 'text-purple-300/80 hover:text-white hover:bg-purple-900/30'
              }`}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
