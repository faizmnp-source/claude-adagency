import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import NavBar from '../../components/NavBar';
import { Plus, Layout, TrendingUp, Sparkles, Film, Mic, Video, ArrowRight, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AdProject {
  id: string;
  clientName: string;
  brandName: string;
  productName: string;
  status: 'setup' | 'trends' | 'concept' | 'scenes' | 'voice' | 'edit' | 'completed';
  updatedAt: string;
}

const AIAdStudio: React.FC = () => {
  const [projects, setProjects] = useState<AdProject[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    clientName: '',
    brandName: '',
    productName: '',
    category: ''
  });

  useEffect(() => {
    // Load projects from local storage or mock
    const saved = localStorage.getItem('ai_ad_projects');
    if (saved) {
      setProjects(JSON.parse(saved));
    } else {
      const mockProjects: AdProject[] = [
        {
          id: '1',
          clientName: 'EcoLife',
          brandName: 'EcoBottle',
          productName: 'Self-Cleaning Bottle',
          status: 'concept',
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          clientName: 'TechFlow',
          brandName: 'FlowKey',
          productName: 'Ergonomic Keyboard',
          status: 'completed',
          updatedAt: new Date().toISOString()
        }
      ];
      setProjects(mockProjects);
      localStorage.setItem('ai_ad_projects', JSON.stringify(mockProjects));
    }
  }, []);

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    const project: AdProject = {
      id: Math.random().toString(36).substr(2, 9),
      ...newProject,
      status: 'setup',
      updatedAt: new Date().toISOString()
    };
    const updated = [project, ...projects];
    setProjects(updated);
    localStorage.setItem('ai_ad_projects', JSON.stringify(updated));
    setIsCreateModalOpen(false);
    setNewProject({ clientName: '', brandName: '', productName: '', category: '' });
  };

  const deleteProject = (id: string) => {
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    localStorage.setItem('ai_ad_projects', JSON.stringify(updated));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'setup': return <Layout size={16} />;
      case 'trends': return <TrendingUp size={16} />;
      case 'concept': return <Sparkles size={16} />;
      case 'scenes': return <Film size={16} />;
      case 'voice': return <Mic size={16} />;
      case 'edit': return <Video size={16} />;
      default: return <ArrowRight size={16} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBFA]">
      <Head>
        <title>AI Ad Studio | Claude Adagency</title>
      </Head>
      
      <NavBar />

      <main className="editorial-grid" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '48px' }}>
          <div>
            <h1 className="display" style={{ fontSize: '64px', color: 'var(--ink)', marginBottom: '8px' }}>AI Ad Studio</h1>
            <p style={{ color: 'var(--ink-soft)', fontSize: '18px' }}>Premium 30-second social ad creative workflow.</p>
          </div>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="cta-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Plus size={20} />
            New Ad Project
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          <AnimatePresence>
            {projects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="editorial-card"
                style={{ padding: '32px', position: 'relative', display: 'flex', flexDirection: 'column' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '24px' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    padding: '6px 12px', 
                    background: 'var(--accent-soft)', 
                    borderRadius: '999px', 
                    color: 'var(--accent-deep)', 
                    fontSize: '11px', 
                    fontWeight: 800, 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.1em' 
                  }}>
                    {getStatusIcon(project.status)}
                    {project.status}
                  </div>
                  <button 
                    onClick={() => deleteProject(project.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', opacity: 0.4 }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '0.4'}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <h3 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--ink)', marginBottom: '4px' }}>{project.brandName}</h3>
                <p style={{ color: 'var(--ink-soft)', fontSize: '15px', marginBottom: '24px' }}>{project.productName}</p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                  <span style={{ fontSize: '10px', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Updated {new Date(project.updatedAt).toLocaleDateString()}
                  </span>
                  <Link 
                    href={`/ai-ad-studio/${project.id}`}
                    style={{ 
                      width: '44px', 
                      height: '44px', 
                      borderRadius: '50%', 
                      background: 'var(--ink)', 
                      color: '#fff', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      textDecoration: 'none'
                    }}
                  >
                    <ArrowRight size={20} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {projects.length === 0 && (
            <div style={{ 
              gridColumn: '1 / -1', 
              padding: '80px 0', 
              textAlign: 'center', 
              border: '2px dashed var(--line)', 
              borderRadius: '40px' 
            }}>
              <div style={{ 
                width: '64px', 
                height: '64px', 
                background: 'rgba(17,17,17,0.04)', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto 16px' 
              }}>
                <Layout style={{ color: 'var(--muted)', opacity: 0.4 }} size={32} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--ink)' }}>No projects yet</h3>
              <p style={{ color: 'var(--ink-soft)', marginBottom: '32px' }}>Start your first premium ad campaign.</p>
              <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="cta-secondary"
              >
                Create Project
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Create Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div style={{ 
            position: 'fixed', 
            inset: 0, 
            zIndex: 1000, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: '24px' 
          }}>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreateModalOpen(false)}
              style={{ 
                position: 'absolute', 
                inset: 0, 
                background: 'rgba(17,17,17,0.4)', 
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)'
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              style={{ 
                position: 'relative', 
                background: '#fff', 
                borderRadius: '40px', 
                padding: '40px', 
                width: '100%', 
                maxWidth: '560px', 
                boxShadow: '0 30px 90px rgba(0,0,0,0.2)' 
              }}
            >
              <h2 className="display" style={{ fontSize: '48px', color: 'var(--ink)', marginBottom: '32px' }}>New Ad Project</h2>
              <form onSubmit={handleCreateProject} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label className="field-label">Client Name</label>
                    <input 
                      required
                      value={newProject.clientName}
                      onChange={e => setNewProject({...newProject, clientName: e.target.value})}
                      className="field-input"
                      placeholder="e.g. Acme Corp"
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label className="field-label">Brand Name</label>
                    <input 
                      required
                      value={newProject.brandName}
                      onChange={e => setNewProject({...newProject, brandName: e.target.value})}
                      className="field-input"
                      placeholder="e.g. Acme"
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label className="field-label">Product Name</label>
                  <input 
                    required
                    value={newProject.productName}
                    onChange={e => setNewProject({...newProject, productName: e.target.value})}
                    className="field-input"
                    placeholder="e.g. Super Widget 3000"
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label className="field-label">Category</label>
                  <select 
                    required
                    value={newProject.category}
                    onChange={e => setNewProject({...newProject, category: e.target.value})}
                    className="field-select"
                  >
                    <option value="">Select Category</option>
                    <option value="tech">Technology</option>
                    <option value="fashion">Fashion</option>
                    <option value="health">Health & Wellness</option>
                    <option value="food">Food & Beverage</option>
                    <option value="home">Home & Living</option>
                  </select>
                </div>
                
                <div style={{ display: 'flex', gap: '16px', paddingTop: '16px' }}>
                  <button 
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    style={{ 
                      flex: 1, 
                      background: 'none', 
                      border: 'none', 
                      cursor: 'pointer', 
                      color: 'var(--muted)', 
                      fontWeight: 800, 
                      fontSize: '12px', 
                      letterSpacing: '0.15em', 
                      textTransform: 'uppercase' 
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="cta-primary"
                    style={{ flex: 2 }}
                  >
                    Create Project
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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

export default AIAdStudio;
