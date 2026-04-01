import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, ChefHat, Star, ArrowLeft, Sparkles, Play, CheckCircle2, Zap, Info, Share2, MessageSquare } from 'lucide-react';
import { useAuth } from '../App';
import ReactMarkdown from 'react-markdown';
import confetti from 'canvas-confetti';
import { useState } from 'react';

export default function RecipeDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const recipe = location.state?.recipe;
  const [isFavorite, setIsFavorite] = useState(recipe?.isFavorite || false);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [showAssistant, setShowAssistant] = useState(false);

  if (!recipe) {
    return <div className="p-8 text-center">Recipe not found</div>;
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    if (!isFavorite) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#3b82f6', '#60a5fa']
      });
    }
  };

  const handleStartCooking = () => {
    if (user?.plan === 'elite') {
      setShowAssistant(true);
    } else {
      setActiveStep(0);
    }
  };

  return (
    <div className="space-y-8 pb-32">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="p-3 bg-white/5 border border-white/10 rounded-2xl text-gray-400 hover:text-white transition-all"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      {/* Hero Section */}
      <div className="relative aspect-video rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 to-black flex items-center justify-center">
          <ChefHat className="w-32 h-32 text-blue-400/20" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        
        <div className="absolute bottom-8 left-8 right-8 space-y-2">
          <div className="flex gap-2">
            <div className="px-3 py-1 bg-blue-600/80 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest text-white">
              {recipe.difficulty}
            </div>
            <div className="px-3 py-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-white">
              {recipe.time}
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight leading-tight">
            {recipe.title}
          </h1>
        </div>

        <div className="absolute top-8 right-8 flex gap-3">
          <button 
            onClick={toggleFavorite}
            className={`p-4 backdrop-blur-md rounded-full border transition-all ${
              isFavorite 
                ? 'bg-blue-600/80 border-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.5)]' 
                : 'bg-black/40 border-white/10 text-white hover:text-red-400'
            }`}
          >
            <Star className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          <button className="p-4 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-white hover:text-blue-400 transition-all">
            <Share2 className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-2">
          <div className="flex items-center gap-2 text-blue-400">
            <ChefHat className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Ingredients</span>
          </div>
          <p className="text-2xl font-bold">{recipe.ingredients.length}</p>
        </div>
        <div className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-2">
          <div className="flex items-center gap-2 text-blue-400">
            <Clock className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Est. Time</span>
          </div>
          <p className="text-2xl font-bold">{recipe.time}</p>
        </div>
      </div>

      {/* Nutrition (Elite Plan Only) */}
      {user?.plan === 'elite' && recipe.nutrients && (
        <div className="p-8 bg-blue-600/5 border border-blue-500/20 rounded-[2.5rem] space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <h3 className="text-lg font-bold tracking-tight">Nutrition Analysis</h3>
            </div>
            <div className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full">
              <span className="text-[10px] font-bold uppercase tracking-widest text-yellow-400">Elite Feature</span>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {Object.entries(recipe.nutrients).map(([key, value]) => (
              <div key={key} className="text-center space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{key}</p>
                <p className="text-lg font-bold text-blue-400">{String(value)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ingredients List */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-blue-600 rounded-full" />
          <h3 className="text-2xl font-bold tracking-tight">Ingredients</h3>
        </div>
        <div className="grid gap-3">
          {recipe.ingredients.map((ing: string, i: number) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl group hover:bg-white/10 transition-all">
              <div className="w-6 h-6 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-[10px] font-bold text-blue-400">
                {i + 1}
              </div>
              <span className="text-gray-300 font-medium group-hover:text-white transition-colors">{ing}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-blue-600 rounded-full" />
          <h3 className="text-2xl font-bold tracking-tight">Instructions</h3>
        </div>
        <div className="prose prose-invert prose-blue max-w-none">
          <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] text-gray-300 leading-relaxed">
            <ReactMarkdown>{recipe.instructions}</ReactMarkdown>
          </div>
        </div>
      </div>

      {/* Start Cooking Button */}
      <div className="fixed bottom-32 left-6 right-6 max-w-md mx-auto z-50">
        <button 
          onClick={handleStartCooking}
          className="w-full py-5 bg-blue-600 hover:bg-blue-500 rounded-3xl font-bold tracking-tight shadow-[0_0_40px_rgba(37,99,235,0.4)] active:scale-95 transition-all flex items-center justify-center gap-3"
        >
          <Play className="w-6 h-6 fill-current" />
          <span>Start Cooking Now</span>
          {user?.plan === 'elite' && (
            <div className="ml-2 px-2 py-0.5 bg-white/20 rounded-lg text-[8px] font-black uppercase tracking-tighter">
              AI Assistant
            </div>
          )}
        </button>
      </div>

      {/* AI Assistant Modal (Elite) */}
      <AnimatePresence>
        {showAssistant && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-2xl p-8 flex flex-col"
          >
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-600 rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.5)]">
                  <ChefHat className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-xl">AI Chef Assistant</h3>
                  <p className="text-xs text-blue-400 font-bold uppercase tracking-widest">Elite Mode Active</p>
                </div>
              </div>
              <button 
                onClick={() => setShowAssistant(false)}
                className="p-3 bg-white/5 border border-white/10 rounded-2xl text-gray-400"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8">
              <motion.div 
                animate={{ 
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    "0 0 20px rgba(37,99,235,0.2)",
                    "0 0 50px rgba(37,99,235,0.4)",
                    "0 0 20px rgba(37,99,235,0.2)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center"
              >
                <MessageSquare className="w-12 h-12 text-white" />
              </motion.div>
              
              <div className="space-y-4">
                <h4 className="text-3xl font-bold tracking-tight">"Ready to start step 1?"</h4>
                <p className="text-gray-400 max-w-xs mx-auto">
                  I'll guide you through each step with voice commands. Just say "Next" when you're ready.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full">
                <button className="p-6 bg-white/5 border border-white/10 rounded-3xl flex flex-col items-center gap-3">
                  <Play className="w-6 h-6 text-blue-400" />
                  <span className="text-xs font-bold uppercase tracking-widest">Start Voice</span>
                </button>
                <button className="p-6 bg-white/5 border border-white/10 rounded-3xl flex flex-col items-center gap-3">
                  <Info className="w-6 h-6 text-blue-400" />
                  <span className="text-xs font-bold uppercase tracking-widest">View Steps</span>
                </button>
              </div>
            </div>

            <div className="mt-auto p-6 bg-blue-600/10 border border-blue-500/20 rounded-3xl flex items-center gap-4">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-ping" />
              <p className="text-sm font-medium text-blue-400">Listening for "Next Step"...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
