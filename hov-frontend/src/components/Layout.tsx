import { useState, ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-velo-light-gray flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        {/* Mobile header */}
        <header className="lg:hidden bg-velo-black p-4 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white p-2 hover:bg-gray-800 rounded-lg"
            aria-label="Open menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <img
            src="/images/mv.png"
            alt="House of Velo"
            className="h-10 w-auto"
          />
          <div className="w-10" /> {/* Spacer for centering */}
        </header>

        {/* Desktop header */}
        <header className="hidden lg:flex bg-white shadow-sm p-4 items-center justify-between">
          <h1 className="text-xl font-semibold text-velo-black">
            Welcome, {user?.name}
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 capitalize">
              {user?.role.toLowerCase()}
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
