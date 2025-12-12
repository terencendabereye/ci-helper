import { Box, Card, CardContent, CardActionArea, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Job } from '../types';

interface JobListProps {
  jobs: Job[];
  onSelectJob: (jobId: string) => void;
}

export default function JobList({ jobs, onSelectJob }: JobListProps) {
  if (jobs.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="textSecondary">No jobs created yet. Click "New Job" to begin.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
      {jobs.map(job => (
        <Card key={job.id} sx={{ cursor: 'pointer', transition: 'all 0.3s', '&:hover': { boxShadow: 4 } }}>
          <CardActionArea onClick={() => onSelectJob(job.id)}>
            <CardContent>
              <Typography variant="h6" gutterBottom>{job.name}</Typography>
              {job.location && <Typography variant="caption" color="textSecondary">📍 {job.location}</Typography>}
              {job.technician && <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>👤 {job.technician}</Typography>}
              <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>📊 {job.gauges.length} gauges</Typography>
            </CardContent>
          </CardActionArea>
          <Box sx={{ p: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); /* delete job functionality tbd */ }}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Card>
      ))}
    </Box>
  );
}
