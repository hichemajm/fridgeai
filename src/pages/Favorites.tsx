import { motion } from 'motion/react';
import { Heart, ChefHat, Clock, ArrowRight, Sparkles, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';

export default function Favorites() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Mock favorites for now
  const favorites = [
    {
      title: "Neon Glow Pasta",
      time: "15 min",
      difficulty: "Easy",
      ingredients: ["Pasta", "Garlic", "Olive Oil", "Chili Flakes"],
      instructions: "Boil pasta. Sauté garlic and chili in oil. Mix and enjoy the glow."
    },
    {
      title: "Cyberpunk Salad",
      time: "10 min",
      difficulty: "Easy",
      ingredients: ["Kale", "Quinoa", "Avocado", "Lemon"],
      instructions: "Massage kale with lemon. Add quinoa and avocado. Fresh and futuristic."
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Saved <span className="text-blue-500">Recipes</span>
        </h2>
        <p className="text-gray-400 text-sm">
          Your personal collection of AI-crafted masterpieces.
        </p>
      </div>

      {/* Favorites List */}
      <div className="grid gap-6">
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] text-center p-8 space-y-6">
            <div className="p-8 bg-blue-600/10 rounded-full border border-blue-500/20">
              <Heart className="w-12 h-12 text-blue-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">No Saved Recipes</h3>
              <p className="text-gray-400 text-sm">Start scanning your fridge to find your next favorite meal!</p>
            </div>
            <button 
              onClick={() => navigate('/')}
              className="px-8 py-4 bg-blue-600 rounded-2xl font-bold tracking-tight hover:bg-blue-500 transition-all"
            >
              Start Scanning
            </button>
          </div>
        ) : (
          favorites.map((recipe, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigate(`/recipe/${index}`, { state: { recipe } })}
              className="group relative bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden hover:bg-white/10 transition-all cursor-pointer shadow-2xl"
            >
              <div className="p-8 flex items-center gap-6">
                <div className="w-24 h-24 bg-blue-600/20 rounded-3xl flex items-center justify-center border border-blue-500/30 group-hover:scale-105 transition-transform">
                  <ChefHat className="w-10 h-10 text-blue-400" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold tracking-tight group-hover:text-blue-400 transition-colors">
                      {recipe.title}
                    </h3>
                    <Star className="w-5 h-5 text-blue-500 fill-current" />
                  </div>
                  <div className="flex items-center gap-4 text-gray-400 text-xs font-medium">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-blue-500" />
                      <span>{recipe.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-blue-500" />
                      <span>{recipe.difficulty}</span>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-blue-600/10 rounded-2xl group-hover:bg-blue-600 transition-all">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
