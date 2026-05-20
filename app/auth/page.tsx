"use client";

import { useState } from "react";
import Link from "next/link";

import { auth } from "@/lib/firebase";

import {
  GoogleAuthProvider,
  OAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithPopup,
  signOut,
  ConfirmationResult,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  reload,
} from "firebase/auth";

export default function Home() {
  const [user, setUser] = useState<any>(null);

  // =========================
  // EMAIL/PASSWORD STATE
  // =========================
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // =========================
  // PHONE STATE
  // =========================
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);

  const [loading, setLoading] = useState(false);

  // =========================
  // SEND TOKEN TO BACKEND
  // =========================
  const handleCreateUser = async (tokenId: string, provider: string) => {
    try {
      const response = await fetch(
        "http://localhost:4000/api/v1/auth/social/google",
        // "https://gluviacare.onrender.com/api/v1/auth/social/google",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idToken: tokenId,
            provider,
          }),
        },
      );

      const data = await response.json();

      console.log("Server response:", data);

      if (!response.ok) {
        throw new Error(
          data?.details || data?.message || "Authentication failed",
        );
      }

      return data;
    } catch (error: any) {
      console.log(error);
      throw new Error(error.message);
    }
  };

  // =========================
  // EMAIL SIGN UP
  // =========================
  const handleEmailSignup = async () => {
    try {
      setLoading(true);

      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      // SEND VERIFICATION EMAIL
      await sendEmailVerification(result.user);

      alert(
        "Verification email sent. Please verify your email before logging in.",
      );

      // GET FRESH TOKEN
      const tokenId = await result.user.getIdToken(true);

      await handleCreateUser(tokenId, "google.com");

      // OPTIONAL LOGOUT AFTER SIGNUP
      await signOut(auth);

      setUser(null);

      setEmail("");
      setPassword("");
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // EMAIL LOGIN
  // =========================
  const handleEmailLogin = async () => {
    try {
      setLoading(true);

      const result = await signInWithEmailAndPassword(auth, email, password);

      // RELOAD USER TO GET LATEST EMAIL VERIFIED STATUS
      await reload(result.user);

      // CHECK EMAIL VERIFICATION
      if (!result.user.emailVerified) {
        alert("Please verify your email before logging in.");

        await sendEmailVerification(result.user);

        alert("A new verification email has been sent.");

        await signOut(auth);

        return;
      }

      setUser(result.user);

      // GET FRESH TOKEN
      const tokenId = await result.user.getIdToken(true);

      console.log("Email Login Token:", tokenId);

      // VERIFY WITH BACKEND
      await handleCreateUser(tokenId, "password");

      alert("Login successful");
    } catch (error: any) {
      console.error(error);

      alert(error?.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // GOOGLE LOGIN
  // =========================
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      const provider = new GoogleAuthProvider();

      const result = await signInWithPopup(auth, provider);

      setUser(result.user);

      const tokenId = await result.user.getIdToken(true);

      console.log("Firebase ID Token:", tokenId);

      await handleCreateUser(tokenId, "google.com");

      alert("Google login successful");
    } catch (error: any) {
      console.error(error);

      alert(error?.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // APPLE LOGIN
  // =========================
  const handleAppleLogin = async () => {
    try {
      setLoading(true);

      const provider = new OAuthProvider("apple.com");

      provider.addScope("email");
      provider.addScope("name");

      const result = await signInWithPopup(auth, provider);

      setUser(result.user);

      const tokenId = await result.user.getIdToken(true);

      console.log("Apple Firebase ID Token:", tokenId);

      await handleCreateUser(tokenId, "apple.com");

      alert("Apple login successful");
    } catch (error: any) {
      console.error(error);

      alert(error?.message || "Apple login failed");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // PHONE LOGIN - SEND OTP
  // =========================
  const handleSendOTP = async () => {
    try {
      setLoading(true);

      if (!(window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          {
            size: "normal",
            callback: () => {
              console.log("reCAPTCHA solved");
            },
          },
        );
      }

      const appVerifier = (window as any).recaptchaVerifier;

      const result = await signInWithPhoneNumber(auth, phone, appVerifier);

      setConfirmationResult(result);

      alert("OTP sent successfully");
    } catch (error: any) {
      console.error(error);

      alert(error?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // VERIFY OTP
  // =========================
  const handleVerifyOTP = async () => {
    try {
      setLoading(true);

      if (!confirmationResult) return;

      const result = await confirmationResult.confirm(otp);

      setUser(result.user);

      const tokenId = await result.user.getIdToken(true);

      console.log("Phone Firebase ID Token:", tokenId);

      await handleCreateUser(tokenId, "phone");

      alert("Phone login successful");
    } catch (error: any) {
      console.error(error);

      alert(error?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = async () => {
    await signOut(auth);

    setUser(null);

    alert("Logged out successfully");
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-2xl rounded-[2rem] bg-slate-900/95 p-8 shadow-2xl shadow-slate-950/40 ring-1 ring-slate-700">
        <div className="mb-8 flex flex-col gap-4">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-white">
              Firebase Auth Test
            </h1>

            <p className="mt-2 text-slate-400">
              Test Email, Google, Apple and Phone Authentication.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-700 bg-slate-800 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-500 hover:bg-slate-700 sm:w-auto"
          >
            Go to Home
          </Link>
        </div>

        {!user ? (
          <div className="grid gap-6">
            {/* EMAIL/PASSWORD */}
            <div className="rounded-3xl border border-slate-700 bg-slate-950/80 p-6 shadow-inner shadow-slate-950/20">
              <h3 className="mb-4 text-xl font-semibold text-white">
                Email Authentication
              </h3>

              <div className="grid gap-4">
                <input
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                />

                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                />

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={handleEmailSignup}
                    disabled={loading}
                    className="rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-50"
                  >
                    Create Account
                  </button>

                  <button
                    onClick={handleEmailLogin}
                    disabled={loading}
                    className="rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-50"
                  >
                    Login
                  </button>
                </div>
              </div>
            </div>

            {/* GOOGLE */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="rounded-2xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-sky-500 px-5 py-4 text-left text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:scale-[1.01] hover:shadow-cyan-500/30 disabled:opacity-50"
            >
              Sign in with Google
            </button>

            {/* APPLE */}
            <button
              onClick={handleAppleLogin}
              disabled={loading}
              className="rounded-2xl bg-slate-800 px-5 py-4 text-left text-sm font-semibold text-white shadow-lg shadow-slate-900/40 transition hover:bg-slate-700 disabled:opacity-50"
            >
              Sign in with Apple
            </button>

            {/* PHONE */}
            <div className="rounded-3xl border border-slate-700 bg-slate-950/80 p-6 shadow-inner shadow-slate-950/20">
              <h3 className="mb-4 text-xl font-semibold text-white">
                Phone Authentication
              </h3>

              <input
                type="text"
                placeholder="+2348012345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
              />

              <button
                onClick={handleSendOTP}
                disabled={loading}
                className="mt-4 w-full rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-50"
              >
                Send OTP
              </button>

              {confirmationResult && (
                <>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="mt-4 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                  />

                  <button
                    onClick={handleVerifyOTP}
                    disabled={loading}
                    className="mt-4 w-full rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-50"
                  >
                    Verify OTP
                  </button>
                </>
              )}

              <div id="recaptcha-container" className="mt-6" />
            </div>
          </div>
        ) : (
          <div className="grid gap-4 rounded-3xl border border-slate-700 bg-slate-950/80 p-6 shadow-inner shadow-slate-950/20">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
                Logged in as
              </p>

              <p className="mt-2 text-lg font-medium text-white">
                {user.email || user.phoneNumber}
              </p>
            </div>

            {user.photoURL && (
              <img
                src={user.photoURL}
                width={60}
                height={60}
                alt="profile"
                className="rounded-full border border-slate-700"
              />
            )}

            <button
              onClick={handleLogout}
              className="mt-2 rounded-2xl bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-400"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
