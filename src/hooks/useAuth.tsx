import React, { useState, useEffect, useContext, createContext } from 'react';
import { UserInfo } from 'firebase/auth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

import { firebaseConfig } from '../api/config';

(window as any).firebase = firebase;

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

type AuthContextType = {
  user: UserInfo | null,
  authInfo: any,
  signOut: () => Promise<void>
}

const authContext = createContext<AuthContextType>({
  user: null,
  authInfo: null,
  signOut: () => Promise.resolve()
});

// Provider component that wraps your app and makes auth object available to any child component that calls useAuth().
export const ProvideAuth: React.FC = ({ children }) => {
  const auth = useProvideAuth();

  return (
    <authContext.Provider value={auth}>
      {children}
    </authContext.Provider>
  );
}

// Hook for child components to get the auth object and re-render when it changes.
export const useAuth = () => {
  return useContext(authContext);
};

// Provider hook that creates auth object and handles state
function useProvideAuth() {
  const [user, setUser] = useState<UserInfo|null>(null);
  const [authInfo, setAuthInfo] = useState<any>(null)

  const signOut = async () => {
    await firebase.auth().signOut();
    setUser(null);
    window.location.reload();
  };

  // Subscribe to user on mount
  // Because this sets state in the callback it will cause any component that utilizes this hook to re-render with the latest auth object.
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((authData) => {
      setUser(authData?.providerData[0] as UserInfo);
      setAuthInfo((authData as any)?.auth?.currentUser?.stsTokenManager);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Return the user object and auth methods
  return {
    user,
    authInfo,
    signOut,
  };
}
