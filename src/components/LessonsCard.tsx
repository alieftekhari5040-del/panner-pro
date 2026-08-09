import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface LessonsCardProps {
  lessons: string[];
  onChangeLesson: (index: number, text: string) => void;
  onAddLesson: () => void;
  onRemoveLesson: (index: number) => void;
}

export const LessonsCard: React.FC<LessonsCardProps> = ({
  lessons,
  onChangeLesson,
  onAddLesson,
  onRemoveLesson,
}) => {
  return (
    <div className="neon-box w-full p-5 sm:p-6 flex flex-col gap-4">
      {/* Title & Add button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="inline-block w-1.5 h-5 bg-gradient-to-b from-orange-400 to-red-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.8)]" />
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide">
            درس‌هایی که امروز گرفتم
          </h2>
        </div>
        <button
          onClick={onAddLesson}
          className="no-print flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-950/40 hover:bg-purple-800/60 border border-purple-500/30 text-purple-300 hover:text-white text-xs transition-all shadow-sm"
          title="افزودن درس جدید"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>درس جدید</span>
        </button>
      </div>

      {/* Ruled lines inner container */}
      <div className="neon-inner-box p-4 sm:p-6 flex flex-col gap-3.5">
        {lessons.map((lesson, idx) => (
          <div key={idx} className="flex items-center gap-3 group">
            <span className="text-xs font-semibold text-purple-400/60 w-4 select-none">
              {idx + 1}.
            </span>
            <input
              type="text"
              value={lesson}
              onChange={(e) => onChangeLesson(idx, e.target.value)}
              placeholder="نکته، درس یا تجربه مهم امروز..."
              className="w-full bg-transparent pb-1.5 px-1 text-sm sm:text-base text-purple-100 placeholder-purple-400/40 border-b border-purple-500/30 focus:border-purple-300 outline-none transition-all"
            />
            <button
              onClick={() => onRemoveLesson(idx)}
              className="no-print opacity-0 group-hover:opacity-100 focus:opacity-100 text-purple-400/60 hover:text-red-400 p-1.5 transition-all"
              title="حذف این درس"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {lessons.length === 0 && (
          <div className="text-center py-3 text-purple-400/60 text-sm">
            هیچ درسی ثبت نشده است. روی «درس جدید» کلیک کنید.
          </div>
        )}
      </div>
    </div>
  );
};
