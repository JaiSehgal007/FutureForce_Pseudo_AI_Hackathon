import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Paper,
  Modal,
  IconButton,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StarIcon from '@mui/icons-material/Star';
import HelpIcon from '@mui/icons-material/Help';
import CloseIcon from '@mui/icons-material/Close';
import Navbar from '../components/Navbar.tsx';

const mockCourses = {
  interests: [
    { id: '1', title: 'Web Development', progress: 75, description: 'Learn modern web development with React, Node.js, and more.' },
    { id: '2', title: 'Data Science', progress: 45, description: 'Master data analysis, machine learning, and AI.' },
  ],
  goodAt: [
    { id: '3', title: 'Mobile Development', progress: 90, description: 'Build iOS and Android apps with React Native.' },
    { id: '4', title: 'Cloud Computing', progress: 85, description: 'Learn AWS, Azure, and cloud architecture.' },
  ],
  topCourses: [
    { id: '5', title: 'Machine Learning', progress: 30, description: 'Introduction to ML concepts and algorithms.' },
    { id: '6', title: 'Blockchain', progress: 20, description: 'Explore blockchain technology and its applications.' },
  ],
};

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleCardClick = (course: any) => {
    setSelectedCourse(course);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCourse(null);
  };

  const CourseCard = ({ course }: { course: any }) => (
    <Card sx={{ mb: 2, cursor: 'pointer', transition: '0.2s', '&:hover': { boxShadow: 6, transform: 'scale(1.03)' } }} onClick={() => handleCardClick(course)}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {course.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {course.description}
        </Typography>
      </CardContent>
    </Card>
  );

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
            <div>
              <Typography variant="h4" component="h1" gutterBottom>
                Hi, Student!
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Welcome to your learning dashboard
              </Typography>
            </div>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate('/student/analysis')}
              sx={{ fontWeight: 600 }}
            >
              View Analysis
            </Button>
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <SchoolIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Your Interests</Typography>
                </Box>
                {mockCourses.interests.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <StarIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Top Choice</Typography>
                </Box>
                {mockCourses.topCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <TrendingUpIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Things You're Good At</Typography>
                </Box>
                {mockCourses.goodAt.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </Paper>
              <Button
                variant="contained"
                fullWidth
                startIcon={<HelpIcon />}
                onClick={() => navigate('/student/intern-faq')}
                sx={{ py: 1.5, mt: 2 }}
              >
                Intern FAQ
              </Button>
            </Grid>
          </Grid>
        </Container>
        <Modal open={modalOpen} onClose={handleCloseModal}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            minWidth: 320,
            maxWidth: 400,
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">{selectedCourse?.title}</Typography>
              <IconButton onClick={handleCloseModal}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Typography variant="body1" sx={{ mb: 2 }}>{selectedCourse?.description}</Typography>
            <Typography variant="body2" color="text.secondary">
              <b>Progress:</b> {selectedCourse?.progress}%
            </Typography>
          </Box>
        </Modal>
      </Box>
    </>
  );
};

export default StudentDashboard; 