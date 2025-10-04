"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import PageHeader from "../_components/page-header";
import RoleSelect from "../_components/role-select";
import {
  Copy, RefreshCw, Trash2, Save, Check, ChevronDown, Users, Crown, UserPlus, Settings, Link
} from "lucide-react";

type Role = "developer" | "designer" | "audio" | "pm";
type Member = {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  role: Role;
  status: "active" | "invited" | "admin_added" | "form_applied";
  isLeader?: boolean;
};
type Team = {
  type: "team";
  teamName: string;
  inviteCode?: string;
  members: Member[];
};

const MAX_TEAM = 5;
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRe = /^\+?\d{10,14}$/;

function isPlaceholderTeam(t: Team | null) {
  if (!t) return true;
  if (!t.teamName) return true;
  if (!t.members || t.members.length === 0) return true;
  if (t.members[0]?.email === "leader@example.com") return true;
  return false;
}

function roleLabel(r: Role) {
  switch (r) {
    case "developer": return "Yazılımcı";
    case "designer": return "Tasarımcı";
    case "audio": return "Ses/Müzik";
    case "pm": return "İçerik/PM";
  }
}

function statusLabel(s: Member["status"]) {
  switch (s) {
    case "invited": return "Davet Gönderildi";
    case "admin_added": return "Admin Atadı";
    case "form_applied": return "Form Kaydı";
    case "active":
    default: return "Aktif";
  }
}

/** -------------------------------
 *  TypeSelect (PORTALLI + FLIP)
 *  ------------------------------- */
type TeamType = "team";
const TYPES: { value: TeamType; label: string }[] = [
  { value: "team", label: "Takım" },
];

