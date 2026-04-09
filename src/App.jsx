import React, { useEffect, useState } from 'react';
import { account } from './lib/appwrite';
import { 
  ShieldCheck, Zap, Server, 
  ArrowRight, RefreshCcw 
} from 'lucide-react';

// Simple Data Visualization Component
const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-slate-800/40 border border-slate-700/50 p-4 rounded-xl backdrop-blur-md">
    <div className="flex items-center gap-3 mb-2">
      <div className={`p-2 rounded-lg ${color} bg-opacity-10`}>
        <Icon className={`w-5 h-5 ${color.replace('bg-', 'text-')}`} />
      </div>
      <span className="text-slate-400 text-sm font-medium">{label}</span>
    </div>
    <div className="text-xl font-bold text-white">{value}</div>
  </div>
);

function App() {
  const [status, setStatus] = useState('connecting');
  const [user, setUser] = useState(null);
  const [latency, setLatency] = useState(0);

  const checkConnection = async () => {
    const start = Date.now();
    setStatus('connecting');
    try {
      const response = await account.get();
      setUser(response);
      setStatus('connected');
      setLatency(Date.now() - start);
    } catch (err) {
      if (err.code === 401) {
        try {
          await account.createAnonymousSession();
          const anon = await account.get();
          setUser(anon);
          setStatus('connected');
          setLatency(Date.now() - start);
        } catch { setStatus('failed'); }
      } else { setStatus('failed'); }
    }
  };

  useEffect(() => { checkConnection(); }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-blue-500/30 font-sans">
      {/* Animated Background Glow */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] -z-10" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] -z-10" />

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md border border-blue-500/20">
                AITHON 2026 Phase 1
              </span>
            </div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">
              Project <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">Infinity</span>
            </h1>
            <p className="text-slate-400 mt-2">Intelligent Infrastructure Management System</p>
          </div>
          
          <button 
            onClick={checkConnection}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-5 py-2.5 rounded-xl transition-all active:scale-95"
          >
            <RefreshCcw className={`w-4 h-4 ${status === 'connecting' ? 'animate-spin' : ''}`} />
            System Check
          </button>
        </header>

        <main className="space-y-8">
          {/* Status Panel */}
          <section className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl backdrop-blur-xl relative overflow-hidden">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Network Synchronization</h2>
                <p className="text-sm text-slate-400 text-balance">Verifying encrypted handshake with Appwrite Cloud nodes.</p>
              </div>
              <div className={`px-4 py-1.5 rounded-full flex items-center gap-2 border shadow-lg transition-colors ${
                status === 'connected' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 
                status === 'failed' ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}>
                <span className={`w-2 h-2 rounded-full ${status === 'connected' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                <span className="text-xs font-bold uppercase tracking-wider">{status}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                <div className="text-xs text-slate-500 uppercase font-bold mb-2">Auth Instance</div>
                <div className="font-mono text-xs text-blue-300 truncate">{user?.$id || 'No active session'}</div>
              </div>
              <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                <div className="text-xs text-slate-500 uppercase font-bold mb-2">Network Latency</div>
                <div className="font-mono text-xs text-blue-300">{latency}ms</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 group">
                Launch Application <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </section>

          {/* Micro Viz Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard icon={Zap} label="Response" value={`${latency}ms`} color="bg-amber-500" />
            <StatCard icon={ShieldCheck} label="Security" value="AES-256" color="bg-emerald-500" />
            <StatCard icon={Server} label="Uptime" value="99.9%" color="bg-blue-500" />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;