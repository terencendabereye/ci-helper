/**
 * Types for Pressure Gauge Calibration Module
 */

export type PressureUnit = 'MPA' | 'Bar';
export type TransmitterUnit = 'mA';

export interface CalibrationPoint {
  id: string;
  inputDesired: number;      // User-set input value
  inputActual: number;       // Measured input value
  outputExpected: number;    // Expected output based on calibration
  outputActual: number;      // Actual measured output
  error?: number;            // Calculated error
  errorPercent?: number;     // Percentage error
}

export interface Gauge {
  id: string;
  label: string;            // User-defined gauge label (e.g., "PT-101")
  unit: PressureUnit;       // MPA or Bar
  minRange: number;
  maxRange: number;
  points: CalibrationPoint[];
  timestamp: number;        // When gauge was created
}

export interface Job {
  id: string;
  name: string;
  description?: string;
  location?: string;
  technician?: string;
  date: number;             // Job creation timestamp
  gauges: Gauge[];
  notes?: string;
}

export interface CalibrationStats {
  minError: number;
  maxError: number;
  avgError: number;
  minErrorPercent: number;
  maxErrorPercent: number;
  avgErrorPercent: number;
}
