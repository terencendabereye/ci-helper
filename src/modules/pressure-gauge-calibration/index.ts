import PressureGaugeCalibration from './PressureGaugeCalibration';
import type { CIModule } from '../../shared/types/module';

export const PressureGaugeCalibrationModule: CIModule = {
  id: 'pressure-gauge-calibration',
  name: 'Pressure Gauge Calibration',
  description: 'Calibrate pressure gauges with detailed error tracking, charts, and PDF reports',
  icon: 'Functions',
  category: 'Calibration',
  component: PressureGaugeCalibration,
};

export default PressureGaugeCalibration;
