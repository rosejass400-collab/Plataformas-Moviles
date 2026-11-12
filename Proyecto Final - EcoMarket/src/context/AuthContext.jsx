import { useEffect, useMemo, useState } from 'react';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { AuthContext } from './AuthContext.js';
import { auth, db, firebaseEnabled } from '../config/firebase.js';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(firebaseEnabled);

  useEffect(() => {
    if (!auth) return undefined;
    return onAuthStateChanged(auth, async nextUser => {
      setUser(nextUser?.isAnonymous ? null : nextUser);
      if (nextUser && !nextUser.isAnonymous && db) {
        try {
          const adminDoc = await getDoc(doc(db, 'admins', nextUser.uid));
          setIsAdmin(adminDoc.exists());
        } catch { setIsAdmin(false); }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });
  }, []);

  const register = async (name, email, password) => {
    if (!auth || !db) throw new Error('Firebase no está configurado.');
    const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    await updateProfile(credential.user, { displayName: name.trim() });
    await setDoc(doc(db, 'users', credential.user.uid), {
      name: name.trim(), email: email.trim().toLowerCase(), addresses: [], createdAt: serverTimestamp(),
    }, { merge: true });
    setUser(auth.currentUser);
    return credential.user;
  };

  const login = async (email, password) => {
    if (!auth) throw new Error('Firebase no está configurado.');
    return signInWithEmailAndPassword(auth, email.trim(), password);
  };

  const value = useMemo(() => ({
    user,
    isAdmin,
    loading,
    firebaseEnabled,
    register,
    login,
    logout: () => auth ? signOut(auth) : Promise.resolve(),
  }), [user, isAdmin, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
