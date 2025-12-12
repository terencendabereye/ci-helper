/**
 * Pressure Gauge Calibration Utilities
 */

import type { CalibrationPoint, Gauge, CalibrationStats } from './types';

export function calculateError(expected: number, actual: number): number {
  return actual - expected;
}

export function calculateErrorPercent(expected: number, actual: number): number {
  if (expected === 0) return 0;
  return ((actual - expected) / Math.abs(expected)) * 100;
}

export function calculateStats(points: CalibrationPoint[]): CalibrationStats {
  if (points.length === 0) {
    return {
      minError: 0,
      maxError: 0,
      avgError: 0,
      minErrorPercent: 0,
      maxErrorPercent: 0,
      avgErrorPercent: 0,
    };
  }

  const errors = points.map(p => p.error || 0);
  const errorPercents = points.map(p => p.errorPercent || 0);

  return {
    minError: Math.min(...errors),
    maxError: Math.max(...errors),
    avgError: errors.reduce((a, b) => a + b, 0) / errors.length,
    minErrorPercent: Math.min(...errorPercents),
    maxErrorPercent: Math.max(...errorPercents),
    avgErrorPercent: errorPercents.reduce((a, b) => a + b, 0) / errorPercents.length,
  };
}

export function validateCalibrationPoint(point: CalibrationPoint, gauge: Gauge): string[] {
  const errors: string[] = [];

  if (isNaN(point.inputDesired) || isNaN(point.inputActual)) {
    errors.push('Input values must be numbers');
  }
  if (isNaN(point.outputExpected) || isNaN(point.outputActual)) {
    errors.push('Output values must be numbers');
  }
  if (point.inputDesired < gauge.minRange || point.inputDesired > gauge.maxRange) {
    errors.push(`Input desired must be between ${gauge.minRange} and ${gauge.maxRange}`);
  }

  return errors;
}

export function generateJobLabel(jobName: string, gaugeName: string): string {
  return `${jobName} - ${gaugeName}`;
}
