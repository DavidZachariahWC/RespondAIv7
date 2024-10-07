import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { fetchUserData } from './api/requests';

interface Personality {
  personality: string;
}

interface UserObject {
  name: string;
  personalities: {
    [key: string]: Personality;
  };
}

type AuthContextType = {
  user: User | null;
  userObject: UserObject | null;
  setUserObject: (userObject: UserObject | null) => void;
  initializing: boolean;
};

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  userObject: null, 
  setUserObject: () => {}, 
  initializing: true 
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userObject, setUserObject] = useState<UserObject | null>(null);
  const [initializing, setInitializing] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        try {
          const userData = await fetchUserData(user.uid);
          setUserObject({
            name: userData.name,
            personalities: userData.personalities
          });
          router.replace('/Home');
        } catch (error) {
          console.error('Error setting user object:', error);
          // Handle error (e.g., show an error message to the user)
        }
      } else {
        setUserObject(null);
        router.replace('/Intro');
      }
      if (initializing) setInitializing(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, userObject, setUserObject, initializing }}>
      {children}
    </AuthContext.Provider>
  );
};