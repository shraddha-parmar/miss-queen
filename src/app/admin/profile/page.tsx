"use client";

import { useState } from "react";
import { User, Shield, Lock, Save, Key } from "lucide-react";

export default function ProfilePage() {
  const [name, setName] = useState("Miss Queen Admin");
  const [email, setEmail] = useState("admin@missqueen.com");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-heading text-primary-dark tracking-wide uppercase">
          Vault Profile
        </h1>
        <p className="text-text-muted text-xs font-medium tracking-wider uppercase mt-1">
          Manage your administrator profile details and credential security keys.
        </p>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-xs rounded-xl p-4 text-center font-medium">
          Profile configurations updated successfully.
        </div>
      )}

      <div className="grid grid-cols-1 gap-8">
        
        {/* Profile Card */}
        <div className="card p-6">
          <h3 className="text-xs uppercase tracking-widest text-text-muted font-bold mb-6 flex items-center gap-2">
            <User className="w-4.5 h-4.5 text-gold-accent" /> Profile Settings
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-bold text-text-muted">Admin User Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-soft-bg border border-border px-4 py-2.5 rounded-xl text-xs focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-bold text-text-muted">Security Role</label>
                <div className="w-full bg-soft-bg border border-border px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 text-text-muted font-semibold">
                  <Shield className="w-3.5 h-3.5 text-gold-accent" /> ADMINISTRATOR
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider font-bold text-text-muted">Email Credentials</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-soft-bg border border-border px-4 py-2.5 rounded-xl text-xs focus:outline-none"
              />
            </div>

            <div className="h-px bg-border/60 w-full my-4"></div>

            <h3 className="text-xs uppercase tracking-widest text-text-muted font-bold mb-4 flex items-center gap-2">
              <Lock className="w-4.5 h-4.5 text-gold-accent" /> Vault Key Access
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-bold text-text-muted">Current Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-soft-bg border border-border px-4 py-2.5 rounded-xl text-xs focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-bold text-text-muted">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-soft-bg border border-border px-4 py-2.5 rounded-xl text-xs focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-accent px-6 py-3.5 rounded-xl flex items-center gap-2 mt-6 text-[10px] tracking-widest font-bold ml-auto"
            >
              <Save className="w-4 h-4" /> Save Profile Configurations
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
