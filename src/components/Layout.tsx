import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Search, Heart, User, Settings, ChefHat } from 'lucide-react';
import { useAuth } from '../App';

export default function Layout() {
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { path: '/', icon: Home, label: 'Scan' },
    { path: '/recipes', icon: Search, label: 'Recipes' },
    { path: '/favorites', icon: Heart, label: 'Saved' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  if (user?.role === 'admin') {
    navItems.push({ path: '/admin', icon: Settings, label: 'Admin' });
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30">
      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-md mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-1.5 bg-blue-600/20 rounded-lg border border-blue-500/30 group-hover:border-blue-500/60 transition-all">
              <ChefHat className="w-5 h-5 text-blue-400" />
            </div>
            <span className="font-bold tracking-tight text-lg">
              FridgeChef <span className="text-blue-500">AI</span>
            </span>
          </Link>
          
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">
                {user?.plan || 'Free'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto pb-32 px-6 pt-6 relative z-10 min-h-[calc(100vh-4rem)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-2xl border-t border-white/5 pb-8 pt-3">
        <div className="max-w-md mx-auto px-8 flex items-center justify-between">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative flex flex-col items-center gap-1 group"
              >
                <div className={`p-2 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-blue-600/20 text-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.2)]' 
                    : 'text-gray-500 hover:text-gray-300'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className={`text-[10px] font-medium tracking-wide transition-colors ${
                  isActive ? 'text-blue-400' : 'text-gray-500'
                }`}>
                  {item.label}
                </span>
                
                {isActive && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute -top-3 w-8 h-1 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.8)]"
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
