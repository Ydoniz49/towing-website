import React from 'react';
import { Box, Container, Typography, Divider } from '@mui/material';
import { ServicesSection } from '../components/ServicesSection';
import { LIGHT_TRANSPARENT_BG } from '../styles/constants';

export const ServicesPage: React.FC = () => {
  return (
    <Box sx={{ width: '100%', bgcolor: 'background.default', pt: { xs: 12, md: 16 } }}>
      <Container maxWidth="md" sx={{ mb: { xs: 3, md: 5 } }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 700, textAlign: 'center', mb: 2 }}>
          Towing & Roadside Services
        </Typography>
        <Typography variant="h6" color="text.secondary" align="center">
          Detailed overview of what we offer to get you moving again safely and quickly.
        </Typography>
      </Container>
      <Divider sx={{ borderColor: 'rgba(2,6,23,0.08)', mx: 'auto', width: '90%', maxWidth: '1400px', mb: { xs: 3, md: 5 } }} />

      {/* replicate home page services section wrapper so card layout/background matches exactly */}
      <Box sx={{ width: '100vw', bgcolor: LIGHT_TRANSPARENT_BG }}>
        <Container
          maxWidth="xl"
          sx={{
            px: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 },
            py: { xs: 4, md: 6 },
          }}
        >
          <ServicesSection hideHeader />
        </Container>
      </Box>
    </Box>
  );
};

export default ServicesPage;
