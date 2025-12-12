import { useState } from 'react';
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

  const handleRangeChange = (field: keyof typeof range, newValue: string) => {
    const numValue = parseFloat(newValue);
    if (!isNaN(numValue)) {
      const newRange = { ...range, [field]: numValue };
      const validation = validateRange(newRange);

      if (validation.isValid) {
        updateRange(newRange);
        setValidationError('');
      } else {
        setValidationError(validation.error || 'Invalid range');
      }
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
              value={range.minInput}
              onChange={(e) =>
                handleRangeChange('minInput', e.target.value)
              }
              fullWidth
              size="small"
            />
            <TextField
              label="Max Input"
              type="number"
              value={range.maxInput}
              onChange={(e) =>
                handleRangeChange('maxInput', e.target.value)
              }
              fullWidth
              size="small"
            />
            <TextField
              label="Min Output"
              type="number"
              value={range.minOutput}
              onChange={(e) =>
                handleRangeChange('minOutput', e.target.value)
              }
              fullWidth
              size="small"
            />
            <TextField
              label="Max Output"
              type="number"
              value={range.maxOutput}
              onChange={(e) =>
                handleRangeChange('maxOutput', e.target.value)
              }
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

          <TextField
            label="Input Value"
            type="number"
            value={value}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              if (!isNaN(val)) {
                calculate(val);
              }
            }}
            fullWidth
            size="small"
            sx={{ mb: 2 }}
          />

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

          <TextField
            label="Output Value"
            type="number"
            value={result}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              if (!isNaN(val)) {
                reverseCalculate(val);
              }
            }}
            fullWidth
            size="small"
            sx={{ mb: 2 }}
          />

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
