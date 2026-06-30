"use client";

import { useState, useEffect } from "react";
import { Users, Search, Shield, Loader2, AlertCircle } from "lucide-react";

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "CUSTOMER";
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch("/api/admin/users");
      if (!res.ok) {
        throw new Error("Failed to load user registry");
      }
      const data = await res.json();
      setUsers(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load users from vault.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleRole = async (id: string, currentRole: "ADMIN" | "CUSTOMER") => {
    const nextRole = currentRole === "ADMIN" ? "CUSTOMER" : "ADMIN";
    
    if (confirm(`Are you sure you want to change this user's role to ${nextRole}?`)) {
      try {
        const res = await fetch(`/api/admin/users/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role: nextRole }),
        });
        
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to update role");
        }
        
        setUsers(
          users.map((u) => (u.id === id ? { ...u, role: data.role } : u))
        );
      } catch (err: any) {
        alert(err.message || "Could not toggle user permissions.");
      }
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      (u.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading text-primary-dark tracking-wide uppercase">
          Vault User Registry
        </h1>
        <p className="text-text-muted text-xs font-medium tracking-wider uppercase mt-1">
          Review client registry, grant dashboard admin rights, and audit accounts.
        </p>
      </div>

      {/* Filters Search */}
      <div className="relative w-full sm:w-80">
        <input
          type="text"
          placeholder="Search accounts by name, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-border pl-10 pr-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-gold-accent transition-colors"
        />
        <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-text-muted">
          <Loader2 className="w-8 h-8 animate-spin text-gold-accent" />
          <span className="text-xs uppercase tracking-widest font-bold">Synchronizing user registry...</span>
        </div>
      )}

      {/* Error state */}
      {!isLoading && error && (
        <div className="card border border-red-200 bg-red-50 text-red-700 flex items-center gap-3 p-6">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div className="text-xs font-medium">{error}</div>
        </div>
      )}

      {/* Main Table */}
      {!isLoading && !error && (
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border text-text-muted font-bold uppercase tracking-wider bg-soft-bg/30">
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4 text-center">Dashboard Permissions</th>
                  <th className="p-4 text-center">Action Toggle</th>
                  <th className="p-4 text-right">Registry Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-text-muted">
                      No user accounts found matching your query.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="border-b border-border/50 last:border-0 hover:bg-soft-bg/20 transition-colors">
                      <td className="p-4 font-bold text-primary-dark">{u.name || "N/A"}</td>
                      <td className="p-4 text-text-secondary font-mono">{u.email}</td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                          u.role === "ADMIN"
                            ? "bg-gold-accent/10 text-gold-accent border border-gold-accent/20"
                            : "bg-zinc-100 text-zinc-600 border border-zinc-200"
                        }`}>
                          {u.role === "ADMIN" && <Shield className="w-3 h-3" />}
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleToggleRole(u.id, u.role)}
                          className="text-gold-accent hover:underline uppercase text-[9px] font-bold tracking-wider"
                        >
                          Toggle Role
                        </button>
                      </td>
                      <td className="p-4 text-right text-text-muted">
                        {new Date(u.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
