import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme.ts';

// Pages
import Home from './pages/Home.tsx';
import SignIn from './pages/SignIn.tsx';
import SignUp from './pages/SignUp.tsx';
import StudentDashboard from './pages/StudentDashboard.tsx';
import MentorDashboard from './pages/MentorDashboard.tsx';
import CourseSelection from './pages/CourseSelection.tsx';
import InternFAQ from './pages/InternFAQ.tsx';
import CourseCreation from './pages/CourseCreation.tsx';
import StudentAnalysis from './pages/StudentAnalysis.tsx';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/mentor/dashboard" element={<MentorDashboard />} />
          <Route path="/student/course-selection" element={<CourseSelection />} />
          <Route path="/student/intern-faq" element={<InternFAQ />} />
          <Route path="/mentor/create-course" element={<CourseCreation />} />
          <Route path="/student/analysis" element={<StudentAnalysis />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 