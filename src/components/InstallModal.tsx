import React from 'react';
import { Monitor, X, CheckCircle2, Download, Sparkles } from 'lucide-react';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerNativeInstall: () => void;
  isNativePromptReady: boolean;
}

export const InstallModal: React.FC<InstallModalProps> = ({
  isOpen,
  onClose,
  onTriggerNativeInstall,
  isNativePromptReady,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="neon-box w-full max-w-md p-6 bg-[#0f0928] border-2 border-purple-500/80 rounded-3xl shadow-[0_0_40px_rgba(168,85,247,0.5)] flex flex-col gap-5 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-1 rounded-lg text-purple-400 hover:text-white hover:bg-purple-900/50 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/30 border border-purple-400 flex items-center justify-center shadow-lg">
            <Monitor className="w-6 h-6 text-purple-200" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-wide">
              نصب روی دسکتاپ (PWA)
            </h3>
            <p className="text-xs text-purple-300/80">
              دسترسی سریع و مستقل مانند نرم‌افزار ویندوز / مک
            </p>
          </div>
        </div>

        {/* Native Install Option if ready */}
        {isNativePromptReady && (
          <div className="bg-purple-950/60 border border-purple-500/40 p-4 rounded-2xl flex flex-col gap-3">
            <div className="flex items-center gap-2 text-purple-200 text-sm font-semibold">
              <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
              <span>قابلیت نصب مستقیم آماده است!</span>
            </div>
            <button
              onClick={onTriggerNativeInstall}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <Download className="w-4 h-4" />
              <span>نصب مستقیم برنامه روی سیستم</span>
            </button>
          </div>
        )}

        {/* Instruction Steps for Chrome / Edge */}
        <div className="flex flex-col gap-3 bg-purple-950/40 border border-purple-500/25 p-4 rounded-2xl text-xs sm:text-sm text-purple-200">
          <p className="font-bold text-purple-300">
            راهنمای نصب در مرورگر (Chrome / Edge):
          </p>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <span>
              در مرورگر Chrome یا Edge روی آیکون <strong>نصب اپلیکیشن (Install 💻)</strong> در سمت راست نوار آدرس کلیک کنید.
            </span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <span>
              یا از منوی مرورگر (`⋮` در بالای صفحه)، گزینه <strong>Install برنامه‌ی روزانه</strong> یا <strong>Apps ➔ Install this site as an app</strong> را انتخاب نمایید.
            </span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <span>
              پس از نصب، آیکون برنامه روی میز کار (Desktop) و منوی استارت قرار می‌گیرد و بدون نیاز به باز کردن مرورگر، در پنجره مستقل اجرا می‌شود!
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full py-2 rounded-xl bg-purple-900/60 hover:bg-purple-800/80 border border-purple-500/40 text-purple-100 font-medium text-sm transition-all"
        >
          متوجه شدم
        </button>
      </div>
    </div>
  );
};
