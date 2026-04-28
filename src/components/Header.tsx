import { auth, signInWithGoogle, logout } from '../lib/firebase';
import { LogIn, LogOut, MessageSquare, Sun, Moon } from 'lucide-react';
import { motion } from 'motion/react';

interface HeaderProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export default function Header({ isDarkMode, onToggleTheme }: HeaderProps) {
  const user = auth.currentUser;

  return (
    <header id="app-header" className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md transition-colors duration-300 dark:border-gray-800 dark:bg-black/80">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white dark:bg-white dark:text-black">
            <MessageSquare size={20} />
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">Nexus Chat</h1>
        </motion.div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={onToggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-100 bg-gray-50 text-gray-500 transition-all hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {user ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 sm:gap-3"
            >
              <div className="hidden text-right lg:block">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{user.displayName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
              </div>
              <img 
                src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} 
                alt={user.displayName || "User"} 
                className="h-10 w-10 rounded-full border border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-900"
                referrerPolicy="no-referrer"
              />
              <button
                id="logout-button"
                onClick={logout}
                className="flex items-center justify-center rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                title="Sign Out"
              >
                <LogOut size={20} />
              </button>
            </motion.div>
          ) : (
            <button
              id="login-button"
              onClick={signInWithGoogle}
              className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              <LogIn size={18} />
              <span>Sign in with Google</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
