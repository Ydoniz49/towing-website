import React from 'react';
import { PHONE } from '../../config';import { Typography, Button, Alert, Divider, List, ListItem, ListItemText, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { BlogLayout } from '../../components/BlogLayout';

const EmergencyTowingGuide: React.FC = () => {
  return (
    <BlogLayout
      title="Emergency Towing Guide"
      description="Learn when to request an emergency tow, how to stay safe while waiting, and what information dispatchers need."
      canonicalPath="/blog/emergency-towing-guide"
      datePublished="2025-11-08"
      image="/images/tow-snow.webp"
    >
      <Typography variant="overline" sx={{ letterSpacing: 1, color: 'primary.main' }}>Guide</Typography>
      <Typography variant="h3" component="h1" sx={{ fontWeight: 800, mb: 1 }}>Emergency Towing Guide</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Published Nov 2025 • 5 min read</Typography>
      <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
        When breakdowns or collisions happen, knowing when to request an emergency tow prevents further damage and keeps everyone safer.
      </Typography>
        <Alert severity="warning" variant="outlined" sx={{ mb: 4 }}>
          If anyone is injured or there is fire, smoke, or leaking fuel, call emergency services first.
        </Alert>
        <Typography variant="h5" sx={{ fontWeight:700, mb:2 }}>When You Need an Emergency Tow</Typography>
        <List dense>
          <ListItem><ListItemText primary="Collision or structural damage" /></ListItem>
          <ListItem><ListItemText primary="Loss of steering or braking ability" /></ListItem>
          <ListItem><ListItemText primary="Transmission failure or drivetrain lock" /></ListItem>
          <ListItem><ListItemText primary="Overheating with steam or persistent smoke" /></ListItem>
        </List>
        <Typography paragraph>
          Driving further in these situations can escalate cost and risk. Request a professional tow immediately to limit additional mechanical damage.
        </Typography>
        <Typography variant="h5" sx={{ fontWeight:700, mt:4, mb:2 }}>Info Dispatchers Need</Typography>
        <List dense>
          <ListItem><ListItemText primary="Location: nearest exit, mile marker, cross street" /></ListItem>
          <ListItem><ListItemText primary="Vehicle: year, make, model" /></ListItem>
          <ListItem><ListItemText primary="Problem: brief symptom description (e.g. 'lost coolant, white steam')" /></ListItem>
          <ListItem><ListItemText primary="Safety concerns: traffic speed, limited shoulder, night visibility" /></ListItem>
        </List>
        <Typography paragraph>
          Accurate info helps us choose the right truck (flatbed vs. wheel lift) and arrival path for quicker, safer service.
        </Typography>
        <Divider sx={{ my:6 }} />
        <Typography variant="h5" sx={{ fontWeight:700, mb:2 }}>Staying Safe While Waiting</Typography>
        <List dense>
          <ListItem><ListItemText primary="Keep hazards on" /></ListItem>
          <ListItem><ListItemText primary="Stay in the vehicle with seatbelt on unless unsafe" /></ListItem>
          <ListItem><ListItemText primary="Prepare documents (registration, insurance)" /></ListItem>
        </List>
        <Typography paragraph>
          We arrive, secure the scene, load the vehicle carefully, and advise next steps for repair or assessment.
        </Typography>
        <Box sx={{ textAlign:'center', my:4 }}>
          <Typography variant="h6" sx={{ fontWeight:700, mb:2 }}>Need an emergency tow right now?</Typography>
          <Box sx={{ display:'flex', gap:2, justifyContent:'center', flexWrap:'wrap' }}>
            <Button component={RouterLink} to="/request-help#lead-form" variant="contained" color="primary" size="large" sx={{ borderRadius:999, px:4 }}>Request Help</Button>
            <Button component="a" href={`tel:${PHONE}`} variant="outlined" size="large" sx={{ borderRadius:999 }}>Call Dispatch</Button>
          </Box>
        </Box>
    </BlogLayout>
  );
};

export default EmergencyTowingGuide;