function TypeSelect({
  value,
  onChange,
  className = "",
  label = "Tür",
}: {
  value: TeamType;
  onChange: (v: TeamType) => void;
  className?: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null);
  const [pos, setPos] = useState<{
    top: number; left: number; width: number; placement: "top" | "bottom"; maxH: number;
  } | null>(null);

  // create portal root
  useEffect(() => {
    const el = document.createElement("div");
    el.setAttribute("data-type-select-portal", "true");
    document.body.appendChild(el);
    setPortalEl(el);
    return () => {
      document.body.removeChild(el);
    };
  }, []);

  // outside click + ESC
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!open) return;
      const t = e.target as Node;
      if (popRef.current?.contains(t)) return;
      if (triggerRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // position + flip
  const reposition = () => {
    const btn = triggerRef.current;
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    const sx = window.scrollX || document.documentElement.scrollLeft || 0;
    const sy = window.scrollY || document.documentElement.scrollTop || 0;
    const below = window.innerHeight - r.bottom;
    const above = r.top;
    const placement: "top" | "bottom" = (below >= 200 || below >= above) ? "bottom" : "top";
    const leftRaw = r.left + sx;
    const leftMax = sx + window.innerWidth - r.width - 8;
    const left = Math.min(leftRaw, leftMax);
    const maxH = Math.max(160, (placement === "bottom" ? below : above) - 8);
    const top = placement === "bottom" ? r.bottom + sy + 4 : r.top + sy - 4;
    setPos({ top, left, width: r.width, placement, maxH });
  };

  useLayoutEffect(() => {
    if (!open) return;
    reposition();
    const f = () => reposition();
    window.addEventListener("resize", f);
    window.addEventListener("scroll", f, true);
    return () => {
      window.removeEventListener("resize", f);
      window.removeEventListener("scroll", f, true);
    };
  }, [open]);

  const current = TYPES.find(t => t.value === value)?.label ?? "";
  const listId = "type-listbox";

  return (
    <div className={className}>
      <label className="text-sm font-medium text-purple-200 mb-2">{label}</label>

      <div
        className="group relative overflow-visible rounded-xl bg-white/20 backdrop-blur-sm border border-white/20 focus-within:border-purple-500/50 focus-within:ring-2 focus-within:ring-purple-500/20 transition-all duration-200"
        data-open={open ? "true" : "false"}
      >
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen(s => !s)}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          className="flex w-full items-center justify-between px-4 py-3 text-left text-white relative z-10"
        >
          <span className={`truncate ${!current ? "text-purple-200/60" : ""}`}>
            {current || "Tür seçin"}
          </span>
          <ChevronDown
            className={`h-4 w-4 text-purple-300 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {open && portalEl && pos && createPortal(
        <div
          ref={popRef}
          id={listId}
          role="listbox"
          className="fixed z-[99999] rounded-xl shadow-2xl border-2 border-purple-500/30 bg-white/95 backdrop-blur-xl overflow-y-auto"
          style={{
            top: pos.top,
            left: pos.left,
            width: pos.width,
            maxHeight: pos.maxH,
            transform: pos.placement === "top" ? "translateY(-100%)" : "none",
            boxShadow: "0 20px 25px -5px rgba(0,0,0,0.3), 0 10px 10px -5px rgba(0,0,0,0.2)",
          }}
        >
          <div className="p-1">
            {TYPES.map((t) => {
              const active = t.value === value;
              return (
                <div
                  key={t.value}
                  role="option"
                  aria-selected={active}
                  onClick={() => { onChange(t.value); setOpen(false); }}
                  className={`flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-slate-800 hover:bg-purple-500/20 hover:text-purple-900 transition-colors ${
                    active ? "bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-purple-900 font-semibold" : ""
                  }`}
                >
                  <span>{t.label}</span>
                  {active && <Check className="h-4 w-4 text-purple-600" />}
                </div>
              );
            })}
          </div>
        </div>,
        portalEl
      )}
    </div>
  );
}

/** -------------------------------
 *  TeamPage
 *  ------------------------------- */
export default function TeamPage() {
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const [mName, setMName] = useState("");
  const [mEmail, setMEmail] = useState("");
  const [mPhone, setMPhone] = useState("");
  const [mAge, setMAge] = useState<string>("");
  const [mRole, setMRole] = useState<Role>("developer");
  const [inviteLink, setInviteLink] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    (async () => {
      try {
        const r1 = await fetch("/api/team", { cache: "no-store" });
        if (!r1.ok) throw new Error("team fetch failed");
        const t1: Team = await r1.json();
        if (!mounted) return;
        if (isPlaceholderTeam(t1)) {
          const r2 = await fetch("/api/team?refresh=1", { cache: "no-store" });
          if (r2.ok) {
            const t2: Team = await r2.json();
            if (mounted) setTeam(t2);
          } else {
            setTeam(t1);
          }
        } else {
          setTeam(t1);
        }
      } catch {
        if (mounted) setErr("Takım bilgileri alınamadı.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const canAdd = useMemo(() => {
    if (!team || team.type !== "team") return false;
    return (
      team.members.length < MAX_TEAM &&
      mName.trim().length >= 3 &&
      emailRe.test(mEmail.trim().toLowerCase()) &&
      phoneRe.test(mPhone.replace(/\s/g, "")) &&
      Number.isInteger(Number(mAge)) &&
      Number(mAge) >= 14
    );
  }, [team, mName, mEmail, mPhone, mAge]);

  const saveTeamBasics = async (patch: Partial<Team> & { action?: string }) => {
    setErr(null);
    setMsg(null);
    try {
      const r = await fetch("/api/team", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) {
        setErr(j?.message || "Kaydedilemedi");
        return;
      }
      setTeam(j as Team);
      if (!patch.action) setMsg("Güncellendi.");
    } catch {
      setErr("Bağlantı hatası");
    }
  };

  const saveTeamName = async (value: string) => {
    if (!team) return;
    await saveTeamBasics({ teamName: value });
  };

  const regenCode = async () => { await saveTeamBasics({ action: "regen_code" }); };

  const addMember = async () => {
    if (!team || !canAdd) return;
    setErr(null);
    setMsg(null);
    setInviteLink(null);
    setLoading(true);
    try {
      const r = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add_member",
          sendInvite: true,
          member: {
            name: mName.trim(),
            email: mEmail.trim().toLowerCase(),
            phone: mPhone.replace(/\s/g, ""),
            age: Number(mAge),
            role: mRole,
          },
        }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) {
        if (j?.code === "IN_OTHER_TEAM") {
          setErr("Bu e-posta başka bir takımda. Katılımcı mevcut takımından ayrılmadan eklenemez.");
        } else if (r.status === 409) {
          setErr(j?.message || "Bu e-posta zaten ekipte.");
        } else {
          setErr(j?.message || "Eklenemedi");
        }
        return;
      }
      setTeam(j.team as Team);
      setInviteLink(j.inviteResetUrl as string);
      setMsg("Üye eklendi. Davet e-postası canlıda gönderilecek.");
      setMName("");
      setMEmail("");
      setMPhone("");
      setMAge("");
    } finally {
      setLoading(false);
    }
  };

  const removeMember = async (email: string) => {
    setErr(null);
    setMsg(null);
    const r = await fetch(`/api/team?email=${encodeURIComponent(email)}`, { method: "DELETE" });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) {
      setErr(j?.message || "Silinemedi");
      return;
    }
    setTeam(j.team as Team);
    setMsg("Üye çıkarıldı.");
  };

  if (loading && !team) return (
    <div className="flex items-center justify-center py-12">
      <div className="flex items-center gap-3 text-purple-200/80">
        <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
        <span className="text-sm font-medium">Takım bilgileri yükleniyor...</span>
      </div>
    </div>
  );
  if (!team) return null;

  const leader = team.members.find((m) => m.isLeader);
  const others = team.members.filter((m) => !m.isLeader);

  return (
    <div className="space-y-6">
      

      {/* Hero Section */}
      <div className="relative overflow-visible rounded-3xl bg-gradient-to-br from-purple-500/20 via-pink-500/15 to-blue-500/20 backdrop-blur-xl border border-purple-500/30 p-6 sm:p-8 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 animate-pulse pointer-events-none z-0"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">Takım Yönetimi</h2>
              <p className="text-sm sm:text-base text-purple-200/80">Üyelerinizi yönetin ve davetler gönderin</p>
            </div>
          </div>
          <p className="text-sm sm:text-base leading-relaxed text-purple-100 max-w-2xl">
            Takımınızı oluşturun, üye ekleyin ve davetler gönderin. Sadece takım olarak
            katılabilir, en fazla 4 kişilik ekipler kurabilirsiniz.
          </p>
        </div>
      </div>

      {/* Takım Bilgileri */}
      <div className="relative overflow-visible rounded-3xl bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-blue-500/10 backdrop-blur-xl border border-purple-500/20 p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
            <Settings className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Takım Bilgileri</h3>
            <p className="text-sm text-purple-200/80">Durum: Takım</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Takım adı */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-purple-200 mb-2">Takım Adı</label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1 overflow-visible">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur-lg pointer-events-none z-0"></div>
                <div className="relative z-10 flex items-center gap-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/20 focus-within:border-purple-500/50 focus-within:ring-2 focus-within:ring-purple-500/20 transition-all duration-200 p-1">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                    <Crown className="h-5 w-5 text-white" />
                  </div>
                  <input
                    className="flex-1 bg-transparent outline-none px-3 py-3 text-white placeholder:text-purple-200/60"
                    value={team.teamName ?? ""}
                    onChange={(e) => setTeam((t) => (t ? { ...t, teamName: e.target.value } : t))}
                    placeholder="Takım Adı"
                  />
                </div>
              </div>
              <button
                onClick={() => saveTeamName((team.teamName ?? "").trim())}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 transition-all duration-200 text-white font-medium shadow-lg"
              >
                <Save className="h-4 w-4" />
                Kaydet
              </button>
            </div>
          </div>

          {/* Tür seçimi (PORTALLI) */}
          <TypeSelect
            value={team.type}
            onChange={(v) => saveTeamBasics({ type: v })}
          />

          {/* Takım Kodu */}
          <div>
            <label className="block text-sm font-medium text-purple-200 mb-2">Takım Kodu</label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative flex-1 overflow-visible">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl blur-lg pointer-events-none z-0"></div>
                <div className="relative z-10 flex items-center gap-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/20 p-1">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                    <Link className="h-5 w-5 text-white" />
                  </div>
                  <input
                    className="flex-1 bg-transparent outline-none px-3 py-3 text-white text-sm"
                    value={team.inviteCode || ""}
                    readOnly
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    await navigator.clipboard.writeText(team.inviteCode || "");
                    setMsg("Kopyalandı");
                  }}
                  className="flex items-center justify-center gap-2 px-3 py-3 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30 border border-blue-500/30 hover:border-blue-500/50 transition-all duration-200 text-white"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <button
                  onClick={regenCode}
                  className="flex items-center justify-center gap-2 px-3 py-3 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 border border-green-500/30 hover:border-green-500/50 transition-all duration-200 text-white"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Üyeler */}
      <div className="relative overflow-visible rounded-3xl bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-blue-500/10 backdrop-blur-xl border border-purple-500/20 p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
            <Users className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Üyeler</h3>
            <p className="text-sm text-purple-200/80">Toplam {team.members.length}/{MAX_TEAM}</p>
          </div>
        </div>

        {/* Üye kartları */}
        <div className="space-y-4">
          {[leader, ...others].filter(Boolean).map((m) => m && (
            <div key={m.id} className="group relative overflow-visible rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 hover:scale-[1.02] transition-all duration-300">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  m.isLeader ? "bg-gradient-to-br from-yellow-500 to-orange-600" : "bg-gradient-to-br from-purple-500 to-pink-600"
                }`}>
                  {m.isLeader ? (
                    <Crown className="h-6 w-6 text-white" />
                  ) : (
                    <span className="text-white font-bold text-lg">
                      {m.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                    <h4 className="font-bold text-white truncate">
                      {m.isLeader ? "👑 " : ""}{m.name}
                    </h4>
                    {m.isLeader && (
                      <span className="px-2 py-1 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-200 text-xs font-medium w-fit">
                        Takım Kaptanı
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-purple-200/80 space-y-1">
                    <div className="truncate">{m.email}</div>
                    <div>{m.phone} • Yaş: {m.age} • {roleLabel(m.role)}</div>
                    <div>{m.isLeader ? "Aktif" : statusLabel(m.status)}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {!m.isLeader && (
                    <button
                      onClick={() => removeMember(m.email)}
                      className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 border border-red-500/30 hover:border-red-500/50 transition-all duration-200 text-sm font-medium flex-1 sm:flex-none"
                    >
                      <Trash2 className="h-4 w-4" />
                      Çıkar
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Yeni üye ekle */}
        {team.type === "team" && (
          <div className="mt-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <UserPlus className="h-4 w-4 text-white" />
              </div>
              <h4 className="font-bold text-white">Üye Ekle</h4>
            </div>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-6">
              <div className="sm:col-span-2">
                <div className="relative overflow-visible">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur-lg pointer-events-none z-0"></div>
                  <div className="relative z-10 rounded-xl bg-white/20 backdrop-blur-sm border border-white/20 focus-within:border-purple-500/50 focus-within:ring-2 focus-within:ring-purple-500/20 transition-all duration-200 p-1">
                    <input
                      className="w-full bg-transparent outline-none px-3 py-3 text-white placeholder:text-purple-200/60"
                      value={mName}
                      onChange={(e) => setMName(e.target.value)}
                      placeholder="Üye Ad Soyad"
                    />
                  </div>
                </div>
              </div>

              <div className="relative overflow-visible">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl blur-lg pointer-events-none z-0"></div>
                <div className="relative z-10 rounded-xl bg-white/20 backdrop-blur-sm border border-white/20 focus-within:border-blue-500/50 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-200 p-1">
                  <input
                    className="w-full bg-transparent outline-none px-3 py-3 text-white placeholder:text-blue-200/60"
                    value={mEmail}
                    onChange={(e) => setMEmail(e.target.value)}
                    placeholder="uye@mail.com"
                  />
                </div>
              </div>

              <div className="relative overflow-visible">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl blur-lg pointer-events-none z-0"></div>
                <div className="relative z-10 rounded-xl bg-white/20 backdrop-blur-sm border border-white/20 focus-within:border-green-500/50 focus-within:ring-2 focus-within:ring-green-500/20 transition-all duration-200 p-1">
                  <input
                    className="w-full bg-transparent outline-none px-3 py-3 text-white placeholder:text-green-200/60"
                    value={mPhone}
                    onChange={(e) => setMPhone(e.target.value)}
                    placeholder="+90 5xx xxx xx xx"
                  />
                </div>
              </div>

              <div className="relative overflow-visible">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl blur-lg pointer-events-none z-0"></div>
                <div className="relative z-10 rounded-xl bg-white/20 backdrop-blur-sm border border-white/20 focus-within:border-yellow-500/50 focus-within:ring-2 focus-within:ring-yellow-500/20 transition-all duration-200 p-1">
                  <input
                    className="w-full bg-transparent outline-none px-3 py-3 text-white placeholder:text-yellow-200/60"
                    value={mAge}
                    onChange={(e) => setMAge(e.target.value)}
                    placeholder="Yaş (18+)"
                    inputMode="numeric"
                  />
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="relative overflow-visible">
                  <RoleSelect
                    value={mRole}
                    onChange={setMRole}
                    showLabel={false}
                    placeholder="Rol seçin"
                  />
                </div>
              </div>

              <div className="sm:col-span-2 lg:col-span-6">
                <button
                  onClick={addMember}
                  disabled={!canAdd || loading}
                  className="group relative inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold text-white transition-all duration-200 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 hover:scale-105 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 w-full sm:w-auto"
                >
                  <UserPlus className="h-4 w-4" />
                  {loading ? "Ekleniyor..." : "Üye Ekle"}
                </button>

                {inviteLink && (
                  <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Link className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-green-200 mb-1">Davet bağlantısı (demo):</div>
                      <code className="text-xs text-green-100 bg-green-500/20 px-2 py-1 rounded break-all">{inviteLink}</code>
                    </div>
                    <button
                      onClick={async () => {
                        if (!inviteLink) return;
                        await navigator.clipboard.writeText(inviteLink);
                        setMsg("Davet linki kopyalandı.");
                      }}
                      className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 border border-green-500/30 hover:border-green-500/50 transition-all duration-200 text-sm font-medium w-full sm:w-auto"
                    >
                      <Copy className="h-4 w-4" />
                      Kopyala
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {team.type !== "team" && (
          <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Users className="h-4 w-4 text-white" />
              </div>
              <div className="text-sm text-amber-200">
                Üye eklemek için türü "Takım"a alın.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Notifications */}
      {(msg || err) && (
        <div className="space-y-3" aria-live="polite">
          {msg && (
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Check className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm text-green-200">{msg}</span>
            </div>
          )}
          {err && (
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/20">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">!</span>
              </div>
              <span className="text-sm text-red-200">{err}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
