import type { CIModule } from '../../shared/types/module';
import LinearInterpolationComponent from './LinearInterpolation';

export const LinearInterpolationModule: CIModule = {
  id: 'linear-interpolation',
  name: 'Linear Interpolation',
  description: 'Scale and convert values between input and output ranges',
  icon: 'Functions',
  component: LinearInterpolationComponent,
  category: 'calculation',
};

export { default } from './LinearInterpolation';
