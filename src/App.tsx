import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot, Timestamp } from 'firebase/firestore';
import { useEffect, useState, createContext, useContext } from 'react';
import { auth, db } from './firebase';
import { UserProfile, Plan } from './types';
import { format } from 'date-fns';

// Pages
import Splash from './pages/Splash';
import Home from './pages/Home';
import ScanResult from './pages/ScanResult';
import Recipes from './pages/Recipes';
import RecipeDetail from './pages/RecipeDetail';
import Favorites from './pages/Favorites';
import Subscription from './pages/Subscription';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Layout from './components/Layout';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

import AuthGuard from './components/AuthGuard';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = doc(db, 'users', firebaseUser.uid);
        
        // Real-time listener for user profile
        const unsubUser = onSnapshot(userRef, async (docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data() as UserProfile;
            
            // Daily reset logic
            const today = format(new Date(), 'yyyy-MM-dd');
            if (userData.lastScanDate !== today) {
              await setDoc(userRef, {
                dailyScansCount: 0,
                lastScanDate: today,
              }, { merge: true });
            }
            
            setUser(userData);
          } else {
            // Create new user profile
            const newUser: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || '',
              photoURL: firebaseUser.photoURL || '',
              role: 'user',
              plan: 'free',
              dailyScansCount: 0,
              lastScanDate: format(new Date(), 'yyyy-MM-dd'),
              createdAt: Timestamp.now(),
            };
            await setDoc(userRef, newUser);
            setUser(newUser);
          }
          setLoading(false);
        });

        return () => unsubUser();
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) return <Splash />;

  return (
    <AuthContext.Provider value={{ user, loading, signIn: async () => {}, signOut: async () => auth.signOut() }}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<AuthGuard><Home /></AuthGuard>} />
            <Route path="/scan-result" element={<AuthGuard><ScanResult /></AuthGuard>} />
            <Route path="/recipes" element={<AuthGuard><Recipes /></AuthGuard>} />
            <Route path="/recipe/:id" element={<AuthGuard><RecipeDetail /></AuthGuard>} />
            <Route path="/favorites" element={<AuthGuard><Favorites /></AuthGuard>} />
            <Route path="/subscription" element={<AuthGuard><Subscription /></AuthGuard>} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}
