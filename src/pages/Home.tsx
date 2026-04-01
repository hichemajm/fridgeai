import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Zap, AlertCircle, Sparkles, X, Check } from 'lucide-react';
import { useAuth } from '../App';
import { PLAN_LIMITS } from '../types';
import { detectIngredients } from '../services/geminiService';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase';

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const canScan = user ? user.dailyScansCount < PLAN_LIMITS[user.plan] : false;

  const startCamera = async () => {
    if (!canScan) {
      setError("Daily limit reached. Upgrade to keep cooking!");
      return;
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setError(null);
    } catch (err) {
      setError("Camera access denied. Please enable it in settings.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current || !user) return;

    setIsScanning(true);
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0);

    const base64Image = canvas.toDataURL('image/jpeg').split(',')[1];
    
    try {
      const ingredients = await detectIngredients(base64Image);
      
      // Increment scan count
      await updateDoc(doc(db, 'users', user.uid), {
        dailyScansCount: increment(1)
      });

      stopCamera();
      navigate('/scan-result', { state: { ingredients, image: canvas.toDataURL('image/jpeg') } });
    } catch (err) {
      setError("Failed to analyze image. Please try again.");
      setIsScanning(false);
    }
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Scan Your <span className="text-blue-500">Fridge</span>
        </h2>
        <p className="text-gray-400 text-sm">
          AI will detect your ingredients and suggest the perfect meal.
        </p>
      </div>

      {/* Usage Card */}
      <div className="p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Daily Scans</span>
          </div>
          <span className="text-xs font-bold text-blue-400">
            {user?.dailyScansCount} / {PLAN_LIMITS[user?.plan || 'free']}
          </span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${((user?.dailyScansCount || 0) / PLAN_LIMITS[user?.plan || 'free']) * 100}%` }}
            className="h-full bg-gradient-to-r from-blue-600 to-blue-400"
          />
        </div>
      </div>

      {/* Camera Stage */}
      <div className="relative aspect-[3/4] bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <AnimatePresence mode="wait">
          {!stream ? (
            <motion.div 
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center space-y-6"
            >
              <div className="p-6 bg-blue-600/10 rounded-full border border-blue-500/20">
                <Camera className="w-12 h-12 text-blue-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Ready to Cook?</h3>
                <p className="text-sm text-gray-400">Open your fridge and point the camera inside.</p>
              </div>
              <button 
                onClick={startCamera}
                disabled={!canScan}
                className={`w-full py-4 rounded-2xl font-bold tracking-tight transition-all flex items-center justify-center gap-2 ${
                  canScan 
                    ? 'bg-blue-600 hover:bg-blue-500 shadow-[0_0_30px_rgba(37,99,235,0.3)]' 
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Camera className="w-5 h-5" />
                Start Scanning
              </button>
              {!canScan && (
                <Link to="/subscription" className="text-blue-400 text-xs font-bold hover:underline">
                  Upgrade for more scans →
                </Link>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="camera"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0"
            >
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover"
              />
              
              {/* Scanning Animation Overlay */}
              <div className="absolute inset-0 pointer-events-none">
                <motion.div 
                  animate={{ y: ['0%', '100%', '0%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_20px_rgba(37,99,235,0.8)]"
                />
                <div className="absolute inset-0 border-[40px] border-black/40" />
                <div className="absolute inset-[40px] border border-blue-500/30 rounded-2xl" />
              </div>

              {/* Camera Controls */}
              <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-6 px-8">
                <button 
                  onClick={stopCamera}
                  className="p-4 bg-black/50 backdrop-blur-xl border border-white/10 rounded-full text-white hover:bg-black/70 transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
                <button 
                  onClick={captureImage}
                  disabled={isScanning}
                  className="p-6 bg-blue-600 rounded-full text-white shadow-[0_0_40px_rgba(37,99,235,0.5)] active:scale-95 transition-all disabled:opacity-50"
                >
                  {isScanning ? (
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="w-8 h-8" />
                    </motion.div>
                  ) : (
                    <Camera className="w-8 h-8" />
                  )}
                </button>
                <div className="w-14" /> {/* Spacer for symmetry */}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error Toast */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
