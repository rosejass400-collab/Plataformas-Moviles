import { useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signInAnonymously, signOut, updateProfile } from 'firebase/auth';
import { AuthContext } from './AuthContext.js';
import { auth, firebaseEnabled } from '../config/firebase.js';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(firebaseEnabled);

  useEffect(() => {
    if (!auth) return undefined;
    return onAuthStateChanged(auth, nextUser => {
      setUser(nextUser);
      setLoading(false);
    });
  }, []);

  const enterDemoMode = async displayName => {
    if (!auth) {
      const error = new Error('Firebase no está configurado.');
      error.code = 'auth/configuration-not-found';
      throw error;
    }

    let demoUser = auth.currentUser?.isAnonymous ? auth.currentUser : null;
    if (!demoUser) {
      demoUser = (await signInAnonymously(auth)).user;
    }

    await updateProfile(demoUser, { displayName });
    setUser(demoUser);
    return demoUser;
  };

  const value = useMemo(() => ({
    user,
    loading,
    firebaseEnabled,
    login: enterDemoMode,
    logout: () => auth ? signOut(auth) : Promise.resolve(),
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
