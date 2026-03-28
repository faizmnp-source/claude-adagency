import { useState, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL;
const TONES = ["Energetic","Luxury","Calm","Playful","Inspirational","Professional","Bold","Minimalist"];

export default function Home() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [drag, setDrag] = useState(false);
  const [step, setStep] = useState(0); // 0 = idle, 1 = uploading, 2 = generating
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
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) handleFile(file);
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!image) return setError("Please upload a product image.");
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
      setError(err?.response?.data?.detail || "Something went wrong. Try again.");
      setLoading(false); setStep(0);
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col z-10">

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5">
        <Logo />
        <Link href="/dashboard" className="text-sm text-white/50 hover:text-white transition-colors">
          My Projects →
        </Link>
      </nav>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl fade-in">

          {/* Hero text */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-xs text-white/60 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              AI-Powered · Instagram Reels · Auto-Post
            </div>
            <h1 className="font-display text-5xl font-extrabold leading-tight mb-4">
              Turn any product into a{" "}
              <span className="grad-text">viral Reel</span>
            </h1>
            <p className="text-white/40 text-lg max-w-md mx-auto">
              Upload your product image, describe your brand, and we handle everything — script, voice, video, posting.
            </p>
          </div>

          {/* Card */}
          <div className="glass p-8 shadow-glow">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Image Upload */}
              <div
                onClick={() => fileRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDrag(true); }}
                onDragLeave={() => setDrag(false)}
                onDrop={onDrop}
                className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden
                  ${drag ? "border-brand-500 shadow-glow bg-brand-700/10" : "border-white/10 hover:border-brand-500/60 hover:bg-white/[0.02]"}
                  ${preview ? "h-52" : "h-40"}`}
              >
                {preview ? (
                  <>
                    <img src={preview} alt="preview" className="w-full h-full object-contain" />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <span className="text-sm font-medium">Change image</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-2 text-white/30">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm">Drop product image here or <span className="text-brand-400">browse</span></span>
                    <span className="text-xs">PNG, JPG up to 10MB</span>
                  </div>
                )}
                <input ref={fileRef} type="file" accept="image/*" className="hidden"
                  onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
              </div>

              {/* Two-col grid */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="Brand Name" name="brand_name" value={form.brand_name} onChange={onChange} placeholder="e.g. Luminary" required />
                <Field label="Product Name" name="product_name" value={form.product_name} onChange={onChange} placeholder="e.g. Glow Serum" required />
              </div>

              {/* Tone pills */}
              <div>
                <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Tone</label>
                <div className="flex flex-wrap gap-2">
                  {TONES.map(t => (
                    <button type="button" key={t} onClick={() => setForm(f => ({ ...f, tone: t }))}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200
                        ${form.tone === t
                          ? "bg-brand-600 border-brand-500 text-white shadow-glow-sm"
                          : "bg-white/5 border-white/10 text-white/50 hover:border-brand-500/50 hover:text-white"}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <Field label="Target Audience" name="target_audience" value={form.target_audience}
                onChange={onChange} placeholder="e.g. Women 25–35 interested in skincare" required />
              <Field label="Call to Action" name="cta" value={form.cta}
                onChange={onChange} placeholder="e.g. Shop now at the link in bio" required />

              {error && (
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
                  <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading} className="grad-btn w-full py-4 text-base">
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    {step === 1 ? "Uploading image…" : "Firing up the AI…"}
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Generate My Reel
                  </span>
                )}
              </button>
            </form>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            {[
              { label: "Reel generated in", value: "~3 min" },
              { label: "Cost per reel", value: "~$1" },
              { label: "Auto-posts to", value: "Instagram" },
            ].map(s => (
              <div key={s.label} className="glass text-center py-4 px-2">
                <p className="grad-text font-display text-xl font-bold">{s.value}</p>
                <p className="text-white/35 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-xl bg-grad-brand flex items-center justify-center shadow-glow-sm">
        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <span className="font-display font-bold text-lg">ReelAI</span>
    </div>
  );
}

function Field({ label, name, value, onChange, placeholder = "", required = false }: {
  label: string; name: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">{label}</label>
      <input name={name} value={value} onChange={onChange} placeholder={placeholder} required={required}
        className="fancy-input" />
    </div>
  );
}
