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
  userLoggedIn: boolean;
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
  reauthenticateUsingCredential: (user: User, credential: any) => Promise<void>;
  GetEmailAuthProvider: () => any;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initializeUser);
    return unsubscribe;
  }, []);

  async function initializeUser(user: any) {
    if (user) {
      console.log("User logged in:", user.email);
      setCurrentUser({ ...user });
      setUserLoggedIn(true);
    } else {
      setCurrentUser(null);
      setUserLoggedIn(false);
    }
    setLoading(false);
  }

  const signup = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await signOut(auth);
      setCurrentUser(null);
      setUserLoggedIn(false);
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
      setUserLoggedIn(true);
    } catch (error: any) {
      console.log("Error signing in:", error);
      console.log("Error code:", error.code);
      if (error.code === "auth/invalid-credential") {
        throw new Error("דוא״ל או סיסמה אינם נכונים");
      }
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      setCurrentUser(userCredential.user);
      setUserLoggedIn(true);
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
    try {
      if (!currentUser) throw new Error("No user logged in");

      if (!currentUser.email) throw new Error("User email is null");

      const credential = EmailAuthProvider.credential(
        currentUser.email,
        currentPassword
      );
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, newPassword);
    } catch (error) {
      console.log("Error updating password:", error);
      throw error;
    }
  };

  const reauthenticateUsingCredential = async (user: User, credential: any) => {
    try {
      await reauthenticateWithCredential(user, credential);
    } catch (error) {
      console.log("Error reauthenticating user:", error);
      throw error;
    }
  };

  const GetEmailAuthProvider = () => {
    return EmailAuthProvider;
  };

  const value = {
    currentUser,
    userLoggedIn,
    loading,
    signup,
    loginEmailAndPassword,
    loginWithGoogle,
    logout,
    resetPassword,
    updateUserPassword,
    reauthenticateUsingCredential,
    GetEmailAuthProvider,
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
