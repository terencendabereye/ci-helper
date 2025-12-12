/**
 * Types for Pressure Gauge Calibration Module
 */

export type PressureUnit = 'MPA' | 'Bar';
export type TransmitterUnit = 'mA';
export type TemperatureUnit = 'C' | 'F';
export type Unit = PressureUnit | TransmitterUnit | TemperatureUnit;

export type DeviceType = 'gauge' | 'transmitter';

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
  deviceType: DeviceType;   // 'gauge' or 'transmitter'
  unit: Unit;               // MPA/Bar for gauges, mA for transmitters
  outputUnit?: Unit;        // Optional output unit (e.g., temperature) for gauges that translate input->output
  minRange: number;         // pressure min (for gauges) or pressure min mapping for transmitter
  maxRange: number;         // pressure max
  // For transmitters, optionally specify current output range (e.g., 4-20 mA)
  currentMin?: number;
  currentMax?: number;
  // Optional explicit output range when mapping input -> output (e.g., 0-100°C)
  outputMin?: number;
  outputMax?: number;
  // Notes and images per-gauge
  notes?: string;
  images?: string[];
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
