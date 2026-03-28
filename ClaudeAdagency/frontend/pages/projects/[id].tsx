import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL;

const JOB_ICONS: Record<string, string> = {
  script: "📝", voice: "🎙️", video: "🎬", merge: "🎞️", post: "📲",
};

export default function ProjectPage() {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const [data, setData] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [actionLoading, setActionLoading] = useState("");

  useEffect(() => {
    if (!id) return;
    async function load() {
      const [proj, jobsRes] = await Promise.all([
        axios.get(`${API}/api/projects/${id}`),
        axios.get(`${API}/api/jobs/${id}`),
      ]);
      setData(proj.data);
      setJobs(jobsRes.data.jobs || []);
    }
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, [id]);

  async function handleAction(action: "approve" | "reject") {
    setActionLoading(action);
    await axios.post(`${API}/api/webhooks/approve/${id}?action=${action}`);
    setActionLoading("");
  }

  if (!data) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading…</div>;

  const { project, content } = data;
  const status = project?.status;

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/dashboard" className="text-brand-500 text-sm hover:underline">← Back to dashboard</Link>

        <div className="mt-6 bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold">{project.brand_name} — {project.product_name}</h1>
              <p className="text-sm text-gray-400 mt-1">Tone: {project.tone} · Audience: {project.target_audience}</p>
            </div>
            <StatusBadge status={status} />
          </div>

          {project.image_url && (
            <img src={project.image_url} alt="product" className="mt-4 h-48 rounded-xl object-contain bg-gray-800 w-full" />
          )}
        </div>

        {/* Job progress */}
        <div className="mt-6 bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="font-semibold mb-4">Pipeline</h2>
          <div className="space-y-2">
            {jobs.length === 0 && <p className="text-sm text-gray-500">Jobs will appear here once generation starts.</p>}
            {jobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between text-sm">
                <span>{JOB_ICONS[job.type] || "⚙️"} {job.type}</span>
                <JobBadge status={job.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Content preview */}
        {content && (
          <div className="mt-6 space-y-4">
            {content.final_url && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h2 className="font-semibold mb-3">Final Reel Preview</h2>
                <video src={content.final_url} controls className="w-full rounded-xl max-h-96 bg-black" />
                {status === "review" && (
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => handleAction("approve")}
                      disabled={!!actionLoading}
                      className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold py-2 rounded-lg transition"
                    >
                      {actionLoading === "approve" ? "Approving…" : "Approve & Post"}
                    </button>
                    <button
                      onClick={() => handleAction("reject")}
                      disabled={!!actionLoading}
                      className="flex-1 bg-red-800 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-2 rounded-lg transition"
                    >
                      {actionLoading === "reject" ? "Rejecting…" : "Reject"}
                    </button>
                  </div>
                )}
              </div>
            )}

            {content.script && (
              <Section title="Script">
                <p className="text-sm text-gray-300 whitespace-pre-wrap">{content.script}</p>
              </Section>
            )}

            {content.hooks?.length > 0 && (
              <Section title="Hooks">
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                  {content.hooks.map((h: string, i: number) => <li key={i}>{h}</li>)}
                </ul>
              </Section>
            )}

            {content.caption && (
              <Section title="Caption">
                <p className="text-sm text-gray-300 whitespace-pre-wrap">{content.caption}</p>
                {content.hashtags?.length > 0 && (
                  <p className="text-sm text-brand-500 mt-2">{content.hashtags.join(" ")}</p>
                )}
              </Section>
            )}

            {content.shot_list?.length > 0 && (
              <Section title="Shot List">
                <div className="space-y-2">
                  {content.shot_list.map((s: any) => (
                    <div key={s.shot} className="text-sm flex gap-3">
                      <span className="text-gray-500 w-6 shrink-0">#{s.shot}</span>
                      <span className="text-gray-300">{s.description}</span>
                      <span className="text-gray-500 shrink-0 ml-auto">{s.duration}</span>
                    </div>
                  ))}
                </div>
              </Section>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-gray-700 text-gray-300", generating: "bg-yellow-700 text-yellow-200",
    review: "bg-blue-700 text-blue-200", approved: "bg-green-700 text-green-200",
    posted: "bg-purple-700 text-purple-200", failed: "bg-red-700 text-red-200",
  };
  return <span className={`text-xs font-semibold px-2 py-1 rounded-full ${map[status] || "bg-gray-700"}`}>{status}</span>;
}

function JobBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    queued: "text-gray-400", running: "text-yellow-400", done: "text-green-400", failed: "text-red-400",
  };
  return <span className={`font-medium ${map[status] || "text-gray-400"}`}>{status}</span>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <h2 className="font-semibold mb-3">{title}</h2>
      {children}
    </div>
  );
}
