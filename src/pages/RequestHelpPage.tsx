import React from 'react';
import { Box, Container, Typography, Divider } from '@mui/material';
import { LeadCaptureForm } from '../components/LeadCaptureForm';

export const RequestHelpPage: React.FC = () => {
  return (
    <Box sx={{ width: '100%', bgcolor: 'background.default', pt: { xs: 12, md: 16 }, pb: { xs: 6, md: 10 } }}>
      <Container maxWidth="md" sx={{ mb: { xs: 3, md: 5 } }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 700, textAlign: 'center', mb: 2 }}>
          Request Assistance
        </Typography>
        <Typography variant="h6" color="text.secondary" align="center">
          Provide a few details and our dispatcher will reach out immediately.
        </Typography>
      </Container>
      <Divider sx={{ borderColor: 'rgba(2,6,23,0.08)', mx: 'auto', width: '90%', maxWidth: '1400px', mb: { xs: 3, md: 5 } }} />
      <LeadCaptureForm />
    </Box>
  );
};

export default RequestHelpPage;
