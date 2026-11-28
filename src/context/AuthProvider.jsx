import { useEffect, useMemo, useState } from "react";
import { AuthContext } from "./AuthContext";
import * as authService from "../services/authServices";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true until Firebase checks the saved session

  useEffect(() => {
    const unsubscribe = authService.onAuthChange((profile) => {
      setUser(profile);
      setLoading(false);
    });
    return unsubscribe; // stop listening when the provider unmounts
  }, []);

  const value = useMemo(
    () => ({
      user, // { uid, name, email, city, bio, photo_url, created_at } or null
      loading,
      isLoggedIn: Boolean(user),

      async register(formValues) {
        const profile = await authService.register(formValues);
        setUser(profile); // the listener skips registration, so set it here
        return profile;
      },
      async login(formValues) {
        const profile = await authService.login(formValues);
        setUser(profile);
        return profile;
      },
      async updateProfile(values) {
        if (!user) return null;
        const profile = await authService.updateUserProfile(user.uid, values);
        setUser((current) => ({ ...current, ...profile }));
        return profile;
      },
      logout: authService.logout, // the listener sets user to null
      resetPassword: authService.resetPassword,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}