import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import NavBar from '../../components/NavBar';
import { 
  ChevronLeft, 
  Layout, 
  TrendingUp, 
  Sparkles, 
  Film, 
  Mic, 
  Video, 
  CheckCircle2, 
  ArrowRight, 
  Loader2,
  Save,
  RefreshCw,
  Plus,
  Trash2,
  Edit3,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchTrendInsights, TrendSignal } from '../../services/trends/trendService';
import { generateAdConcept, AdConcept } from '../../services/gemini/adService';
import { buildShotstackPayload } from '../../services/shotstack/shotstackService';

type Step = 'setup' | 'trends' | 'concept' | 'scenes' | 'voice' | 'edit';

const AdProjectDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  
  const [currentStep, setCurrentStep] = useState<Step>('setup');
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState<any>(null);
  
  // Data States
  const [setupData, setSetupData] = useState({
    clientName: '',
    brandName: '',
    productName: '',
    productCategory: '',
    targetAudience: '',
    platform: 'Instagram Reels',
    cta: 'Shop Now',
    brandTone: 'Professional & Modern',
    adAngle: 'Problem/Solution',
    productPhotos: [] as string[],
    referenceImages: [] as string[]
  });
  
  const [trendData, setTrendData] = useState<TrendSignal | null>(null);
  const [conceptData, setConceptData] = useState<AdConcept | null>(null);
  const [scenes, setScenes] = useState<any[]>([]);
  const [voiceover, setVoiceover] = useState({
    voiceName: 'Adam',
    script: '',
    status: 'pending'
  });
  const [editPlan, setEditPlan] = useState<any>(null);

  useEffect(() => {
    if (id) {
      const saved = localStorage.getItem('ai_ad_projects');
      if (saved) {
        const projects = JSON.parse(saved);
        const p = projects.find((proj: any) => proj.id === id);
        if (p) {
          setProject(p);
          setSetupData(prev => ({
            ...prev,
            clientName: p.clientName || '',
            brandName: p.brandName || '',
            productName: p.productName || '',
            productCategory: p.category || ''
          }));
          // Load other data if exists
          const savedData = localStorage.getItem(`ad_project_data_${id}`);
          if (savedData) {
            const parsed = JSON.parse(savedData);
            if (parsed.setup) setSetupData(parsed.setup);
            if (parsed.trends) setTrendData(parsed.trends);
            if (parsed.concept) {
              setConceptData(parsed.concept);
              setScenes(parsed.concept.scenes);
              setVoiceover(prev => ({ ...prev, script: parsed.concept.voiceover_text }));
            }
            if (parsed.step) setCurrentStep(parsed.step);
          }
        }
      }
    }
  }, [id]);

  const saveProjectData = (step?: Step) => {
    const data = {
      setup: setupData,
      trends: trendData,
      concept: conceptData,
      step: step || currentStep
    };
    localStorage.setItem(`ad_project_data_${id}`, JSON.stringify(data));
    
    // Update project status in main list
    const saved = localStorage.getItem('ai_ad_projects');
    if (saved) {
      const projects = JSON.parse(saved);
      const updated = projects.map((p: any) => 
        p.id === id ? { ...p, status: step || currentStep, updatedAt: new Date().toISOString() } : p
      );
      localStorage.setItem('ai_ad_projects', JSON.stringify(updated));
    }
  };

  const handleNext = () => {
    const steps: Step[] = ['setup', 'trends', 'concept', 'scenes', 'voice', 'edit'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1];
      setCurrentStep(nextStep);
      saveProjectData(nextStep);
    }
  };

  const handleBack = () => {
    const steps: Step[] = ['setup', 'trends', 'concept', 'scenes', 'voice', 'edit'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  // Step Handlers
  const runTrendAnalysis = async () => {
    setLoading(true);
    try {
      const trends = await fetchTrendInsights(setupData.productCategory);
      setTrendData(trends);
      saveProjectData();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateConcept = async () => {
    setLoading(true);
    try {
      const concept = await generateAdConcept({ ...setupData, trends: trendData });
      setConceptData(concept);
      setScenes(concept.scenes);
      setVoiceover(prev => ({ ...prev, script: concept.voiceover_text }));
      saveProjectData();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateEditPlan = () => {
    const plan = buildShotstackPayload(scenes, voiceover);
    setEditPlan(plan);
    saveProjectData();
  };

  const updateScene = (index: number, field: string, value: any) => {
    const updated = [...scenes];
    updated[index] = { ...updated[index], [field]: value };
    setScenes(updated);
  };

  // Renderers
  const renderSetup = () => (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <label className="block text-xs font-bold uppercase tracking-widest text-[#999]">Client & Brand</label>
          <input 
            value={setupData.clientName}
            onChange={e => setSetupData({...setupData, clientName: e.target.value})}
            className="w-full bg-white border border-[#111]/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#0B2B26]"
            placeholder="Client Name"
          />
          <input 
            value={setupData.brandName}
            onChange={e => setSetupData({...setupData, brandName: e.target.value})}
            className="w-full bg-white border border-[#111]/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#0B2B26]"
            placeholder="Brand Name"
          />
        </div>
        <div className="space-y-4">
          <label className="block text-xs font-bold uppercase tracking-widest text-[#999]">Product Details</label>
          <input 
            value={setupData.productName}
            onChange={e => setSetupData({...setupData, productName: e.target.value})}
            className="w-full bg-white border border-[#111]/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#0B2B26]"
            placeholder="Product Name"
          />
          <select 
            value={setupData.productCategory}
            onChange={e => setSetupData({...setupData, productCategory: e.target.value})}
            className="w-full bg-white border border-[#111]/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#0B2B26] appearance-none"
          >
            <option value="tech">Technology</option>
            <option value="fashion">Fashion</option>
            <option value="health">Health & Wellness</option>
            <option value="food">Food & Beverage</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-xs font-bold uppercase tracking-widest text-[#999]">Target Audience & Strategy</label>
        <textarea 
          value={setupData.targetAudience}
          onChange={e => setSetupData({...setupData, targetAudience: e.target.value})}
          className="w-full bg-white border border-[#111]/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#0B2B26] min-h-[100px]"
          placeholder="Describe your target audience (e.g. Busy professionals aged 25-40 interested in productivity...)"
        />
        <div className="grid grid-cols-2 gap-4">
          <select 
            value={setupData.brandTone}
            onChange={e => setSetupData({...setupData, brandTone: e.target.value})}
            className="w-full bg-white border border-[#111]/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#0B2B26] appearance-none"
          >
            <option value="Professional & Modern">Professional & Modern</option>
            <option value="Playful & High Energy">Playful & High Energy</option>
            <option value="Minimalist & Luxury">Minimalist & Luxury</option>
            <option value="Aggressive & Bold">Aggressive & Bold</option>
          </select>
          <select 
            value={setupData.adAngle}
            onChange={e => setSetupData({...setupData, adAngle: e.target.value})}
            className="w-full bg-white border border-[#111]/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#0B2B26] appearance-none"
          >
            <option value="Problem/Solution">Problem/Solution</option>
            <option value="Aspirational Lifestyle">Aspirational Lifestyle</option>
            <option value="Direct Product Demo">Direct Product Demo</option>
            <option value="Social Proof/Testimonial">Social Proof/Testimonial</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end pt-8">
        <button onClick={handleNext} className="cta-primary flex items-center gap-2">
          Save & Continue <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );

  const renderTrends = () => (
    <div className="space-y-8">
      {!trendData && !loading && (
        <div className="text-center py-20 bg-white border border-[#111]/5 rounded-[40px]">
          <TrendingUp className="mx-auto mb-4 text-[#111]/20" size={48} />
          <h3 className="text-xl font-bold mb-2">Analyze Market Trends</h3>
          <p className="text-[#666] mb-8 max-w-md mx-auto">We&apos;ll pull the last 7 days of viral signals for {setupData.productCategory} to inform your ad strategy.</p>
          <button onClick={runTrendAnalysis} className="cta-primary">Run Analysis</button>
        </div>
      )}

      {loading && (
        <div className="text-center py-20">
          <Loader2 className="mx-auto mb-4 animate-spin text-[#0B2B26]" size={48} />
          <p className="text-[#666] font-medium">Scanning social signals and viral hooks...</p>
        </div>
      )}

      {trendData && !loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-[32px] border border-[#111]/5 shadow-sm">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Sparkles size={18} className="text-amber-500" />
                Trending Hooks
              </h3>
              <div className="space-y-3">
                {trendData.trending_hooks.map((hook, i) => (
                  <div key={i} className="p-4 bg-[#FDFBFA] rounded-xl border border-[#111]/5 text-[#111] font-medium">
                    &quot;{hook}&quot;
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-[32px] border border-[#111]/5 shadow-sm">
                <h3 className="text-lg font-bold mb-6">Content Formats</h3>
                <div className="flex flex-wrap gap-2">
                  {trendData.trending_formats.map((f, i) => (
                    <span key={i} className="px-4 py-2 bg-[#0B2B26]/5 text-[#0B2B26] rounded-full text-xs font-bold uppercase tracking-wider">{f}</span>
                  ))}
                </div>
              </div>
              <div className="bg-white p-8 rounded-[32px] border border-[#111]/5 shadow-sm">
                <h3 className="text-lg font-bold mb-6">Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {trendData.trending_keywords.map((k, i) => (
                    <span key={i} className="px-4 py-2 bg-[#111]/5 text-[#111] rounded-full text-xs font-bold uppercase tracking-wider">{k}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-[#0B2B26] text-white p-8 rounded-[32px] shadow-xl">
              <h3 className="text-lg font-bold mb-4">Recommended Style</h3>
              <p className="text-white/80 leading-relaxed mb-6">{trendData.recommended_style}</p>
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-white/40">Emotional Angles</h4>
                <ul className="space-y-2">
                  {trendData.emotional_angles.map((a, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 size={14} className="text-emerald-400" />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <button onClick={handleNext} className="w-full cta-primary py-6 rounded-[24px]">
              Proceed to Concept
            </button>
            <button onClick={runTrendAnalysis} className="w-full text-[#666] text-sm font-bold flex items-center justify-center gap-2 hover:text-[#111]">
              <RefreshCw size={14} /> Refresh Trends
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );

  const renderConcept = () => (
    <div className="space-y-8">
      {!conceptData && !loading && (
        <div className="text-center py-20 bg-white border border-[#111]/5 rounded-[40px]">
          <Sparkles className="mx-auto mb-4 text-amber-500" size={48} />
          <h3 className="text-xl font-bold mb-2">Generate Ad Strategy</h3>
          <p className="text-[#666] mb-8 max-w-md mx-auto">Gemini will use your brand inputs and trend data to craft a high-converting 30-second ad concept.</p>
          <button onClick={generateConcept} className="cta-primary">Generate with Gemini</button>
        </div>
      )}

      {loading && (
        <div className="text-center py-20">
          <Loader2 className="mx-auto mb-4 animate-spin text-[#0B2B26]" size={48} />
          <p className="text-[#666] font-medium">Crafting your ad strategy and script...</p>
        </div>
      )}

      {conceptData && !loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-10 rounded-[40px] border border-[#111]/5 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black tracking-tight">The Script</h3>
                <button className="text-[#666] hover:text-[#111]"><Edit3 size={20} /></button>
              </div>
              <div className="p-8 bg-[#FDFBFA] rounded-3xl border border-[#111]/5 font-serif text-xl leading-relaxed text-[#333] italic">
                &quot;{conceptData.script}&quot;
              </div>
              <div className="mt-8 grid grid-cols-2 gap-6">
                <div className="p-6 bg-[#0B2B26]/5 rounded-2xl">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#0B2B26] mb-2">Selected Hook</h4>
                  <p className="text-[#111] font-bold">{conceptData.selected_hook}</p>
                </div>
                <div className="p-6 bg-[#111]/5 rounded-2xl">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#111]/60 mb-2">CTA</h4>
                  <p className="text-[#111] font-bold">{conceptData.cta}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white p-8 rounded-[32px] border border-[#111]/5 shadow-sm">
              <h3 className="text-lg font-bold mb-4">Strategy Summary</h3>
              <p className="text-[#666] leading-relaxed text-sm mb-6">{conceptData.strategy_summary}</p>
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#999]">Alternative Hooks</h4>
                {conceptData.hooks.filter(h => h !== conceptData.selected_hook).map((h, i) => (
                  <div key={i} className="p-4 bg-[#FDFBFA] rounded-xl border border-[#111]/5 text-sm text-[#666]">
                    {h}
                  </div>
                ))}
              </div>
            </div>
            <button onClick={handleNext} className="w-full cta-primary py-6 rounded-[24px]">
              Build Scene Prompts
            </button>
            <button onClick={generateConcept} className="w-full text-[#666] text-sm font-bold flex items-center justify-center gap-2 hover:text-[#111]">
              <RefreshCw size={14} /> Regenerate Concept
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );

  const renderScenes = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-black tracking-tight">Scene Prompt Lab</h3>
        <div className="flex gap-4">
          <button className="cta-secondary py-3 px-6 text-sm flex items-center gap-2">
            <Plus size={16} /> Add Scene
          </button>
          <button onClick={handleNext} className="cta-primary py-3 px-6 text-sm flex items-center gap-2">
            Approve All & Continue <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {scenes.map((scene, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white border border-[#111]/5 rounded-[32px] p-8 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-1/4 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-[#111] text-white flex items-center justify-center font-black">
                    {scene.scene_number}
                  </span>
                  <div>
                    <h4 className="font-bold text-[#111]">{scene.purpose}</h4>
                    <p className="text-xs text-[#999] font-mono">{scene.duration_seconds}s • {scene.emotion}</p>
                  </div>
                </div>
                <div className="p-4 bg-[#FDFBFA] rounded-2xl border border-[#111]/5">
                  <h5 className="text-[10px] font-bold uppercase tracking-widest text-[#999] mb-2">Camera Style</h5>
                  <p className="text-sm text-[#111]">{scene.camera_style}</p>
                </div>
              </div>

              <div className="lg:w-2/4 space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#999]">Visual Description</label>
                  <p className="text-[#111] leading-relaxed">{scene.visual_description}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#999]">AI Video Prompt</label>
                  <textarea 
                    value={scene.ai_video_prompt}
                    onChange={e => updateScene(index, 'ai_video_prompt', e.target.value)}
                    className="w-full bg-[#FDFBFA] border border-[#111]/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-[#0B2B26] min-h-[100px] text-sm font-mono"
                  />
                </div>
              </div>

              <div className="lg:w-1/4 space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#999]">Caption Overlay</label>
                  <input 
                    value={scene.caption_overlay}
                    onChange={e => updateScene(index, 'caption_overlay', e.target.value)}
                    className="w-full bg-[#FDFBFA] border border-[#111]/10 rounded-2xl px-5 py-3 focus:outline-none focus:border-[#0B2B26] text-sm font-bold"
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <button className="flex-1 py-3 bg-emerald-500/10 text-emerald-600 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-emerald-500/20 transition-colors">
                    Approve
                  </button>
                  <button className="p-3 text-[#111]/20 hover:text-red-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderVoice = () => (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-white p-10 rounded-[40px] border border-[#111]/5 shadow-sm space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-black tracking-tight">Voiceover Prep</h3>
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 text-amber-600 rounded-full text-xs font-bold uppercase tracking-wider">
            <Mic size={14} /> ElevenLabs Ready
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-xs font-bold uppercase tracking-widest text-[#999]">Selected Voice</label>
          <div className="grid grid-cols-3 gap-4">
            {['Adam', 'Bella', 'Charlie'].map(v => (
              <button 
                key={v}
                onClick={() => setVoiceover({...voiceover, voiceName: v})}
                className={`py-4 rounded-2xl border-2 transition-all font-bold ${voiceover.voiceName === v ? 'border-[#0B2B26] bg-[#0B2B26]/5 text-[#0B2B26]' : 'border-[#111]/5 hover:border-[#111]/20'}`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-xs font-bold uppercase tracking-widest text-[#999]">Final Script</label>
          <textarea 
            value={voiceover.script}
            onChange={e => setVoiceover({...voiceover, script: e.target.value})}
            className="w-full bg-[#FDFBFA] border border-[#111]/10 rounded-3xl px-8 py-6 focus:outline-none focus:border-[#0B2B26] min-h-[200px] text-lg leading-relaxed italic"
          />
        </div>

        <div className="flex justify-between items-center pt-4">
          <p className="text-xs text-[#999] font-mono uppercase">Estimated Duration: 28s</p>
          <button onClick={handleNext} className="cta-primary">Save & Continue</button>
        </div>
      </div>
    </div>
  );

  const renderEdit = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-black tracking-tight">Shotstack Edit Prep</h3>
        <button onClick={generateEditPlan} className="cta-primary flex items-center gap-2">
          <RefreshCw size={18} /> Generate Edit Plan
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[32px] border border-[#111]/5 shadow-sm">
            <h4 className="text-lg font-bold mb-6">Timeline Overview</h4>
            <div className="space-y-4">
              {scenes.map((s, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-[#FDFBFA] rounded-2xl border border-[#111]/5">
                  <span className="text-xs font-mono text-[#999] w-8">0:{i * 5 < 10 ? `0${i * 5}` : i * 5}</span>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-[#111]">{s.purpose}</p>
                    <p className="text-[10px] text-[#666] uppercase tracking-wider">{s.caption_overlay}</p>
                  </div>
                  <span className="text-xs font-bold text-[#0B2B26]">{s.duration_seconds}s</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#111] text-white p-8 rounded-[32px] shadow-xl overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-bold">JSON Payload</h4>
              <button className="text-white/40 hover:text-white"><Save size={18} /></button>
            </div>
            <pre className="text-[10px] font-mono text-emerald-400 overflow-x-auto max-h-[400px] pb-4">
              {JSON.stringify(editPlan || { message: "Click generate to build payload" }, null, 2)}
            </pre>
          </div>
          <button className="w-full py-6 bg-[#0B2B26] text-white rounded-[24px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#0B2B26]/90 transition-all">
            <ExternalLink size={20} /> Export to Shotstack
          </button>
        </div>
      </div>
    </div>
  );

  if (!project) return <div className="pt-40 text-center">Loading project...</div>;

  return (
    <div className="min-h-screen bg-[#FDFBFA]">
      <Head>
        <title>{project.brandName} | AI Ad Studio</title>
      </Head>
      
      <NavBar />

      <main className="editorial-grid" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
        {/* Header & Stepper */}
        <div style={{ marginBottom: '48px' }}>
          <button 
            onClick={() => router.push('/ai-ad-studio')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              color: 'var(--ink-soft)', 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              marginBottom: '24px', 
              fontWeight: 800, 
              fontSize: '13px', 
              textTransform: 'uppercase', 
              letterSpacing: '0.1em' 
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--ink)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--ink-soft)'}
          >
            <ChevronLeft size={18} /> Back to Dashboard
          </button>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
              <div>
                <h1 className="display" style={{ fontSize: '48px', color: 'var(--ink)', marginBottom: '8px' }}>{project.brandName}</h1>
                <p style={{ color: 'var(--ink-soft)', fontSize: '18px' }}>{project.productName}</p>
              </div>
              
              {/* Stepper */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                background: '#fff', 
                padding: '8px', 
                borderRadius: '999px', 
                border: '1px solid var(--line)', 
                boxShadow: 'var(--shadow-md)' 
              }}>
                {[
                  { id: 'setup', icon: <Layout size={16} /> },
                  { id: 'trends', icon: <TrendingUp size={16} /> },
                  { id: 'concept', icon: <Sparkles size={16} /> },
                  { id: 'scenes', icon: <Film size={16} /> },
                  { id: 'voice', icon: <Mic size={16} /> },
                  { id: 'edit', icon: <Video size={16} /> }
                ].map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => setCurrentStep(s.id as Step)}
                    style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      transition: 'all 0.2s ease',
                      border: 'none',
                      cursor: 'pointer',
                      background: currentStep === s.id ? 'var(--ink)' : 'transparent',
                      color: currentStep === s.id ? '#fff' : 'var(--muted)'
                    }}
                    onMouseEnter={e => {
                      if (currentStep !== s.id) e.currentTarget.style.background = 'rgba(17,17,17,0.05)';
                    }}
                    onMouseLeave={e => {
                      if (currentStep !== s.id) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    {s.icon}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="min-h-[60vh]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {currentStep === 'setup' && renderSetup()}
              {currentStep === 'trends' && renderTrends()}
              {currentStep === 'concept' && renderConcept()}
              {currentStep === 'scenes' && renderScenes()}
              {currentStep === 'voice' && renderVoice()}
              {currentStep === 'edit' && renderEdit()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <style jsx>{`
        .cta-primary {
          background: #111;
          color: #fff;
          padding: 14px 28px;
          border-radius: 999px;
          font-weight: 800;
          font-size: 14px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
        }
        .cta-primary:hover {
          background: #0B2B26;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(11,43,38,0.15);
        }
        .cta-secondary {
          background: transparent;
          color: #111;
          padding: 14px 28px;
          border-radius: 999px;
          font-weight: 800;
          font-size: 14px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          border: 2px solid #111;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
        }
        .cta-secondary:hover {
          background: #111;
          color: #fff;
        }
        .editorial-grid {
          width: 100%;
          max-width: 1240px;
          margin: 0 auto;
          padding-left: 24px;
          padding-right: 24px;
        }
      `}</style>
    </div>
  );
};

export default AdProjectDetail;
