import { useState, useRef, useEffect } from "react";
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

const GALLERY_IMAGES = [
  { src: "/portfolio/work1.jpg", label: "Brand Visual" },
  { src: "/portfolio/work2.jpg", label: "Creative Shot" },
  { src: "/portfolio/work3.jpg", label: "Product Story" },
  { src: "/portfolio/work4.jpg", label: "Campaign Art" },
  { src: "/portfolio/work5.jpg", label: "Visual Identity" },
];

const PLANS = [
  {
    name: "STARTER",
    price: "₹4,999",
    usd: "$60",
    period: "/month",
    reels: "4",
    highlight: false,
    features: [
      "4 AI-generated Reels",
      "Script + Voiceover + Video",
      "Instagram Auto-Post",
      "Caption & Hashtags",
      "3-day delivery",
      "Email support",
    ],
    cta: "Get Started",
  },
  {
    name: "GROWTH",
    price: "₹8,999",
    usd: "$108",
    period: "/month",
    reels: "8",
    highlight: true,
    features: [
      "8 AI-generated Reels",
      "Script + Voiceover + Video",
      "Instagram Auto-Post",
      "Caption & Hashtags",
      "1-day delivery",
      "WhatsApp delivery",
      "Priority support",
      "Performance report",
    ],
    cta: "Most Popular →",
  },
  {
    name: "AGENCY",
    price: "₹18,999",
    usd: "$228",
    period: "/month",
    reels: "20",
    highlight: false,
    features: [
      "20 AI-generated Reels",
      "Script + Voiceover + Video",
      "Instagram Auto-Post",
      "Caption & Hashtags",
      "Same-day delivery",
      "WhatsApp delivery",
      "Dedicated account manager",
      "Monthly analytics report",
      "Custom brand tone setup",
      "Bulk scheduling calendar",
    ],
    cta: "Contact Us",
  },
];

