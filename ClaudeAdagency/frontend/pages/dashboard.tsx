import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL;

const STATUS_COLORS: Record<string, string> = {
  pending:    "bg-gray-700 text-gray-300",
  generating: "bg-yellow-700 text-yellow-200",
  review:     "bg-blue-700 text-blue-200",
  approved:   "bg-green-700 text-green-200",
  posted:     "bg-purple-700 text-purple-200",
  failed:     "bg-red-700 text-red-200",
};

export default function Dashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await axios.get(`${API}/api/projects`);
      setProjects(data);
      setLoading(false);
    }
    load();
    const id = setInterval(load, 10000);
    return () => clearInterval(id);
  }, []);

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-brand-500">Projects</h1>
          <Link href="/" className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
            + New Project
          </Link>
        </div>

        {loading && <p className="text-gray-400">Loading…</p>}

        <div className="space-y-3">
          {projects.map((p) => (
            <Link key={p.id} href={`/projects/${p.id}`} className="block bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-brand-500 transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{p.brand_name} — {p.product_name}</p>
                  <p className="text-sm text-gray-400 mt-0.5">{new Date(p.created_at).toLocaleString()}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_COLORS[p.status] || "bg-gray-700"}`}>
                  {p.status}
                </span>
              </div>
            </Link>
          ))}
          {!loading && projects.length === 0 && (
            <p className="text-gray-500 text-center py-12">No projects yet. <Link href="/" className="text-brand-500 underline">Create one →</Link></p>
          )}
        </div>
      </div>
    </main>
  );
}
