import React from 'react';

interface LessonsCardProps {
  lessons: string[];
  onChangeLesson: (index: number, text: string) => void;
}

export const LessonsCard: React.FC<LessonsCardProps> = ({
  lessons,
  onChangeLesson,
}) => {
  return (
    <div className="neon-box w-full p-5 sm:p-6 flex flex-col gap-4">
      {/* Title */}
      <div className="flex items-center gap-2.5">
        <span className="inline-block w-1.5 h-5 bg-gradient-to-b from-orange-400 to-red-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.8)]" />
        <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide">
          درس‌هایی که امروز گرفتم
        </h2>
      </div>

      {/* Ruled lines inner container */}
      <div className="neon-inner-box p-4 sm:p-6 flex flex-col gap-4 sm:gap-5">
        {lessons.map((lesson, idx) => (
          <div key={idx} className="flex items-center gap-3">
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
          </div>
        ))}
      </div>
    </div>
  );
};
