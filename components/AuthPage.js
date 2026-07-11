import { useState, useEffect } from "react";
import { ArrowLeft, Key, Lock, Mail, ShieldAlert, User } from "lucide-react";
import PremiumLogo from "./PremiumLogo";

export default function AuthPage({ onBack, onAuthSuccess }) {
  const [activeTab, setActiveTab] = useState("login"); // "login" | "signup"
  const [authState, setAuthState] = useState("form"); // "form" | "verify-otp" | "forgot-password" | "reset-password"
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(true);
  
  // Input fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Initialize Google Login SDK
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      if (window.google && clientId) {
        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleGoogleResponse
          });
          window.google.accounts.id.renderButton(
            document.getElementById("google-signin-btn"),
            { theme: "dark", size: "large", shape: "pill", width: 280 }
          );
        } catch (e) {
          console.error("Google SSO Button Init Error:", e);
        }
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [activeTab, authState]);

  const handleGoogleResponse = async (response) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: response.credential, mode: activeTab })
      });
      const data = await res.json().catch(() => ({ error: "Google verification route error. Make sure your dev server is restarted." }));
      if (!res.ok) throw new Error(data.error || "Google sign-in failed");

      onAuthSuccess(data.token, data.user);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    const guestUser = {
      id: "guest",
      name: "Guest User",
      email: "guest@aurora.app",
      isGuest: true
    };
    onAuthSuccess("guest", guestUser);
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json().catch(() => ({ error: "Signup endpoint error. Make sure you restart your Next.js dev server to load the new .env settings!" }));
      if (!res.ok) throw new Error(data.error || "Registration failed");

      setSuccessMsg("Account pre-created. Please verify your OTP code.");
      setAuthState("verify-otp");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otpCode) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otpCode })
      });
      const data = await res.json().catch(() => ({ error: "Verification endpoint error. Try again." }));
      if (!res.ok) throw new Error(data.error || "OTP verification failed");

      onAuthSuccess(data.token, data.user);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json().catch(() => ({ error: "Login endpoint error. Check your database connection parameters." }));

      if (res.status === 202 && data.needsVerification) {
        setSuccessMsg(data.message);
        setAuthState("verify-otp");
        return;
      }

      if (!res.ok) throw new Error(data.error || "Login failed");

      onAuthSuccess(data.token, data.user);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json().catch(() => ({ error: "Forgot password endpoint error. Check your SMTP setup." }));
      if (!res.ok) throw new Error(data.error || "Failed sending reset code");

      setSuccessMsg("Reset code has been sent.");
      setAuthState("reset-password");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!otpCode || !newPassword) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otpCode, newPassword })
      });
      const data = await res.json().catch(() => ({ error: "Reset password endpoint error." }));
      if (!res.ok) throw new Error(data.error || "Password reset failed");

      setSuccessMsg(data.message);
      setAuthState("form");
      setActiveTab("login");
      setOtpCode("");
      setNewPassword("");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050608] text-white flex flex-col justify-center items-center px-6">
      <div className="noise-overlay" />
      <div className="moving-grid" />

      {/* Back Button */}
      <button 
        onClick={onBack}
        className="absolute top-6 left-6 flex items-center gap-2 text-xs text-[#98A2B3] hover:text-white uppercase tracking-wider transition bg-white/[0.02] border border-white/5 px-4 py-2 rounded-full"
      >
        <ArrowLeft className="h-4 w-4" />
        Return
      </button>

      {/* Main card */}
      <div className="relative w-full max-w-md bg-[#11161D]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-8 shadow-2xl relative z-10 space-y-6">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center gap-2">
          <PremiumLogo />
          <span className="text-[10px] text-[#98A2B3]/50 uppercase tracking-[0.3em] mt-1">EQUITY AUDITING SUITE</span>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-xs text-red-400 flex items-start gap-2.5">
            <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-xs text-emerald-400">
            {successMsg}
          </div>
        )}

        {/* STATE A: OTP VERIFY */}
        {authState === "verify-otp" && (
          <form onSubmit={handleVerifyOtpSubmit} className="space-y-4">
            <div className="text-center space-y-1.5">
              <h3 className="text-base font-bold text-white uppercase tracking-wider">Account Verification</h3>
              <p className="text-xs text-[#98A2B3]">Enter the 6-digit OTP code sent to <strong>{email}</strong>.</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-[#98A2B3]">Verification Code</label>
              <div className="relative flex items-center border border-white/10 bg-[#050608]/50 rounded-xl px-3 py-2">
                <Key className="h-4 w-4 text-white/30 mr-2.5" />
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="Enter code"
                  className="bg-transparent text-sm w-full outline-none text-white tracking-widest placeholder:text-white/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || otpCode.length !== 6}
              className="w-full rounded-xl bg-[#FF4B2B] py-3 text-xs font-semibold uppercase tracking-wider text-white disabled:opacity-40 hover:bg-[#FF4B2B]/90 transition shadow-lg"
            >
              {loading ? "Verifying…" : "Confirm Verification"}
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthState("form");
                setError(null);
                setSuccessMsg(null);
              }}
              className="w-full text-center text-xs text-[#98A2B3] hover:underline"
            >
              Cancel Verification
            </button>
          </form>
        )}

        {/* STATE B: FORGOT PASSWORD REQUEST */}
        {authState === "forgot-password" && (
          <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
            <div className="text-center space-y-1.5">
              <h3 className="text-base font-bold text-white uppercase tracking-wider">Forgot Password</h3>
              <p className="text-xs text-[#98A2B3]">Confirm your registered email to receive a password reset code.</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-[#98A2B3]">Email Address</label>
              <div className="relative flex items-center border border-white/10 bg-[#050608]/50 rounded-xl px-3 py-2">
                <Mail className="h-4 w-4 text-white/30 mr-2.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. name@domain.com"
                  className="bg-transparent text-sm w-full outline-none text-white placeholder:text-white/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email}
              className="w-full rounded-xl bg-[#FF4B2B] py-3 text-xs font-semibold uppercase tracking-wider text-white disabled:opacity-40 hover:bg-[#FF4B2B]/90 transition shadow-lg"
            >
              {loading ? "Sending Code…" : "Send Reset Code"}
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthState("form");
                setError(null);
                setSuccessMsg(null);
              }}
              className="w-full text-center text-xs text-[#98A2B3] hover:underline"
            >
              Back to Login
            </button>
          </form>
        )}

        {/* STATE C: RESET PASSWORD SETTINGS */}
        {authState === "reset-password" && (
          <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
            <div className="text-center space-y-1.5">
              <h3 className="text-base font-bold text-white uppercase tracking-wider">Reset Password</h3>
              <p className="text-xs text-[#98A2B3]">Complete password reset using the code sent to your email.</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-[#98A2B3]">OTP Reset Code</label>
              <div className="relative flex items-center border border-white/10 bg-[#050608]/50 rounded-xl px-3 py-2">
                <Key className="h-4 w-4 text-white/30 mr-2.5" />
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="Enter reset code"
                  className="bg-transparent text-sm w-full outline-none text-white tracking-widest placeholder:text-white/20"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-[#98A2B3]">New Password</label>
              <div className="relative flex items-center border border-white/10 bg-[#050608]/50 rounded-xl px-3 py-2">
                <Lock className="h-4 w-4 text-white/30 mr-2.5" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Choose secure password"
                  className="bg-transparent text-sm w-full outline-none text-white placeholder:text-white/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || otpCode.length !== 6 || !newPassword}
              className="w-full rounded-xl bg-[#FF4B2B] py-3 text-xs font-semibold uppercase tracking-wider text-white disabled:opacity-40 hover:bg-[#FF4B2B]/90 transition shadow-lg"
            >
              {loading ? "Updating Password…" : "Reset & Confirm"}
            </button>
          </form>
        )}

        {/* STATE D: FORM TABS (LOGIN / SIGNUP) */}
        {authState === "form" && (
          <>
            {/* Tabs */}
            <div className="flex border-b border-white/5">
              <button
                onClick={() => {
                  setActiveTab("login");
                  setError(null);
                  setSuccessMsg(null);
                }}
                className={`flex-1 pb-3 text-xs uppercase tracking-widest font-semibold transition ${
                  activeTab === "login"
                    ? "border-b-2 border-[#FF4B2B] text-white"
                    : "text-[#98A2B3]/50 hover:text-white"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setActiveTab("signup");
                  setError(null);
                  setSuccessMsg(null);
                }}
                className={`flex-1 pb-3 text-xs uppercase tracking-widest font-semibold transition ${
                  activeTab === "signup"
                    ? "border-b-2 border-[#FF4B2B] text-white"
                    : "text-[#98A2B3]/50 hover:text-white"
                }`}
              >
                Register
              </button>
            </div>

            {activeTab === "login" ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-[#98A2B3]">Email Address</label>
                  <div className="relative flex items-center border border-white/10 bg-[#050608]/50 rounded-xl px-3 py-2">
                    <Mail className="h-4 w-4 text-white/30 mr-2.5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. name@domain.com"
                      className="bg-transparent text-sm w-full outline-none text-white placeholder:text-white/20"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] uppercase tracking-wider text-[#98A2B3]">Password</label>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthState("forgot-password");
                        setError(null);
                        setSuccessMsg(null);
                      }}
                      className="text-[9px] uppercase tracking-wider text-[#FF7A3D] hover:underline"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative flex items-center border border-white/10 bg-[#050608]/50 rounded-xl px-3 py-2">
                    <Lock className="h-4 w-4 text-white/30 mr-2.5" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="bg-transparent text-sm w-full outline-none text-white placeholder:text-white/20"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !email || !password}
                  className="w-full rounded-xl bg-[#FF4B2B] py-3 text-xs font-semibold uppercase tracking-wider text-white disabled:opacity-40 hover:bg-[#FF4B2B]/90 transition shadow-lg"
                >
                  {loading ? "Signing In…" : "Sign In"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignupSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-[#98A2B3]">Display Name</label>
                  <div className="relative flex items-center border border-white/10 bg-[#050608]/50 rounded-xl px-3 py-2">
                    <User className="h-4 w-4 text-white/30 mr-2.5" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="bg-transparent text-sm w-full outline-none text-white placeholder:text-white/20"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-[#98A2B3]">Email Address</label>
                  <div className="relative flex items-center border border-white/10 bg-[#050608]/50 rounded-xl px-3 py-2">
                    <Mail className="h-4 w-4 text-white/30 mr-2.5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. name@domain.com"
                      className="bg-transparent text-sm w-full outline-none text-white placeholder:text-white/20"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-[#98A2B3]">Password</label>
                  <div className="relative flex items-center border border-white/10 bg-[#050608]/50 rounded-xl px-3 py-2">
                    <Lock className="h-4 w-4 text-white/30 mr-2.5" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Choose secure password"
                      className="bg-transparent text-sm w-full outline-none text-white placeholder:text-white/20"
                    />
                  </div>
                </div>

                {/* Consent Checkboxes */}
                <div className="space-y-3 pt-2 text-left">
                  <label className="flex items-start gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mt-0.5 rounded border-white/10 bg-[#050608]/50 text-[#FF4B2B] focus:ring-[#FF4B2B]/30 h-3.5 w-3.5 transition"
                    />
                    <span className="text-[10px] text-[#98A2B3] leading-relaxed">
                      I agree to the{" "}
                      <a
                        href="/terms"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#FF7A3D] hover:underline inline-flex items-center gap-0.5 font-semibold"
                      >
                        Terms &amp; Conditions
                      </a>
                    </span>
                  </label>

                  <label className="flex items-start gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={permissionGranted}
                      onChange={(e) => setPermissionGranted(e.target.checked)}
                      className="mt-0.5 rounded border-white/10 bg-[#050608]/50 text-[#FF4B2B] focus:ring-[#FF4B2B]/30 h-3.5 w-3.5 transition"
                    />
                    <span className="text-[10px] text-[#98A2B3] leading-relaxed">
                      I authorize AURORA to retrieve financial metrics and scraped report summaries for my queries.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading || !name || !email || !password || !termsAccepted}
                  className="w-full rounded-xl bg-[#FF4B2B] py-3 text-xs font-semibold uppercase tracking-wider text-white disabled:opacity-40 hover:bg-[#FF4B2B]/90 transition shadow-lg mt-2"
                >
                  {loading ? "Creating Account…" : "Register"}
                </button>
              </form>
            )}

            {/* Google Authentication Section */}
            <div className="space-y-4 pt-4 border-t border-white/5 flex flex-col items-center">
              <span className="text-[9px] uppercase tracking-widest text-[#98A2B3]/50">Or authenticate with</span>
              
              {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? (
                <div className="flex flex-col items-center gap-3">
                  <div id="google-signin-btn" className="relative z-20" />
                  {activeTab === "signup" && (
                    <p className="text-[9px] text-[#98A2B3]/60 max-w-[260px] text-center leading-relaxed font-sans">
                      By authenticating with Google, you agree to our{" "}
                      <a
                        href="/terms"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#FF7A3D] hover:underline font-semibold"
                      >
                        Terms &amp; Conditions
                      </a>{" "}
                      and authorize AURORA to run financial audits and crawl reports.
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-[9px] text-yellow-500/70 border border-yellow-500/10 p-3 rounded-lg bg-yellow-500/5 text-center leading-relaxed">
                  Google Client ID is not configured in .env.<br />
                  Add <strong>NEXT_PUBLIC_GOOGLE_CLIENT_ID</strong> to verify Google sign-in.
                </div>
              )}

              <div className="pt-3 border-t border-white/5 w-full text-center">
                <button
                  type="button"
                  onClick={handleGuestLogin}
                  className="text-[10px] uppercase tracking-widest text-[#FF7A3D] hover:text-white transition font-semibold hover:underline"
                >
                  Continue as Guest
                </button>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
