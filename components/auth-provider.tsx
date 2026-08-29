"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { authErrorMessage, mapGuest, type Guest } from "@/lib/guest";
import { getInsforgeClient, isInsforgeConfigured } from "@/lib/insforge";

type AuthContextValue = {
  configured: boolean;
  ready: boolean;
  guest: Guest | null;
  sendCode: (email: string) => Promise<string | null>;
  verifyCode: (email: string, otp: string) => Promise<string | null>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [configured] = useState(() => isInsforgeConfigured());
  const [ready, setReady] = useState(!isInsforgeConfigured());
  const [guest, setGuest] = useState<Guest | null>(null);

  useEffect(() => {
    const client = getInsforgeClient();
    if (!client) {
      return;
    }

    let cancelled = false;

    function applyUser(user: unknown) {
      if (!cancelled) {
        setGuest(mapGuest(user));
        setReady(true);
      }
    }

    void client.auth
      .getCurrentUser()
      .then(({ data }) => {
        applyUser(data?.user);
      })
      .catch(() => {
        applyUser(null);
      });

    const unsubscribe = client.auth.onAuthStateChange(() => {
      void client.auth.getCurrentUser().then(({ data }) => {
        applyUser(data?.user);
      });
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  const sendCode = useCallback(async (email: string) => {
    const client = getInsforgeClient();
    if (!client) {
      return "The desk is not connected on this machine.";
    }

    const trimmed = email.trim();
    if (!trimmed) {
      return "An email is needed.";
    }

    const { error } = await client.auth.signInWithOtp({ email: trimmed });
    return error
      ? authErrorMessage(error, "The code could not be sent.")
      : null;
  }, []);

  const verifyCode = useCallback(async (email: string, otp: string) => {
    const client = getInsforgeClient();
    if (!client) {
      return "The desk is not connected on this machine.";
    }

    const trimmedEmail = email.trim();
    const trimmedOtp = otp.trim();
    if (!trimmedEmail || !trimmedOtp) {
      return "Email and code are both needed.";
    }

    const { data, error } = await client.auth.verifyOtp({
      email: trimmedEmail,
      otp: trimmedOtp,
    });

    if (error) {
      return authErrorMessage(error, "That code could not be used.");
    }

    setGuest(mapGuest(data?.user));
    return null;
  }, []);

  const signOut = useCallback(async () => {
    const client = getInsforgeClient();
    if (client) {
      await client.auth.signOut();
    }
    setGuest(null);
  }, []);

  const value = useMemo(
    () => ({
      configured,
      ready,
      guest,
      sendCode,
      verifyCode,
      signOut,
    }),
    [configured, guest, ready, sendCode, signOut, verifyCode],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
