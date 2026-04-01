import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Clock, ChefHat, Star, ArrowRight, Sparkles, Filter, Zap } from 'lucide-react';
import { useAuth } from '../App';
import { Recipe } from '../types';

export default function Recipes() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const recipes: Recipe[] = location.state?.recipes || [];
  const ingredients: string[] = location.state?.ingredients || [];

  if (recipes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 space-y-6">
        <div className="p-8 bg-blue-600/10 rounded-full border border-blue-500/20">
          <ChefHat className="w-16 h-16 text-blue-400" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">No Recipes Found</h3>
          <p className="text-gray-400 text-sm">We couldn't generate any recipes with those ingredients. Try adding more!</p>
        </div>
        <button 
          onClick={() => navigate('/')}
          className="px-8 py-4 bg-blue-600 rounded-2xl font-bold tracking-tight hover:bg-blue-500 transition-all"
        >
          Back to Scanning
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          AI <span className="text-blue-500">Chef</span> Recommendations
        </h2>
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span>Found {recipes.length} recipes for your ingredients</span>
        </div>
      </div>

      {/* Filters/Quick Stats */}
      <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full whitespace-nowrap">
          <Filter className="w-3 h-3 text-blue-400" />
          <span className="text-xs font-medium">All Cuisines</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full whitespace-nowrap">
          <Clock className="w-3 h-3 text-blue-400" />
          <span className="text-xs font-medium">Under 30m</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full whitespace-nowrap">
          <Zap className="w-3 h-3 text-blue-400" />
          <span className="text-xs font-medium">Lazy Mode</span>
        </div>
      </div>

      {/* Recipes Grid */}
      <div className="grid gap-6">
        {recipes.map((recipe, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => navigate(`/recipe/${index}`, { state: { recipe } })}
            className="group relative bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden hover:bg-white/10 transition-all cursor-pointer shadow-2xl"
          >
            {/* Image Placeholder with Gradient */}
            <div className="aspect-[4/3] bg-gradient-to-br from-blue-900/40 to-black relative">
              <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:scale-110 transition-transform duration-700">
                <ChefHat className="w-24 h-24 text-blue-400" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              
              {/* Badges */}
              <div className="absolute top-6 left-6 flex gap-2">
                <div className="px-3 py-1 bg-blue-600/80 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest text-white">
                  {recipe.difficulty}
                </div>
                {user?.plan === 'elite' && (
                  <div className="px-3 py-1 bg-yellow-500/80 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest text-black">
                    Elite
                  </div>
                )}
              </div>
              
              <button className="absolute top-6 right-6 p-3 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-white hover:text-red-400 transition-all">
                <Star className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 space-y-4">
              <div className="space-y-1">
                <h3 className="text-2xl font-bold tracking-tight group-hover:text-blue-400 transition-colors">
                  {recipe.title}
                </h3>
                <div className="flex items-center gap-4 text-gray-400 text-sm">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span>{recipe.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ChefHat className="w-4 h-4 text-blue-500" />
                    <span>{recipe.ingredients.length} ingredients</span>
                  </div>
                </div>
              </div>

              {/* Ingredients Preview */}
              <div className="flex flex-wrap gap-2">
                {recipe.ingredients.slice(0, 3).map((ing, i) => (
                  <span key={i} className="text-[10px] font-bold uppercase tracking-widest text-blue-400/60">
                    {ing}
                  </span>
                ))}
                {recipe.ingredients.length > 3 && (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600">
                    +{recipe.ingredients.length - 3} more
                  </span>
                )}
              </div>

              <div className="pt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-xs font-medium text-gray-400">AI Optimized</span>
                </div>
                <div className="p-3 bg-blue-600 rounded-2xl group-hover:translate-x-1 transition-transform shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
