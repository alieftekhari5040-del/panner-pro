import React from 'react';

export const FooterBar: React.FC = () => {
  return (
    <footer className="w-full mt-6 pt-4 border-t border-purple-500/20 flex flex-row items-center justify-between text-xs sm:text-sm text-purple-400/80 font-medium">
      {/* Right side (RTL): روز صفر تا قله */}
      <div className="flex items-center gap-1.5">
        <span>روز صفر تا قله</span>
      </div>

      {/* Left side (RTL): ● THE ASCENT BLUEPRINT - DAILY */}
      <div className="flex items-center gap-2 font-sans tracking-wider uppercase text-[11px] sm:text-xs">
        <span className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 shadow-[0_0_6px_rgba(249,115,22,0.8)]" />
        <span className="text-purple-300">THE ASCENT BLUEPRINT - DAILY</span>
      </div>
    </footer>
  );
};
