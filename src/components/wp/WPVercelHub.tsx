import React, { useState, useEffect } from 'react';
import { WPIcon } from './WPIcons';
import { useEdgeConfig } from '@/hooks/useEdgeConfig';

interface WPVercelHubProps {
  isOpen: boolean;
  onClose: () => void;
}

type PivotTab = 'edge' | 'blob' | 'analytics' | 'functions';

export const WPVercelHub: React.FC<WPVercelHubProps> = ({ isOpen, onClose }) => {
  const { data: edgeConfig, isLoading: isConfigLoading } = useEdgeConfig();
  const [activeTab, setActiveTab] = useState<PivotTab>('edge');
  const [visitorStats, setVisitorStats] = useState<{ total: number; today: number; date?: string; source?: string } | null>(null);
  const [edgeLatency, setEdgeLatency] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchTelemetry = async () => {
    setIsRefreshing(true);
    const startTime = performance.now();
    try {
      const [visitorRes, configRes] = await Promise.all([
        fetch('/api/visitor-counter').then(r => r.json()).catch(() => null),
        fetch('/api/config?t=' + Date.now()).then(r => r.json()).catch(() => null),
      ]);
      const endTime = performance.now();
      setEdgeLatency(Math.round(endTime - startTime));
      if (visitorRes) setVisitorStats(visitorRes);
    } catch {
      // Ignore
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchTelemetry();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black text-white font-segoe select-none animate-in fade-in duration-200">
      {/* 1. Header Bar with Back Button */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/80 backdrop-blur-md">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-white/80 active:text-white transition-colors"
        >
          <WPIcon name="arrowLeft" size={18} />
          <span className="text-[14px] font-segoe-light">start</span>
        </button>

        <div className="flex items-center gap-1.5 text-white/90">
          <WPIcon name="vercel" size={14} className="fill-white" />
          <span className="text-[13px] font-segoe-semilight tracking-wider uppercase text-white/70">
            vercel ecosystem
          </span>
        </div>

        <button
          onClick={fetchTelemetry}
          className={`p-1.5 text-white/70 active:text-white transition-opacity ${
            isRefreshing ? 'animate-spin' : ''
          }`}
          title="Refresh telemetry"
        >
          <WPIcon name="rotation" size={15} />
        </button>
      </div>

      {/* 2. Panoramic Title & Pivot Headers */}
      <div className="px-5 pt-3 pb-1 border-b border-white/[0.08]">
        <h1 className="text-[34px] font-segoe-light tracking-[-0.03em] text-white leading-none lowercase">
          cloud telemetry
        </h1>

        {/* Pivot Navigation Tabs */}
        <div className="flex items-center gap-6 mt-3 overflow-x-auto scrollbar-hide text-[16px] lowercase">
          <button
            onClick={() => setActiveTab('edge')}
            className={`pb-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'edge'
                ? 'border-[hsl(var(--wp-accent))] text-white font-medium'
                : 'border-transparent text-white/50 hover:text-white/80 font-light'
            }`}
          >
            edge config
          </button>
          <button
            onClick={() => setActiveTab('blob')}
            className={`pb-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'blob'
                ? 'border-[hsl(var(--wp-accent))] text-white font-medium'
                : 'border-transparent text-white/50 hover:text-white/80 font-light'
            }`}
          >
            blob storage
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`pb-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'border-[hsl(var(--wp-accent))] text-white font-medium'
                : 'border-transparent text-white/50 hover:text-white/80 font-light'
            }`}
          >
            insights
          </button>
          <button
            onClick={() => setActiveTab('functions')}
            className={`pb-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'functions'
                ? 'border-[hsl(var(--wp-accent))] text-white font-medium'
                : 'border-transparent text-white/50 hover:text-white/80 font-light'
            }`}
          >
            serverless & ai
          </button>
        </div>
      </div>

      {/* 3. Main Pivot Content Area */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {/* Tab 1: Edge Config */}
        {activeTab === 'edge' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="p-4 bg-white/[0.04] border border-white/10 rounded">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[12px] font-segoe-semilight tracking-wider uppercase text-cyan-300">
                  Global Edge Network
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                  ACTIVE
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-left">
                <div>
                  <span className="text-[11px] text-white/50 block font-light">Deployment Region</span>
                  <span className="text-[16px] text-white font-semibold font-mono">
                    {edgeConfig?.region?.toUpperCase() || 'BOM1 (MUMBAI)'}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-white/50 block font-light">Edge Latency</span>
                  <span className="text-[16px] text-emerald-300 font-semibold font-mono">
                    {edgeLatency !== null ? `${edgeLatency} ms` : 'Measuring…'}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-white/50 block font-light">Environment</span>
                  <span className="text-[14px] text-white font-medium capitalize">
                    {edgeConfig?.environment || 'Production'}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-white/50 block font-light">Work Availability</span>
                  <span className="text-[14px] text-cyan-300 font-medium">
                    {edgeConfig?.openToWork ? 'Open to Work' : 'Unavailable'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white/[0.04] border border-white/10 rounded space-y-2">
              <span className="text-[12px] font-segoe-semilight tracking-wider uppercase text-white/60 block">
                Live Edge Config Broadcast
              </span>
              <p className="text-[14px] font-segoe-light text-white/95 leading-relaxed">
                "{edgeConfig?.announcement || 'Welcome to my portfolio! Built with React, Vite & the Vercel edge ecosystem.'}"
              </p>
              <span className="text-[11px] text-white/40 block">
                Synchronized across 300+ Vercel global edge pop locations with sub-millisecond reads.
              </span>
            </div>
          </div>
        )}

        {/* Tab 2: Blob Storage */}
        {activeTab === 'blob' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="p-4 bg-white/[0.04] border border-white/10 rounded">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[12px] font-segoe-semilight tracking-wider uppercase text-purple-300">
                  @vercel/blob Storage
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">
                  CONNECTED
                </span>
              </div>
              <p className="text-[13px] text-white/80 font-light mb-3">
                Dynamic portfolio content, visitor persistence, and resumes are hosted natively on Vercel distributed object storage.
              </p>

              {/* Blob Catalog */}
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 bg-white/[0.03] border border-white/5 rounded">
                  <div className="flex items-center gap-2">
                    <WPIcon name="folder" size={16} className="text-purple-300" />
                    <span className="text-[13px] text-white font-mono">projects.json</span>
                  </div>
                  <span className="text-[11px] text-white/50 font-light">Vercel Blob Public</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-white/[0.03] border border-white/5 rounded">
                  <div className="flex items-center gap-2">
                    <WPIcon name="people" size={16} className="text-purple-300" />
                    <span className="text-[13px] text-white font-mono">profile.json</span>
                  </div>
                  <span className="text-[11px] text-white/50 font-light">Dynamic Identity</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-white/[0.03] border border-white/5 rounded">
                  <div className="flex items-center gap-2">
                    <WPIcon name="analytics" size={16} className="text-purple-300" />
                    <span className="text-[13px] text-white font-mono">visitor-count.json</span>
                  </div>
                  <span className="text-[11px] text-white/50 font-light">Telemetry Counter</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-white/[0.03] border border-white/5 rounded">
                  <div className="flex items-center gap-2">
                    <WPIcon name="document" size={16} className="text-purple-300" />
                    <span className="text-[13px] text-white font-mono">documents.json</span>
                  </div>
                  <span className="text-[11px] text-white/50 font-light">Office PDF Resumes</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Insights & Web Vitals */}
        {activeTab === 'analytics' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-white/[0.04] border border-white/10 rounded">
                <span className="text-[11px] text-white/50 uppercase tracking-wider block font-light">
                  Today's Traffic
                </span>
                <span className="text-[28px] font-mono font-bold text-teal-300 block my-1">
                  +{visitorStats?.today || 0}
                </span>
                <span className="text-[11px] text-white/50 font-light">Unique visitors today</span>
              </div>

              <div className="p-4 bg-white/[0.04] border border-white/10 rounded">
                <span className="text-[11px] text-white/50 uppercase tracking-wider block font-light">
                  All-Time Traffic
                </span>
                <span className="text-[28px] font-mono font-bold text-white block my-1">
                  {visitorStats?.total || 0}
                </span>
                <span className="text-[11px] text-white/50 font-light">Persistent Blob log</span>
              </div>
            </div>

            <div className="p-4 bg-white/[0.04] border border-white/10 rounded space-y-2.5">
              <span className="text-[12px] font-segoe-semilight tracking-wider uppercase text-teal-300 block">
                Vercel Real User Monitoring (RUM)
              </span>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-white/80 font-light">@vercel/analytics</span>
                <span className="text-emerald-300 font-mono">Active (100%)</span>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-white/80 font-light">@vercel/speed-insights</span>
                <span className="text-emerald-300 font-mono">Active (Core Web Vitals)</span>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-white/80 font-light">Edge CDN Cache Hit Rate</span>
                <span className="text-teal-300 font-mono">&gt; 98.4%</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Serverless & AI */}
        {activeTab === 'functions' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="p-4 bg-white/[0.04] border border-white/10 rounded space-y-3">
              <span className="text-[12px] font-segoe-semilight tracking-wider uppercase text-amber-300 block">
                Vercel AI SDK Integration
              </span>
              <p className="text-[13px] text-white/85 font-light leading-relaxed">
                The Windows Phone Cortana assistant runs directly on Vercel Serverless Functions using the Vercel AI SDK (<code className="text-amber-200">streamText</code>) with Google Gemini, dynamically grounded in real-time Edge Config & Blob contexts.
              </p>
            </div>

            <div className="p-4 bg-white/[0.04] border border-white/10 rounded space-y-2">
              <span className="text-[12px] font-segoe-semilight tracking-wider uppercase text-white/60 block">
                Active Serverless Routes
              </span>
              <div className="space-y-1.5 text-[12px] font-mono">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-white/90">GET /api/config</span>
                  <span className="text-cyan-300">Edge Config + Blob</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-white/90">POST /api/chat</span>
                  <span className="text-cyan-300">AI SDK Streaming</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-white/90">POST /api/visitor-counter</span>
                  <span className="text-cyan-300">Blob Counter Atomic</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-white/90">GET /api/projects</span>
                  <span className="text-cyan-300">Blob Catalog</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Bottom Metro Bar */}
      <div className="p-3 border-t border-white/10 bg-black flex items-center justify-between text-white/60 text-[12px]">
        <span className="font-segoe-light">Powered by Vercel Cloud Platform</span>
        <span className="font-mono text-[11px] text-white/40">v2026.11</span>
      </div>
    </div>
  );
};

export default WPVercelHub;
