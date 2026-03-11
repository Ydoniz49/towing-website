import React, { useEffect } from 'react';
import { SITE_NAME } from '../config';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { LOCATION_BY_SLUG, LOCATIONS } from '../data/locations';
import { Box, Container, Typography, Chip, Paper, Button, List, ListItem, ListItemText } from '@mui/material';
import { ServicesSection } from '../components/ServicesSection';
import { generateLocalBusinessSchema, injectSchema } from '../utils/schema';
import { MapWithRadius } from '../components/MapWithRadius';
import { track } from '../utils/analytics';

export const LocationPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const loc = slug ? LOCATION_BY_SLUG[slug] : undefined;

  useEffect(() => {
    const prev = document.title;
    if (loc) {
      document.title = `${loc.city}, ${loc.state} Towing | ${SITE_NAME}`;
      
      // Inject LocalBusiness structured data
      const schema = generateLocalBusinessSchema(loc);
      const cleanup = injectSchema(schema);
      
      return () => {
        document.title = prev;
        cleanup();
      };
    }
    return () => { document.title = prev; };
  }, [loc]);

  if (!loc) {
    return (
      <Box sx={{ width: '100%', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', pt: { xs: 12, md: 16 } }}>
        <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>Location Not Found</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            The service area you’re looking for doesn’t exist yet.
          </Typography>
          <Button component={RouterLink} to="/locations" variant="contained" color="primary" sx={{ borderRadius: 999 }}>Back to Locations</Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.default' }}>
      {/* Hero */}
      <Box sx={{
        bgcolor: 'transparent',
        pt: { xs: 12, md: 16 },
        pb: { xs: 6, md: 8 },
        width: '100vw', left: '50%', right: '50%', ml: '-50vw', mr: '-50vw', position: 'relative',
        backgroundImage: 'linear-gradient(180deg, #1b1f26 0%, #222730 45%, #191c22 100%)',
        textAlign: 'center'
      }}>
        <Container maxWidth="md">
          <Typography variant="overline" sx={{ color: 'primary.main', letterSpacing: 1 }}>Service Area</Typography>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 800, mb: 1 }}>
            {loc.name}
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            {loc.description}
          </Typography>
          {loc.seo?.eta && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {loc.seo.eta}
            </Typography>
          )}
          <Button component="a" href={`tel:${loc.ctaPhone || loc.phone}`} variant="contained" color="primary" size="large" sx={{ borderRadius: 999, px: 4 }}
            onClick={() => track('phone_click', { placement: 'location_hero', city: loc.city })}
          >
            Call our {loc.city} dispatch: {loc.ctaPhone || loc.phone}
          </Button>
        </Container>
      </Box>

      {/* Map with service radius */}
      <Container maxWidth="md" sx={{ mt: { xs: 2, md: 3 }, mb: { xs: 4, md: 6 } }}>
        <Paper elevation={3} sx={{ p: 2 /* radius via theme */ }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Service area map</Typography>
          <MapWithRadius center={loc.coords} radiusMiles={loc.radiusMiles} height={340} visualScale={0.6} />
        </Paper>
      </Container>

        {/* Global Services section reused from homepage */}
        <ServicesSection maxWidth="md" />

      {/* Services & CTA */}
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 }, display: 'grid', gap: { xs: 3, md: 4 } }}>
        {loc.services && loc.services.length > 0 && (
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Common Services</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {loc.services.map(s => (
                <Chip key={s} label={s} color="default" size="small" />
              ))}
            </Box>
          </Paper>
        )}

        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Need help in {loc.city} right now?</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Tell us a few details and our dispatcher will reach out immediately.
          </Typography>
          <Button component={RouterLink} to="/request-help#lead-form" variant="contained" color="primary" sx={{ borderRadius: 999 }}>
            Request Help
          </Button>
        </Paper>

        {/* Location-specific info for SEO */}
        {(loc.seo?.highways || loc.seo?.neighborhoods || loc.seo?.zipCodes || loc.zipCodes) && (
          <Paper elevation={1} sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Getting to you fast in {loc.city}</Typography>
            {loc.seo?.highways && loc.seo.highways.length > 0 && (
              <>
                <Typography variant="subtitle2" sx={{ mt: 1 }}>Common service corridors</Typography>
                <List dense>
                  {loc.seo.highways.map((h) => (
                    <ListItem key={h} sx={{ py: 0 }}>
                      <ListItemText primary={h} />
                    </ListItem>
                  ))}
                </List>
              </>
            )}
            {loc.seo?.neighborhoods && loc.seo.neighborhoods.length > 0 && (
              <>
                <Typography variant="subtitle2">Neighborhoods we frequently serve</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {loc.seo.neighborhoods.map(n => (
                    <Chip key={n} label={n} size="small" />
                  ))}
                </Box>
              </>
            )}
            {(loc.seo?.zipCodes || loc.zipCodes) && (
              <>
                <Typography variant="subtitle2" sx={{ mt: 2 }}>Zip codes we cover</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {(loc.seo?.zipCodes || loc.zipCodes || []).map((z: string) => (
                    <Chip key={z} label={z} size="small" />
                  ))}
                </Box>
              </>
            )}
          </Paper>
        )}

        {/* Nearby Areas */}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Nearby Areas We Serve</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {getNearbyLocations(loc.slug).map(n => (
              <Button key={n.slug} component={RouterLink} to={`/locations/${n.slug}`} size="small" sx={{ borderRadius: 999 }}>
                {n.city}, {n.state}
              </Button>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

// Lightweight distance helper for internal linking relevance
function getNearbyLocations(slug: string) {
  const current = LOCATION_BY_SLUG[slug];
  if (!current) return [] as typeof LOCATIONS;
  const dist = (a: {lat:number; lng:number}, b: {lat:number; lng:number}) => {
    const toRad = (d:number)=>d*Math.PI/180;
    const R = 6371; // km
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const aa = Math.sin(dLat/2)**2 + Math.cos(toRad(a.lat))*Math.cos(toRad(b.lat))*Math.sin(dLng/2)**2;
    const c = 2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1-aa));
    return R * c; // km
  };
  return LOCATIONS
    .filter(l => l.slug !== slug)
    .map(l => ({ l, d: dist(current.coords, l.coords) }))
    .sort((x, y) => x.d - y.d)
    .slice(0, 4)
    .map(x => x.l);
}

export default LocationPage;
