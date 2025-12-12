# 🔧 Instrumentation Module Development Guide

This guide has tips specific to building calculation modules for control and instrumentation work.

## 🎯 Common Instrumentation Modules

Here are modules you might want to build for field work:

### 1. **Pressure Unit Converter**
```
Convert between: Pa, kPa, MPa, Bar, PSI, atm, mmHg, inH2O
```
Perfect for: Gauge readings, sensor data, pressure specifications

### 2. **Temperature Converter**
```
Convert between: Celsius, Fahrenheit, Kelvin, Rankine
Plus: Temperature offset/scale calculations
```
Perfect for: RTD calibration, sensor readings

### 3. **Flow Rate Converter**
```
Convert between: m³/s, L/min, L/s, GPM, CFM
Plus: Differential pressure → flow calculations
```
Perfect for: Flow meter readings

### 4. **Signal Scaler (4-20mA)**
```
Convert between: Milliamps, engineering units, percentages
Linear interpolation on steroids
```
Perfect for: Analog signal conditioning, DAQ conversions

### 5. **Resistance (RTD/Thermistor) Calculator**
```
Convert: RTD resistance → Temperature (Pt100, Pt1000)
Uses: Callendar-Van Dusen or simplified Steinhart-Hart equations
```
Perfect for: RTD calibration, temperature sensors

### 6. **Decibel (dB) Calculator**
```
Power dB: 10*log10(P2/P1)
Voltage dB: 20*log10(V2/V1)
```
Perfect for: Signal analysis, attenuation calculations

## 📋 Module Template for Instrumentation

```typescript
// calculations.ts - Pure math functions
export interface UnitConfig {
  name: string;
  symbol: string;
  toBase: (value: number) => number;  // Convert to base unit
  fromBase: (value: number) => number; // Convert from base unit
}

export const UNIT_PRESETS = {
  pressure: {
    'Pa': { /* config */ },
    'kPa': { /* config */ },
    'PSI': { /* config */ },
    // ...
  },
  temperature: { /* ... */ },
};

export function convert(
  value: number,
  fromUnit: UnitConfig,
  toUnit: UnitConfig
): number {
  const baseValue = fromUnit.toBase(value);
  return toUnit.fromBase(baseValue);
}

// hooks.ts
export function useUnitConverter() {
  const [inputValue, setInputValue] = useState<number>(0);
  const [inputUnit, setInputUnit] = useState<string>('Pa');
  const [outputUnit, setOutputUnit] = useState<string>('kPa');
  const [history, setHistory] = useState<ConversionRecord[]>(() =>
    getFromStorage('unit_converter_history', [])
  );

  const result = useMemo(() => 
    convert(inputValue, UNITS[inputUnit], UNITS[outputUnit]),
    [inputValue, inputUnit, outputUnit]
  );

  const addToHistory = useCallback((record) => {
    const newHistory = [...history, record];
    saveToStorage('unit_converter_history', newHistory);
    setHistory(newHistory);
  }, [history]);

  return { inputValue, setInputValue, result, history, addToHistory };
}
```

## 🛠️ Special Features for Instrumentation

### 1. **Calculation History**
```typescript
interface CalculationRecord {
  timestamp: number;
  input: number;
  output: number;
  inputUnit: string;
  outputUnit: string;
  notes?: string;
}

// Save important calculations
const addToHistory = (record: CalculationRecord) => {
  const history = getFromStorage('calc_history', []);
  saveToStorage('calc_history', [...history, record]);
};

// Export for field reports
const exportHistory = (history: CalculationRecord[]) => {
  const csv = history.map(r => 
    `${new Date(r.timestamp).toISOString()},${r.input},${r.output},${r.inputUnit},${r.outputUnit}`
  ).join('\n');
  // Copy to clipboard or download
};
```

### 2. **Unit Presets for Common Equipment**
```typescript
const SENSOR_PRESETS = {
  'Omega PT100': {
    type: 'RTD',
    range: [-50, 250],
    units: 'Celsius',
    conversion: 'pt100_3850'
  },
  'Hydac Pressure Transmitter': {
    type: 'pressure',
    range: [0, 350],
    units: 'bar',
    output: '4-20mA'
  },
  // ... more presets
};
```

