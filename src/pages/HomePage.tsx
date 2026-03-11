import React from 'react';
import { Box, Button, Container, Divider, Typography } from '@mui/material';
import { HeroSection } from '../components/HeroSection';
import { ServicesSection } from '../components/ServicesSection';
import { LeadCaptureForm } from '../components/LeadCaptureForm';
import { ContactSection } from '../components/ContactSection';
import ResponsivePicture from '../components/ResponsivePicture';

export const HomePage: React.FC = () => {
  return (
    <Box component="div" sx={{ width: '100%', maxWidth: '100vw', overflowX: 'hidden', bgcolor: 'background.default' }}>
      <Box sx={{ width: '100%', px: 0, pt: 0 }}>
        <HeroSection />
      </Box>
      
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)', mx: 'auto', width: '90%', maxWidth: '1400px' }} />
      
      <Box sx={{ width: '100vw', bgcolor: 'rgba(255,255,255,0.02)' }}>
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 }, pt: 0, pb: { xs: 4, md: 6 } }}>
          <ServicesSection />
        </Container>
      </Box>

      <Box sx={{ width: '100vw', bgcolor: 'background.default' }}>
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 }, py: { xs: 4, md: 7 } }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              alignItems: 'center',
              gap: { xs: 3, md: 5 },
              background: 'linear-gradient(160deg, rgba(255,56,92,0.16), rgba(255,255,255,0.06))',
              borderRadius: 5,
              p: { xs: 2, md: 3 },
            }}
          >
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 1.5, fontSize: { xs: '1.6rem', md: '2.1rem' } }}>
                Real Trucks. Real Response.
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2.5, maxWidth: 620 }}>
                Professional operators, modern equipment, and dispatch that moves quickly when your day goes sideways.
              </Typography>
              <Button href="/request-help#lead-form" variant="contained" color="primary" sx={{ borderRadius: 999, px: 3 }}>
                Request Help
              </Button>
            </Box>
            <ResponsivePicture
              src="/images/tow-snow.webp"
              alt="Tow truck preparing to recover a vehicle in winter conditions"
              width={1200}
              height={800}
              sizes="(max-width: 900px) 100vw, 50vw"
              borderRadius={18}
            />
          </Box>
        </Container>
      </Box>
      
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)', mx: 'auto', width: '90%', maxWidth: '1400px' }} />
      
      <Box sx={{ width: '100vw', bgcolor: 'rgba(255,255,255,0.03)' }}>
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 }, py: { xs: 5, md: 6 } }}>
          <LeadCaptureForm />
        </Container>
      </Box>
      
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)', mx: 'auto', width: '90%', maxWidth: '1400px' }} />
      
      <Box sx={{ width: '100vw', bgcolor: 'rgba(255,255,255,0.02)' }}>
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 }, py: { xs: 4, md: 6 } }}>
          <ContactSection />
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
