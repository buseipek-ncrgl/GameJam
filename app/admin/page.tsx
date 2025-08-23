"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AdminSectionCard from "@/app/admin/_components/admin-sectioncard";
import { useDisplayName } from "@/lib/use-user";
import { IdCard, Users, Megaphone, Link2, MessageSquare, Inbox, TrendingUp, Clock, AlertCircle } from "lucide-react";

const quickLinks = [
  { href: "/admin/katilimcilar", label: "Katılımcılar", icon: IdCard, color: "from-blue-500 to-cyan-500" },
  { href: "/admin/takimlar",     label: "Takımlar",      icon: Users, color: "from-purple-500 to-pink-500" },
  { href: "/admin/duyurular",    label: "Duyurular",     icon: Megaphone, color: "from-orange-500 to-red-500" },
  { href: "/admin/eslestirme",   label: "Takım Eşleşmeleri", icon: Link2, color: "from-green-500 to-emerald-500" },
  { href: "/admin/mesajlar",     label: "Mesajlar",      icon: MessageSquare, color: "from-indigo-500 to-purple-500" },
  { href: "/admin/teslimler",    label: "Teslimler",     icon: Inbox, color: "from-teal-500 to-blue-500" },
];

type Stats = {
  totalParticipants: number | null;
  totalTeams: number | null;
  pendingSubmissions: number | null;
  unreadMessages: number | null;
};

function Stat({ icon: Icon, label, value, trend }: { icon: any; label: string; value: string | number; trend?: string }) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500 shadow-sm">
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{value}</div>
          <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">{label}</div>
          {trend && (
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">{trend}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminHome() {
  const { displayName } = useDisplayName();

  const [stats, setStats] = useState<Stats>({
    totalParticipants: null,
    totalTeams: null,
    pendingSubmissions: null,
    unreadMessages: null,
  });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        setLoading(true);

        const [usersRes, teamsRes, subsTeamsRes, msgsRes] = await Promise.all([
          fetch("/api/admin/users?page=1&pageSize=1", {
            cache: "no-store",
            credentials: "same-origin",
          }),
          fetch("/api/admin/teams?page=1&pageSize=1", {
            cache: "no-store",
            credentials: "same-origin",
          }),
          fetch("/api/admin/submissions/teams?page=1&pageSize=1", {
            cache: "no-store",
            credentials: "same-origin",
          }),
          fetch("/api/admin/messages?box=inbox&unread=1&pageSize=1", {
            cache: "no-store",
            credentials: "same-origin",
          }),
        ]);

        if (!usersRes.ok) throw new Error(`Users HTTP ${usersRes.status}`);
        if (!teamsRes.ok) throw new Error(`Teams HTTP ${teamsRes.status}`);
        if (!subsTeamsRes.ok) throw new Error(`SubmissionsTeams HTTP ${subsTeamsRes.status}`);
        if (!msgsRes.ok) throw new Error(`Messages HTTP ${msgsRes.status}`);

        const usersJson = await usersRes.json();
        const teamsJson = await teamsRes.json();
        const subsTeamsJson = await subsTeamsRes.json();
        const msgsJson = await msgsRes.json();

        const next: Stats = {
          totalParticipants: Number(usersJson?.total ?? 0),
          totalTeams: Number(teamsJson?.totalTeams ?? 0),
          pendingSubmissions: Number(subsTeamsJson?.totalTeams ?? 0),
          unreadMessages: Number(msgsJson?.total ?? 0),
        };

        if (alive) {
          setStats(next);
          setErr(null);
        }
      } catch (e: any) {
        if (alive) setErr(e?.message ?? "Bilinmeyen hata");
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-xl bg-slate-900 p-8 text-white shadow-lg">
        <div className="relative">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            Merhaba {displayName ?? "Yönetici"}, hoş geldiniz! 👋
          </h1>
          <p className="text-slate-300 text-lg">
            Yönetim panelinden katılımcıları, takımları, duyuruları ve teslimleri buradan yönetebilirsiniz.
          </p>
        </div>
      </div>

      {err && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <div>
              <div className="font-semibold text-red-700 dark:text-red-400">Metrikler yüklenemedi</div>
              <div className="text-sm text-red-600 dark:text-red-300">{err}</div>
            </div>
          </div>
        </div>
      )}

      {/* Özet Metrikler */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Stat 
          icon={IdCard} 
          label="Toplam Katılımcı" 
          value={loading ? "…" : (stats.totalParticipants ?? "—")} 
          trend="+12% bu hafta"
        />
        <Stat 
          icon={Users} 
          label="Toplam Takım" 
          value={loading ? "…" : (stats.totalTeams ?? "—")} 
          trend="+5% bu hafta"
        />
        <Stat 
          icon={Inbox} 
          label="Bekleyen Teslim" 
          value={loading ? "…" : (stats.pendingSubmissions ?? "—")} 
        />
        <Stat 
          icon={MessageSquare} 
          label="Okunmamış Mesaj" 
          value={loading ? "…" : (stats.unreadMessages ?? "—")} 
        />
      </div>

      {/* Kısayollar */}
      <AdminSectionCard title="Hızlı Erişim" subtitle="Sık kullanılan sayfalar">
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
          {quickLinks.map(({ href, label, icon: Icon, color }) => (
            <Link
              key={href}
              href={href}
              className="group relative overflow-hidden rounded-xl p-6 text-center transition-shadow duration-200 hover:shadow-md"
            >
              <div className="relative">
                <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br ${color} shadow-sm transition-transform duration-200 group-hover:scale-105`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors duration-200">
                  {label}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </AdminSectionCard>

      {/* Bekleyen İşler */}
      <AdminSectionCard title="Bekleyen İşler" subtitle="Hızlı aksiyon almanız gerekenler">
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500 shadow-sm">
              <Inbox className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-orange-900 dark:text-orange-100">
                Bekleyen Teslimler
              </div>
              <div className="text-sm text-orange-700 dark:text-orange-300">
                <Link href="/admin/teslimler" className="underline hover:no-underline">
                  Teslimler sekmesinde <strong>{loading ? "…" : (stats.pendingSubmissions ?? 0)}</strong> bekleyen inceleme var.
                </Link>
              </div>
            </div>
            <Clock className="h-5 w-5 text-orange-500" />
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500 shadow-sm">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-blue-900 dark:text-blue-100">
                Okunmamış Mesajlar
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300">
                <Link href="/admin/mesajlar" className="underline hover:no-underline">
                  Mesajlar sekmesinde <strong>{loading ? "…" : (stats.unreadMessages ?? 0)}</strong> okunmamış ileti var.
                </Link>
              </div>
            </div>
            <AlertCircle className="h-5 w-5 text-blue-500" />
          </div>
        </div>
      </AdminSectionCard>
    </div>
  );
}