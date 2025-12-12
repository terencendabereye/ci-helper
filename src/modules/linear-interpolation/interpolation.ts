/**
 * Linear Interpolation Utility
 *
 * Interpolates a value based on input and output ranges
 * Formula: y = y1 + (x - x1) * (y2 - y1) / (x2 - x1)
 */

export interface InterpolationRange {
  minInput: number;
  maxInput: number;
  minOutput: number;
  maxOutput: number;
}

export function validateRange(range: InterpolationRange): {
  isValid: boolean;
  error?: string;
} {
  if (range.minInput === range.maxInput) {
    return { isValid: false, error: 'Input range cannot have min equal to max' };
  }
  if (!isFinite(range.minInput) || !isFinite(range.maxInput)) {
    return { isValid: false, error: 'Input range values must be finite numbers' };
  }
  if (!isFinite(range.minOutput) || !isFinite(range.maxOutput)) {
    return {
      isValid: false,
      error: 'Output range values must be finite numbers',
    };
  }
  return { isValid: true };
}

export function interpolate(
  value: number,
  range: InterpolationRange
): number {
  const { minInput, maxInput, minOutput, maxOutput } = range;

  // Clamp value to input range
  const clampedValue = Math.max(minInput, Math.min(maxInput, value));

  // Linear interpolation formula
  const ratio = (clampedValue - minInput) / (maxInput - minInput);
  const result = minOutput + ratio * (maxOutput - minOutput);

  return result;
}

export function interpolateWithoutClamping(
  value: number,
  range: InterpolationRange
): number {
  const { minInput, maxInput, minOutput, maxOutput } = range;
  const ratio = (value - minInput) / (maxInput - minInput);
  const result = minOutput + ratio * (maxOutput - minOutput);
  return result;
}

/**
 * Reverse interpolation: given an output value, find the input value
 */
export function reverseInterpolate(
  outputValue: number,
  range: InterpolationRange
): number {
  const { minInput, maxInput, minOutput, maxOutput } = range;

  // Clamp to output range
  const clampedValue = Math.max(minOutput, Math.min(maxOutput, outputValue));

  // Reverse formula
  const ratio = (clampedValue - minOutput) / (maxOutput - minOutput);
  const result = minInput + ratio * (maxInput - minInput);

  return result;
}
