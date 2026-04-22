// frontend/store/useBiasReport.ts
import { create } from 'zustand';

export type SystemStatus = 'idle' | 'uploading' | 'analyzing' | 'generating' | 'complete' | 'error';

export interface BiasMetrics {
  targetColumn: string;
  protectedAttribute: string;
  disparateImpact: number;
  demographicParityDifference: number;
  isBiased: boolean;
  flaggedFeatures: string[];
}

interface BiasReportState {
  // Data State
  file: File | null;
  metrics: BiasMetrics | null;
  reportStream: string;

  // UI State
  status: SystemStatus;
  errorMessage: string | null;

  // Actions
  setFile: (file: File | null) => void;
  setStatus: (status: SystemStatus) => void;
  setMetrics: (metrics: BiasMetrics) => void;
  appendReportStream: (chunk: string) => void;
  setErrorMessage: (msg: string) => void;
  reset: () => void;
}

export const useBiasReport = create<BiasReportState>((set) => ({
  file: null,
  metrics: null,
  reportStream: '',
  status: 'idle',
  errorMessage: null,

  setFile: (file) => set({ file }),
  setStatus: (status) => set({ status }),
  setMetrics: (metrics) => set({ metrics }),
  appendReportStream: (chunk) =>
    set((state) => ({ reportStream: state.reportStream + chunk })),
  setErrorMessage: (msg) =>
    set({ errorMessage: msg, status: 'error' }),
  reset: () =>
    set({ file: null, metrics: null, reportStream: '', status: 'idle', errorMessage: null }),
}));
