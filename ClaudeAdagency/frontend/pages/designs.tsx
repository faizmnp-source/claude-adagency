import Head from 'next/head';

type Concept = {
  id: string;
  name: string;
  vibe: string;
  bg: string;
  palette: string[];
};

const concepts: Concept[] = [
  { id: '1', name: 'Crimson Nebula 3D', vibe: 'Cinematic premium futuristic', bg: 'radial-gradient(circle at 30% 20%, rgba(229,9,20,0.35) 0%, #05070f 60%)', palette: ['#05070F', '#0E1424', '#E50914', '#7C3AED', '#9CA3AF'] },
  { id: '2', name: 'Liquid Glass Social Pro', vibe: 'Social polished transparent', bg: 'linear-gradient(135deg,#0b1020,#172554,#0b1020)', palette: ['#0B1020', '#FFFFFF22', '#FF3B5C', '#22D3EE', '#D1D5DB'] },
  { id: '3', name: 'Creator Neon Grid', vibe: 'High-energy creator motion', bg: 'linear-gradient(140deg,#070b14,#111827,#070b14)', palette: ['#070B14', '#FF1B2D', '#2563EB', '#8B5CF6', '#94A3B8'] },
  { id: '4', name: 'Enterprise AI Black Titanium', vibe: 'Trusted enterprise precision', bg: 'linear-gradient(120deg,#0a0a0b,#111827)', palette: ['#0A0A0B', '#1F2937', '#DC2626', '#10B981', '#9CA3AF'] },
  { id: '5', name: 'Aurora Motion Studio', vibe: 'Artistic premium emotional', bg: 'linear-gradient(130deg,#060916,#7c3aed55,#3b82f655)', palette: ['#060916', '#F43F5E', '#7C3AED', '#3B82F6', '#E5E7EB'] },
  { id: '6', name: 'Social Commerce Velocity', vibe: 'Performance growth focused', bg: 'linear-gradient(120deg,#0b132b,#172554)', palette: ['#0B132B', '#E11D48', '#F59E0B', '#3B82F6', '#E5E7EB'] },
  { id: '7', name: 'Minimal Luxe Mono + Red', vibe: 'Luxury minimal with red', bg: 'linear-gradient(160deg,#09090b,#18181b)', palette: ['#09090B', '#FAFAFA', '#27272A', '#71717A', '#EF4444'] },
  { id: '8', name: 'Futuristic Hologram UI', vibe: 'Experimental AI-lab', bg: 'linear-gradient(130deg,#04050a,#a855f744,#22d3ee44)', palette: ['#04050A', '#F43F5E', '#22D3EE', '#A855F7', '#E5E7EB'] },
  { id: '9', name: 'Warm Premium Human-Tech', vibe: 'Human-friendly trusted tech', bg: 'linear-gradient(135deg,#111827,#fb718533,#fdba7433)', palette: ['#111827', '#FB7185', '#FDBA74', '#60A5FA', '#E5E7EB'] },
  { id: '10', name: 'Ultra Premium 3D Dark Royale', vibe: 'Award-winning flagship', bg: 'linear-gradient(135deg,#040816,#6d28d955,#2563eb55)', palette: ['#040816', '#E50914', '#6D28D9', '#2563EB', '#E5E7EB'] },
];

export default function DesignsPage() {
  return (
    <>
      <Head>
        <title>Design Concepts Preview | TheCraftStudios</title>
      </Head>

      <main style={{ minHeight: '100vh', background: 'linear-gradient(180deg,#06070d,#0b0d14 40%)', color: '#F8FAFC', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 20px 80px' }}>
          <h1 style={{ fontSize: 'clamp(28px,4vw,44px)', margin: '0 0 10px' }}>10 Website Design Concepts — Visual Preview</h1>
          <p style={{ color: '#9CA3AF', margin: '0 0 26px' }}>Compare all concepts visually, then choose your top 2 and I will turn one into full wireframes.</p>

          <div style={{ background: '#111827', border: '1px solid #1f2937', padding: '14px 16px', borderRadius: 12, color: '#CBD5E1', marginBottom: 22 }}>
            If this page is running, you can now view everything directly at <strong>/designs</strong>.
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 16 }}>
            {concepts.map((c) => (
              <article key={c.id} style={{ borderRadius: 18, border: '1px solid rgba(255,255,255,.12)', overflow: 'hidden', background: '#121826', boxShadow: '0 10px 30px rgba(0,0,0,.28)' }}>
                <div style={{ padding: 18, minHeight: 145, background: c.bg }}>
                  <h3 style={{ margin: 0, fontSize: 18 }}>{c.id}) {c.name}</h3>
                  <small style={{ display: 'block', color: 'rgba(255,255,255,.84)', marginTop: 6 }}>{c.vibe}</small>
                  <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                    {['Home', 'Studio', 'Pricing'].map((chip) => (
                      <span key={chip} style={{ fontSize: 12, padding: '5px 8px', borderRadius: 999, border: '1px solid rgba(255,255,255,.2)', background: 'rgba(255,255,255,.08)' }}>{chip}</span>
                    ))}
                  </div>
                </div>

                <div style={{ padding: '14px 16px 18px' }}>
                  <strong style={{ fontSize: 13, color: '#CBD5E1' }}>Palette</strong>
                  <div style={{ display: 'flex', gap: 6, margin: '10px 0 12px' }}>
                    {c.palette.map((color) => (
                      <span key={color} title={color} style={{ width: 28, height: 28, borderRadius: 8, border: '1px solid rgba(255,255,255,.28)', background: color, display: 'inline-block' }} />
                    ))}
                  </div>

                  <strong style={{ fontSize: 13, color: '#CBD5E1' }}>Studio Layout Preview</strong>
                  <div style={{ display: 'grid', gridTemplateColumns: '72px 1fr 92px', gap: 8, marginTop: 8 }}>
                    {['Rail', 'Create', 'Preview'].map((block) => (
                      <div key={block} style={{ minHeight: 56, borderRadius: 10, border: '1px solid rgba(255,255,255,.18)', background: 'rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#E5E7EB' }}>
                        {block}
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
