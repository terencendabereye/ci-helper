import { Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import type { Job } from '../types';
import { usePressureGaugeCalibration } from '../hooks';

interface GaugeSelectorProps {
  job?: Job;
  activeGaugeId: string | null;
  onSelectGauge: (gaugeId: string) => void;
}

export default function GaugeSelector({ job, activeGaugeId, onSelectGauge }: GaugeSelectorProps) {
  const { createGauge } = usePressureGaugeCalibration();
  const [newGaugeDialog, setNewGaugeDialog] = useState(false);
  const [gaugeForm, setGaugeForm] = useState({
    label: '',
    unit: 'MPA' as 'MPA' | 'Bar',
    minRange: 0,
    maxRange: 100,
  });

  const handleCreateGauge = () => {
    if (job && gaugeForm.label.trim()) {
      createGauge(job.id, gaugeForm.label, gaugeForm.unit, gaugeForm.minRange, gaugeForm.maxRange);
      setGaugeForm({ label: '', unit: 'MPA', minRange: 0, maxRange: 100 });
      setNewGaugeDialog(false);
    }
  };

  if (!job) {
    return <Typography>No job selected</Typography>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Gauges ({job.gauges.length})</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setNewGaugeDialog(true)}>
          Add Gauge
        </Button>
      </Box>

      {job.gauges.length === 0 ? (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="textSecondary">No gauges added. Click "Add Gauge" to begin calibration.</Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'grid', gap: 2 }}>
          {job.gauges.map(gauge => (
            <Card
              key={gauge.id}
              onClick={() => onSelectGauge(gauge.id)}
              sx={{ cursor: 'pointer', bgcolor: activeGaugeId === gauge.id ? 'primary.light' : 'paper', transition: 'all 0.3s' }}
            >
              <CardContent>
                <Typography variant="h6">{gauge.label}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {gauge.unit}: {gauge.minRange} – {gauge.maxRange}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {gauge.points.length} calibration points
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* New Gauge Dialog */}
      <Dialog open={newGaugeDialog} onClose={() => setNewGaugeDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Gauge</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField
            label="Gauge Label"
            fullWidth
            value={gaugeForm.label}
            onChange={(e) => setGaugeForm(f => ({ ...f, label: e.target.value }))}
            placeholder="e.g., PT-101"
          />
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField
              select
              label="Unit"
              value={gaugeForm.unit}
              onChange={(e) => setGaugeForm(f => ({ ...f, unit: e.target.value as 'MPA' | 'Bar' }))}
              SelectProps={{ native: true }}
            >
              <option value="MPA">MPA</option>
              <option value="Bar">Bar</option>
            </TextField>
          </Box>
          <TextField
            type="number"
            label="Min Range"
            fullWidth
            value={gaugeForm.minRange}
            onChange={(e) => setGaugeForm(f => ({ ...f, minRange: parseFloat(e.target.value) || 0 }))}
          />
          <TextField
            type="number"
            label="Max Range"
            fullWidth
            value={gaugeForm.maxRange}
            onChange={(e) => setGaugeForm(f => ({ ...f, maxRange: parseFloat(e.target.value) || 100 }))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewGaugeDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateGauge} variant="contained" disabled={!gaugeForm.label.trim()}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
