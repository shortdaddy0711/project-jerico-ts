import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AuthContextProps {
    user: User | null;
    userData: unknown | null;
    loading: boolean;
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps>({
    user: null,
    userData: null,
    loading: true,
    loginWithGoogle: async () => {},
    logout: async () => {},
});

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<unknown | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser: User | null) => {
            if (currentUser) {
                // Check if a corresponding teacher document exists
                const teacherDocRef = doc(db, 'teachers', currentUser.uid);
                const teacherDoc = await getDoc(teacherDocRef);

                if (!teacherDoc.exists()) {
                    await setDoc(teacherDocRef, {
                        name: currentUser.displayName || `Teacher-${currentUser.uid}`,
                        ownerId: currentUser.uid,
                        photo: currentUser.photoURL || '',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        ministry: '',
                        lifegroup: '',
                    });
                }

                if (currentUser) {
                    setUser(currentUser);
                }

                const userData = teacherDoc.data();
                if (userData) {
                    setUserData(userData);
                }

                setLoading(false);
            } else {
                setUser(null);
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
    };

    const logoutUser = async () => {
        await signOut(auth);
    };

    return (
        <AuthContext.Provider value={{ user, userData, loading, loginWithGoogle, logout: logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
};
