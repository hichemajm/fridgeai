import { motion } from 'motion/react';
import { Check, Zap, Sparkles, ChefHat, Star, ShieldCheck, ArrowRight, Info } from 'lucide-react';
import { useAuth } from '../App';
import { Plan } from '../types';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import confetti from 'canvas-confetti';

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    scans: '5 scans / day',
    features: ['Basic recipes only', 'Ads enabled', 'Standard AI speed'],
    color: 'gray',
  },
  {
    id: 'starter',
    name: 'Starter',
    price: '$5',
    scans: '10 scans / day',
    features: ['Better recipes', 'No ads', 'Faster AI responses'],
    color: 'blue',
    popular: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$10',
    scans: '25 scans / day',
    features: ['Premium recipes', 'Dietary filters', 'Priority processing'],
    color: 'purple',
  },
  {
    id: 'elite',
    name: 'Elite',
    price: '$25',
    scans: '50 scans / day',
    features: ['Ultra advanced recipes', 'Nutrition analysis', 'AI Chef Assistant (Voice)', 'Early access'],
    color: 'yellow',
  },
];

export default function Subscription() {
  const { user } = useAuth();

  const handleUpgrade = async (planId: string) => {
    if (!user) return;
    
    // Simulate payment and upgrade
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        plan: planId as Plan,
      });
      
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#3b82f6', '#60a5fa', '#fbbf24']
      });
    } catch (err) {
      console.error("Failed to upgrade:", err);
    }
  };

  return (
    <div className="space-y-12 pb-32">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/10 border border-blue-500/20 rounded-full"
        >
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Premium Access</span>
        </motion.div>
        <h2 className="text-4xl font-bold tracking-tight">
          Choose Your <span className="text-blue-500">Plan</span>
        </h2>
        <p className="text-gray-400 text-sm max-w-xs mx-auto">
          Unlock the full power of FridgeChef AI and cook like a professional.
        </p>
      </div>

      {/* Plans List */}
      <div className="space-y-6">
        {PLANS.map((plan, index) => {
          const isCurrent = user?.plan === plan.id;
          const isElite = plan.id === 'elite';
          const isPopular = plan.popular;

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-8 rounded-[3rem] border transition-all duration-500 ${
                isCurrent 
                  ? 'bg-blue-600/10 border-blue-500/50 shadow-[0_0_40px_rgba(37,99,235,0.2)]' 
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              } ${isElite ? 'shadow-[0_0_60px_rgba(251,191,36,0.1)]' : ''}`}
            >
              {isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-blue-600 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.5)]">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white">Most Popular</span>
                </div>
              )}

              <div className="flex items-center justify-between mb-8">
                <div className="space-y-1">
                  <h3 className={`text-2xl font-bold tracking-tight ${isElite ? 'text-yellow-400' : ''}`}>
                    {plan.name}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-500">
                    <Zap className="w-3 h-3" />
                    <span className="text-xs font-medium">{plan.scans}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold tracking-tight">{plan.price}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500">/ month</div>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`p-1 rounded-full ${isCurrent ? 'bg-blue-500' : 'bg-white/10'}`}>
                      <Check className="w-3 h-3 text-black" />
                    </div>
                    <span className="text-sm text-gray-300 font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleUpgrade(plan.id)}
                disabled={isCurrent}
                className={`w-full py-5 rounded-3xl font-bold tracking-tight transition-all flex items-center justify-center gap-3 ${
                  isCurrent 
                    ? 'bg-white/5 border border-white/10 text-gray-500 cursor-default' 
                    : isElite
                      ? 'bg-yellow-500 hover:bg-yellow-400 text-black shadow-[0_0_40px_rgba(251,191,36,0.3)]'
                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_30px_rgba(37,99,235,0.3)]'
                }`}
              >
                {isCurrent ? (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    <span>Current Plan</span>
                  </>
                ) : (
                  <>
                    <span>Upgrade to {plan.name}</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="space-y-2">
          <div className="w-12 h-12 mx-auto bg-white/5 rounded-2xl flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-blue-400" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Secure Payments</p>
        </div>
        <div className="space-y-2">
          <div className="w-12 h-12 mx-auto bg-white/5 rounded-2xl flex items-center justify-center">
            <Info className="w-6 h-6 text-blue-400" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Cancel Anytime</p>
        </div>
        <div className="space-y-2">
          <div className="w-12 h-12 mx-auto bg-white/5 rounded-2xl flex items-center justify-center">
            <ChefHat className="w-6 h-6 text-blue-400" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">24/7 Support</p>
        </div>
      </div>
    </div>
  );
}
