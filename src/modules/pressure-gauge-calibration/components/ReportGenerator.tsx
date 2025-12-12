import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import type { Gauge, Job } from '../types';
import { calculateStats } from '../utils';

interface ReportGeneratorProps {
  job?: Job;
  gauge: Gauge;
}

export default function ReportGenerator({ job, gauge }: ReportGeneratorProps) {
  const reportRef = useRef<HTMLDivElement>(null);
  const stats = calculateStats(gauge.points);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;

    const canvas = await html2canvas(reportRef.current, { scale: 2 });
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`${job?.name}_${gauge.label}_report.pdf`);
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

      <Paper
        ref={reportRef}
        sx={{ p: 3, bgcolor: '#fff', color: '#000' }}
      >
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
