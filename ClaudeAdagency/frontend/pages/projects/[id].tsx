import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import Logo from "../../components/Logo";

const API = process.env.NEXT_PUBLIC_API_URL;

const PIPELINE: { key: string; label: string; icon: string }[] = [
  { key: "script", label: "AI Script",   icon: "✦" },
  { key: "voice",  label: "Voice",        icon: "♪" },
  { key: "video",  label: "Video",        icon: "▶" },
  { key: "merge",  label: "Final Edit",   icon: "◈" },
  { key: "post",   label: "Instagram",    icon: "◉" },
];

const JOB_STATUS: Record<string, { color: string; bg: string; label: string }> = {
  queued:  { color: "text-white/30", bg: "bg-white/5",           label: "Queued" },
  running: { color: "text-yellow-300", bg: "bg-yellow-500/10",   label: "Running" },
  done:    { color: "text-green-300",  bg: "bg-green-500/10",    label: "Done" },
  failed:  { color: "text-red-400",    bg: "bg-red-500/10",      label: "Failed" },
};

export default function ProjectPage() {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const [data, setData]       = useState<any>(null);
  const [jobs, setJobs]       = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [activeTab, setActiveTab] = useState<"preview"|"voice"|"script"|"caption"|"shots">("preview");

  useEffect(() => {
    if (!id) return;
    async function load() {
      try {
        const [proj, jobsRes] = await Promise.all([
          axios.get(`${API}/api/projects/${id}`),
          axios.get(`${API}/api/jobs/${id}`),
        ]);
        setData(proj.data);
        setJobs(jobsRes.data.jobs || []);
        // Auto-switch to voice tab when voice is ready and no final video yet
        const c = proj.data?.content;
        if (c?.voice_url && !c?.final_url) {
          setActiveTab(t => t === "preview" ? "voice" : t);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
    const iv = setInterval(load, 5000);
    return () => clearInterval(iv);
  }, [id]);

  async function act(action: "approve" | "reject") {
    setActionLoading(action);
    await axios.post(`${API}/api/webhooks/approve/${id}?action=${action}`);
    setActionLoading("");
  }

  if (loading) return <PageShell><div className="space-y-4">{[1,2,3].map(i => <div key={i} className="shimmer h-24 rounded-2xl" />)}</div></PageShell>;
  if (!data)   return <PageShell><p className="text-white/30 text-center py-20">Project not found.</p></PageShell>;

  const { project, content } = data;
  const status = project?.status;
  const jobMap = Object.fromEntries(jobs.map((j: any) => [j.type, j]));

  return (
    <PageShell>
      <div className="max-w-4xl mx-auto space-y-5 fade-in">

        {/* Back */}
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-white/35 hover:text-white transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Dashboard
        </Link>

        {/* Hero card */}
        <div className="glass p-6 flex gap-5 items-start">
          {project.image_url && (
            <img src={project.image_url} alt="" className="w-20 h-20 rounded-xl object-cover shrink-0 shadow-glow-sm" />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="display text-2xl lime-text leading-tight">
                  {project.brand_name}
                </h1>
                <p className="text-white/50 text-sm mt-0.5">{project.product_name}</p>
              </div>
              <StatusBadge status={status} />
            </div>
            <div className="flex flex-wrap gap-3 mt-3">
              <Chip icon="◆" label={project.tone} />
              <Chip icon="◎" label={project.target_audience} />
              <Chip icon="→" label={project.cta} />
            </div>
          </div>
        </div>

        {/* Pipeline */}
        <div className="glass p-6">
          <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-5">Pipeline</h2>
          <div className="flex items-start gap-0">
            {PIPELINE.map((step, i) => {
              const job = jobMap[step.key];
              const st = job?.status || "queued";
              const meta = JOB_STATUS[st];
              const isLast = i === PIPELINE.length - 1;
              return (
                <div key={step.key} className="flex-1 flex flex-col items-center text-center relative">
                  {/* connector line */}
                  {!isLast && (
                    <div className={`absolute top-5 left-1/2 w-full h-0.5 transition-colors duration-700
                      ${st === "done" ? "bg-gradient-to-r from-lime to-lime/20" : "bg-white/5"}`} />
                  )}
                  {/* circle */}
                  <div className={`relative z-10 w-10 h-10 rounded-sm flex items-center justify-center text-base font-bold mb-2 border transition-all duration-500
                    ${st === "done"    ? "bg-lime border-lime text-ink" : ""}
                    ${st === "running" ? "bg-yellow-500/20 border-yellow-500/50 text-yellow-300 animate-pulse" : ""}
                    ${st === "failed"  ? "bg-red-500/20 border-red-500/50 text-red-400" : ""}
                    ${st === "queued"  ? "bg-white/5 border-white/10 text-white/25" : ""}`}>
                    {st === "done" ? "✓" : step.icon}
                  </div>
                  <p className="text-xs font-semibold text-white/60">{step.label}</p>
                  <p className={`text-xs mt-0.5 ${meta.color}`}>{meta.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Content tabs */}
        {content && (
          <div className="glass overflow-hidden">
            {/* Tab bar */}
            <div className="flex border-b border-white/5">
              {[
                { key: "preview", label: "Preview", show: !!content.final_url },
                { key: "voice",   label: "Voice",   show: !!content.voice_url },
                { key: "script",  label: "Script",  show: !!content.script },
                { key: "caption", label: "Caption", show: !!content.caption },
                { key: "shots",   label: "Shots",   show: !!content.shot_list?.length },
              ].filter(t => t.show).map(t => (
                <button key={t.key} onClick={() => setActiveTab(t.key as any)}
                  className={`px-5 py-3.5 text-sm font-semibold transition-all border-b-2 -mb-px
                    ${activeTab === t.key
                      ? "border-lime text-white"
                      : "border-transparent text-white/35 hover:text-white/60"}`}>
                  {t.label}
                </button>
              ))}
            </div>

            <div className="p-6">
              {/* Video preview */}
              {activeTab === "preview" && content.final_url && (
                <div className="fade-in">
                  <video src={content.final_url} controls
                    className="w-full max-h-[500px] rounded-xl bg-black object-contain shadow-glow" />
                  {status === "review" && (
                    <div className="flex gap-3 mt-5">
                      <button onClick={() => act("approve")} disabled={!!actionLoading}
                        className="flex-1 py-3.5 rounded-xl font-semibold text-sm transition-all
                          bg-green-500/15 border border-green-500/30 text-green-300
                          hover:bg-green-500/25 hover:border-green-500/50 disabled:opacity-40">
                        {actionLoading === "approve"
                          ? <span className="flex items-center justify-center gap-2"><Spinner />Approving…</span>
                          : "✓ Approve & Post to Instagram"}
                      </button>
                      <button onClick={() => act("reject")} disabled={!!actionLoading}
                        className="px-6 py-3.5 rounded-xl font-semibold text-sm transition-all
                          bg-red-500/10 border border-red-500/20 text-red-400
                          hover:bg-red-500/20 disabled:opacity-40">
                        {actionLoading === "reject" ? <Spinner /> : "✕ Reject"}
                      </button>
                    </div>
                  )}
                  {status === "posted" && (
                    <div className="mt-4 flex items-center gap-2 bg-lime/10 border border-lime/20 rounded-sm px-4 py-3 text-lime text-sm font-semibold">
                      <span className="w-2 h-2 rounded-full bg-lime" /> Posted to Instagram
                    </div>
                  )}
                </div>
              )}

              {/* Voice */}
              {activeTab === "voice" && content.voice_url && (
                <div className="fade-in space-y-5">
                  {/* Player */}
                  <div className="rounded-2xl border border-white/7 overflow-hidden"
                    style={{ background: "var(--card)" }}>
                    <div className="px-5 pt-5 pb-3 flex items-center gap-3 border-b border-white/5">
                      <div className="w-9 h-9 rounded-sm flex items-center justify-center shrink-0"
                        style={{ background: "#C8FF00" }}>
                        <svg className="w-4 h-4 text-ink" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"/>
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white/90">Voiceover</p>
                        <p className="text-xs text-white/30 mt-0.5">Generated by ElevenLabs</p>
                      </div>
                    </div>
                    <div className="px-5 py-5">
                      <audio
                        controls
                        src={content.voice_url}
                        className="w-full"
                        style={{ accentColor: "#C8FF00" }}
                      />
                    </div>
                  </div>

                  {/* Download button */}
                  <a
                    href={content.voice_url}
                    download={`${content.project_id || "voiceover"}.mp3`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2.5 w-full py-3 rounded-sm border
                      border-lime/30 text-lime text-sm font-bold tracking-wider uppercase
                      hover:bg-lime/8 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                    </svg>
                    Download MP3
                  </a>

                  {/* Script preview under player */}
                  {content.script && (
                    <div className="rounded-xl border border-white/5 px-5 py-4"
                      style={{ background: "rgba(255,255,255,0.02)" }}>
                      <p className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-2">Script</p>
                      <p className="text-sm text-white/60 leading-relaxed">{content.script}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Script */}
              {activeTab === "script" && content.script && (
                <div className="fade-in space-y-5">
                  <div className="bg-white/[0.03] rounded-xl p-5 border border-white/5">
                    <p className="text-sm leading-relaxed text-white/80 whitespace-pre-wrap">{content.script}</p>
                  </div>
                  {content.hooks?.length > 0 && (
                    <div>
                      <h3 className="text-xs font-semibold text-white/35 uppercase tracking-wider mb-3">Hook Variants</h3>
                      <div className="space-y-2">
                        {content.hooks.map((h: string, i: number) => (
                          <div key={i} className="flex gap-3 bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3">
                            <span className="lime-text font-bold text-sm shrink-0">#{i + 1}</span>
                            <p className="text-sm text-white/70">{h}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Caption */}
              {activeTab === "caption" && content.caption && (
                <div className="fade-in space-y-4">
                  <div className="bg-white/[0.03] rounded-xl p-5 border border-white/5">
                    <p className="text-sm leading-relaxed text-white/80 whitespace-pre-wrap">{content.caption}</p>
                  </div>
                  {content.hashtags?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {content.hashtags.map((h: string, i: number) => (
                        <span key={i} className="text-xs px-2.5 py-1 rounded-sm bg-lime/10 border border-lime/20 text-lime font-medium">{h}</span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Shot list */}
              {activeTab === "shots" && content.shot_list?.length > 0 && (
                <div className="fade-in space-y-2">
                  {content.shot_list.map((s: any) => (
                    <div key={s.shot} className="flex items-center gap-4 bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3">
                      <span className="w-7 h-7 rounded-sm bg-lime/10 border border-lime/20 flex items-center justify-center text-xs font-bold text-lime shrink-0">{s.shot}</span>
                      <p className="text-sm text-white/70 flex-1">{s.description}</p>
                      <span className="text-xs text-white/25 shrink-0">{s.camera}</span>
                      <span className="text-xs font-mono text-lime shrink-0">{s.duration}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Generating state */}
        {!content && status === "generating" && (
          <div className="glass p-10 text-center fade-in">
            <div className="w-16 h-16 rounded-sm bg-lime/20 border border-lime/30 mx-auto mb-4 flex items-center justify-center animate-pulse">
              <svg className="w-8 h-8 text-white animate-spin-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="display text-2xl text-white mb-1">AI IS WORKING ITS MAGIC</h2>
            <p className="text-white/35 text-sm">Script → Voice → Video → Merge. This takes ~3 minutes.</p>
          </div>
        )}
      </div>
    </PageShell>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen z-10 bg-ink">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/6">
        <Logo size="small" />
        <Link href="/" className="lime-btn px-5 py-2.5 text-sm inline-flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Reel
        </Link>
      </nav>
      <main className="px-6 py-8">{children}</main>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending:    "bg-white/5 border-white/10 text-white/40",
    generating: "bg-yellow-500/10 border-yellow-500/20 text-yellow-300",
    review:     "bg-blue-500/10 border-blue-500/20 text-blue-300",
    approved:   "bg-green-500/10 border-green-500/20 text-green-300",
    posted:     "bg-lime/10 border-lime/20 text-lime",
    failed:     "bg-red-500/10 border-red-500/20 text-red-400",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold shrink-0 ${map[status] || map.pending}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </span>
  );
}

function Chip({ icon, label }: { icon: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs bg-white/5 border border-white/8 rounded-full px-3 py-1 text-white/40">
      <span className="text-lime">{icon}</span>
      {label}
    </span>
  );
}

function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin inline" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}
