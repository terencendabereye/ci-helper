import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, Paper, Alert, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import type { Gauge } from '../types';
import { usePressureGaugeCalibration } from '../hooks';
import { calculateStats } from '../utils';

interface CalibrationTableProps {
  gauge: Gauge;
  jobId: string;
}

export default function CalibrationTable({ gauge, jobId }: CalibrationTableProps) {
  const { addCalibrationPoint, deleteCalibrationPoint } = usePressureGaugeCalibration();
  const [newPointDialog, setNewPointDialog] = useState(false);
  const [newPoint, setNewPoint] = useState({
    inputDesired: '',
    inputActual: '',
    outputExpected: '',
    outputActual: '',
  });

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

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">{gauge.label} - Calibration Data</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setNewPointDialog(true)}>
          Add Point
        </Button>
      </Box>

      {gauge.points.length > 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Avg Error: {stats.avgError.toFixed(4)} | Min: {stats.minError.toFixed(4)} | Max: {stats.maxError.toFixed(4)} | Avg %: {stats.avgErrorPercent.toFixed(2)}%
        </Alert>
      )}

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
                  <TableCell>{point.inputDesired.toFixed(2)}</TableCell>
                  <TableCell>{point.inputActual.toFixed(2)}</TableCell>
                  <TableCell>{point.outputExpected.toFixed(4)}</TableCell>
                  <TableCell>{point.outputActual.toFixed(4)}</TableCell>
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
    </Box>
  );
}
