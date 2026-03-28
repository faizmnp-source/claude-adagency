import { useState, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL;

const TONES = [
  { label: "Energetic", sym: "⚡" },
  { label: "Luxury",    sym: "◆" },
  { label: "Calm",      sym: "○" },
  { label: "Playful",   sym: "◈" },
  { label: "Bold",      sym: "▲" },
  { label: "Minimal",   sym: "—" },
];

export default function Home() {
  const router  = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [step,    setStep]    = useState(0);
  const [error,   setError]   = useState("");
  const [image,   setImage]   = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [drag,    setDrag]    = useState(false);
  const [form, setForm] = useState({
    brand_name: "", product_name: "", tone: "Energetic",
    target_audience: "", cta: "",
  });

  function handleFile(file: File) { setImage(file); setPreview(URL.createObjectURL(file)); }

  function onDrop(e: React.DragEvent) {
    e.preventDefault(); setDrag(false);
    const f = e.dataTransfer.files?.[0];
    if (f?.type.startsWith("image/")) handleFile(f);
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!image) return setError("Please add a product image.");
    setLoading(true); setError("");
    try {
      setStep(1);
      const fd = new FormData();
      fd.append("image", image);
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      const { data: up } = await axios.post(`${API}/api/upload`, fd);
      setStep(2);
      const { data: gen } = await axios.post(`${API}/api/generate/${up.project_id}`);
      router.push(`/projects/${gen.project_id}`);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Something went wrong. Please try again.");
      setLoading(false); setStep(0);
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-ink">

      {/* ── NAV ── */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/6 bg-ink z-10">
        <CraftLogo />
        <div className="hidden md:flex items-center gap-8">
          <a href="mailto:info@thecraftstudios.in"
            className="text-sm text-white/40 hover:text-violet transition-colors tracking-wide">
            info@thecraftstudios.in
          </a>
          {["Features", "Pricing"].map(l => (
            <a key={l} href="#" className="text-sm text-white/40 hover:text-white transition-colors tracking-wide">{l}</a>
          ))}
        </div>
        <Link href="/dashboard" className="ghost-btn px-4 py-2 text-sm tracking-wide">
          My Projects →
        </Link>
      </nav>

      {/* ── HERO ── */}
      <main className="flex-1 grid lg:grid-cols-[1fr_460px] max-w-[1400px] mx-auto w-full">

        {/* LEFT — Purple hero */}
        <div className="relative flex flex-col justify-between px-8 lg:px-16 py-14 border-r border-white/6 overflow-hidden">

          {/* Purple background gradient */}
          <div className="absolute inset-0 bg-violet/20 pointer-events-none" />
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 80% 60% at 20% 50%, rgba(124,58,237,0.35) 0%, transparent 70%)" }} />

          <div className="relative z-10">
            {/* Badge */}
            <div className="pill bg-violet/20 text-violet-300 border border-violet/30 mb-10 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-violet animate-pulse" style={{ background: "#A78BFA" }} />
              AI Content Studio · thecraftstudios.in
            </div>

            {/* Giant headline */}
            <h1 className="display text-[clamp(64px,8vw,120px)] text-white leading-none mb-6">
              UNLOCK<br />
              <span style={{ color: "#C8FF00" }}>YOUR</span><br />
              STYLE.
            </h1>

            <p className="text-white/50 text-base leading-relaxed max-w-md mb-10">
              Upload your product image. We write the script, record the voice,
              render the video — and post it to Instagram automatically.
            </p>

            {/* Stats row */}
            <div className="flex items-center gap-10 mb-14">
              {[
                { value: "~3 MIN",    label: "To generate" },
                { value: "~$1",       label: "Per reel" },
                { value: "AUTO-POST", label: "To Instagram" },
              ].map(s => (
                <div key={s.label}>
                  <p className="display text-2xl" style={{ color: "#C8FF00" }}>{s.value}</p>
                  <p className="text-[10px] text-white/30 tracking-wider uppercase mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pipeline steps */}
          <div className="relative z-10 space-y-0 border border-white/10 rounded-sm overflow-hidden">
            {[
              { n: "01", title: "Script",  desc: "Claude writes hooks, shots & caption" },
              { n: "02", title: "Voice",   desc: "ElevenLabs records natural narration" },
              { n: "03", title: "Video",   desc: "Runway turns your image into a reel" },
              { n: "04", title: "Publish", desc: "Auto-posts to Instagram on approval" },
            ].map((s, i) => (
              <div key={s.n}
                className={`flex items-center gap-5 px-5 py-4 ${i < 3 ? "border-b border-white/5" : ""} group hover:bg-violet/10 transition-colors`}>
                <span className="display text-xl w-8 shrink-0" style={{ color: "#C8FF00" }}>{s.n}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white/80 uppercase tracking-wide">{s.title}</p>
                  <p className="text-xs text-white/30 mt-0.5">{s.desc}</p>
                </div>
                <svg className="w-4 h-4 text-white/10 group-hover:text-violet-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7"/>
                </svg>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Form */}
        <div className="flex flex-col px-8 py-14 bg-surface/50">

          <div className="mb-6">
            <h2 className="display text-3xl text-white tracking-wide">NEW PROJECT</h2>
            <div className="mt-2" style={{ height: 2, width: 32, background: "#7C3AED", borderRadius: 1 }} />
          </div>

          <form onSubmit={submit} className="flex flex-col gap-5 flex-1">

            {/* Image upload */}
            <div>
              <Label>Product Image</Label>
              <div
                onClick={() => fileRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDrag(true); }}
                onDragLeave={() => setDrag(false)}
                onDrop={onDrop}
                className={`mt-1.5 cursor-pointer rounded-sm border-2 border-dashed overflow-hidden
                  flex items-center justify-center transition-all duration-200
                  ${preview ? "h-48" : "h-36"}
                  ${drag
                    ? "border-violet/60 bg-violet/5"
                    : "border-white/10 hover:border-violet/40 hover:bg-white/[0.015]"}`}
              >
                {preview ? (
                  <>
                    <img src={preview} alt="" className="w-full h-full object-contain" />
                    <div className="absolute inset-0 bg-ink/70 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <span className="text-xs font-bold text-violet-300 tracking-widest uppercase">Change</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-white/20">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    <span className="text-xs tracking-wider">DROP IMAGE OR <span style={{ color: "#C8FF00" }}>BROWSE</span></span>
                  </div>
                )}
                <input ref={fileRef} type="file" accept="image/*" className="hidden"
                  onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
              </div>
            </div>

            {/* Brand + Product */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Brand"   name="brand_name"   value={form.brand_name}   onChange={onChange} placeholder="The Craft Studios" />
              <Field label="Product" name="product_name" value={form.product_name} onChange={onChange} placeholder="Glow Serum" />
            </div>

            {/* Tone */}
            <div>
              <Label>Tone</Label>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {TONES.map(t => (
                  <button type="button" key={t.label}
                    onClick={() => setForm(f => ({ ...f, tone: t.label }))}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm border text-xs font-bold uppercase tracking-wider transition-all
                      ${form.tone === t.label
                        ? "text-ink border-lime"
                        : "bg-transparent border-white/10 text-white/35 hover:border-violet/40 hover:text-white/60"}`}
                    style={form.tone === t.label ? { background: "#C8FF00" } : {}}>
                    <span className="text-[10px]">{t.sym}</span>{t.label}
                  </button>
                ))}
              </div>
            </div>

            <Field label="Target Audience" name="target_audience" value={form.target_audience} onChange={onChange} placeholder="Women 25–35, skincare" />
            <Field label="Call to Action"  name="cta"             value={form.cta}             onChange={onChange} placeholder="Shop now at link in bio" />

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/8 border border-red-500/15 rounded-sm px-3 py-2.5">
                <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="lime-btn py-4 text-sm mt-auto">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                  {step === 1 ? "UPLOADING..." : "STARTING PIPELINE..."}
                </span>
              ) : "START CRAFTING →"}
            </button>

          </form>
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/6 px-8 py-4 flex items-center justify-between">
        <p className="text-xs text-white/20 tracking-wider">
          © 2026 <span style={{ color: "#A78BFA" }}>THECRAFTSTUDIOS.</span> · thecraftstudios.in
        </p>
        <a href="mailto:info@thecraftstudios.in"
          className="text-xs text-white/20 hover:text-violet-400 transition-colors tracking-wide">
          info@thecraftstudios.in
        </a>
      </footer>

    </div>
  );
}

function CraftLogo() {
  return (
    <div className="flex items-center gap-3">
      {/* Logo mark — purple "i" gem */}
      <div className="relative w-8 h-8 flex items-center justify-center rounded-sm bg-ink border border-violet/40">
        <span className="display text-[20px] text-white leading-none">i</span>
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full"
          style={{ background: "#A855F7", boxShadow: "0 0 8px rgba(168,85,247,0.8)" }} />
      </div>
      <div className="leading-none">
        {/* THECRAFTSTU + purple i + OS. */}
        <span className="display text-[16px] text-white tracking-widest">
          THECRAFTSTU
          <span style={{ color: "#A855F7" }}>D</span>
          <span style={{ color: "#A855F7", textShadow: "0 0 12px rgba(168,85,247,0.6)" }}>i</span>
          OS.
        </span>
        <p className="text-[8px] text-white/25 tracking-[0.15em] uppercase mt-0.5">
          Crafting Visual Growth
        </p>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{children}</p>;
}

function Field({ label, name, value, onChange, placeholder = "" }: {
  label: string; name: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <input name={name} value={value} onChange={onChange} placeholder={placeholder}
        className="fancy-input mt-1.5" />
    </div>
  );
}
