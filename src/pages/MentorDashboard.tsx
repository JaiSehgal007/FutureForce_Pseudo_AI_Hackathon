import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Navbar from '../components/Navbar.tsx';

const mockCourses = [
  {
    id: '1',
    title: 'Web Development Bootcamp',
    description: 'A comprehensive course covering modern web development technologies',
    imageUrl: 'https://source.unsplash.com/random/300x200?web',
    modules: 12,
  },
  {
    id: '2',
    title: 'Data Science Fundamentals',
    description: 'Learn the basics of data analysis and machine learning',
    imageUrl: 'https://source.unsplash.com/random/300x200?data',
    modules: 8,
  },
  {
    id: '3',
    title: 'Mobile App Development',
    description: 'Build iOS and Android apps using React Native',
    imageUrl: 'https://source.unsplash.com/random/300x200?mobile',
    modules: 10,
  },
];

const MentorDashboard = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(45deg, #121212 30%, #1e1e1e 90%)',
          py: 4,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                Hi, Mentor!
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage your courses and create new ones
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/mentor/create-course')}
            >
              Create New Course
            </Button>
          </Box>

          <Grid container spacing={4}>
            {mockCourses.map((course) => (
              <Grid item xs={12} sm={6} md={4} key={course.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      transition: 'transform 0.2s',
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={course.imageUrl}
                    alt={course.title}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="h2">
                      {course.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {course.description}
                    </Typography>
                    <Typography variant="body2" color="primary">
                      {course.modules} Modules
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Paper sx={{ p: 3, mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Course Statistics
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Total Courses
                </Typography>
                <Typography variant="h4">{mockCourses.length}</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Total Modules
                </Typography>
                <Typography variant="h4">
                  {mockCourses.reduce((sum, course) => sum + course.modules, 0)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Active Students
                </Typography>
                <Typography variant="h4">150+</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default MentorDashboard;