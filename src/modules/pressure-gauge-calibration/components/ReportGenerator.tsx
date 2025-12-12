import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import jsPDF from 'jspdf';
import type { Gauge, Job } from '../types';
import { calculateStats } from '../utils';

interface ReportGeneratorProps {
  job?: Job;
  gauge: Gauge;
}

export default function ReportGenerator({ job, gauge }: ReportGeneratorProps) {
  const stats = calculateStats(gauge.points);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const margin = 15;
    let y = margin;

    pdf.setFontSize(16);
    pdf.text('Pressure Gauge Calibration Report', 105, y, { align: 'center' });
    y += 10;

    pdf.setFontSize(11);
    if (job) {
      pdf.text(`Job: ${job.name}`, margin, y);
      pdf.text(`Date: ${new Date(job.date).toLocaleDateString()}`, 140, y);
      y += 7;
      if (job.location) { pdf.text(`Location: ${job.location}`, margin, y); }
      if (job.technician) { pdf.text(`Technician: ${job.technician}`, 100, y); }
      y += 10;
    }

    pdf.text(`Gauge: ${gauge.label}`, margin, y);
    pdf.text(`Unit: ${gauge.unit}`, 140, y);
    y += 7;
    pdf.text(`Range: ${gauge.minRange} - ${gauge.maxRange}`, margin, y);
    y += 10;

    pdf.setFontSize(12);
    pdf.text('Error Statistics', margin, y);
    y += 6;
    pdf.setFontSize(10);
    pdf.text(`Avg Error: ${stats.avgError.toFixed(6)}`, margin, y);
    pdf.text(`Min Error: ${stats.minError.toFixed(6)}`, 90, y);
    pdf.text(`Max Error: ${stats.maxError.toFixed(6)}`, 140, y);
    y += 8;

    // Table header
    pdf.setFontSize(11);
    const colX = [margin, 55, 95, 135, 170, 190];
    pdf.text('Input Desired', colX[0], y);
    pdf.text('Input Actual', colX[1], y);
    pdf.text('Output Expected', colX[2], y);
    pdf.text('Output Actual', colX[3], y);
    pdf.text('Error', colX[4], y);
    y += 6;

    pdf.setFontSize(10);
    gauge.points.forEach((p) => {
      if (y > 280) { pdf.addPage(); y = margin; }
      pdf.text(p.inputDesired.toFixed(2), colX[0], y);
      pdf.text(p.inputActual.toFixed(2), colX[1], y);
      pdf.text(p.outputExpected.toFixed(4), colX[2], y);
      pdf.text(p.outputActual.toFixed(4), colX[3], y);
      pdf.text((p.error || 0).toFixed(4), colX[4], y);
      y += 6;
    });

    pdf.save(`${(job?.name || 'job')}_${gauge.label}_report.pdf`);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button variant="contained" startIcon={<PrintIcon />} onClick={handlePrint}>
          Print
        </Button>
        <Button variant="contained" startIcon={<DownloadIcon />} onClick={handleDownloadPDF}>
          Download PDF
        </Button>
      </Box>

      <Paper sx={{ p: 3, bgcolor: '#fff', color: '#000' }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
          Pressure Gauge Calibration Report
        </Typography>

        {/* Job Details */}
        {job && (
          <Box sx={{ mb: 3, pb: 2, borderBottom: '1px solid #ccc' }}>
            <Typography variant="h6">Job Details</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mt: 1, fontSize: '0.9rem' }}>
              <Box>
                <strong>Job Name:</strong> {job.name}
              </Box>
              {job.location && (
                <Box>
                  <strong>Location:</strong> {job.location}
                </Box>
              )}
              {job.technician && (
                <Box>
                  <strong>Technician:</strong> {job.technician}
                </Box>
              )}
              <Box>
                <strong>Date:</strong> {new Date(job.date).toLocaleDateString()}
              </Box>
            </Box>
            {job.description && (
              <Box sx={{ mt: 1 }}>
                <strong>Description:</strong> {job.description}
              </Box>
            )}
          </Box>
        )}

        {/* Gauge Details */}
        <Box sx={{ mb: 3, pb: 2, borderBottom: '1px solid #ccc' }}>
          <Typography variant="h6">Gauge Details</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mt: 1, fontSize: '0.9rem' }}>
            <Box>
              <strong>Label:</strong> {gauge.label}
            </Box>
            <Box>
              <strong>Unit:</strong> {gauge.unit}
            </Box>
            <Box>
              <strong>Range:</strong> {gauge.minRange} – {gauge.maxRange}
            </Box>
            <Box>
              <strong>Points:</strong> {gauge.points.length}
            </Box>
          </Box>
        </Box>

        {/* Error Statistics */}
        <Box sx={{ mb: 3, pb: 2, borderBottom: '1px solid #ccc' }}>
          <Typography variant="h6">Error Statistics</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 1, fontSize: '0.9rem' }}>
            <Box sx={{ p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <strong>Average Error:</strong> {stats.avgError.toFixed(6)}
            </Box>
            <Box sx={{ p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <strong>Min Error:</strong> {stats.minError.toFixed(6)}
            </Box>
            <Box sx={{ p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <strong>Max Error:</strong> {stats.maxError.toFixed(6)}
            </Box>
            <Box sx={{ p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <strong>Avg Error %:</strong> {stats.avgErrorPercent.toFixed(2)}%
            </Box>
          </Box>
        </Box>

        {/* Data Table */}
        <Box>
          <Typography variant="h6" sx={{ mb: 1 }}>Calibration Data</Typography>
          <TableContainer>
            <Table size="small" sx={{ bgcolor: '#fff' }}>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f0f0f0' }}>
                  <TableCell sx={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Input Desired</TableCell>
                  <TableCell sx={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Input Actual</TableCell>
                  <TableCell sx={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Output Expected</TableCell>
                  <TableCell sx={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Output Actual</TableCell>
                  <TableCell sx={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Error</TableCell>
                  <TableCell sx={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Error %</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {gauge.points.map(point => (
                  <TableRow key={point.id}>
                    <TableCell sx={{ fontSize: '0.9rem' }}>{point.inputDesired.toFixed(2)}</TableCell>
                    <TableCell sx={{ fontSize: '0.9rem' }}>{point.inputActual.toFixed(2)}</TableCell>
                    <TableCell sx={{ fontSize: '0.9rem' }}>{point.outputExpected.toFixed(4)}</TableCell>
                    <TableCell sx={{ fontSize: '0.9rem' }}>{point.outputActual.toFixed(4)}</TableCell>
                    <TableCell sx={{ fontSize: '0.9rem' }}>{(point.error || 0).toFixed(4)}</TableCell>
                    <TableCell sx={{ fontSize: '0.9rem' }}>{(point.errorPercent || 0).toFixed(2)}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #ccc', fontSize: '0.9rem', color: '#666' }}>
          <Typography variant="caption">
            Generated: {new Date().toLocaleString()}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
