import { Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import type { Job, DeviceType } from '../types';

interface GaugeSelectorProps {
  job?: Job;
  activeGaugeId: string | null;
  onSelectGauge: (gaugeId: string) => void;
  createGauge: (jobId: string, label: string, deviceType: DeviceType, unit: string, minRange: number, maxRange: number, currentMin?: number, currentMax?: number, outputUnit?: string, outputMin?: number, outputMax?: number) => any;
  deleteGauge?: (jobId: string, gaugeId: string) => void;
}

export default function GaugeSelector({ job, activeGaugeId, onSelectGauge, createGauge, deleteGauge }: GaugeSelectorProps) {
  const [newGaugeDialog, setNewGaugeDialog] = useState(false);
  const [gaugeForm, setGaugeForm] = useState<any>({
    label: '',
    deviceType: 'gauge',
    unit: 'MPA',
    minRange: 0,
    maxRange: 100,
    currentMin: 4,
    currentMax: 20,
    outputUnit: 'MPA',
    outputMin: 0,
    outputMax: 100,
  });

  const handleCreateGauge = () => {
    if (job && gaugeForm.label.trim()) {
      createGauge(job.id, gaugeForm.label, gaugeForm.deviceType, gaugeForm.unit, Number(gaugeForm.minRange), Number(gaugeForm.maxRange), gaugeForm.deviceType === 'transmitter' ? Number(gaugeForm.currentMin) : undefined, gaugeForm.deviceType === 'transmitter' ? Number(gaugeForm.currentMax) : undefined, gaugeForm.outputUnit, Number(gaugeForm.outputMin), Number(gaugeForm.outputMax));
      setGaugeForm({ label: '', deviceType: 'gauge', unit: 'MPA', minRange: 0, maxRange: 100, currentMin: 4, currentMax: 20, outputUnit: 'MPA', outputMin: 0, outputMax: 100 });
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
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', bgcolor: activeGaugeId === gauge.id ? 'primary.light' : 'paper', transition: 'all 0.3s' }}
            >
              <CardContent onClick={() => onSelectGauge(gauge.id)} sx={{ flex: 1 }}>
                <Typography variant="h6">{gauge.label}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Input: {gauge.unit}: {gauge.minRange} – {gauge.maxRange}
                </Typography>
                {gauge.outputUnit && (
                  <Typography variant="body2" color="textSecondary">
                    Output: {gauge.outputUnit}: {gauge.outputMin ?? '-'} – {gauge.outputMax ?? '-'}
                  </Typography>
                )}
                <Typography variant="caption" color="textSecondary">
                  {gauge.points.length} calibration points
                </Typography>
              </CardContent>
              <Box sx={{ pr: 1 }}>
                <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); deleteGauge && job && deleteGauge(job.id, gauge.id); }}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Card>
          ))}
        </Box>
      )}

      {/* New Gauge Dialog */}
      <Dialog open={newGaugeDialog} onClose={() => setNewGaugeDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Gauge / Transmitter</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField
            label="Label"
            fullWidth
            value={gaugeForm.label}
            onChange={(e) => setGaugeForm((f: any) => ({ ...f, label: e.target.value }))}
            placeholder="e.g., PT-101 or TX-201"
          />
          <TextField
            select
            label="Device Type"
            value={gaugeForm.deviceType}
            onChange={(e) => setGaugeForm((f: any) => ({ ...f, deviceType: e.target.value }))}
            SelectProps={{ native: true }}
          >
            <option value="gauge">Gauge</option>
            <option value="transmitter">Transmitter</option>
          </TextField>
          <TextField
            select
            label="Unit"
            value={gaugeForm.unit}
            onChange={(e) => setGaugeForm((f: any) => ({ ...f, unit: e.target.value }))}
            SelectProps={{ native: true }}
          >
            <option value="MPA">MPA</option>
            <option value="Bar">Bar</option>
          </TextField>
          {gaugeForm.deviceType === 'gauge' && (
            <TextField
              select
              label="Output Unit"
              value={gaugeForm.outputUnit}
              onChange={(e) => setGaugeForm((f: any) => ({ ...f, outputUnit: e.target.value }))}
              SelectProps={{ native: true }}
            >
              <option value="MPA">MPA</option>
              <option value="Bar">Bar</option>
              <option value="C">°C</option>
              <option value="F">°F</option>
            </TextField>
          )}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField
              type="number"
              label="Min Range"
              fullWidth
              value={gaugeForm.minRange}
              onChange={(e) => setGaugeForm((f: any) => ({ ...f, minRange: e.target.value }))}
            />
            <TextField
              type="number"
              label="Max Range"
              fullWidth
              value={gaugeForm.maxRange}
              onChange={(e) => setGaugeForm((f: any) => ({ ...f, maxRange: e.target.value }))}
            />
          </Box>

          {gaugeForm.deviceType === 'transmitter' && (
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                type="number"
                label="Current Min (mA)"
                value={gaugeForm.currentMin}
                onChange={(e) => setGaugeForm((f: any) => ({ ...f, currentMin: e.target.value }))}
              />
              <TextField
                type="number"
                label="Current Max (mA)"
                value={gaugeForm.currentMax}
                onChange={(e) => setGaugeForm((f: any) => ({ ...f, currentMax: e.target.value }))}
              />
            </Box>
          )}
          {gaugeForm.deviceType === 'gauge' && (
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                type="number"
                label="Output Min"
                fullWidth
                value={gaugeForm.outputMin}
                onChange={(e) => setGaugeForm((f: any) => ({ ...f, outputMin: e.target.value }))}
              />
              <TextField
                type="number"
                label="Output Max"
                fullWidth
                value={gaugeForm.outputMax}
                onChange={(e) => setGaugeForm((f: any) => ({ ...f, outputMax: e.target.value }))}
              />
            </Box>
          )}
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
