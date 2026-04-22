"use client";

import { useBiasReport } from "@/store/useBiasReport";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export function ReportView() {
  const { status, metrics, reportStream } = useBiasReport();

  if (status === "uploading" || status === "analyzing") {
    return (
      <div className="w-full max-w-5xl space-y-8 animate-in fade-in duration-500">
        <div className="h-8 w-1/3 bg-slate-800/50 rounded-lg animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 w-full bg-slate-800/30 border border-slate-700/30 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (status === "complete" && metrics) {
    const isBiased = metrics.isBiased;
    
    // Extrapolate visualization data based on Disparate Impact
    const unprivilegedScore = Math.min(Math.round(metrics.disparateImpact * 100), 100);
    const chartData = [
      { name: 'Privileged Group', Rate: 100 },
      { name: 'Unprivileged Group', Rate: unprivilegedScore }
    ];

    return (
      <div className="w-full max-w-5xl space-y-8 pb-20">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h2 className="text-2xl font-bold text-white">Analysis Results</h2>
          <div className="flex gap-4">
             <button disabled className="px-4 py-1.5 rounded-full text-sm font-semibold border border-slate-700 bg-slate-800/50 text-slate-400 cursor-not-allowed hidden md:flex items-center gap-2" title="Coming Soon">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                Mitigate Bias & Download (Beta)
             </button>
             <div className={`px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 border ${isBiased ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
               <div className={`w-2 h-2 rounded-full ${isBiased ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
               {isBiased ? "Bias Detected" : "Fairness Verified"}
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-4">
              {[
                { label: "Target Column", value: metrics.targetColumn },
                { label: "Protected Attr", value: metrics.protectedAttribute },
                { label: "Disparate Impact", value: metrics.disparateImpact?.toFixed(3), alert: isBiased },
                { label: "Demographic Parity", value: metrics.demographicParityDifference?.toFixed(3) }
              ].map((m, idx) => (
                 <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className={`p-6 rounded-2xl border bg-slate-900/50 backdrop-blur-md ${m.alert ? 'border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-slate-800'}`}>
                    <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase mb-2">{m.label}</p>
                    <p className={`text-3xl font-bold tracking-tight ${m.alert ? 'text-red-400' : 'text-white'}`}>{m.value}</p>
                 </motion.div>
              ))}
           </div>
           
           <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="col-span-1 border border-slate-800 bg-slate-900/50 rounded-2xl p-6 flex flex-col items-center justify-center">
              <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase mb-4 w-full text-left">Selection Rate Disparity</p>
              <div className="h-32 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{fill: '#1e293b'}} contentStyle={{backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px'}} />
                    <Bar dataKey="Rate" radius={[4, 4, 0, 0]}>
                       {chartData.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={index === 0 ? '#38bdf8' : (isBiased ? '#ef4444' : '#38bdf8')} />
                       ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
           </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="p-8 rounded-2xl border border-sky-500/20 bg-gradient-to-b from-slate-900/80 to-slate-900/40 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-500 via-blue-500 to-violet-500" />
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 flex items-center justify-center border border-sky-500/30">
               <svg className="w-4 h-4 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h3 className="text-lg font-bold text-white">AI Real-Time Insights</h3>
          </div>
          <div className="prose prose-invert max-w-none">
            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap font-light text-lg">
              {reportStream || <span className="animate-pulse text-slate-500">Connecting to AI Neural Link...</span>}
            </p>
          </div>
        </motion.div>
      </div>
    );
  }
  return null;
}
