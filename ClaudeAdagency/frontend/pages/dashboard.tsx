import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL;

const STATUS_META: Record<string, { label: string; color: string; dot: string }> = {
  pending:    { label: "Pending",    color: "bg-white/5 text-white/40 border-white/10",         dot: "bg-white/30" },
  generating: { label: "Generating", color: "bg-yellow-500/10 text-yellow-300 border-yellow-500/20", dot: "bg-yellow-400 animate-pulse" },
  review:     { label: "Review",     color: "bg-blue-500/10 text-blue-300 border-blue-500/20",     dot: "bg-blue-400 animate-pulse" },
  approved:   { label: "Approved",   color: "bg-green-500/10 text-green-300 border-green-500/20",  dot: "bg-green-400" },
  posted:     { label: "Posted",     color: "bg-brand-500/10 text-brand-400 border-brand-500/20",  dot: "bg-brand-400" },
  failed:     { label: "Failed",     color: "bg-red-500/10 text-red-400 border-red-500/20",        dot: "bg-red-400" },
};

const TONE_COLORS: Record<string, string> = {
  Energetic: "text-orange-400", Luxury: "text-yellow-400", Calm: "text-blue-400",
  Playful: "text-pink-400", Inspirational: "text-purple-400", Professional: "text-slate-400",
  Bold: "text-red-400", Minimalist: "text-gray-400",
};

export default function Dashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    async function load() {
      try {
        const { data } = await axios.get(`${API}/api/projects`);
        setProjects(data);
      } finally {
        setLoading(false);
      }
    }
    load();
    const id = setInterval(load, 8000);
    return () => clearInterval(id);
  }, []);

  const filtered = filter === "all" ? projects : projects.filter(p => p.status === filter);
  const counts = projects.reduce((acc, p) => ({ ...acc, [p.status]: (acc[p.status] || 0) + 1 }), {} as Record<string, number>);

  return (
    <div className="relative min-h-screen z-10">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/5">
        <Logo />
        <Link href="/" className="gold-btn px-5 py-2.5 text-sm inline-flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Reel
        </Link>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8 fade-in">
          <h1 className="font-display text-3xl font-extrabold grad-text mb-1">Your Projects</h1>
          <p className="text-white/35 text-sm">{projects.length} reel{projects.length !== 1 ? "s" : ""} created</p>
        </div>

        {/* Stats bar */}
        {projects.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 fade-in">
            {[
              { label: "Total", value: projects.length, color: "text-white" },
              { label: "Generating", value: counts.generating || 0, color: "text-yellow-300" },
              { label: "Ready to Review", value: counts.review || 0, color: "text-blue-300" },
              { label: "Posted", value: counts.posted || 0, color: "text-brand-400" },
            ].map(s => (
              <div key={s.label} className="glass px-5 py-4">
                <p className={`font-display text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-white/35 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Filter tabs */}
        {projects.length > 0 && (
          <div className="flex gap-2 mb-6 flex-wrap">
            {["all", "generating", "review", "posted", "failed"].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200
                  ${filter === f
                    ? "bg-brand-600 border-brand-500 text-white"
                    : "bg-white/5 border-white/10 text-white/40 hover:border-brand-500/40 hover:text-white"}`}>
                {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
                {f !== "all" && counts[f] ? ` · ${counts[f]}` : ""}
              </button>
            ))}
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="shimmer h-24 rounded-2xl" />)}
          </div>
        )}

        {/* Empty state */}
        {!loading && projects.length === 0 && (
          <div className="glass text-center py-20 fade-in">
            <div className="w-16 h-16 rounded-2xl bg-grad-brand mx-auto mb-4 flex items-center justify-center shadow-glow">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M15 10l4.553-2.069A1 1 0 0121 8.882v6.236a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
              </svg>
            </div>
            <h2 className="font-display text-xl font-bold mb-2">No reels yet</h2>
            <p className="text-white/35 text-sm mb-6">Create your first AI-powered Instagram Reel</p>
            <Link href="/" className="gold-btn px-6 py-3 inline-block">Create First Reel</Link>
          </div>
        )}

        {/* Project grid */}
        <div className="space-y-3">
          {filtered.map((p, i) => {
            const meta = STATUS_META[p.status] || STATUS_META.pending;
            return (
              <Link key={p.id} href={`/projects/${p.id}`}
                className="glass glass-hover flex items-center gap-5 px-6 py-5 fade-in block"
                style={{ animationDelay: `${i * 60}ms` }}>

                {/* Thumbnail placeholder */}
                <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-white/5">
                  {p.image_url
                    ? <img src={p.image_url} alt="" className="w-full h-full object-cover" />
                    : <div className="w-full h-full bg-grad-subtle" />}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{p.brand_name} — {p.product_name}</p>
                  <p className={`text-xs mt-0.5 font-medium ${TONE_COLORS[p.tone] || "text-white/40"}`}>{p.tone}</p>
                  <p className="text-white/25 text-xs mt-1">{new Date(p.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                </div>

                {/* Status */}
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold shrink-0 ${meta.color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                  {meta.label}
                </div>

                <svg className="w-4 h-4 text-white/20 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: "linear-gradient(135deg, #C9A84C, #9D7A2A)", boxShadow: "0 4px 16px rgba(201,168,76,0.25)" }}>
        <svg className="w-4 h-4 text-ink" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
        </svg>
      </div>
      <div>
        <span className="font-semibold text-[15px] text-white tracking-tight leading-none block">Craft Studio</span>
        <span className="text-[9px] text-white/25 tracking-[0.12em] uppercase leading-none">AI Content</span>
      </div>
    </div>
  );
}
