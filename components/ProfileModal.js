import { useState } from "react";
import { User, X, LogOut, ShieldCheck, Mail, Calendar } from "lucide-react";

export default function ProfileModal({ isOpen, onClose, user, token, onUpdateUser, onLogout }) {
  const [name, setName] = useState(user?.name || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/auth/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed updating profile");

      onUpdateUser(data.token, data.user);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-md rounded-2xl border border-white/5 bg-[#11161D] p-6 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-[#FF7A3D]" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Profile Workspace</h3>
          </div>
          <button onClick={onClose} className="text-[#98A2B3] hover:text-white transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3.5 text-xs text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3.5 text-xs text-emerald-400">
            Profile updated successfully.
          </div>
        )}

        {/* Account Info Details */}
        <div className="rounded-xl border border-white/5 bg-[#050608]/40 p-4 space-y-3.5 text-xs text-[#98A2B3]">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-[#98A2B3]/50">
              <Mail className="h-3.5 w-3.5" />
              Email Address
            </span>
            <span className="font-semibold text-white">{user?.email}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-[#98A2B3]/50">
              <ShieldCheck className="h-3.5 w-3.5" />
              Auth Security
            </span>
            <span className="rounded bg-white/[0.04] px-2 py-0.5 text-[9px] uppercase tracking-wider text-white">
              {user?.isGuest ? "Guest Session" : user?.googleId ? "Google OAuth" : "Credentials Verified"}
            </span>
          </div>
        </div>

        {/* Form Name Edit / Guest warning */}
        {user?.isGuest ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4 text-xs text-yellow-500/80 leading-relaxed text-center">
              ⚠️ <strong>Guest Mode Active</strong><br />
              Your search history is stored locally in-memory and will clear when your active browser session ends.
            </div>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={onLogout}
                className="w-full rounded-xl border border-red-500/20 bg-red-500/5 py-2.5 text-xs font-semibold uppercase tracking-wider text-red-400 hover:bg-red-500/10 transition flex items-center justify-center gap-1.5"
              >
                <LogOut className="h-3.5 w-3.5" />
                Exit Guest Mode
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-[#98A2B3]/60">Change Display Name</label>
              <div className="relative flex items-center border border-white/10 bg-[#050608]/50 rounded-xl px-3 py-2.5">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter name"
                  className="bg-transparent text-sm w-full outline-none text-white placeholder:text-white/20"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading || !name.trim() || name.trim() === user?.name}
                className="flex-1 rounded-xl bg-[#FF4B2B] py-2.5 text-xs font-semibold uppercase tracking-wider text-white disabled:opacity-40 hover:bg-[#FF4B2B]/90 transition"
              >
                {loading ? "Saving…" : "Save Changes"}
              </button>
              
              <button
                type="button"
                onClick={onLogout}
                className="rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-red-400 hover:bg-red-500/10 transition flex items-center justify-center gap-1.5"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign Out
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
