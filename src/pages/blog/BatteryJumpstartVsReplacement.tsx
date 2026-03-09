import React from 'react';
import { PHONE } from '../../config';import { Typography, Button, Divider, Paper, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { BlogLayout } from '../../components/BlogLayout';

const BatteryJumpstartVsReplacement: React.FC = () => {
  return (
    <BlogLayout
      title="Battery: Jump-Start vs Replacement"
      description="How to decide between a jump-start and battery replacement on the roadside, symptoms, quick tests, and what we can do on-scene."
      canonicalPath="/blog/battery-jumpstart-vs-replacement"
      datePublished="2025-11-08"
      image="/images/tow-snow.webp"
    >
      <Typography variant="overline" sx={{ letterSpacing:1, color:'primary.main' }}>Battery</Typography>
      <Typography variant="h3" component="h1" sx={{ fontWeight:800, mb:1 }}>Jump-Start vs Replacement</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb:3 }}>Published Nov 2025 • 4 min read</Typography>
      <Typography variant="h6" color="text.secondary" sx={{ mb:4 }}>
        Not sure if you need a jump or a new battery? Here's how to tell, and what our team can do at the curb.
      </Typography>
        <Divider sx={{ my:4 }} />
        <Box sx={{ display:'grid', gap:2, gridTemplateColumns:{ xs:'1fr', md:'1fr 1fr' } }}>
          <Paper variant="outlined" sx={{ p:2, borderRadius:3 }}>
            <Typography variant="h6" sx={{ fontWeight:700, mb:1 }}>Jump-Start</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb:1 }}>Best when:</Typography>
            <ul>
              <li>Headlights dim and dashboard flickers</li>
              <li>Car was recently sitting with lights on</li>
              <li>Battery age under 3 years</li>
            </ul>
            <Typography variant="body2">We use pro-grade boosters and verify alternator output before sending you on your way.</Typography>
          </Paper>
          <Paper variant="outlined" sx={{ p:2, borderRadius:3 }}>
            <Typography variant="h6" sx={{ fontWeight:700, mb:1 }}>Replacement</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb:1 }}>Consider when:</Typography>
            <ul>
              <li>Cranks slowly after a successful jump</li>
              <li>Battery age 4+ years or visible corrosion/bulge</li>
              <li>Multiple jump-starts in a short time</li>
            </ul>
            <Typography variant="body2">We can advise on replacement options or tow to a nearby shop if needed.</Typography>
          </Paper>
        </Box>
        <Box sx={{ textAlign:'center', my:5 }}>
          <Typography variant="h6" sx={{ fontWeight:700, mb:2 }}>Need a jump or tow right now?</Typography>
          <Box sx={{ display:'flex', gap:2, justifyContent:'center', flexWrap:'wrap' }}>
            <Button component={RouterLink} to="/request-help#lead-form" variant="contained" color="primary" size="large" sx={{ borderRadius:999, px:4 }}>Request Help</Button>
            <Button component="a" href={`tel:${PHONE}`} variant="outlined" size="large" sx={{ borderRadius:999 }}>Call Dispatch</Button>
          </Box>
        </Box>
    </BlogLayout>
  );
};

export default BatteryJumpstartVsReplacement;
