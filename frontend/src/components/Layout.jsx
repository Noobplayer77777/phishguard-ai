import React from 'react';
import { Shield, Moon, Sun } from 'lucide-react';

const Layout = ({ children, darkMode, toggleTheme }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-cyber-900/80 backdrop-blur-md border-b border-gray-200 dark:border-cyber-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-cyber-blue p-2 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyber-blue to-purple-600">
                PhishGuard AI
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-cyber-800 transition-colors"
                aria-label="Toggle theme"
              >
                {darkMode ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-gray-600" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="border-t border-gray-200 dark:border-cyber-800 py-8 bg-white dark:bg-cyber-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-500 dark:text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} PhishGuard AI. All rights reserved.
          </div>
          <div className="flex space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center"><Shield className="h-4 w-4 mr-1"/> Powered by AI Detection Engine</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
