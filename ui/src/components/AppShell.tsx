'use client';

import { createContext, useContext, useMemo, useState } from 'react';
import { Menu, X } from 'lucide-react';
import Sidebar from './Sidebar';

type AppShellContextValue = {
  openMobileNav: () => void;
  closeMobileNav: () => void;
  toggleMobileNav: () => void;
};

const AppShellContext = createContext<AppShellContextValue | null>(null);

export function useAppShell() {
  return useContext(AppShellContext);
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const contextValue = useMemo<AppShellContextValue>(
    () => ({
      openMobileNav: () => setIsMobileNavOpen(true),
      closeMobileNav: () => setIsMobileNavOpen(false),
      toggleMobileNav: () => setIsMobileNavOpen(value => !value),
    }),
    [],
  );

  return (
    <AppShellContext.Provider value={contextValue}>
      <div className="flex min-h-screen bg-gray-950 text-gray-100">
        <div className="hidden lg:flex lg:w-60 lg:flex-shrink-0 lg:border-r lg:border-gray-800">
          <Sidebar />
        </div>

        <div
          className={`fixed inset-0 z-40 bg-gray-950/80 backdrop-blur-sm transition-opacity duration-200 lg:hidden ${
            isMobileNavOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
          onClick={() => setIsMobileNavOpen(false)}
          aria-hidden="true"
        />

        <div
          className={`fixed inset-y-0 left-0 z-50 w-[18.5rem] max-w-[85vw] transform border-r border-gray-800 bg-gray-900 shadow-2xl transition-transform duration-200 lg:hidden ${
            isMobileNavOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center justify-end px-3 pt-3">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
              onClick={() => setIsMobileNavOpen(false)}
              aria-label="Close navigation menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <Sidebar onNavigate={() => setIsMobileNavOpen(false)} />
        </div>

        <main className="relative flex min-w-0 flex-1 flex-col bg-gray-950 text-gray-100">{children}</main>
      </div>
    </AppShellContext.Provider>
  );
}

export function MobileNavButton() {
  const appShell = useAppShell();

  if (!appShell) return null;

  return (
    <button
      type="button"
      className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-300 transition-colors hover:bg-gray-800 hover:text-white lg:hidden"
      onClick={appShell.toggleMobileNav}
      aria-label="Open navigation menu"
    >
      <Menu className="h-5 w-5" />
    </button>
  );
}
