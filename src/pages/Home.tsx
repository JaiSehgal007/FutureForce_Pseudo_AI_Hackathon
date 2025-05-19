import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import CodeIcon from '@mui/icons-material/Code';
import GroupIcon from '@mui/icons-material/Group';
import WorkIcon from '@mui/icons-material/Work';
import Navbar from '../components/Navbar.tsx';

const features = [
  {
    title: 'Learn Programming',
    description: 'Master coding skills with our comprehensive courses',
    icon: <CodeIcon sx={{ fontSize: 40 }} />,
  },
  {
    title: 'Expert Mentors',
    description: 'Learn from industry professionals',
    icon: <GroupIcon sx={{ fontSize: 40 }} />,
  },
  {
    title: 'Internship Opportunities',
    description: 'Get real-world experience through internships',
    icon: <WorkIcon sx={{ fontSize: 40 }} />,
  },
  {
    title: 'Quality Education',
    description: 'Access high-quality learning materials',
    icon: <SchoolIcon sx={{ fontSize: 40 }} />,
  },
];

const Home = () => {
  const navigate = useNavigate();

  const handleFeatureClick = () => {
    navigate('/signin');
  };

  return (
    <>
      <Navbar />
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(45deg, #121212 30%, #1e1e1e 90%)',
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Box textAlign="center" mb={8}>
            <Typography variant="h1" component="h1" gutterBottom>
              Welcome to Our Learning Platform
            </Typography>
            <Typography variant="h5" color="text.secondary" paragraph>
              Your journey to success starts here
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      cursor: 'pointer',
                    },
                  }}
                  onClick={handleFeatureClick}
                >
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                    <Box sx={{ color: 'primary.main', mb: 2 }}>{feature.icon}</Box>
                    <Typography gutterBottom variant="h5" component="h2">
                      {feature.title}
                    </Typography>
                    <Typography color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                    <Button variant="contained" color="primary">
                      Learn More
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box textAlign="center" mt={8}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate('/signup')}
              sx={{ mr: 2 }}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              onClick={() => navigate('/signin')}
            >
              Sign In
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Home; 