### 3. **Measurement Uncertainty**
```typescript
interface MeasurementWithUncertainty {
  value: number;
  uncertainty: number; // ±value
  unit: string;
}

export function calculateUncertainty(
  value: number,
  sensorAccuracy: number,  // % of reading
  resolutionBits: number
): MeasurementWithUncertainty {
  const accuracyError = value * (sensorAccuracy / 100);
  const resolutionError = value / (2 ** resolutionBits);
  const totalUncertainty = Math.sqrt(accuracyError ** 2 + resolutionError ** 2);
  
  return {
    value,
    uncertainty: totalUncertainty,
    unit: 'measurement units'
  };
}
```

### 4. **Calibration Points**
```typescript
interface CalibrationPoint {
  reading: number;      // What sensor read
  reference: number;    // Actual/true value
  timestamp: number;
  equipment: string;
  technician?: string;
}

export function calibrationError(points: CalibrationPoint[]) {
  // Calculate linearity, accuracy, hysteresis
}

export function generateCalibrationCertificate(points: CalibrationPoint[]) {
  // Generate report with uncertainty analysis
}
```

## 🔬 Calculation Patterns

### Pattern 1: Linear Conversion (Already Implemented!)
```typescript
// Any A → B if relationship is linear: B = m*A + b
export function linearConversion(value, m, b) {
  return m * value + b;
}
```

### Pattern 2: Polynomial Conversion
```typescript
// Useful for RTD: R = R0(1 + A*t + B*t² + C*(t-100)*t³)
export function polynomialConversion(value, coefficients) {
  return coefficients.reduce((sum, coef, i) => 
    sum + coef * Math.pow(value, i), 0
  );
}
```

### Pattern 3: Piecewise Conversion
```typescript
// Different formula for different ranges (e.g., thermocouple types)
export function piecewiseConversion(value, segments) {
  const segment = segments.find(s => 
    value >= s.rangeMin && value <= s.rangeMax
  );
  return segment?.convert(value) ?? null;
}
```

### Pattern 4: Iterative Calculation
```typescript
// For complex equations (e.g., RTD Callendar-Van Dusen)
export function iterativeCalibration(value, accuracy = 0.001) {
  let result = initialGuess(value);
  let error = Infinity;
  
  while (error > accuracy) {
    const next = improveEstimate(result);
    error = Math.abs(next - result);
    result = next;
  }
  
  return result;
}
```

## 📊 UI Components for Instrumentation

### Reading Display
```tsx
<Paper sx={{ p: 2, mb: 2, textAlign: 'center' }}>
  <Typography variant="caption" color="textSecondary">Current Reading</Typography>
  <Typography variant="h2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
    {reading.toFixed(4)}
  </Typography>
  <Typography variant="caption">{unit}</Typography>
  {/* Show uncertainty if available */}
  <Typography variant="caption" color="error">
    ±{uncertainty.toFixed(4)}
  </Typography>
</Paper>
```

### Range Selector
```tsx
<FormControl fullWidth size="small" sx={{ mb: 2 }}>
  <InputLabel>Sensor Range</InputLabel>
  <Select value={range} onChange={(e) => setRange(e.target.value)}>
    <MenuItem value="0-100">0-100 mA/unit</MenuItem>
    <MenuItem value="4-20">4-20 mA (standard)</MenuItem>
    <MenuItem value="0-10">0-10 V</MenuItem>
  </Select>
</FormControl>
```

### Unit Toggle
```tsx
<ButtonGroup variant="outlined" fullWidth>
  {['Celsius', 'Fahrenheit', 'Kelvin'].map(unit => (
    <Button
      key={unit}
      onClick={() => setUnit(unit)}
      variant={unit === selectedUnit ? 'contained' : 'outlined'}
    >
      {unit}
    </Button>
  ))}
</ButtonGroup>
```

## ✅ Validation for Instrumentation

