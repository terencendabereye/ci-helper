import { useState, useEffect } from 'react';
import { useTheme, useMediaQuery } from '@mui/material';
import {
  Container,
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  Divider,
  Alert,
} from '@mui/material';
import { ModuleHeader } from '../../shared/components/ModuleHeader';
import { useLinearInterpolation } from './hooks';
import { validateRange } from './interpolation';

interface LinearInterpolationProps {
  onBack?: () => void;
}

export default function LinearInterpolation({
  onBack,
}: LinearInterpolationProps) {
  const { range, updateRange, value, result, calculate, reverseCalculate } =
    useLinearInterpolation();

  const [validationError, setValidationError] = useState<string>('');
  const [inputs, setInputs] = useState<Record<string, string>>(() => ({
    minInput: String(range.minInput),
    maxInput: String(range.maxInput),
    minOutput: String(range.minOutput),
    maxOutput: String(range.maxOutput),
    value: String(value),
    result: String(result),
  }));
  const [inputWarning, setInputWarning] = useState<string>('');
  const [outputWarning, setOutputWarning] = useState<string>('');

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md')) || useMediaQuery('(pointer:fine)');

  useEffect(() => {
    setInputs({
      minInput: String(range.minInput),
      maxInput: String(range.maxInput),
      minOutput: String(range.minOutput),
      maxOutput: String(range.maxOutput),
      value: String(value),
      result: String(result),
    });
  }, [range, value, result]);

  const handleRangeInputChange = (field: keyof typeof range, newValue: string) => {
    setInputs((s) => ({ ...s, [field]: newValue }));
  };

  const commitRangeField = (field: keyof typeof range) => {
    const str = (inputs[field] ?? '').trim();
    if (str === '') {
      // allow empty while typing; don't validate until user provides a number
      setValidationError('');
      return;
    }
    const numValue = parseFloat(str);
    if (!isNaN(numValue)) {
      const newRange = { ...range, [field]: numValue };
      const validation = validateRange(newRange);

      if (validation.isValid) {
        updateRange(newRange);
        setValidationError('');
      } else {
        setValidationError(validation.error || 'Invalid range');
      }
    } else {
      setValidationError('Please enter a valid number');
    }
  };

  const checkInputRange = (num: number) => {
    if (num < Math.min(range.minInput, range.maxInput) || num > Math.max(range.minInput, range.maxInput)) {
      setInputWarning(`Value ${num} is outside input range (${range.minInput}–${range.maxInput})`);
    } else {
      setInputWarning('');
    }
  };

  const checkOutputRange = (num: number) => {
    if (num < Math.min(range.minOutput, range.maxOutput) || num > Math.max(range.minOutput, range.maxOutput)) {
      setOutputWarning(`Value ${num} is outside output range (${range.minOutput}–${range.maxOutput})`);
    } else {
      setOutputWarning('');
    }
  };

  const handleCalculate = () => {
    calculate(value);
  };

  const handleReverseCalculate = () => {
    reverseCalculate(result);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <ModuleHeader title="Linear Interpolation" onBack={onBack} />

      <Container maxWidth="sm" sx={{ py: 3, flex: 1 }}>
        {/* Range Configuration */}
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Configure Range
          </Typography>
          <Typography variant="caption" color="textSecondary" sx={{ mb: 2, display: 'block' }}>
            Set your input and output ranges for interpolation
          </Typography>

          {validationError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {validationError}
            </Alert>
          )}

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField
              label="Min Input"
              type="number"
              value={inputs.minInput}
              onChange={(e) => handleRangeInputChange('minInput', e.target.value)}
              onBlur={() => commitRangeField('minInput')}
              fullWidth
              size="small"
            />
            <TextField
              label="Max Input"
              type="number"
              value={inputs.maxInput}
              onChange={(e) => handleRangeInputChange('maxInput', e.target.value)}
              onBlur={() => commitRangeField('maxInput')}
              fullWidth
              size="small"
            />
            <TextField
              label="Min Output"
              type="number"
              value={inputs.minOutput}
              onChange={(e) => handleRangeInputChange('minOutput', e.target.value)}
              onBlur={() => commitRangeField('minOutput')}
              fullWidth
              size="small"
            />
            <TextField
              label="Max Output"
              type="number"
              value={inputs.maxOutput}
              onChange={(e) => handleRangeInputChange('maxOutput', e.target.value)}
              onBlur={() => commitRangeField('maxOutput')}
              fullWidth
              size="small"
            />
          </Box>

          {/* Range Summary */}
          <Box sx={{ mt: 2, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
            <Typography variant="caption">
              Input Range: {range.minInput} → {range.maxInput}
            </Typography>
            <br />
            <Typography variant="caption">
              Output Range: {range.minOutput} → {range.maxOutput}
            </Typography>
          </Box>
        </Paper>

        <Divider sx={{ my: 2 }} />

        {/* Forward Interpolation */}
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Forward Interpolation
          </Typography>
          <Typography variant="caption" color="textSecondary" sx={{ mb: 2, display: 'block' }}>
            Input → Output
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 2 }}>
            <TextField
              label="Input Value"
              type="number"
              value={inputs.value}
              onChange={(e) => setInputs((s) => ({ ...s, value: e.target.value }))}
              onBlur={() => {
                const str = (inputs.value ?? '').trim();
                if (str === '') return;
                const val = parseFloat(str);
                if (!isNaN(val)) {
                  calculate(val);
                  checkInputRange(val);
                }
              }}
              fullWidth
              size="small"
            />
            {isDesktop && (
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <Button size="small" onClick={() => { const v = parseFloat(inputs.value||'0')||0; const nv = v - 1; setInputs(s=>({...s, value:String(nv)})); calculate(nv); checkInputRange(nv); }}>-1</Button>
                <Button size="small" onClick={() => { const v = parseFloat(inputs.value||'0')||0; const nv = v + 1; setInputs(s=>({...s, value:String(nv)})); calculate(nv); checkInputRange(nv); }}>+1</Button>
              </Box>
            )}
          </Box>
          {inputWarning && (
            <Alert severity="warning" sx={{ mb: 2 }}>{inputWarning}</Alert>
          )}

          <Button
            variant="contained"
            onClick={handleCalculate}
            fullWidth
            sx={{ mb: 2 }}
          >
            Calculate
          </Button>

          <Box sx={{ p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
            <Typography variant="caption" color="textSecondary">
              Output
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              {result.toFixed(4)}
            </Typography>
          </Box>
        </Paper>

        {/* Reverse Interpolation */}
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Reverse Interpolation
          </Typography>
          <Typography variant="caption" color="textSecondary" sx={{ mb: 2, display: 'block' }}>
            Output → Input (Find the input that produces this output)
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 2 }}>
            <TextField
              label="Output Value"
              type="number"
              value={inputs.result}
              onChange={(e) => setInputs((s) => ({ ...s, result: e.target.value }))}
              onBlur={() => {
                const str = (inputs.result ?? '').trim();
                if (str === '') return;
                const val = parseFloat(str);
                if (!isNaN(val)) {
                  reverseCalculate(val);
                  checkOutputRange(val);
                }
              }}
              fullWidth
              size="small"
            />
            {isDesktop && (
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <Button size="small" onClick={() => { const v = parseFloat(inputs.result||'0')||0; const nv = v - 1; setInputs(s=>({...s, result:String(nv)})); reverseCalculate(nv); checkOutputRange(nv); }}>-1</Button>
                <Button size="small" onClick={() => { const v = parseFloat(inputs.result||'0')||0; const nv = v + 1; setInputs(s=>({...s, result:String(nv)})); reverseCalculate(nv); checkOutputRange(nv); }}>+1</Button>
              </Box>
            )}
          </Box>
          {outputWarning && (
            <Alert severity="warning" sx={{ mb: 2 }}>{outputWarning}</Alert>
          )}

          <Button
            variant="contained"
            color="secondary"
            onClick={handleReverseCalculate}
            fullWidth
            sx={{ mb: 2 }}
          >
            Calculate Reverse
          </Button>

          <Box sx={{ p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
            <Typography variant="caption" color="textSecondary">
              Input
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              {value.toFixed(4)}
            </Typography>
          </Box>
        </Paper>

        {/* Help Section */}
        <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            💡 How It Works
          </Typography>
          <Typography variant="body2" component="div" sx={{ mb: 1 }}>
            Linear interpolation finds a value between two known values on a linear scale.
          </Typography>
          <Typography variant="caption" component="div" sx={{ mb: 1 }}>
            📌 <strong>Example:</strong> If input range is 0-100 and output range is 0-1000,
            an input of 50 would output 500.
          </Typography>
          <Typography variant="caption">
            📌 Useful for: Sensor calibration, scale conversion, data mapping
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
