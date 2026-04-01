import { motion } from 'motion/react';
import { User, Mail, Zap, Star, Shield, LogOut, Settings, ChefHat, Sparkles, LogIn } from 'lucide-react';
import { useAuth } from '../App';
import { auth } from '../firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { PLAN_LIMITS } from '../types';

export default function Profile() {
  const { user, loading, signOut } = useAuth();

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Sign in failed:", err);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading profile...</div>;

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 space-y-8">
        <div className="p-8 bg-blue-600/10 rounded-full border border-blue-500/20">
          <User className="w-16 h-16 text-blue-400" />
        </div>
        <div className="space-y-2">
          <h3 className="text-3xl font-bold tracking-tight">Join the <span className="text-blue-500">Chef</span> Community</h3>
          <p className="text-gray-400 text-sm max-w-xs mx-auto">
            Sign in to save your recipes, track your usage, and unlock premium features.
          </p>
        </div>
        <button 
          onClick={handleSignIn}
          className="w-full py-5 bg-blue-600 hover:bg-blue-500 rounded-3xl font-bold tracking-tight shadow-[0_0_40px_rgba(37,99,235,0.4)] active:scale-95 transition-all flex items-center justify-center gap-3"
        >
          <LogIn className="w-6 h-6" />
          <span>Sign In with Google</span>
        </button>
      </div>
    );
  }

  const usagePercent = (user.dailyScansCount / PLAN_LIMITS[user.plan]) * 100;

  return (
    <div className="space-y-10 pb-32">
      {/* Profile Header */}
      <div className="relative p-10 bg-white/5 border border-white/10 rounded-[3rem] overflow-hidden">
        <div className="absolute top-0 right-0 p-6">
          <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">
              {user.plan} Plan
            </span>
          </div>
        </div>
        
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="relative">
            <div className="w-28 h-28 rounded-full border-2 border-blue-500/30 p-1.5 shadow-[0_0_40px_rgba(37,99,235,0.2)]">
              <img 
                src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} 
                alt="Profile" 
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 p-2 bg-blue-600 rounded-full border-4 border-black shadow-lg">
              <Shield className="w-4 h-4 text-white" />
            </div>
          </div>
          
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight">{user.displayName || 'Chef User'}</h2>
            <div className="flex items-center justify-center gap-2 text-gray-500">
              <Mail className="w-3 h-3" />
              <span className="text-xs font-medium">{user.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Stats */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold tracking-tight">Daily Usage</h3>
          <span className="text-xs font-bold text-blue-400">
            {user.dailyScansCount} / {PLAN_LIMITS[user.plan]} Scans
          </span>
        </div>
        
        <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-500">
              <span>Limit Progress</span>
              <span>{Math.round(usagePercent)}%</span>
            </div>
            <div className="h-3 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${usagePercent}%` }}
                className={`h-full bg-gradient-to-r ${usagePercent > 80 ? 'from-red-600 to-red-400' : 'from-blue-600 to-blue-400'}`}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4">
              <div className="p-3 bg-blue-600/10 rounded-xl">
                <ChefHat className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Recipes</p>
                <p className="text-lg font-bold">12</p>
              </div>
            </div>
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4">
              <div className="p-3 bg-blue-600/10 rounded-xl">
                <Star className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Saved</p>
                <p className="text-lg font-bold">5</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid gap-4">
        <button className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all group">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600/10 rounded-xl group-hover:bg-blue-600/20 transition-all">
              <Settings className="w-5 h-5 text-blue-400" />
            </div>
            <span className="font-bold tracking-tight">Account Settings</span>
          </div>
          <div className="p-2 bg-white/5 rounded-lg">
            <Sparkles className="w-4 h-4 text-gray-500" />
          </div>
        </button>

        <button 
          onClick={signOut}
          className="flex items-center justify-between p-6 bg-red-500/5 border border-red-500/10 rounded-3xl hover:bg-red-500/10 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-500/10 rounded-xl group-hover:bg-red-500/20 transition-all">
              <LogOut className="w-5 h-5 text-red-400" />
            </div>
            <span className="font-bold tracking-tight text-red-400">Sign Out</span>
          </div>
        </button>
      </div>
    </div>
  );
}