```typescript
export function validateMeasurement(
  value: number,
  sensorRange: [number, number],
  units: string
): { isValid: boolean; warning?: string; error?: string } {
  // Out of range warning
  if (value < sensorRange[0] || value > sensorRange[1]) {
    return { 
      isValid: true, 
      warning: `Reading ${value} ${units} is outside typical sensor range` 
    };
  }

  // Unrealistic values
  if (isNaN(value) || !isFinite(value)) {
    return { 
      isValid: false, 
      error: 'Invalid measurement value' 
    };
  }

  // Signal saturation
  if (value <= sensorRange[0] + 1 || value >= sensorRange[1] - 1) {
    return { 
      isValid: true, 
      warning: 'Measurement near sensor limits - consider equipment check' 
    };
  }

  return { isValid: true };
}
```

## 🔒 Measurement Data Structure

```typescript
interface FieldMeasurement {
  id: string;
  timestamp: number;
  location: string;
  equipment: string;
  measurement: number;
  unit: string;
  temperature: number;           // Ambient for corrections
  humidity: number;              // If relevant
  notes: string;
  technician: string;
  certified: boolean;
  uncertainty: number;
  calibrationDate?: number;      // When was sensor last calibrated?
}

// Store multiple measurements
const measurements: FieldMeasurement[] = [];
saveToStorage(StorageKey.USER_DATA, measurements);
```

## 📈 Recommended Module Progression

### Phase 1: Basic Conversions
1. ✅ Linear Interpolation (done!)
2. Pressure Unit Converter
3. Temperature Converter
4. Simple Unit Converter (generic)

### Phase 2: Signal Conditioning
1. 4-20mA Signal Scaler
2. Decibel Calculator
3. Analog Output Converter (0-10V, etc.)

### Phase 3: Sensor Specific
1. RTD Calculator (Pt100)
2. Thermocouple Converter
3. Calibration Verification

### Phase 4: Analysis Tools
1. Measurement History
2. Calibration Report Generator
3. Uncertainty Calculator
4. Data Export (CSV, PDF)

## 💾 Offline Considerations

```typescript
// Save calibration data locally
const saveCalibrationData = (data: CalibrationRecord[]) => {
  saveToStorage(StorageKey.CALIBRATION_HISTORY, data);
};

// Export when network available
const syncToCloud = async (data: any) => {
  try {
    await fetch('/api/calibrations', { method: 'POST', body: JSON.stringify(data) });
  } catch (error) {
    // Offline - data stays local, syncs when online
    console.log('Offline - will sync when connected');
  }
};
```

## 🧪 Testing Tips for Instrumentation

1. **Test with Real Sensor Data**
   - Use actual calibration certificates
   - Verify conversions match sensor specs

2. **Test Edge Cases**
   - Saturation points (0 and max)
   - Below/above range values
   - Negative numbers
   - Very large numbers

3. **Accuracy Testing**
   - Compare with manufacturer specs
   - Cross-check with standard references
   - Verify decimal precision

4. **Field Simulation**
   - Test on actual mobile device
   - Try offline mode
   - Test with gloved hands (larger touch targets)
   - Test with bright sunlight (contrast)

## 📚 Instrumentation Resources

- **Standards**: ISO 13485 (medical), ISO 17025 (calibration labs)
- **Physics**: NIST Special Publication 330 (SI units)
- **Conversions**: NIST Special Publication 811
- **Sensor Specs**: Check manufacturer datasheets
- **Uncertainty**: GUM (Guide to the Expression of Uncertainty)

## 🎯 Real-World Use Case Example

```
Field Technician Underground:
1. Measures pressure: 2.5 bar (using 4-20mA transmitter)
2. Opens CI Helper → Pressure Converter
3. Inputs: 2.5 bar
4. Gets: 
   - 250 kPa
   - 36.3 PSI
   - 0.0247 atm
5. Takes screenshot
6. Notes: "Main line pressure acceptable"
7. Calculation saved to history
8. Later (back at office) → Export report with all measurements
```

---

**Building calculation tools for field professionals? You're creating value! Keep these patterns in mind.** 🔧

See ARCHITECTURE.md for general development guidelines and examples.
