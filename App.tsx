
import React, { useState, useEffect } from 'react';
import FlipClock from './components/FlipClock';
import { AppSettings } from './types';

const SettingsIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

const ACCESS_CODE = "0407";

const App: React.FC = () => {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [inputCode, setInputCode] = useState("");
  const [error, setError] = useState(false);
  const [settings, setSettings] = useState<AppSettings>({
    showSeconds: false,
    theme: 'dark',
    is24Hour: true,
    mode: 'clock',
    orientation: 'auto',
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [settingsView, setSettingsView] = useState<'main' | 'orientation'>('main');

  useEffect(() => {
    const savedAuth = localStorage.getItem('flip_clock_auth');
    if (savedAuth === 'true') {
      setIsAuthorized(true);
    }
  }, []);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode === ACCESS_CODE) {
      setIsAuthorized(true);
      localStorage.setItem('flip_clock_auth', 'true');
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
      setInputCode("");
    }
  };

  const toggleSetting = (key: keyof AppSettings) => {
    setSettings(prev => ({
      ...prev,
      [key]: typeof prev[key] === 'boolean' ? !prev[key] : prev[key],
    }));
  };

  const isDark = settings.theme === 'dark';

  if (!isAuthorized) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center p-6">
        <form onSubmit={handleAuth} className="w-full max-w-xs space-y-6 text-center">
          <h1 className="text-white/20 text-sm font-bold tracking-[0.3em] uppercase">Private Access</h1>
          <div className="relative">
            <input
              type="password"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="••••"
              className={`w-full bg-zinc-900 border-2 ${error ? 'border-red-500 animate-shake' : 'border-white/5'} text-white text-center text-4xl py-4 rounded-2xl outline-none transition-all focus:border-white/20`}
              autoFocus
            />
          </div>
          <p className="text-white/10 text-[10px] tracking-widest leading-relaxed">
            THIS IS A PRIVATE WORK.<br/>AUTHORIZED PERSONNEL ONLY.
          </p>
        </form>
        <style>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
          }
          .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
        `}</style>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 ${isDark ? 'bg-[#000000]' : 'bg-[#FFFFFF]'} flex items-center justify-center p-0 transition-colors duration-1000`}>
      <button 
        onClick={() => {
          setSettingsView('main');
          setIsMenuOpen(!isMenuOpen);
        }}
        className={`fixed top-4 right-4 sm:top-8 sm:right-8 z-[150] p-2 transition-all active:scale-90 ${isDark ? 'text-white/30 hover:text-white' : 'text-black/30 hover:text-black'}`}
      >
        <SettingsIcon />
      </button>

      {isMenuOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 animate-in fade-in duration-300" onClick={() => setIsMenuOpen(false)}>
          <div 
            className={`${isDark ? 'bg-zinc-900 text-white' : 'bg-white text-black'} p-8 sm:p-10 rounded-[2.5rem] sm:rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] w-full max-w-sm border ${isDark ? 'border-white/10' : 'border-black/5'} transform animate-in slide-in-from-bottom-12 zoom-in-95`}
            onClick={e => e.stopPropagation()}
          >
            {settingsView === 'main' ? (
              <>
                <div className="flex justify-between items-center mb-8 sm:mb-10">
                   <h2 className="text-2xl sm:text-3xl font-normal tracking-tight">OPTIONS</h2>
                   <button onClick={() => setIsMenuOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                   </button>
                </div>

                <div className="space-y-3">
                   <div className="flex items-center justify-between p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-zinc-500/5 cursor-pointer hover:bg-zinc-500/10 transition-colors" onClick={() => setSettingsView('orientation')}>
                     <span className="font-bold text-xs sm:text-sm uppercase tracking-widest">Screen Rotation</span>
                     <div className="flex items-center gap-2">
                        <span className="text-zinc-500 text-xs sm:text-sm">{settings.orientation === 'auto' ? 'Auto' : 'Portrait'}</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-zinc-500"><path d="M9 18l6-6-6-6"/></svg>
                     </div>
                   </div>

                   <div className="flex items-center justify-between p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-zinc-500/5">
                     <span className="font-bold text-xs sm:text-sm uppercase tracking-widest">Show Seconds</span>
                     <button onClick={() => toggleSetting('showSeconds')} className={`w-12 h-6 sm:w-14 sm:h-7 rounded-full transition-colors ${settings.showSeconds ? 'bg-white' : 'bg-zinc-800'} p-1 sm:p-1.5`}>
                        <div className={`w-4 h-4 rounded-full transition-all ${settings.showSeconds ? 'bg-black translate-x-6 sm:translate-x-7' : 'bg-zinc-500 translate-x-0'}`}></div>
                     </button>
                   </div>

                   <div className="flex items-center justify-between p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-zinc-500/5">
                     <span className="font-bold text-xs sm:text-sm uppercase tracking-widest">Dark Mode</span>
                     <button onClick={() => setSettings(s => ({...s, theme: s.theme === 'dark' ? 'light' : 'dark'}))} className={`w-12 h-6 sm:w-14 sm:h-7 rounded-full transition-colors ${settings.theme === 'dark' ? 'bg-white' : 'bg-zinc-800'} p-1 sm:p-1.5`}>
                        <div className={`w-4 h-4 rounded-full transition-all ${settings.theme === 'dark' ? 'bg-black translate-x-6 sm:translate-x-7' : 'bg-zinc-500 translate-x-0'}`}></div>
                     </button>
                   </div>

                   <div className="flex items-center justify-between p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-zinc-500/5">
                     <span className="font-bold text-xs sm:text-sm uppercase tracking-widest">24H Format</span>
                     <button onClick={() => toggleSetting('is24Hour')} className={`w-12 h-6 sm:w-14 sm:h-7 rounded-full transition-colors ${settings.is24Hour ? 'bg-white' : 'bg-zinc-800'} p-1 sm:p-1.5`}>
                        <div className={`w-4 h-4 rounded-full transition-all ${settings.is24Hour ? 'bg-black translate-x-6 sm:translate-x-7' : 'bg-zinc-500 translate-x-0'}`}></div>
                     </button>
                   </div>

                   <div className="pt-4 sm:pt-6">
                     <div className="flex gap-2 p-1 bg-zinc-500/10 rounded-[1.5rem]">
                        <button 
                          onClick={() => setSettings(s => ({...s, mode: 'clock'}))}
                          className={`flex-1 py-3 sm:py-4 rounded-[1.25rem] text-xs font-black transition-all ${settings.mode === 'clock' ? (isDark ? 'bg-white text-black' : 'bg-zinc-900 text-white') : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                          CLOCK
                        </button>
                        <button 
                          onClick={() => setSettings(s => ({...s, mode: 'timer'}))}
                          className={`flex-1 py-3 sm:py-4 rounded-[1.25rem] text-xs font-black transition-all ${settings.mode === 'timer' ? (isDark ? 'bg-white text-black' : 'bg-zinc-900 text-white') : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                          TIMER
                        </button>
                     </div>
                   </div>

                   <div className="pt-2 text-center">
                     <button 
                       onClick={() => {
                         localStorage.removeItem('flip_clock_auth');
                         window.location.reload();
                       }} 
                       className="text-[10px] text-zinc-600 hover:text-zinc-400 uppercase tracking-widest"
                     >
                       Reset Access Authorization
                     </button>
                   </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center mb-8 sm:mb-10 relative">
                  <button onClick={() => setSettingsView('main')} className="absolute left-0 p-2 text-zinc-500 hover:text-white transition-colors">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
                  </button>
                  <h2 className="w-full text-center text-xl sm:text-2xl font-normal tracking-tight">Screen Rotation</h2>
                  <button onClick={() => setIsMenuOpen(false)} className="absolute right-0 p-2 text-zinc-500 hover:text-white transition-colors">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                   </button>
                </div>

                <div className="bg-zinc-500/5 rounded-[2rem] overflow-hidden">
                   <div 
                    className="flex items-center justify-between p-5 cursor-pointer hover:bg-white/5 transition-colors border-b border-white/5"
                    onClick={() => { setSettings(s => ({...s, orientation: 'auto'})); setSettingsView('main'); }}
                   >
                     <span className="text-lg">Auto</span>
                     {settings.orientation === 'auto' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-white"><path d="M20 6L9 17l-5-5"/></svg>}
                   </div>
                   <div 
                    className="flex items-center justify-between p-5 cursor-pointer hover:bg-white/5 transition-colors"
                    onClick={() => { setSettings(s => ({...s, orientation: 'portrait'})); setSettingsView('main'); }}
                   >
                     <span className="text-lg">Portrait</span>
                     {settings.orientation === 'portrait' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-white"><path d="M20 6L9 17l-5-5"/></svg>}
                   </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <main className="w-full h-full flex items-center justify-center select-none cursor-default overflow-hidden relative">
        <FlipClock settings={settings} />
      </main>
    </div>
  );
};

export default App;
