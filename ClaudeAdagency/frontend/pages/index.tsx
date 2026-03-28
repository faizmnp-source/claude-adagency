import { useState, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL;

const TONES = [
  { label: "Energetic", emoji: "⚡" },
  { label: "Luxury",    emoji: "✦" },
  { label: "Calm",      emoji: "◌" },
  { label: "Playful",   emoji: "◈" },
  { label: "Bold",      emoji: "◆" },
  { label: "Minimal",   emoji: "—" },
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

  function handleFile(file: File) {
    setImage(file);
    setPreview(URL.createObjectURL(file));
  }

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
    <div className="relative min-h-screen z-10 flex flex-col">

      {/* ── Ambient glows ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(123,94,167,0.12) 0%, transparent 65%)" }} />
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 65%)" }} />
      </div>

      {/* ── Navigation ── */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5">
        <CraftLogo />
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="ghost-btn px-4 py-2 text-sm">My Projects</Link>
        </div>
      </nav>

      {/* ── Main split layout ── */}
      <main className="relative z-10 flex-1 grid lg:grid-cols-[1fr_480px] max-w-7xl mx-auto w-full px-6 pb-12 gap-8 items-start pt-6">

        {/* ── LEFT: Brand story ── */}
        <div className="hidden lg:flex flex-col justify-between h-full py-4">

          {/* Headline */}
          <div className="slide-up">
            <div className="pill bg-gold/10 border border-gold/20 text-gold mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              AI Content Studio
            </div>

            <h1 className="font-serif text-[56px] leading-[1.1] font-bold mb-6 tracking-tight">
              Craft reels that{" "}
              <br />
              <span className="gold-text italic">stop the scroll.</span>
            </h1>

            <p className="text-white/40 text-lg leading-relaxed max-w-md">
              Upload your product. We write the script, record the voice,
              generate the video — and post it to Instagram while you sleep.
            </p>
          </div>

          {/* Feature list */}
          <div className="mt-12 space-y-4 slide-up" style={{ animationDelay: "100ms" }}>
            {[
              { icon: "✦", title: "AI Scriptwriting", desc: "Claude writes scroll-stopping hooks in seconds" },
              { icon: "♪", title: "Voice Generation",  desc: "ElevenLabs narrates with a human-quality voice" },
              { icon: "▶", title: "Video Production",  desc: "Runway turns your image into a cinematic reel" },
              { icon: "◉", title: "Auto Publishing",   desc: "Approved reels post directly to Instagram" },
            ].map(f => (
              <div key={f.title} className="flex items-start gap-4 group">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 mt-0.5
                  bg-gold/10 border border-gold/20 text-gold group-hover:bg-gold/15 transition-colors">
                  {f.icon}
                </div>
                <div>
                  <p className="font-semibold text-sm text-white/90">{f.title}</p>
                  <p className="text-xs text-white/35 mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Stats row */}
          <div className="gold-divider my-10" />
          <div className="grid grid-cols-3 gap-6 slide-up" style={{ animationDelay: "150ms" }}>
            {[
              { value: "~3 min", label: "to generate" },
              { value: "~$1",    label: "per reel" },
              { value: "9:16",   label: "ready format" },
            ].map(s => (
              <div key={s.label}>
                <p className="gold-text font-serif text-2xl font-bold">{s.value}</p>
                <p className="text-white/30 text-xs mt-0.5 uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: Form panel ── */}
        <div className="fade-in">
          {/* Mobile headline */}
          <div className="lg:hidden mb-6 text-center">
            <CraftLogo centered />
            <h1 className="font-serif text-3xl font-bold mt-4 mb-2">
              Craft reels that <span className="gold-text italic">stop the scroll.</span>
            </h1>
          </div>

          <div className="rounded-2xl overflow-hidden border border-white/7"
            style={{ background: "var(--card)" }}>

            {/* Form header */}
            <div className="px-7 pt-7 pb-5 border-b border-white/5">
              <h2 className="font-semibold text-base text-white/90">New Project</h2>
              <p className="text-white/35 text-xs mt-1">Fill in your brand details to begin</p>
            </div>

            <form onSubmit={submit} className="px-7 py-6 space-y-5">

              {/* Image drop zone */}
              <div>
                <Label>Product Image</Label>
                <div
                  onClick={() => fileRef.current?.click()}
                  onDragOver={e => { e.preventDefault(); setDrag(true); }}
                  onDragLeave={() => setDrag(false)}
                  onDrop={onDrop}
                  className={`relative mt-1.5 cursor-pointer rounded-xl border-2 border-dashed
                    flex items-center justify-center overflow-hidden transition-all duration-200
                    ${preview ? "h-44" : "h-36"}
                    ${drag
                      ? "border-gold/60 bg-gold/5"
                      : "border-white/10 hover:border-gold/30 hover:bg-white/[0.015]"}`}
                >
                  {preview ? (
                    <>
                      <img src={preview} alt="" className="w-full h-full object-contain" />
                      <div className="absolute inset-0 bg-ink/60 flex flex-col items-center justify-center
                        opacity-0 hover:opacity-100 transition-opacity gap-1">
                        <span className="text-xs font-semibold text-white">Change image</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-white/25 py-2">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="text-center">
                        <span className="text-xs">Drop image or </span>
                        <span className="text-xs text-gold">browse</span>
                      </div>
                      <span className="text-[10px] text-white/15">PNG · JPG · WEBP</span>
                    </div>
                  )}
                  <input ref={fileRef} type="file" accept="image/*" className="hidden"
                    onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
                </div>
              </div>

              {/* Brand + Product */}
              <div className="grid grid-cols-2 gap-3">
                <Field label="Brand Name"    name="brand_name"    value={form.brand_name}    onChange={onChange} placeholder="Craft Studio" />
                <Field label="Product Name"  name="product_name"  value={form.product_name}  onChange={onChange} placeholder="Glow Serum" />
              </div>

              {/* Tone */}
              <div>
                <Label>Tone</Label>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {TONES.map(t => (
                    <button type="button" key={t.label}
                      onClick={() => setForm(f => ({ ...f, tone: t.label }))}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all duration-150
                        ${form.tone === t.label
                          ? "bg-gold/15 border-gold/40 text-gold"
                          : "bg-white/3 border-white/8 text-white/40 hover:border-gold/20 hover:text-white/70"}`}>
                      <span className="text-[10px]">{t.emoji}</span> {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Audience + CTA */}
              <Field label="Target Audience" name="target_audience" value={form.target_audience} onChange={onChange} placeholder="Women 25–35, skincare enthusiasts" />
              <Field label="Call to Action"  name="cta"             value={form.cta}             onChange={onChange} placeholder="Shop now at link in bio" />

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2.5 rounded-xl px-4 py-3 text-red-400 text-xs border
                  bg-red-500/8 border-red-500/15">
                  <svg className="w-3.5 h-3.5 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                  {error}
                </div>
              )}

              {/* Submit */}
              <button type="submit" disabled={loading} className="gold-btn w-full py-3.5 text-sm">
                {loading ? (
                  <span className="flex items-center justify-center gap-2.5">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                    </svg>
                    {step === 1 ? "Uploading…" : "Starting AI pipeline…"}
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Start Crafting
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                    </svg>
                  </span>
                )}
              </button>

            </form>

            {/* Footer note */}
            <div className="px-7 pb-6 text-center">
              <p className="text-[11px] text-white/20">
                Script · Voice · Video · Caption · Hashtags — all generated automatically
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ── Sub-components ── */

function CraftLogo({ centered = false }: { centered?: boolean }) {
  return (
    <div className={`flex items-center gap-2.5 ${centered ? "justify-center" : ""}`}>
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

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] font-semibold text-white/35 uppercase tracking-wider">{children}</p>;
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
