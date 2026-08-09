import React, { useState, useEffect } from 'react';
import { FileText, X, Save, Trash2, Check, Sparkles } from 'lucide-react';

interface QuickNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NOTE_STORAGE_KEY = 'ascent_blueprint_quick_note';

export const QuickNoteModal: React.FC<QuickNoteModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [noteText, setNoteText] = useState(() => {
    try {
      return localStorage.getItem(NOTE_STORAGE_KEY) || '';
    } catch {
      return '';
    }
  });

  const [savedFeedback, setSavedFeedback] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(NOTE_STORAGE_KEY, noteText);
    } catch {
      // ignore
    }
  }, [noteText]);

  if (!isOpen) return null;

  const handleClear = () => {
    if (window.confirm('آیا از پاک کردن متن دفترچه یادداشت اطمینان دارید؟')) {
      setNoteText('');
    }
  };

  const handleManualSave = () => {
    try {
      localStorage.setItem(NOTE_STORAGE_KEY, noteText);
      setSavedFeedback(true);
      setTimeout(() => setSavedFeedback(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="neon-box w-full max-w-lg p-6 bg-[#0f0928] border-2 border-purple-500/80 rounded-3xl shadow-[0_0_40px_rgba(168,85,247,0.5)] flex flex-col gap-5 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-1.5 rounded-lg text-purple-400 hover:text-white hover:bg-purple-900/50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/30 border border-purple-400 flex items-center justify-center shadow-lg">
              <FileText className="w-6 h-6 text-purple-200" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
                <span>دفترچه یادداشت شخصی (Scratchpad)</span>
                <span className="text-[11px] font-bold text-orange-300 bg-orange-950/60 px-2 py-0.5 rounded-full border border-orange-500/40">
                  همیشه فعال
                </span>
              </h3>
              <p className="text-xs text-purple-300/80">
                یادداشت‌ها، ایده‌ها و لینک‌های ضروری (ذخیره خودکار در مرورگر لپ‌تاپ)
              </p>
            </div>
          </div>
        </div>

        {/* Text Area */}
        <div className="relative">
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="یادداشت‌های دم‌دستی، ایده‌های ناگهانی، شماره‌ها یا لینک‌های مهم خود را اینجا تایپ کنید..."
            rows={8}
            className="w-full bg-purple-950/40 border border-purple-400/40 rounded-2xl p-4 text-sm sm:text-base text-purple-100 placeholder-purple-400/40 outline-none focus:border-purple-300 transition-colors resize-none leading-relaxed"
            autoFocus
          />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleManualSave}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>{savedFeedback ? 'ذخیره شد ✅' : 'ذخیره دستی'}</span>
            </button>
            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-950/60 hover:bg-red-900/40 border border-purple-500/30 hover:border-red-400/50 text-purple-300 hover:text-red-300 font-medium text-xs transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>پاک کردن متن</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-purple-900/60 hover:bg-purple-800/80 border border-purple-500/40 text-purple-200 font-medium text-sm transition-colors"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
};
