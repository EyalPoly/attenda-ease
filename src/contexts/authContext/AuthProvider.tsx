import { auth } from "../../firebase/firebase";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  User,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";

interface AuthContextType {
  currentUser: User | null;
  userLogedIn: boolean;
  loading: boolean;
  signup: (email: string, password: string) => Promise<void>;
  loginEmailAndPassword: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserPassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userLogedIn, setUserLogedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initializeUser);
    return unsubscribe;
  }, []);

  async function initializeUser(user: any) {
    if (user) {
      console.log("User logged in:", user);
      setCurrentUser({ ...user });
      setUserLogedIn(true);
    } else {
      setCurrentUser(null);
      setUserLogedIn(false);
    }
    setLoading(false);
  }

  const signup = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await signOut(auth);
      setCurrentUser(null);
      setUserLogedIn(false);
    } catch (error) {
      console.log("Error signing up:", error);
      throw error;
    }
  };

  const loginEmailAndPassword = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setCurrentUser(userCredential.user);
      setUserLogedIn(true);
    } catch (error) {
      console.log("Error signing in:", error);
    }
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      setCurrentUser(userCredential.user);
      setUserLogedIn(true);
    } catch (error) {
      console.log("Error signing in with Google:", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log("Error signing out:", error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.log("Error reseting password:", error);
      throw error;
    }
  };

  const updateUserPassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    if (!currentUser) throw new Error("No user logged in");

    try {
      if (currentUser.email) {
        const credential = EmailAuthProvider.credential(
          currentUser.email,
          currentPassword
        );
        await reauthenticateWithCredential(currentUser, credential);
        await updatePassword(currentUser, newPassword);
      } else {
        console.log("User email is null");
        throw new Error("User email is null");
      }
    } catch (error) {
      console.log("Error updating password:", error);
      throw error;
    }
  };

  const value = {
    currentUser,
    userLogedIn,
    loading,
    signup,
    loginEmailAndPassword,
    loginWithGoogle,
    logout,
    resetPassword,
    updateUserPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
