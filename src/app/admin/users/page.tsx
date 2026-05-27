"use client";

import { useState } from "react";
import { Users, Search, Shield, UserCheck, Trash2 } from "lucide-react";

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "CUSTOMER";
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserItem[]>([
    { id: "usr-1", name: "Miss Queen Admin", email: "admin@missqueen.com", role: "ADMIN", createdAt: "12 Apr 2026" },
    { id: "usr-2", name: "John Doe", email: "customer@missqueen.com", role: "CUSTOMER", createdAt: "15 Apr 2026" },
    { id: "usr-3", name: "Aarav Sharma", email: "aarav@gmail.com", role: "CUSTOMER", createdAt: "24 May 2026" },
  ]);

  const [search, setSearch] = useState("");

  const handleToggleRole = (id: string) => {
    setUsers(
      users.map((u) => {
        if (u.id === id) {
          const nextRole = u.role === "ADMIN" ? "CUSTOMER" : "ADMIN";
          return { ...u, role: nextRole };
        }
        return u;
      })
    );
  };

  const handleDelete = (id: string) => {
    if (confirm("Remove user account from Vault database registry?")) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
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

      {/* Main Table */}
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
                <th className="p-4 text-center">Remove</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id} className="border-b border-border/50 last:border-0 hover:bg-soft-bg/20 transition-colors">
                  <td className="p-4 font-bold text-primary-dark">{u.name}</td>
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
                      onClick={() => handleToggleRole(u.id)}
                      className="text-gold-accent hover:underline uppercase text-[9px] font-bold tracking-wider"
                    >
                      Toggle Role
                    </button>
                  </td>
                  <td className="p-4 text-right text-text-muted">{u.createdAt}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="p-2 text-text-muted hover:text-red-500 transition-colors rounded-lg hover:bg-soft-bg"
                        aria-label="Remove user account"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
