import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import Navbar from '../components/Navbar.tsx';

interface Course {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Web Development',
    description: 'Learn modern web development with React, Node.js, and more',
    imageUrl: 'https://source.unsplash.com/random/300x200?web',
  },
  {
    id: '2',
    title: 'Data Science',
    description: 'Master data analysis, machine learning, and AI',
    imageUrl: 'https://source.unsplash.com/random/300x200?data',
  },
  {
    id: '3',
    title: 'Mobile Development',
    description: 'Build iOS and Android apps with React Native',
    imageUrl: 'https://source.unsplash.com/random/300x200?mobile',
  },
  {
    id: '4',
    title: 'Cloud Computing',
    description: 'Learn AWS, Azure, and cloud architecture',
    imageUrl: 'https://source.unsplash.com/random/300x200?cloud',
  },
];

const CourseSelection = () => {
  const navigate = useNavigate();
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

  const handleCourseToggle = (courseId: string) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleContinue = () => {
    // Here you would typically save the selected courses
    navigate('/student/dashboard');
  };

  return (
    <>
      <Navbar />
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(45deg, #121212 30%, #1e1e1e 90%)',
          backdropFilter: 'blur(10px)',
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
            Select Your Courses
          </Typography>
          <Typography variant="body1" align="center" sx={{ mb: 6, color: 'text.secondary' }}>
            Choose the courses you're interested in. You can select multiple courses.
          </Typography>

          <Grid container spacing={4}>
            {mockCourses.map((course) => (
              <Grid item xs={12} sm={6} md={4} key={course.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      transition: 'transform 0.2s',
                    },
                  }}
                >
                  <CardActionArea onClick={() => handleCourseToggle(course.id)}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={course.imageUrl}
                      alt={course.title}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h6" component="h2">
                        {course.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {course.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedCourses.includes(course.id)}
                        onChange={() => handleCourseToggle(course.id)}
                        sx={{ position: 'absolute', top: 8, right: 8 }}
                      />
                    }
                    label=""
                  />
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 6, textAlign: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleContinue}
              disabled={selectedCourses.length === 0}
              sx={{ px: 4 }}
            >
              Continue
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default CourseSelection; 