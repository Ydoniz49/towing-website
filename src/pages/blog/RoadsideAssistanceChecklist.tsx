import React from 'react';
import { Typography, Button, Divider, Chip, List, ListItem, ListItemText, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { BlogLayout } from '../../components/BlogLayout';

const RoadsideAssistanceChecklist: React.FC = () => {
  return (
    <BlogLayout
      title="Roadside Assistance Checklist"
      description="Essential roadside assistance checklist: battery, lockout, tire change, fluid issues, and safety steps while you wait."
      canonicalPath="/blog/roadside-assistance-checklist"
      datePublished="2025-11-08"
      image="/images/tow-snow.webp"
    >
      <Typography variant="overline" sx={{ letterSpacing:1, color:'primary.main' }}>Checklist</Typography>
      <Typography variant="h3" component="h1" sx={{ fontWeight:800, mb:1 }}>Roadside Assistance Checklist</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb:3 }}>Published Nov 2025 • 4 min read</Typography>
      <Typography variant="h6" color="text.secondary" sx={{ mb:4 }}>
        Run through this quick list to stay safe and speed up your roadside service if you experience a minor breakdown.
      </Typography>
        <Divider sx={{ mb:4 }} />
        <Typography variant="h5" sx={{ fontWeight:700, mb:2 }}>Core Situations</Typography>
        <Box sx={{ display:'flex', gap:1, flexWrap:'wrap', mb:3 }}>
          <Chip label="Battery" color="primary" variant="outlined" />
          <Chip label="Lockout" color="primary" variant="outlined" />
          <Chip label="Flat Tire" color="primary" variant="outlined" />
          <Chip label="Low Fuel" color="primary" variant="outlined" />
          <Chip label="Overheat" color="primary" variant="outlined" />
        </Box>
        <Typography variant="h5" sx={{ fontWeight:700, mt:2, mb:2 }}>Before You Call</Typography>
        <List dense>
          <ListItem><ListItemText primary="Move to a safe shoulder or parking area if possible" /></ListItem>
          <ListItem><ListItemText primary="Turn on hazard lights" /></ListItem>
          <ListItem><ListItemText primary="Note surroundings: landmarks, exits, mile markers" /></ListItem>
          <ListItem><ListItemText primary="Gather vehicle info: year, make, model" /></ListItem>
        </List>
        <Typography variant="h5" sx={{ fontWeight:700, mt:4, mb:2 }}>While Waiting</Typography>
        <List dense>
          <ListItem><ListItemText primary="Remain in vehicle if near fast traffic" /></ListItem>
          <ListItem><ListItemText primary="Keep doors locked if nighttime or isolated" /></ListItem>
          <ListItem><ListItemText primary="Prepare keys, wheel lock adapter, and insurance card" /></ListItem>
          <ListItem><ListItemText primary="Avoid attempting jump-starts without proper cables" /></ListItem>
        </List>
        <Typography paragraph sx={{ mt:2 }}>
          We verify your situation, send a properly equipped truck, and confirm ETA updates through dispatch. You stay informed every step.
        </Typography>
        <Box sx={{ textAlign:'center', my:5 }}>
          <Typography variant="h6" sx={{ fontWeight:700, mb:2 }}>Need roadside help right now?</Typography>
          <Box sx={{ display:'flex', gap:2, justifyContent:'center', flexWrap:'wrap' }}>
            <Button component={RouterLink} to="/request-help#lead-form" variant="contained" color="primary" size="large" sx={{ borderRadius:999, px:4 }}>Request Help</Button>
            <Button component="a" href="tel:1-800-TOWING" variant="outlined" size="large" sx={{ borderRadius:999 }}>Call Dispatch</Button>
          </Box>
        </Box>
    </BlogLayout>
  );
};

export default RoadsideAssistanceChecklist;
