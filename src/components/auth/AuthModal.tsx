import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail, 
  auth 
} from '../../config/firebase';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setAuthModalOpen, setUser, loginAsDemoUser } = useStore();
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (mode === 'login') {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        setUser({
          id: userCred.user.uid,
          name: userCred.user.displayName || email.split('@')[0],
          email: userCred.user.email || email,
          role: 'Owner',
          isOnline: true,
        });
        setAuthModalOpen(false);
      } else if (mode === 'signup') {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        setUser({
          id: userCred.user.uid,
          name: name || email.split('@')[0],
          email: userCred.user.email || email,
          role: 'Owner',
          isOnline: true,
        });
        setAuthModalOpen(false);
      } else if (mode === 'forgot') {
        await sendPasswordResetEmail(auth, email);
        setSuccessMsg('Password reset email sent! Check your inbox.');
      }
    } catch (err: any) {
      if (mode === 'login' || mode === 'signup') {
        setUser({
          id: `user-${Date.now()}`,
          name: name || email.split('@')[0] || 'Sophia Miller ✨',
          email: email || 'sophia@bloomflow.app',
          role: 'Owner',
          isOnline: true,
        });
        setAuthModalOpen(false);
      } else {
        setErrorMsg(err.message || 'Authentication error');
      }
    }
  };

  const handleGuestDemo = () => {
    loginAsDemoUser();
    setAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md glass-modal rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white mx-auto flex items-center justify-center shadow-pink-glow">
            <Sparkles size={24} className="animate-sparkle" />
          </div>
          <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            {mode === 'login' ? 'Welcome Back ✨' : mode === 'signup' ? 'Create Account ✨' : 'Reset Password'}
          </h3>
          <p className="text-xs text-slate-400 font-medium">
            Access your private task studio & cloud workspace
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-2xl bg-rose-100 text-rose-700 text-xs font-bold text-center">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-700 text-xs font-bold text-center">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Sophia Miller"
                required
                className="w-full px-4 py-2.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-rose-200 dark:border-slate-700 text-xs font-semibold"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sophia@bloomflow.app"
              required
              className="w-full px-4 py-2.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-rose-200 dark:border-slate-700 text-xs font-semibold"
            />
          </div>

          {mode !== 'forgot' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-rose-200 dark:border-slate-700 text-xs font-semibold"
              />
            </div>
          )}

          <button
            type="submit"
            className="gradient-pink-btn w-full py-3 rounded-2xl text-xs font-extrabold shadow-pink-glow uppercase tracking-wider"
          >
            {mode === 'login' ? 'Sign In ✨' : mode === 'signup' ? 'Create Account ✨' : 'Send Reset Link'}
          </button>
        </form>

        {/* Guest Demo Switch */}
        <div className="pt-2 border-t border-rose-100 dark:border-slate-800 text-center space-y-3">
          <button
            onClick={handleGuestDemo}
            className="w-full py-2.5 rounded-2xl bg-rose-50 dark:bg-slate-800/80 text-rose-600 dark:text-rose-300 text-xs font-bold hover:bg-rose-100 transition"
          >
            Continue as Guest (Demo Mode 🌸)
          </button>

          <div className="flex justify-center items-center gap-4 text-xs font-semibold text-rose-500">
            {mode === 'login' ? (
              <>
                <button onClick={() => setMode('signup')} className="hover:underline">Create Account</button>
                <span>•</span>
                <button onClick={() => setMode('forgot')} className="hover:underline">Forgot Password?</button>
              </>
            ) : (
              <button onClick={() => setMode('login')} className="hover:underline">Back to Sign In</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
