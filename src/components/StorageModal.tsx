import React from 'react';
import { Download, Upload, X, ShieldCheck, HardDrive } from 'lucide-react';
import { ALL_WEEKDAYS } from '../utils/jalali';
import { loadDayData, saveDayData } from '../utils/storage';

interface StorageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataRestored: () => void;
}

export const StorageModal: React.FC<StorageModalProps> = ({
  isOpen,
  onClose,
  onDataRestored,
}) => {
  if (!isOpen) return null;

  const handleExportBackup = () => {
    try {
      const backup: Record<string, unknown> = {};
      ALL_WEEKDAYS.forEach((day) => {
        backup[`day_${day}`] = loadDayData(day);
      });
      const habits = localStorage.getItem('ascent_blueprint_habits_v2');
      if (habits) {
        backup['habits'] = JSON.parse(habits);
      }
      backup['exportDate'] = new Date().toISOString();
      backup['version'] = '2.0';

      const jsonStr = JSON.stringify(backup, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Ascent-Blueprint-Backup-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('خطا در ایجاد فایل پشتیبان');
    }
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const backup = JSON.parse(content);
        if (backup && typeof backup === 'object') {
          ALL_WEEKDAYS.forEach((day) => {
            if (backup[`day_${day}`]) {
              saveDayData(backup[`day_${day}`]);
            }
          });
          if (backup['habits']) {
            localStorage.setItem('ascent_blueprint_habits_v2', JSON.stringify(backup['habits']));
          }
          alert('اطلاعات با موفقیت بازیابی شد!');
          onDataRestored();
          onClose();
        }
      } catch {
        alert('فایل پشتیبان نامعتبر است.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="neon-box w-full max-w-md p-6 bg-[#0f0928] border-2 border-purple-500/80 rounded-3xl shadow-[0_0_40px_rgba(168,85,247,0.5)] flex flex-col gap-5 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-1.5 rounded-lg text-purple-400 hover:text-white hover:bg-purple-900/50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/30 border border-purple-400 flex items-center justify-center shadow-lg">
            <HardDrive className="w-6 h-6 text-purple-200" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-wide">
              پشتیبان‌گیری و بازیابی اطلاعات
            </h3>
            <p className="text-xs text-purple-300/80">
              انتقال و نگهداری فایل آفلاین از داده‌های برنامه
            </p>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="bg-emerald-950/50 border border-emerald-500/40 p-4 rounded-2xl flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
          <div className="text-xs text-purple-100">
            <p className="font-bold text-emerald-300 text-sm">
              ذخیره‌سازی خودکار مرورگر فعال است ✅
            </p>
            <p className="mt-1 text-purple-200/90 leading-relaxed">
              تمامی کارهای شما به‌صورت خودکار و بلادرنگ در حافظه مرورگر (LocalStorage) ذخیره می‌شوند. نیازی به ذخیره‌سازی دستی نیست!
            </p>
          </div>
        </div>

        {/* Actions: Export / Import */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleExportBackup}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>دانلود فایل پشتیبان (Export JSON)</span>
          </button>

          <label className="w-full py-3 px-4 rounded-xl bg-purple-900/60 hover:bg-purple-800/80 border border-purple-500/40 text-purple-100 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors">
            <Upload className="w-4 h-4" />
            <span>بازیابی از فایل پشتیبان (Import JSON)</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="hidden"
            />
          </label>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full py-2 rounded-xl bg-purple-900/40 hover:bg-purple-800/60 border border-purple-500/30 text-purple-200 font-medium text-sm transition-colors"
        >
          بستن
        </button>
      </div>
    </div>
  );
};
