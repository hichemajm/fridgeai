import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, X, Sparkles, ChefHat, ArrowRight, Trash2 } from 'lucide-react';
import { useAuth } from '../App';
import { generateRecipes } from '../services/geminiService';

export default function ScanResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ingredients, setIngredients] = useState<string[]>(location.state?.ingredients || []);
  const [newIngredient, setNewIngredient] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addIngredient = () => {
    if (newIngredient.trim() && !ingredients.includes(newIngredient.trim())) {
      setIngredients([...ingredients, newIngredient.trim()]);
      setNewIngredient('');
    }
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleGenerate = async () => {
    if (ingredients.length === 0) {
      setError("Add at least one ingredient to start cooking!");
      return;
    }

    setIsGenerating(true);
    try {
      const recipes = await generateRecipes(ingredients, user?.plan || 'free');
      navigate('/recipes', { state: { recipes, ingredients } });
    } catch (err) {
      setError("Failed to generate recipes. Please try again.");
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Detected <span className="text-blue-500">Ingredients</span>
        </h2>
        <p className="text-gray-400 text-sm">
          Verify and add any missing items from your fridge.
        </p>
      </div>

      {/* Captured Image Preview */}
      {location.state?.image && (
        <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl group">
          <img 
            src={location.state.image} 
            alt="Scan Preview" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-6 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-white/80">Analysis Complete</span>
          </div>
        </div>
      )}

      {/* Ingredients List */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <AnimatePresence>
            {ingredients.map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="group flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full hover:bg-blue-500/20 transition-all"
              >
                <span className="text-sm font-medium text-blue-400">{item}</span>
                <button 
                  onClick={() => removeIngredient(index)}
                  className="p-0.5 hover:bg-red-500/20 rounded-full text-blue-400 hover:text-red-400 transition-all"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Add New Ingredient */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input 
              type="text" 
              value={newIngredient}
              onChange={(e) => setNewIngredient(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addIngredient()}
              placeholder="Add missing ingredient..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all"
            />
          </div>
          <button 
            onClick={addIngredient}
            className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all"
          >
            <Plus className="w-6 h-6 text-blue-400" />
          </button>
        </div>
      </div>

      {/* Action Button */}
      <div className="fixed bottom-32 left-6 right-6 max-w-md mx-auto z-50">
        <button 
          onClick={handleGenerate}
          disabled={isGenerating || ingredients.length === 0}
          className="w-full py-5 bg-blue-600 hover:bg-blue-500 rounded-3xl font-bold tracking-tight shadow-[0_0_40px_rgba(37,99,235,0.4)] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-6 h-6" />
              </motion.div>
              <span>Generating Recipes...</span>
            </>
          ) : (
            <>
              <ChefHat className="w-6 h-6" />
              <span>Generate Recipes</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </>
          )}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-400 text-center text-sm font-medium"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
