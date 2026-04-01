import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, BarChart3, Settings, Shield, Search, Filter, MoreVertical, Ban, Edit, CheckCircle2, Zap, DollarSign, Activity } from 'lucide-react';
import { collection, getDocs, query, limit, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { UserProfile } from '../types';

export default function Admin() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'analytics' | 'settings'>('users');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(20));
        const querySnapshot = await getDocs(q);
        const usersData = querySnapshot.docs.map(doc => doc.data() as UserProfile);
        setUsers(usersData);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="space-y-10 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">Admin <span className="text-blue-500">Dashboard</span></h2>
          <p className="text-gray-400 text-xs font-medium uppercase tracking-widest">System Control Center</p>
        </div>
        <div className="p-3 bg-blue-600 rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.3)]">
          <Shield className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-1.5 bg-white/5 border border-white/10 rounded-2xl">
        {(['users', 'analytics', 'settings'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
              activeTab === tab 
                ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]' 
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-8">
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-4">
                <div className="flex items-center gap-2 text-blue-400">
                  <Users className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Total Users</span>
                </div>
                <p className="text-3xl font-bold">1,284</p>
                <div className="flex items-center gap-1 text-green-400 text-[10px] font-bold">
                  <Activity className="w-3 h-3" />
                  <span>+12% this week</span>
                </div>
              </div>
              <div className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-4">
                <div className="flex items-center gap-2 text-yellow-400">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Revenue</span>
                </div>
                <p className="text-3xl font-bold">$4,820</p>
                <div className="flex items-center gap-1 text-blue-400 text-[10px] font-bold">
                  <Zap className="w-3 h-3" />
                  <span>32 Elite Subs</span>
                </div>
              </div>
            </div>

            {/* Search & Filter */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Search users..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all"
                />
              </div>
              <button className="p-4 bg-white/5 border border-white/10 rounded-2xl text-gray-500">
                <Filter className="w-5 h-5" />
              </button>
            </div>

            {/* Users List */}
            <div className="space-y-3">
              {loading ? (
                <div className="p-8 text-center text-gray-500">Loading users...</div>
              ) : (
                users.map((user) => (
                  <motion.div
                    key={user.uid}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between group hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <img 
                        src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} 
                        alt="" 
                        className="w-10 h-10 rounded-full border border-white/10"
                      />
                      <div>
                        <p className="font-bold text-sm">{user.displayName || 'Anonymous'}</p>
                        <p className="text-[10px] text-gray-500 font-medium">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter ${
                        user.plan === 'elite' ? 'bg-yellow-500 text-black' : 
                        user.plan === 'pro' ? 'bg-purple-500 text-white' : 
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {user.plan}
                      </div>
                      <button className="p-2 text-gray-500 hover:text-white transition-all">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="p-12 bg-white/5 border border-white/10 rounded-[3rem] text-center space-y-4">
            <div className="p-6 bg-blue-600/10 rounded-full border border-blue-500/20 w-fit mx-auto">
              <BarChart3 className="w-12 h-12 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold">Advanced Analytics</h3>
            <p className="text-sm text-gray-400">Detailed usage tracking and revenue metrics are being processed. Check back soon.</p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-8">
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-bold">Global Configuration</h3>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">AI Model Priority</label>
                  <div className="flex gap-2">
                    <button className="flex-1 py-3 bg-blue-600 rounded-xl text-xs font-bold">Gemini 1.5 Flash</button>
                    <button className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-gray-500">Gemini 1.5 Pro</button>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Feature Toggles</label>
                  <div className="space-y-2">
                    {[
                      { label: 'Ads Enabled', active: true },
                      { label: 'Voice Assistant', active: true },
                      { label: 'Nutrition Analysis', active: true },
                      { label: 'TikTok Export', active: false },
                    ].map((feature) => (
                      <div key={feature.label} className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-white/5">
                        <span className="text-sm font-medium text-gray-300">{feature.label}</span>
                        <div className={`w-10 h-5 rounded-full p-1 transition-all ${feature.active ? 'bg-blue-600' : 'bg-gray-800'}`}>
                          <div className={`w-3 h-3 bg-white rounded-full transition-all ${feature.active ? 'translate-x-5' : 'translate-x-0'}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button className="w-full py-4 bg-blue-600 rounded-2xl font-bold tracking-tight shadow-[0_0_30px_rgba(37,99,235,0.3)]">
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
