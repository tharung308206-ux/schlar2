import React from 'react';
import { useApp } from '../../../context/AppContext';
import { Smartphone, Maximize2, Minimize2, RotateCcw, Wifi, Battery, Signal } from 'lucide-react';

interface MobileShellProps {
  children: React.ReactNode;
  activeRoleTitle: string;
}

export const MobileShell: React.FC<MobileShellProps> = ({ children, activeRoleTitle }) => {
  const { isMobileDeviceView, setIsMobileDeviceView, currentRole, switchRoleAndNavigate } = useApp();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-900/95 py-2 sm:py-6 px-1 sm:px-4 flex flex-col items-center justify-start">
      {/* Device Viewport Mode Switcher Bar */}
      <div className="w-full max-w-md flex items-center justify-between mb-2 sm:mb-4 px-2 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-white truncate text-[11px] sm:text-xs">{activeRoleTitle}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMobileDeviceView(!isMobileDeviceView)}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 text-[11px] font-medium transition-colors"
          >
            {isMobileDeviceView ? (
              <>
                <Maximize2 className="w-3 h-3" />
                <span>Fluid Mobile</span>
              </>
            ) : (
              <>
                <Minimize2 className="w-3 h-3" />
                <span>Device Frame</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Device Frame or Responsive Viewport */}
      {isMobileDeviceView ? (
        <div className="relative w-full max-w-[412px] h-[844px] bg-slate-950 rounded-[40px] sm:rounded-[48px] p-2.5 sm:p-3 shadow-2xl border-[3px] sm:border-[4px] border-slate-800 ring-1 ring-slate-700/50 flex flex-col overflow-hidden mobile-device-shadow">
          {/* Top Notch / Dynamic Island */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-28 h-6 bg-slate-950 rounded-full z-50 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-slate-900 border border-slate-800" />
          </div>

          {/* Status Bar */}
          <div className="h-7 px-6 flex items-center justify-between text-[11px] font-semibold text-slate-800 dark:text-slate-200 shrink-0 z-40 select-none">
            <span className="font-mono">9:41</span>
            <div className="flex items-center gap-1.5">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4" />
            </div>
          </div>

          {/* Mobile Screen Container */}
          <div className="flex-1 bg-slate-50 dark:bg-slate-900 rounded-[38px] overflow-hidden flex flex-col relative">
            {children}
          </div>

          {/* Home indicator bar at bottom */}
          <div className="h-4 flex items-center justify-center shrink-0">
            <div className="w-32 h-1 bg-slate-600 rounded-full" />
          </div>
        </div>
      ) : (
        <div className="w-full max-w-lg bg-slate-50 rounded-2xl border border-slate-200 shadow-xl overflow-hidden min-h-[780px] flex flex-col">
          {children}
        </div>
      )}
    </div>
  );
};
