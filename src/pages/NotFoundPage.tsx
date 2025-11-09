import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  return (
    <Box sx={{ width: '100%', minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f6f8fa', pt: { xs: 10, md: 14 } }}>
      <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
        <Typography variant="h2" sx={{ fontWeight: 700, mb: 2 }}>404</Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          The page you’re looking for doesn’t exist.
        </Typography>
        <Button component={RouterLink} to="/" variant="contained" color="primary" sx={{ borderRadius: 999, px: 4 }}>
          Go Home
        </Button>
      </Container>
    </Box>
  );
};

export default NotFoundPage;
