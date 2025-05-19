import React from 'react';
import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Navbar from '../components/Navbar.tsx';

const faqs = [
  {
    question: 'What are the eligibility criteria for internships?',
    answer:
      'To be eligible for internships, you must be enrolled in a recognized educational institution, have completed at least 2 years of your degree program, and maintain a minimum GPA of 3.0. You should also have completed relevant courses in your field of interest.',
  },
  {
    question: 'How long do internships typically last?',
    answer:
      'Our internships typically last for 3-6 months, depending on the project requirements and your availability. Summer internships usually run for 3 months, while semester-long internships can extend up to 6 months.',
  },
  {
    question: 'Are internships paid?',
    answer:
      'Yes, all our internships are paid positions. The compensation varies based on the role, your experience level, and the project requirements. We also provide additional benefits like mentorship, networking opportunities, and potential full-time offers.',
  },
  {
    question: 'What kind of projects will I work on?',
    answer:
      'Interns work on real-world projects that contribute to our company goals. You might work on software development, data analysis, UI/UX design, or other areas depending on your skills and interests. Each intern is assigned a mentor who guides them throughout the project.',
  },
  {
    question: 'How do I apply for an internship?',
    answer:
      'You can apply for internships through our website. The application process includes submitting your resume, a cover letter, and completing an online assessment. Selected candidates will be invited for technical interviews and a final round with the team.',
  },
  {
    question: 'What support is provided during the internship?',
    answer:
      'We provide comprehensive support to our interns, including regular mentorship sessions, technical training, access to learning resources, and networking events. You will also have the opportunity to participate in company-wide activities and workshops.',
  },
];

const InternFAQ = () => {
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
          <Paper sx={{ p: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
              Internship FAQ
            </Typography>
            <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
              Find answers to commonly asked questions about our internship program
            </Typography>

            {faqs.map((faq, index) => (
              <Accordion
                key={index}
                sx={{
                  mb: 2,
                  backgroundColor: 'background.paper',
                  '&:before': {
                    display: 'none',
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <Typography variant="h6">{faq.question}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1" color="text.secondary">
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default InternFAQ; 