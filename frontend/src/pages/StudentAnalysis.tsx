import React from 'react';
import { Box, Container, Typography, Paper, LinearProgress, Grid, Button } from '@mui/material';
import Navbar from '../components/Navbar.tsx';
import { useNavigate } from 'react-router-dom';

const StudentAnalysis = () => {
  const navigate = useNavigate();
  return (
    <>
      <Navbar />
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(45deg, #121212 30%, #1e1e1e 90%)',
          py: 6,
        }}
      >
        <Container maxWidth="sm">
          <Paper sx={{ p: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom align="center">
              Your Course Analysis
            </Typography>
            <Box sx={{ mb: 4 }}>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                Overall Progress
              </Typography>
              <LinearProgress
                variant="determinate"
                value={65}
                sx={{ height: 12, borderRadius: 5, mb: 1, background: '#222' }}
              />
              <Typography variant="body2" color="text.secondary">
                65% Complete
              </Typography>
            </Box>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Courses Completed
                </Typography>
                <Typography variant="h4">4/6</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Average Score
                </Typography>
                <Typography variant="h4">85%</Typography>
              </Grid>
            </Grid>
            <Button variant="contained" fullWidth onClick={() => navigate('/student/dashboard')}>
              Back to Dashboard
            </Button>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default StudentAnalysis; 