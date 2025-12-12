import { useState, useCallback } from 'react';
import type { InterpolationRange } from './interpolation';
import { interpolate, reverseInterpolate } from './interpolation';
import { getFromStorage, saveToStorage, StorageKey } from '../../shared/utils/storage';

const STORAGE_KEY = `${StorageKey.MODULE_SETTINGS}_linear_interpolation`;

export function useLinearInterpolation() {
  const [range, setRange] = useState<InterpolationRange>(() => {
    return getFromStorage(STORAGE_KEY, {
      minInput: 0,
      maxInput: 100,
      minOutput: 0,
      maxOutput: 1000,
    });
  });

  const [value, setValue] = useState<number>(0);
  const [result, setResult] = useState<number>(0);

  const updateRange = useCallback((newRange: InterpolationRange) => {
    setRange(newRange);
    saveToStorage(STORAGE_KEY, newRange);
  }, []);

  const calculate = useCallback((inputValue: number) => {
    setValue(inputValue);
    const interpolated = interpolate(inputValue, range);
    setResult(interpolated);
  }, [range]);

  const reverseCalculate = useCallback((outputValue: number) => {
    setResult(outputValue);
    const reversed = reverseInterpolate(outputValue, range);
    setValue(reversed);
  }, [range]);

  return {
    range,
    updateRange,
    value,
    setValue,
    result,
    setResult,
    calculate,
    reverseCalculate,
  };
}
