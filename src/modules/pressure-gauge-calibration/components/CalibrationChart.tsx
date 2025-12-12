import { Box, Paper, Typography } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Gauge } from '../types';

interface CalibrationChartProps {
  gauge: Gauge;
}

export default function CalibrationChart({ gauge }: CalibrationChartProps) {
  const chartData = gauge.points.map(p => ({
    input: p.inputDesired,
    expected: p.outputExpected,
    actual: p.outputActual,
    error: p.error || 0,
  }));

  if (chartData.length < 2) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="textSecondary">Need at least 2 calibration points to display chart</Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ width: '100%', height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="input" label={{ value: `Input (${gauge.unit})`, position: 'insideBottom', offset: -5 }} />
          <YAxis label={{ value: 'Output (mA)', angle: -90, position: 'insideLeft' }} />
          <Tooltip formatter={(v) => (v as number).toFixed(4)} />
          <Legend />
          <Line type="monotone" dataKey="expected" stroke="#8884d8" name="Expected Output" />
          <Line type="monotone" dataKey="actual" stroke="#82ca9d" name="Actual Output" />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
