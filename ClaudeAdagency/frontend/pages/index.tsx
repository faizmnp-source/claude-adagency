import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL;

const TONES = ["Energetic", "Luxury", "Calm", "Playful", "Inspirational", "Professional"];

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [form, setForm] = useState({
    brand_name: "",
    product_name: "",
    tone: "Energetic",
    target_audience: "",
    cta: "",
  });

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!image) return setError("Please upload a product image.");
    setLoading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("image", image);
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));

      const { data: uploadData } = await axios.post(`${API}/api/upload`, fd);
      const { data: genData } = await axios.post(`${API}/api/generate/${uploadData.project_id}`);
      router.push(`/projects/${genData.project_id}`);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <h1 className="text-3xl font-bold mb-2 text-brand-500">Instagram AI Studio</h1>
        <p className="text-gray-400 mb-8">Upload your product image and we'll generate a complete Reel.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Image upload */}
          <label className="block">
            <span className="text-sm text-gray-400">Product Image *</span>
            <div className="mt-1 border-2 border-dashed border-gray-700 rounded-xl p-4 text-center cursor-pointer hover:border-brand-500 transition">
              {preview ? (
                <img src={preview} alt="preview" className="mx-auto max-h-40 rounded-lg object-contain" />
              ) : (
                <span className="text-gray-500">Click to upload or drag & drop</span>
              )}
              <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
            </div>
          </label>

          <Field label="Brand Name" name="brand_name" value={form.brand_name} onChange={handleChange} required />
          <Field label="Product Name" name="product_name" value={form.product_name} onChange={handleChange} required />

          <label className="block">
            <span className="text-sm text-gray-400">Tone</span>
            <select name="tone" value={form.tone} onChange={handleChange} className="mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-500">
              {TONES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </label>

          <Field label="Target Audience" name="target_audience" value={form.target_audience} onChange={handleChange} placeholder="e.g. Women 25-35 interested in skincare" required />
          <Field label="Call to Action" name="cta" value={form.cta} onChange={handleChange} placeholder="e.g. Shop now at our link in bio" required />

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button type="submit" disabled={loading} className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition">
            {loading ? "Generating…" : "Generate Reel"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          <a href="/dashboard" className="text-brand-500 hover:underline">View all projects →</a>
        </p>
      </div>
    </main>
  );
}

function Field({ label, name, value, onChange, placeholder = "", required = false }: {
  label: string; name: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string; required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm text-gray-400">{label}{required && " *"}</span>
      <input
        name={name} value={value} onChange={onChange} placeholder={placeholder} required={required}
        className="mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-500"
      />
    </label>
  );
}
