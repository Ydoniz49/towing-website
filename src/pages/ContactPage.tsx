import React from 'react';
import { Box, Container, Typography, Divider } from '@mui/material';
import { ContactSection } from '../components/ContactSection';

export const ContactPage: React.FC = () => {
  return (
    <Box sx={{ width: '100%', bgcolor: 'background.default', pt: { xs: 12, md: 16 } }}>
      <Container maxWidth="md" sx={{ mb: { xs: 3, md: 5 } }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 700, textAlign: 'center', mb: 2 }}>
          Contact Us
        </Typography>
        <Typography variant="h6" color="text.secondary" align="center">
          We're here 24/7 — reach out anytime.
        </Typography>
      </Container>
      <Divider sx={{ borderColor: 'rgba(2,6,23,0.08)', mx: 'auto', width: '90%', maxWidth: '1400px', mb: { xs: 3, md: 5 } }} />
      {/* section already has its own heading; hide it here to avoid repetition */}
      <ContactSection hideTitle />
    </Box>
  );
};

export default ContactPage;
