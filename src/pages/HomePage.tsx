import React from 'react';
import { Box, Container, Divider } from '@mui/material';
import { HeroSection } from '../components/HeroSection';
import { ServicesSection } from '../components/ServicesSection';
import { LeadCaptureForm } from '../components/LeadCaptureForm';
import { ContactSection } from '../components/ContactSection';

export const HomePage: React.FC = () => {
  return (
    <Box component="div" sx={{ width: '100%', maxWidth: '100vw', overflowX: 'hidden', bgcolor: '#f6f8fa' }}>
      <Box sx={{ width: '100%', px: 0, pt: 0 }}>
        <HeroSection />
      </Box>
      
      <Divider sx={{ borderColor: 'rgba(2,6,23,0.08)', mx: 'auto', width: '90%', maxWidth: '1400px' }} />
      
      <Box sx={{ width: '100vw', bgcolor: 'rgba(16,185,129,0.03)' }}>
        <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 }, pt: 0, pb: { xs: 3, md: 6 } }}>
          <ServicesSection />
        </Container>
      </Box>
      
      <Divider sx={{ borderColor: 'rgba(2,6,23,0.08)', mx: 'auto', width: '90%', maxWidth: '1400px' }} />
      
      <Box sx={{ width: '100vw', bgcolor: 'rgba(16,185,129,0.045)' }}>
        <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 }, py: { xs: 3, md: 6 } }}>
          <LeadCaptureForm />
        </Container>
      </Box>
      
      <Divider sx={{ borderColor: 'rgba(2,6,23,0.08)', mx: 'auto', width: '90%', maxWidth: '1400px' }} />
      
      <Box sx={{ width: '100vw', bgcolor: 'rgba(16,185,129,0.03)' }}>
        <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 }, py: { xs: 3, md: 6 } }}>
          <ContactSection />
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
