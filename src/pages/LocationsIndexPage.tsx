import React, { useEffect } from 'react';
import { Box, Container, Typography, Paper, Button } from '@mui/material';
import { LOCATIONS } from '../data/locations';
import { Link as RouterLink } from 'react-router-dom';

export const LocationsIndexPage: React.FC = () => {
  useEffect(() => {
    const prev = document.title;
    document.title = 'Service Areas | 24/7 Towing';
    return () => { document.title = prev; };
  }, []);

  return (
    <Box sx={{ width: '100%', bgcolor: '#f6f8fa', pt: { xs: 12, md: 16 }, pb: { xs: 8, md: 12 } }}>
      <Container maxWidth="md" sx={{ mb: { xs: 4, md: 6 }, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
          Chicagoland Service Areas
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Primary hub in Plainfield with rapid coverage across Chicagoland suburbs.
        </Typography>
      </Container>
      <Container maxWidth="lg" sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' } }}>
        {LOCATIONS.map(loc => (
          <Paper key={loc.slug} elevation={3} sx={{ p: 3, borderRadius: 3, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>{loc.city}, {loc.state}</Typography>
            <Typography variant="body2" color="text.secondary">{loc.description}</Typography>
            {/* Removed radius display per request */}
            <Button component={RouterLink} to={`/locations/${loc.slug}`} variant="contained" color="primary" size="small" sx={{ alignSelf: 'flex-start', borderRadius: 999, mt: 1 }}>
              View Details
            </Button>
          </Paper>
        ))}
      </Container>
    </Box>
  );
};

export default LocationsIndexPage;
