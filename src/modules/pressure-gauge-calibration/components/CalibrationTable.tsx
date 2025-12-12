import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, Paper, Alert, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import type { Gauge, CalibrationPoint } from '../types';
import { calculateStats } from '../utils';

interface CalibrationTableProps {
  gauge: Gauge;
  jobId: string;
  addCalibrationPoint: (jobId: string, gaugeId: string, point: Omit<CalibrationPoint, 'id' | 'error' | 'errorPercent'>) => void;
  addCalibrationPoints?: (jobId: string, gaugeId: string, points: Array<Omit<CalibrationPoint, 'id' | 'error' | 'errorPercent'>>) => void;
  deleteCalibrationPoint: (jobId: string, gaugeId: string, pointId: string) => void;
  updateCalibrationPoint?: (jobId: string, gaugeId: string, pointId: string, updates: Partial<CalibrationPoint>) => void;
  updateGauge?: (jobId: string, gaugeId: string, updates: Partial<Gauge>) => void;
}

export default function CalibrationTable({ gauge, jobId, addCalibrationPoint, addCalibrationPoints, deleteCalibrationPoint, updateCalibrationPoint, updateGauge }: CalibrationTableProps) {
  const [newPointDialog, setNewPointDialog] = useState(false);
  const [newPoint, setNewPoint] = useState({
    inputDesired: '',
    inputActual: '',
    outputExpected: '',
    outputActual: '',
  });
  const [bulkParamDialogOpen, setBulkParamDialogOpen] = useState(false);
  const [bulkTableDialogOpen, setBulkTableDialogOpen] = useState(false);
  const [bulkForm, setBulkForm] = useState({ start: '', end: '', step: '' });
  const [bulkRows, setBulkRows] = useState<Array<{ inputDesired: string; inputActual: string; outputExpected: string; outputActual: string }>>([]);

  const stats = calculateStats(gauge.points);

  const handleAddPoint = () => {
    const input = {
      inputDesired: parseFloat(newPoint.inputDesired) || 0,
      inputActual: parseFloat(newPoint.inputActual) || 0,
      outputExpected: parseFloat(newPoint.outputExpected) || 0,
      outputActual: parseFloat(newPoint.outputActual) || 0,
    };

    addCalibrationPoint(jobId, gauge.id, input);
    setNewPoint({ inputDesired: '', inputActual: '', outputExpected: '', outputActual: '' });
    setNewPointDialog(false);
  };

  const mapValue = (v: number, inMin: number, inMax: number, outMin: number, outMax: number) => {
    if (inMax === inMin) return outMin;
    return outMin + ((v - inMin) * (outMax - outMin)) / (inMax - inMin);
  };

  const handleGenerateBulkTable = () => {
    const start = parseFloat(bulkForm.start);
    const end = parseFloat(bulkForm.end);
    const step = parseFloat(bulkForm.step) || 0;
    if (isNaN(start) || isNaN(end) || step <= 0) return;
    const rows: typeof bulkRows = [];
    for (let v = start; v <= end + 1e-9; v += step) {
      let expected = v;
      if (gauge.deviceType === 'transmitter' && typeof gauge.currentMin === 'number' && typeof gauge.currentMax === 'number') {
        expected = mapValue(v, gauge.minRange, gauge.maxRange, gauge.currentMin, gauge.currentMax);
      } else if (typeof gauge.outputMin === 'number' && typeof gauge.outputMax === 'number') {
        expected = mapValue(v, gauge.minRange, gauge.maxRange, gauge.outputMin, gauge.outputMax);
      }
      rows.push({ inputDesired: String(v), inputActual: String(v), outputExpected: String(Number(expected.toFixed(4))), outputActual: String(Number(expected.toFixed(4))) });
    }
    setBulkRows(rows);
    setBulkParamDialogOpen(false);
    setBulkTableDialogOpen(true);
  };

  const handleCommitBulk = () => {
    const points = bulkRows.map(r => ({
      inputDesired: parseFloat(r.inputDesired) || 0,
      inputActual: parseFloat(r.inputActual) || 0,
      outputExpected: parseFloat(r.outputExpected) || 0,
      outputActual: parseFloat(r.outputActual) || 0,
    }));
    if (addCalibrationPoints) {
      addCalibrationPoints(jobId, gauge.id, points);
    } else {
      // Fallback: add individually if batch function not available
      points.forEach(p => addCalibrationPoint(jobId, gauge.id, p));
    }
    setBulkRows([]);
    setBulkTableDialogOpen(false);
    setBulkForm({ start: '', end: '', step: '' });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">{gauge.label} - Calibration Data</Typography>
        <Box>
          <Button sx={{ mr: 1 }} variant="outlined" onClick={() => setBulkParamDialogOpen(true)}>Bulk Add</Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setNewPointDialog(true)}>
            Add Point
          </Button>
        </Box>
      </Box>

      {/* Notes & Images */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle1">Notes</Typography>
        <TextField
          fullWidth
          multiline
          rows={3}
          value={gauge.notes || ''}
          onChange={(e) => updateGauge && updateGauge(jobId, gauge.id, { notes: e.target.value })}
          placeholder="Enter notes or remarks for this gauge"
          sx={{ mb: 1 }}
        />
        <input
          accept="image/*"
          id="gauge-images"
          type="file"
          multiple
          onChange={async (e) => {
            const files = e.target.files;
            if (!files || !updateGauge) return;
            const urls: string[] = [];
            for (let i = 0; i < files.length; i++) {
              const f = files[i];
              const data = await new Promise<string>((res) => {
                const r = new FileReader();
                r.onload = () => res(String(r.result));
                r.readAsDataURL(f);
              });
              urls.push(data);
            }
            const existing = gauge.images || [];
            updateGauge(jobId, gauge.id, { images: [...existing, ...urls] });
          }}
        />
        {gauge.images && gauge.images.length > 0 && (
          <Box sx={{ display: 'flex', gap: 1, mt: 1, overflowX: 'auto' }}>
            {gauge.images.map((src, idx) => (
              <img key={idx} src={src} style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 4 }} />
            ))}
          </Box>
        )}
      </Paper>

      {gauge.points.length > 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Avg Error: {stats.avgError.toFixed(4)} | Min: {stats.minError.toFixed(4)} | Max: {stats.maxError.toFixed(4)} | Avg %: {stats.avgErrorPercent.toFixed(2)}%
        </Alert>
      )}

      {/* PASS / FAIL */}
      {gauge.points.length > 0 && (() => {
        const threshold = 2; // percent
        const allPass = gauge.points.every(p => Math.abs(p.errorPercent || 0) <= threshold);
        return (
          <Alert severity={allPass ? 'success' : 'error'} sx={{ mb: 2 }}>
            Gauge Status: {allPass ? 'PASS' : 'FAIL'} (Threshold: {threshold}%)
          </Alert>
        );
      })()}

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'action.hover' }}>
              <TableCell>Input Desired ({gauge.unit})</TableCell>
              <TableCell>Input Actual</TableCell>
              <TableCell>Output Expected</TableCell>
              <TableCell>Output Actual</TableCell>
              <TableCell>Error</TableCell>
              <TableCell>Error %</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {gauge.points.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  <Typography color="textSecondary">No calibration points yet</Typography>
                </TableCell>
              </TableRow>
            ) : (
              gauge.points.map(point => (
                <TableRow key={point.id}>
                    <TableCell>
                      {point.inputDesired.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        type="number"
                        value={point.inputActual}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          if (updateCalibrationPoint) updateCalibrationPoint(jobId, gauge.id, point.id, { inputActual: val });
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {point.outputExpected.toFixed(4)}
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        type="number"
                        value={point.outputActual}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          if (updateCalibrationPoint) updateCalibrationPoint(jobId, gauge.id, point.id, { outputActual: val });
                        }}
                      />
                    </TableCell>
                  <TableCell sx={{ color: Math.abs(point.error || 0) > 0.1 ? 'warning.main' : 'success.main' }}>
                    {(point.error || 0).toFixed(4)}
                  </TableCell>
                  <TableCell sx={{ color: Math.abs(point.errorPercent || 0) > 1 ? 'warning.main' : 'success.main' }}>
                    {(point.errorPercent || 0).toFixed(2)}%
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => deleteCalibrationPoint(jobId, gauge.id, point.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Point Dialog */}
      <Dialog open={newPointDialog} onClose={() => setNewPointDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Calibration Point</DialogTitle>
        <DialogContent sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, pt: 2 }}>
          <TextField
            type="number"
            label="Input Desired"
            value={newPoint.inputDesired}
            onChange={(e) => setNewPoint(p => ({ ...p, inputDesired: e.target.value }))}
            placeholder="0"
          />
          <TextField
            type="number"
            label="Input Actual"
            value={newPoint.inputActual}
            onChange={(e) => setNewPoint(p => ({ ...p, inputActual: e.target.value }))}
            placeholder="0"
          />
          <TextField
            type="number"
            label="Output Expected"
            value={newPoint.outputExpected}
            onChange={(e) => setNewPoint(p => ({ ...p, outputExpected: e.target.value }))}
            placeholder="0"
          />
          <TextField
            type="number"
            label="Output Actual"
            value={newPoint.outputActual}
            onChange={(e) => setNewPoint(p => ({ ...p, outputActual: e.target.value }))}
            placeholder="0"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewPointDialog(false)}>Cancel</Button>
          <Button onClick={handleAddPoint} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Parameter Input Dialog */}
      <Dialog open={bulkParamDialogOpen} onClose={() => setBulkParamDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Bulk Add - Enter Parameters</DialogTitle>
        <DialogContent sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2, pt: 2 }}>
          <TextField
            type="number"
            label="Start Value"
            value={bulkForm.start}
            onChange={(e) => setBulkForm(f => ({ ...f, start: e.target.value }))}
            placeholder="0"
          />
          <TextField
            type="number"
            label="End Value"
            value={bulkForm.end}
            onChange={(e) => setBulkForm(f => ({ ...f, end: e.target.value }))}
            placeholder="10"
          />
          <TextField
            type="number"
            label="Step Increment"
            value={bulkForm.step}
            onChange={(e) => setBulkForm(f => ({ ...f, step: e.target.value }))}
            placeholder="2"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkParamDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleGenerateBulkTable} variant="contained">Generate Table</Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Add / Edit Table Dialog */}
      <Dialog open={bulkTableDialogOpen} onClose={() => { setBulkTableDialogOpen(false); setBulkRows([]); }} maxWidth="md" fullWidth>
        <DialogTitle>Bulk Create Table</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>Adjust the generated table if needed, then commit to create calibration points.</Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Input Desired ({gauge.unit})</TableCell>
                  <TableCell>Input Actual</TableCell>
                  <TableCell>Output Expected ({gauge.outputUnit || gauge.unit})</TableCell>
                  <TableCell>Output Actual</TableCell>
                  <TableCell>Remove</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bulkRows.map((r, i) => (
                  <TableRow key={i}>
                    <TableCell>{r.inputDesired}</TableCell>
                    <TableCell>
                      <TextField size="small" type="number" value={r.inputActual} onChange={(e) => {
                        const v = e.target.value; setBulkRows(rows => rows.map((row, idx) => idx === i ? { ...row, inputActual: v } : row));
                      }} />
                    </TableCell>
                    <TableCell>
                      <TextField size="small" type="number" value={r.outputExpected} onChange={(e) => {
                        const v = e.target.value; setBulkRows(rows => rows.map((row, idx) => idx === i ? { ...row, outputExpected: v } : row));
                      }} />
                    </TableCell>
                    <TableCell>
                      <TextField size="small" type="number" value={r.outputActual} onChange={(e) => {
                        const v = e.target.value; setBulkRows(rows => rows.map((row, idx) => idx === i ? { ...row, outputActual: v } : row));
                      }} />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" color="error" onClick={() => setBulkRows(rows => rows.filter((_, idx) => idx !== i))}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setBulkTableDialogOpen(false); setBulkRows([]); }}>Cancel</Button>
          <Button variant="contained" onClick={handleCommitBulk}>Create Points</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
