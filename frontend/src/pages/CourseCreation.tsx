import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Navbar from '../components/Navbar.tsx';

interface Module {
  id: string;
  title: string;
  description: string;
  context: string;
  imageUrl: string;
}

const CourseCreation = () => {
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState({
    id: '',
    title: '',
    description: '',
    domain: '',
    imageUrl: '',
    numberOfModules: '1',
  });

  const [modules, setModules] = useState<Module[]>([
    {
      id: '1',
      title: '',
      description: '',
      context: '',
      imageUrl: '',
    },
  ]);

  const handleCourseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCourseData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'numberOfModules') {
      const numModules = parseInt(value);
      const currentModules = [...modules];
      if (numModules > currentModules.length) {
        // Add new modules
        for (let i = currentModules.length; i < numModules; i++) {
          currentModules.push({
            id: (i + 1).toString(),
            title: '',
            description: '',
            context: '',
            imageUrl: '',
          });
        }
      } else {
        // Remove extra modules
        currentModules.splice(numModules);
      }
      setModules(currentModules);
    }
  };

  const handleModuleChange = (index: number, field: keyof Module, value: string) => {
    const updatedModules = [...modules];
    updatedModules[index] = {
      ...updatedModules[index],
      [field]: value,
    };
    setModules(updatedModules);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle course creation
    alert('Course created successfully!');
    navigate('/mentor/dashboard');
  };

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
        <Container maxWidth="md">
          <Paper sx={{ p: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Create New Course
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Course ID"
                    name="id"
                    value={courseData.id}
                    onChange={handleCourseChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Course Title"
                    name="title"
                    value={courseData.title}
                    onChange={handleCourseChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    multiline
                    rows={3}
                    label="Course Description"
                    name="description"
                    value={courseData.description}
                    onChange={handleCourseChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Domain</InputLabel>
                    <Select
                      name="domain"
                      value={courseData.domain}
                      label="Domain"
                      onChange={handleCourseChange}
                    >
                      <MenuItem value="web">Web Development</MenuItem>
                      <MenuItem value="mobile">Mobile Development</MenuItem>
                      <MenuItem value="data">Data Science</MenuItem>
                      <MenuItem value="cloud">Cloud Computing</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Image URL"
                    name="imageUrl"
                    value={courseData.imageUrl}
                    onChange={handleCourseChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>Number of Modules</InputLabel>
                    <Select
                      name="numberOfModules"
                      value={courseData.numberOfModules}
                      label="Number of Modules"
                      onChange={handleCourseChange}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <MenuItem key={num} value={num.toString()}>
                          {num}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                Modules
              </Typography>

              {modules.map((module, index) => (
                <Paper key={module.id} sx={{ p: 2, mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="subtitle1">Module {index + 1}</Typography>
                    {modules.length > 1 && (
                      <IconButton
                        color="error"
                        onClick={() => {
                          const newModules = modules.filter((m) => m.id !== module.id);
                          setModules(newModules);
                          setCourseData((prev) => ({
                            ...prev,
                            numberOfModules: newModules.length.toString(),
                          }));
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        label="Module Title"
                        value={module.title}
                        onChange={(e) => handleModuleChange(index, 'title', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        multiline
                        rows={2}
                        label="Module Description"
                        value={module.description}
                        onChange={(e) => handleModuleChange(index, 'description', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        multiline
                        rows={3}
                        label="Module Context"
                        value={module.context}
                        onChange={(e) => handleModuleChange(index, 'context', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Module Image URL"
                        value={module.imageUrl}
                        onChange={(e) => handleModuleChange(index, 'imageUrl', e.target.value)}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              ))}

              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  type="submit"
                  size="large"
                  startIcon={<AddIcon />}
                >
                  Create Course
                </Button>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default CourseCreation; 