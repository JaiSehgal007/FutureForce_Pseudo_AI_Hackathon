import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Link,
  Tabs,
  Tab,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import Navbar from '../components/Navbar.tsx';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`signup-tabpanel-${index}`}
      aria-labelledby={`signup-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const SignUp = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [studentData, setStudentData] = useState({
    id: '',
    name: '',
    age: '',
    gender: '',
    educationLevel: '',
    email: '',
    contact: '',
  });

  const [mentorData, setMentorData] = useState({
    id: '',
    name: '',
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleStudentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStudentData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMentorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMentorData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle student registration
    navigate('/student/course-selection');
  };

  const handleMentorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle mentor registration
    navigate('/mentor/dashboard');
  };

  return (
    <>
      <Navbar />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          background: 'linear-gradient(45deg, #121212 30%, #1e1e1e 90%)',
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={3}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: 'background.paper',
            }}
          >
            <Typography component="h1" variant="h4" sx={{ mt: 3 }}>
              Sign Up
            </Typography>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              sx={{ width: '100%', borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label="Student" />
              <Tab label="Mentor" />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              <Box component="form" onSubmit={handleStudentSubmit} sx={{ width: '100%' }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="id"
                  label="ID"
                  name="id"
                  value={studentData.id}
                  onChange={handleStudentChange}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="name"
                  label="Name"
                  type="text"
                  value={studentData.name}
                  onChange={handleStudentChange}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="age"
                  label="Age"
                  type="number"
                  value={studentData.age}
                  onChange={handleStudentChange}
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel>Gender</InputLabel>
                  <Select
                    name="gender"
                    value={studentData.gender}
                    label="Gender"
                    onChange={handleStudentChange}
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Education Level</InputLabel>
                  <Select
                    name="educationLevel"
                    value={studentData.educationLevel}
                    label="Education Level"
                    onChange={handleStudentChange}
                  >
                    <MenuItem value="high-school">High School</MenuItem>
                    <MenuItem value="bachelors">Bachelor's</MenuItem>
                    <MenuItem value="masters">Master's</MenuItem>
                    <MenuItem value="phd">PhD</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="email"
                  label="Email"
                  type="email"
                  value={studentData.email}
                  onChange={handleStudentChange}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="contact"
                  label="Contact Number"
                  type="tel"
                  value={studentData.contact}
                  onChange={handleStudentChange}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign Up as Student
                </Button>
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Box component="form" onSubmit={handleMentorSubmit} sx={{ width: '100%' }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="id"
                  label="ID"
                  name="id"
                  value={mentorData.id}
                  onChange={handleMentorChange}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="name"
                  label="Name"
                  type="text"
                  value={mentorData.name}
                  onChange={handleMentorChange}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign Up as Mentor
                </Button>
              </Box>
            </TabPanel>

            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/signin')}
                sx={{ color: 'primary.main' }}
              >
                Already have an account? Sign In
              </Link>
            </Box>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default SignUp; 