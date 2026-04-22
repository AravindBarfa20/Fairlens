"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { GlassCard } from "@/components/ui/GlassCard";
import { FileText, Clock, AlertTriangle, CheckCircle, Trash2 } from "lucide-react";

interface AuditReport {
  id: string;
  file_name: string;
  target_column: string;
  protected_attribute: string;
  disparate_impact: number;
  demographic_parity_diff: number;
  is_biased: boolean;
  flagged_features: string[];
  ai_explanation: string | null;
  created_at: string;
}

export default function HistoryPage() {
  const [reports, setReports] = useState<AuditReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<AuditReport | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchReports();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("audit_reports")
      .select("*")
      .order("created_at", { ascending: false });

    setReports(data || []);
    setLoading(false);
  };

  const deleteReport = async (id: string) => {
    await supabase.from("audit_reports").delete().eq("id", id);
    setReports((prev) => prev.filter((r) => r.id !== id));
    if (selectedReport?.id === id) setSelectedReport(null);
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight dark:text-white text-neutral-900">
          Audit History
        </h1>
        <p className="dark:text-neutral-400 text-neutral-500">
          {reports.length} report{reports.length !== 1 ? "s" : ""} saved
        </p>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 rounded-2xl dark:bg-white/[0.02] bg-neutral-100 animate-pulse" />
          ))}
        </div>
      ) : reports.length === 0 ? (
        <GlassCard className="flex flex-col items-center gap-4 py-16 text-center">
          <FileText className="w-10 h-10 dark:text-neutral-600 text-neutral-400" />
          <div>
            <p className="text-sm font-medium dark:text-neutral-400 text-neutral-600">No reports yet</p>
            <p className="text-xs dark:text-neutral-600 text-neutral-400 mt-1">Upload a CSV to run your first audit</p>
          </div>
        </GlassCard>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {reports.map((report, i) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <GlassCard className="p-5 cursor-pointer hover:border-white/10 transition-colors">
                <div className="flex items-start justify-between">
                  <div
                    className="flex-1 min-w-0"
                    onClick={() => setSelectedReport(selectedReport?.id === report.id ? null : report)}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {report.is_biased ? (
                        <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      )}
                      <span className="text-sm font-medium dark:text-white text-neutral-900 truncate">
                        {report.file_name}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-3 text-xs dark:text-neutral-500 text-neutral-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(report.created_at)}
                      </span>
                      <span>DI: {report.disparate_impact?.toFixed(2)}</span>
                      <span>DP: {report.demographic_parity_diff?.toFixed(2)}</span>
                    </div>

                    <div className="flex gap-2 mt-2">
                      <span className="inline-flex items-center rounded-md dark:bg-white/5 bg-neutral-100 px-2 py-0.5 text-[10px] dark:text-neutral-400 text-neutral-500">
                        target: {report.target_column}
                      </span>
                      <span className="inline-flex items-center rounded-md dark:bg-white/5 bg-neutral-100 px-2 py-0.5 text-[10px] dark:text-neutral-400 text-neutral-500">
                        protected: {report.protected_attribute}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => { e.stopPropagation(); deleteReport(report.id); }}
                    className="p-1.5 rounded-lg dark:hover:bg-white/5 hover:bg-neutral-100 transition-colors flex-shrink-0"
                    aria-label="Delete report"
                  >
                    <Trash2 className="w-3.5 h-3.5 dark:text-neutral-600 text-neutral-400" />
                  </button>
                </div>

                {/* Expanded view */}
                {selectedReport?.id === report.id && report.ai_explanation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-4 pt-4 border-t dark:border-white/5 border-neutral-200"
                  >
                    <p className="text-xs font-medium dark:text-neutral-400 text-neutral-500 mb-2">AI Analysis</p>
                    <div className="text-sm dark:text-neutral-300 text-neutral-600 leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                      {report.ai_explanation}
                    </div>
                  </motion.div>
                )}
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
