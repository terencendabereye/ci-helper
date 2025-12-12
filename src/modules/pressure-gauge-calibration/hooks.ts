/**
 * Custom hook for pressure gauge calibration state and storage
 */

import { useState, useCallback } from 'react';
import { getFromStorage, saveToStorage, StorageKey } from '../../shared/utils/storage';
import type { Job, Gauge, CalibrationPoint } from './types';

// Simple UUID-like generator
const generateId = () => Math.random().toString(36).substr(2, 9);

const STORAGE_KEY = `${StorageKey.MODULE_SETTINGS}_pressure_gauge_calibration`;

export function usePressureGaugeCalibration() {
  const [jobs, setJobs] = useState<Job[]>(() => {
    return getFromStorage(STORAGE_KEY, []);
  });

  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [activeGaugeId, setActiveGaugeId] = useState<string | null>(null);

  const saveJobs = useCallback((updatedJobs: Job[]) => {
    setJobs(updatedJobs);
    saveToStorage(STORAGE_KEY, updatedJobs);
  }, []);

  const createJob = useCallback((name: string, description?: string, location?: string, technician?: string) => {
    const newJob: Job = {
      id: generateId(),
      name,
      description,
      location,
      technician,
      date: Date.now(),
      gauges: [],
    };
    const updated = [...jobs, newJob];
    saveJobs(updated);
    setActiveJobId(newJob.id);
    return newJob;
  }, [jobs, saveJobs]);

  const deleteJob = useCallback((jobId: string) => {
    const updated = jobs.filter(j => j.id !== jobId);
    saveJobs(updated);
    if (activeJobId === jobId) setActiveJobId(null);
  }, [jobs, saveJobs, activeJobId]);

  const updateJob = useCallback((jobId: string, updates: Partial<Job>) => {
    const updated = jobs.map(j => j.id === jobId ? { ...j, ...updates } : j);
    saveJobs(updated);
  }, [jobs, saveJobs]);

  const createGauge = useCallback((jobId: string, label: string, deviceType: 'gauge' | 'transmitter', unit: string, minRange: number, maxRange: number, currentMin?: number, currentMax?: number, outputUnit?: string, outputMin?: number, outputMax?: number) => {
    const newGauge: Gauge = {
      id: generateId(),
      label,
      deviceType,
      unit: unit as any,
      outputUnit: outputUnit as any,
      minRange,
      maxRange,
      currentMin,
      currentMax,
      outputMin,
      outputMax,
      points: [],
      timestamp: Date.now(),
    };
    const updated = jobs.map(j =>
      j.id === jobId ? { ...j, gauges: [...j.gauges, newGauge] } : j
    );
    saveJobs(updated);
    setActiveGaugeId(newGauge.id);
    return newGauge;
  }, [jobs, saveJobs]);

  const updateGauge = useCallback((jobId: string, gaugeId: string, updates: Partial<Gauge>) => {
    const updated = jobs.map(j => {
      if (j.id === jobId) {
        return {
          ...j,
          gauges: j.gauges.map(g => g.id === gaugeId ? { ...g, ...updates } : g),
        };
      }
      return j;
    });
    saveJobs(updated);
  }, [jobs, saveJobs]);

  const deleteGauge = useCallback((jobId: string, gaugeId: string) => {
    const updated = jobs.map(j =>
      j.id === jobId ? { ...j, gauges: j.gauges.filter(g => g.id !== gaugeId) } : j
    );
    saveJobs(updated);
    if (activeGaugeId === gaugeId) setActiveGaugeId(null);
  }, [jobs, saveJobs, activeGaugeId]);

  const addCalibrationPoint = useCallback((jobId: string, gaugeId: string, point: Omit<CalibrationPoint, 'id' | 'error' | 'errorPercent'>) => {
    const updated = jobs.map(j => {
      if (j.id === jobId) {
        return {
          ...j,
          gauges: j.gauges.map(g => {
            if (g.id === gaugeId) {
              return {
                ...g,
                points: [...g.points, {
                  ...point,
                  id: generateId(),
                  error: point.outputActual - point.outputExpected,
                  errorPercent: point.outputExpected === 0 ? 0 : ((point.outputActual - point.outputExpected) / Math.abs(point.outputExpected)) * 100,
                }],
              };
            }
            return g;
          }),
        };
      }
      return j;
    });
    saveJobs(updated);
  }, [jobs, saveJobs]);

  const addCalibrationPoints = useCallback((jobId: string, gaugeId: string, points: Array<Omit<CalibrationPoint, 'id' | 'error' | 'errorPercent'>>) => {
    const updated = jobs.map(j => {
      if (j.id === jobId) {
        return {
          ...j,
          gauges: j.gauges.map(g => {
            if (g.id === gaugeId) {
              const newPoints = points.map(point => ({
                ...point,
                id: generateId(),
                error: point.outputActual - point.outputExpected,
                errorPercent: point.outputExpected === 0 ? 0 : ((point.outputActual - point.outputExpected) / Math.abs(point.outputExpected)) * 100,
              }));
              return {
                ...g,
                points: [...g.points, ...newPoints],
              };
            }
            return g;
          }),
        };
      }
      return j;
    });
    saveJobs(updated);
  }, [jobs, saveJobs]);

  const updateCalibrationPoint = useCallback((jobId: string, gaugeId: string, pointId: string, updates: Partial<CalibrationPoint>) => {
    const updated = jobs.map(j => {
      if (j.id === jobId) {
        return {
          ...j,
          gauges: j.gauges.map(g => {
            if (g.id === gaugeId) {
              return {
                ...g,
                points: g.points.map(p => {
                  if (p.id === pointId) {
                    const merged = { ...p, ...updates };
                    return {
                      ...merged,
                      error: merged.outputActual - merged.outputExpected,
                      errorPercent: merged.outputExpected === 0 ? 0 : ((merged.outputActual - merged.outputExpected) / Math.abs(merged.outputExpected)) * 100,
                    };
                  }
                  return p;
                }),
              };
            }
            return g;
          }),
        };
      }
      return j;
    });
    saveJobs(updated);
  }, [jobs, saveJobs]);

  const deleteCalibrationPoint = useCallback((jobId: string, gaugeId: string, pointId: string) => {
    const updated = jobs.map(j => {
      if (j.id === jobId) {
        return {
          ...j,
          gauges: j.gauges.map(g => {
            if (g.id === gaugeId) {
              return {
                ...g,
                points: g.points.filter(p => p.id !== pointId),
              };
            }
            return g;
          }),
        };
      }
      return j;
    });
    saveJobs(updated);
  }, [jobs, saveJobs]);

  const importJobs = useCallback((imported: Job[]) => {
    const merged = [...jobs, ...imported];
    saveJobs(merged);
  }, [jobs, saveJobs]);

  const getActiveJob = useCallback(() => {
    return jobs.find(j => j.id === activeJobId);
  }, [jobs, activeJobId]);

  const getActiveGauge = useCallback(() => {
    const job = getActiveJob();
    if (!job) return null;
    return job.gauges.find(g => g.id === activeGaugeId);
  }, [getActiveJob, activeGaugeId]);

  return {
    jobs,
    activeJobId,
    activeGaugeId,
    setActiveJobId,
    setActiveGaugeId,
    createJob,
    deleteJob,
    updateJob,
    createGauge,
    deleteGauge,
    addCalibrationPoint,
    updateCalibrationPoint,
    deleteCalibrationPoint,
    addCalibrationPoints,
    updateGauge,
    importJobs,
    getActiveJob,
    getActiveGauge,
  };
}
