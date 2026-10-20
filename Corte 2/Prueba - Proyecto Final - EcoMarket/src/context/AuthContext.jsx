import { createContext, useEffect, useMemo, useState } from 'react';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, firebaseEnabled } from '../config/firebase.js';

export const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); const [loading, setLoading] = useState(firebaseEnabled);
  useEffect(() => { if (!auth) { setLoading(false); return; } return onAuthStateChanged(auth, user => { setUser(user); setLoading(false); }); }, []);
  const value = useMemo(() => ({ user, loading, firebaseEnabled,
    login: (email, password) => signInWithEmailAndPassword(auth, email, password),
    register: (email, password) => createUserWithEmailAndPassword(auth, email, password),
    logout: () => auth ? signOut(auth) : Promise.resolve(),
  }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}