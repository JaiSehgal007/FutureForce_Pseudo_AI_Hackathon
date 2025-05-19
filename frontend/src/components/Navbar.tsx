import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="static" sx={{ background: 'linear-gradient(90deg, #1e1e1e 60%, #9c27b0 100%)' }}>
      <Toolbar>
        <Typography
          variant="h5"
          component="div"
          sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 2, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          Learning Buddy
        </Typography>
        <Box>
          <Button color="inherit" onClick={() => navigate('/')}>Home</Button>
          {/* <Button color="inherit" onClick={() => navigate('/student/dashboard')}>Dashboard</Button>
          <Button color="inherit" onClick={() => navigate('/student/intern-faq')}>FAQ</Button> */}
          <Button color="inherit" onClick={() => navigate('/signin')}>Sign In</Button>
          <Button color="inherit" onClick={() => navigate('/signup')}>Sign Up</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 