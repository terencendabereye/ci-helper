/**
 * Pressure Gauge Calibration Module - Main Component
 */

import { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import WorkIcon from '@mui/icons-material/Work';
import { ModuleHeader } from '../../shared/components/ModuleHeader';
import { usePressureGaugeCalibration } from './hooks';
import JobList from './components/JobList';
import GaugeSelector from './components/GaugeSelector';
import CalibrationTable from './components/CalibrationTable';
import CalibrationChart from './components/CalibrationChart';
import ReportGenerator from './components/ReportGenerator';

interface PressureGaugeCalibrationProps {
  onBack?: () => void;
}

export default function PressureGaugeCalibration({ onBack }: PressureGaugeCalibrationProps) {
  const {
    jobs,
    activeJobId,
    activeGaugeId,
    setActiveJobId,
    setActiveGaugeId,
    createJob,
    getActiveJob,
    getActiveGauge,
  } = usePressureGaugeCalibration();

  const [tab, setTab] = useState<'jobs' | 'gauges' | 'calibration' | 'report'>(activeJobId ? 'gauges' : 'jobs');
  const [newJobDialog, setNewJobDialog] = useState(false);
  const [jobForm, setJobForm] = useState({
    name: '',
    description: '',
    location: '',
    technician: '',
  });

  const activeJob = getActiveJob();
  const activeGauge = getActiveGauge();

  const handleCreateJob = () => {
    if (jobForm.name.trim()) {
      createJob(jobForm.name, jobForm.description, jobForm.location, jobForm.technician);
      setJobForm({ name: '', description: '', location: '', technician: '' });
      setNewJobDialog(false);
      setTab('gauges');
    }
  };

  const handleTabChange = (_: React.SyntheticEvent, newTab: typeof tab) => {
    setTab(newTab);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <ModuleHeader title="Pressure Gauge Calibration" onBack={onBack} />

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2, gap: 2 }}>
        {!activeJobId ? (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Active Jobs</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setNewJobDialog(true)}
              >
                New Job
              </Button>
            </Box>
            <JobList
              jobs={jobs}
              onSelectJob={(jobId) => {
                setActiveJobId(jobId);
                setTab('gauges');
              }}
            />

            {/* New Job Dialog */}
            <Dialog open={newJobDialog} onClose={() => setNewJobDialog(false)} maxWidth="sm" fullWidth>
              <DialogTitle>Create New Job</DialogTitle>
              <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                <TextField
                  label="Job Name"
                  fullWidth
                  value={jobForm.name}
                  onChange={(e) => setJobForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g., Pipeline Pressure Test"
                />
                <TextField
                  label="Description"
                  fullWidth
                  multiline
                  rows={2}
                  value={jobForm.description}
                  onChange={(e) => setJobForm(f => ({ ...f, description: e.target.value }))}
                />
                <TextField
                  label="Location"
                  fullWidth
                  value={jobForm.location}
                  onChange={(e) => setJobForm(f => ({ ...f, location: e.target.value }))}
                  placeholder="e.g., Section A, Station 5"
                />
                <TextField
                  label="Technician"
                  fullWidth
                  value={jobForm.technician}
                  onChange={(e) => setJobForm(f => ({ ...f, technician: e.target.value }))}
                  placeholder="Your name"
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setNewJobDialog(false)}>Cancel</Button>
                <Button onClick={handleCreateJob} variant="contained" disabled={!jobForm.name.trim()}>
                  Create
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        ) : (
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {/* Job Header */}
            <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: 'action.hover' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <WorkIcon />
                <Typography variant="h6">{activeJob?.name}</Typography>
                <Button size="small" onClick={() => setActiveJobId(null)}>Back to Jobs</Button>
              </Box>
              {activeJob?.location && (
                <Typography variant="caption" color="text.secondary">
                  📍 {activeJob.location}
                </Typography>
              )}
            </Paper>

            {/* Tab Navigation */}
            <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 2 }}>
              <Tab label="Gauges" value="gauges" />
              {activeGaugeId && <Tab label="Calibration" value="calibration" />}
              {activeGaugeId && <Tab label="Chart & Report" value="report" />}
            </Tabs>

            {/* Tab Content */}
            <Box sx={{ flex: 1, overflow: 'auto' }}>
              {tab === 'gauges' && (
                <GaugeSelector
                  job={activeJob || undefined}
                  activeGaugeId={activeGaugeId}
                  onSelectGauge={(gaugeId: string) => {
                    setActiveGaugeId(gaugeId);
                    setTab('calibration');
                  }}
                />
              )}

              {tab === 'calibration' && activeGauge && (
                <CalibrationTable gauge={activeGauge} jobId={activeJobId || ''} />
              )}

              {tab === 'report' && activeGauge && (
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 2 }}>
                  <Box>
                    <Typography variant="h6" sx={{ mb: 2 }}>Trend Chart</Typography>
                    <CalibrationChart gauge={activeGauge} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ mb: 2 }}>Generate Report</Typography>
                    <ReportGenerator
                      job={activeJob || undefined}
                      gauge={activeGauge}
                    />
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