export default function Home() {
  const router  = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading]   = useState(false);
  const [step,    setStep]      = useState(0);
  const [error,   setError]     = useState("");
  const [image,   setImage]     = useState<File | null>(null);
  const [preview, setPreview]   = useState("");
  const [drag,    setDrag]      = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [form, setForm] = useState({
    brand_name: "", product_name: "", tone: "Energetic",
    target_audience: "", cta: "",
  });

  // 5-second cinematic intro
  useEffect(() => {
    const t = setTimeout(() => setIntroDone(true), 5000);
    return () => clearTimeout(t);
  }, []);

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
    <>
      {/* ── CINEMATIC INTRO ── */}
      <div className={`fixed inset-0 z-50 bg-ink flex flex-col items-center justify-center transition-opacity duration-1000 ${introDone ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
        <div className="absolute inset-0 overflow-hidden">
          <video
            src="/portfolio/reel1.mp4"
            autoPlay muted playsInline loop
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0" style={{
            background: "linear-gradient(to bottom, rgba(8,8,8,0.55) 0%, rgba(8,8,8,0.2) 50%, rgba(8,8,8,0.85) 100%)"
          }} />
        </div>
        <div className="relative z-10 text-center px-6">
          <p className="text-white/30 tracking-[0.4em] text-xs uppercase mb-6">Welcome to</p>
          <div className="display text-[clamp(40px,9vw,110px)] text-white leading-none tracking-widest"
            style={{ textShadow: "0 0 80px rgba(168,85,247,0.5)" }}>
            <span style={{
              display: "inline-block",
              borderBottom: "3px solid #A855F7",
              paddingBottom: "4px"
            }}>T</span>HECRAFT STU
            <span style={{ color: "#A855F7", textShadow: "0 0 24px rgba(168,85,247,1)" }}>i</span>OS.
          </div>
          <p className="text-white/35 tracking-[0.22em] text-sm uppercase mt-5">
            CRAFTING VISUAL GROWTH · FROM REELS TO SITES
          </p>
          {/* Loading line */}
          <div className="mt-10 w-40 h-px bg-white/10 mx-auto overflow-hidden">
            <div className="h-full" style={{
              background: "#A855F7",
              animation: "introBar 5s linear forwards"
            }} />
          </div>
        </div>
        <style>{`@keyframes introBar { from { width: 0% } to { width: 100% } }`}</style>
      </div>

      {/* ── MAIN PAGE ── */}
      <div className="relative min-h-screen flex flex-col bg-ink">

        {/* ── NAV ── */}
        <nav className="flex items-center justify-between px-8 py-5 border-b border-white/6 sticky top-0 bg-ink/95 z-40"
          style={{ backdropFilter: "blur(12px)" }}>
          <CraftLogo />
          <div className="hidden md:flex items-center gap-8">
            <a href="#work"    className="text-sm text-white/40 hover:text-white transition-colors tracking-wide">Work</a>
            <a href="#pricing" className="text-sm text-white/40 hover:text-white transition-colors tracking-wide">Pricing</a>
            <a href="mailto:info@thecraftstudios.in"
              className="text-sm text-white/40 hover:text-violet-400 transition-colors tracking-wide">
              info@thecraftstudios.in
            </a>
          </div>
          <Link href="/dashboard" className="ghost-btn px-4 py-2 text-sm tracking-wide">
            My Projects →
          </Link>
        </nav>

        {/* ── HERO ── */}
        <section className="flex-1 grid lg:grid-cols-[1fr_460px] max-w-[1400px] mx-auto w-full">

          {/* LEFT */}
          <div className="relative flex flex-col justify-between px-8 lg:px-16 py-14 border-r border-white/6 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse 80% 60% at 15% 50%, rgba(124,58,237,0.25) 0%, transparent 70%)" }} />

            <div className="relative z-10">
              <div className="pill bg-violet/20 text-violet-300 border border-violet/30 mb-10 w-fit">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#A78BFA" }} />
                AI Content Studio · thecraftstudios.in
              </div>

              <h1 className="display text-[clamp(64px,8vw,118px)] text-white leading-none mb-6">
                UNLOCK<br />
                <span style={{ color: "#C8FF00" }}>YOUR</span><br />
                STYLE.
              </h1>

              <p className="text-white/50 text-base leading-relaxed max-w-md mb-10">
                Upload your product image. We write the script, record the voice,
                render the video — and post it to Instagram automatically.
              </p>

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

            <div className="relative z-10 border border-white/10 rounded-sm overflow-hidden">
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
              <div className="mt-2" style={{ height: 2, width: 32, background: "#A855F7", borderRadius: 1 }} />
            </div>

            <form onSubmit={submit} className="flex flex-col gap-5 flex-1">
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
                    ${drag ? "border-violet/60 bg-violet/5" : "border-white/10 hover:border-violet/40 hover:bg-white/[0.015]"}`}
                >
                  {preview ? (
                    <>
                      <img src={preview} alt="" className="w-full h-full object-contain" />
                      <div className="absolute inset-0 bg-ink/70 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "#A855F7" }}>Change Image</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-white/20">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                      <span className="text-xs tracking-wider">DROP IMAGE OR <span style={{ color: "#C8FF00" }}>BROWSE</span></span>
                      <span className="text-[10px] text-white/15">Auto-enhanced · background removed · upscaled</span>
                    </div>
                  )}
                  <input ref={fileRef} type="file" accept="image/*" className="hidden"
                    onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Brand"   name="brand_name"   value={form.brand_name}   onChange={onChange} placeholder="The Craft Studios" />
                <Field label="Product" name="product_name" value={form.product_name} onChange={onChange} placeholder="Glow Serum" />
              </div>

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
                    {step === 1 ? "UPLOADING & ENHANCING..." : "STARTING PIPELINE..."}
                  </span>
                ) : "START CRAFTING →"}
              </button>
            </form>
          </div>
        </section>

        {/* ── OUR WORK ── */}
        <section id="work" className="border-t border-white/6 py-20 px-8 max-w-[1400px] mx-auto w-full">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="pill bg-violet/10 text-violet-300 border border-violet/20 mb-5 w-fit">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#A78BFA" }} />
                Our Work
              </div>
              <h2 className="display text-[clamp(36px,5vw,80px)] text-white leading-none">
                REELS WE<br />
                <span style={{ color: "#A855F7" }}>CRAFTED.</span>
              </h2>
            </div>
            <p className="text-white/20 text-sm max-w-[220px] text-right hidden md:block leading-relaxed">
              Every piece generated from a single product image. No studio. No filming.
            </p>
          </div>

          {/* Featured video — full width */}
          <div className="relative rounded-sm overflow-hidden mb-4 group"
            style={{ border: "1px solid rgba(168,85,247,0.2)" }}>
            <video
              src="/portfolio/reel1.mp4"
              autoPlay muted playsInline loop
              className="w-full max-h-[520px] object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-6 flex items-center gap-3">
              <span className="w-7 h-7 rounded-full flex items-center justify-center"
                style={{ background: "rgba(168,85,247,0.4)", border: "1px solid rgba(168,85,247,0.6)" }}>
                <svg className="w-3 h-3 ml-0.5" style={{ color: "#C4B5FD" }} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                </svg>
              </span>
              <span className="text-xs text-white/50 tracking-widest uppercase">Featured Reel</span>
            </div>
            {/* Purple corner accent */}
            <div className="absolute top-0 left-0 w-16 h-1" style={{ background: "#A855F7" }} />
          </div>

          {/* Image grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {GALLERY_IMAGES.map((item, i) => (
              <div key={i} className="relative rounded-sm overflow-hidden group aspect-square"
                style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                <img
                  src={item.src}
                  alt={item.label}
                  className="w-full h-full object-cover opacity-75 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-2 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-[10px] text-white/60 tracking-widest uppercase">{item.label}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── PRICING ── */}
        <section id="pricing" className="border-t border-white/6 py-20 px-8 max-w-[1400px] mx-auto w-full">
          <div className="text-center mb-14">
            <div className="pill bg-lime/10 text-lime border border-lime/20 mb-5 mx-auto w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-lime" />
              Simple Pricing
            </div>
            <h2 className="display text-[clamp(40px,6vw,90px)] text-white leading-none mb-4">
              PLANS &amp; <span style={{ color: "#C8FF00" }}>PRICING.</span>
            </h2>
            <p className="text-white/35 text-sm max-w-md mx-auto">
              No hidden fees. Cancel anytime. All plans include AI script, voice, video and Instagram posting.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {PLANS.map((plan) => (
              <div key={plan.name}
                className="relative flex flex-col rounded-sm overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: plan.highlight ? "rgba(168,85,247,0.08)" : "rgba(255,255,255,0.02)",
                  border: plan.highlight ? "1px solid rgba(168,85,247,0.4)" : "1px solid rgba(255,255,255,0.08)",
                  boxShadow: plan.highlight ? "0 0 40px rgba(168,85,247,0.12)" : "none",
                }}>

                {plan.highlight && (
                  <div className="absolute top-0 inset-x-0 h-0.5" style={{ background: "#A855F7" }} />
                )}
                {plan.highlight && (
                  <div className="absolute top-3 right-4">
                    <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-sm"
                      style={{ background: "#A855F7", color: "#fff" }}>POPULAR</span>
                  </div>
                )}

                <div className="p-7 flex-1">
                  <p className="display text-xl text-white/50 tracking-widest mb-4">{plan.name}</p>

                  <div className="flex items-end gap-2 mb-1">
                    <span className="display text-[52px] text-white leading-none">{plan.price}</span>
                    <span className="text-white/30 text-sm mb-2">{plan.period}</span>
                  </div>
                  <p className="text-white/20 text-xs mb-6">{plan.usd} USD equivalent</p>

                  <div className="flex items-center gap-2 mb-8 px-3 py-2 rounded-sm"
                    style={{ background: "rgba(200,255,0,0.06)", border: "1px solid rgba(200,255,0,0.1)" }}>
                    <span className="display text-2xl" style={{ color: "#C8FF00" }}>{plan.reels}</span>
                    <span className="text-xs text-white/40 uppercase tracking-wider">Reels per month</span>
                  </div>

                  <ul className="space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-sm text-white/60">
                        <svg className="w-3.5 h-3.5 shrink-0" style={{ color: plan.highlight ? "#A855F7" : "#C8FF00" }}
                          fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="px-7 pb-7">
                  <a href="mailto:info@thecraftstudios.in?subject=Plan enquiry"
                    className={`block w-full py-3.5 text-center text-sm font-bold uppercase tracking-wider rounded-sm transition-all ${
                      plan.highlight
                        ? "text-white hover:opacity-90"
                        : "border border-white/15 text-white/60 hover:border-white/30 hover:text-white"
                    }`}
                    style={plan.highlight ? { background: "#A855F7" } : {}}>
                    {plan.cta}
                  </a>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-white/15 text-xs mt-8 tracking-wider">
            ₹2,000 one-time onboarding fee · All prices + GST · Custom enterprise plans available
          </p>
        </section>

        {/* ── FOOTER ── */}
        <footer className="border-t border-white/6 px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-6">
            <CraftLogo />
            <span className="text-white/10 hidden md:block">|</span>
            <p className="text-xs text-white/20 tracking-wider hidden md:block">
              thecraftstudios.in
            </p>
          </div>
          <div className="flex items-center gap-6">
            <a href="#pricing" className="text-xs text-white/20 hover:text-white transition-colors tracking-wide">Pricing</a>
            <a href="#work" className="text-xs text-white/20 hover:text-white transition-colors tracking-wide">Work</a>
            <a href="mailto:info@thecraftstudios.in"
              className="text-xs text-white/20 hover:text-violet-400 transition-colors tracking-wide">
              info@thecraftstudios.in
            </a>
          </div>
          <p className="text-xs text-white/15">© 2026 <span style={{ color: "#A78BFA" }}>THECRAFTSTUDIOS.</span></p>
        </footer>

      </div>
    </>
  );
}

function CraftLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex items-center justify-center w-9 h-9"
        style={{
          border: "2px solid #A855F7",
          borderRadius: 3,
          boxShadow: "0 0 14px rgba(168,85,247,0.35)",
          background: "rgba(168,85,247,0.1)"
        }}>
        <span className="display text-[18px] text-white leading-none">T</span>
      </div>
      <div className="leading-none">
        <span className="display text-[15px] text-white tracking-widest">
          HECRAFT STU
          <span style={{ color: "#A855F7", textShadow: "0 0 12px rgba(168,85,247,0.8)" }}>i</span>OS.
        </span>
        <p className="text-[7px] text-white/25 tracking-[0.15em] uppercase mt-0.5">Crafting Visual Growth</p>
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
