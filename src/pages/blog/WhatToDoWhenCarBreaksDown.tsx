import React from 'react';
import { Typography, Alert, List, ListItem, ListItemText, Divider, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { BlogLayout } from '../../components/BlogLayout';

export const WhatToDoWhenCarBreaksDown: React.FC = () => {
  return (
    <BlogLayout
      title="What To Do When Your Car Breaks Down"
      description="A clear, calm checklist to keep you safe during a breakdown and get professional help quickly."
      canonicalPath="/blog/what-to-do-when-your-car-breaks-down"
      datePublished="2025-11-08"
      image="/images/tow-snow.webp"
    >
      <Typography variant="overline" sx={{ letterSpacing: 1, color: 'primary.main' }}>Safety Guide</Typography>
      <Typography variant="h3" component="h1" sx={{ fontWeight: 800, mb: 1 }}>
        What To Do When Your Car Breaks Down
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Published Nov 2025 • 6 min read
      </Typography>
      <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
        A clear, calm checklist to keep you safe, reduce stress, and get professional help quickly.
      </Typography>
        <Alert severity="warning" variant="outlined" sx={{ mb: 4 }}>
          If you’re in a dangerous situation (high-speed traffic, smoke, fire, or injury) call emergency services first.
        </Alert>

        <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mt: 4, mb: 2 }}>
          1. Stay Calm & Assess
        </Typography>
        <Typography paragraph>
          Sudden breakdowns are stressful. Take a breath and quickly observe what happened: loss of power, dash lights, smoke, strange noise, flat tire, or steering issues.
        </Typography>

        <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mt: 4, mb: 2 }}>
          2. Signal & Move Over (If Possible)
        </Typography>
        <Typography paragraph>
          Turn on hazard lights immediately. If the vehicle still has momentum and it’s safe, coast toward the right shoulder, an exit ramp, or a wide breakdown lane. Avoid stopping on a blind curve.
        </Typography>
        <List dense>
          <ListItem><ListItemText primary="Use turn signals when merging to the shoulder." /></ListItem>
          <ListItem><ListItemText primary="Don’t slam brakes—steady control is safer." /></ListItem>
          <ListItem><ListItemText primary="If you can’t move fully off the road, angle wheels away from traffic." /></ListItem>
        </List>

        <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mt: 4, mb: 2 }}>
          3. Make Yourself Visible & Stay Safe
        </Typography>
        <Typography paragraph>
          Keep hazard lights on. At night or in poor visibility, consider turning on interior lights. If you have reflective triangles or flares, place them (rough guidance: 10 ft, 100 ft, and 200 ft behind on highways). Never stand in the travel lane.
        </Typography>

        <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mt: 4, mb: 2 }}>
          4. Diagnose Lightly (Only If Safe)
        </Typography>
        <Typography paragraph>
          Check the basics: flat tire, steam (coolant), smoke (call for help), dead battery symptoms (dim lights, clicking), out of fuel, or dashboard warning indicators. Avoid opening the hood if you’re too close to fast-moving traffic.
        </Typography>

        <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mt: 4, mb: 2 }}>
          5. Call Professional Help
        </Typography>
        <Typography paragraph>
          A qualified towing or roadside technician reduces risk and further damage. Provide location (nearest mile marker, exit, cross street), vehicle make/model/year, and the issue you observed.
        </Typography>
        <List dense>
          <ListItem><ListItemText primary="Need a jump, tire change, or tow? Call us 24/7." /></ListItem>
          <ListItem><ListItemText primary="If you’re unsure, describe the symptoms—we’ll guide next steps." /></ListItem>
        </List>
        <Box sx={{ my: 3 }}>
          <Button component="a" href="tel:1-800-TOWING" variant="contained" color="primary" size="large" sx={{ borderRadius: 999, px: 4 }}>
            Call 24/7 Dispatch: 1-800-TOWING
          </Button>
        </Box>

        <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mt: 4, mb: 2 }}>
          6. Stay With (or Near) the Vehicle Safely
        </Typography>
        <Typography paragraph>
          In most cases, stay inside with seatbelt fastened—especially on busy highways. If you must exit (e.g. smoke or fire risk), move to a safe distance behind a barrier if available.
        </Typography>

        <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mt: 4, mb: 2 }}>
          7. Prepare for Help to Arrive
        </Typography>
        <Typography paragraph>
          Gather registration, insurance, and any roadside assistance membership info. When the truck arrives, confirm company name before unlocking doors.
        </Typography>

        <Divider sx={{ my: 6 }} />
        <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 2 }}>
          Essential Breakdown Kit Checklist
        </Typography>
        <List dense>
          <ListItem><ListItemText primary="Phone + charger / battery pack" /></ListItem>
          <ListItem><ListItemText primary="Reflective triangles or LED beacons" /></ListItem>
          <ListItem><ListItemText primary="Flashlight with extra batteries" /></ListItem>
          <ListItem><ListItemText primary="Jumper cables or jump pack" /></ListItem>
          <ListItem><ListItemText primary="Tire inflator & pressure gauge" /></ListItem>
          <ListItem><ListItemText primary="Work gloves" /></ListItem>
          <ListItem><ListItemText primary="Emergency water & basic first-aid kit" /></ListItem>
        </List>

        <Divider sx={{ my: 6 }} />
        <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 2 }}>
          When to Call a Tow vs. Roadside Assist
        </Typography>
        <Typography paragraph>
          Minor issues like a dead battery, flat tire, or being out of fuel can often be resolved on-site. Situations like drivetrain failure, overheating with steam, collision damage, or unknown engine knocking usually require a tow to prevent further harm.
        </Typography>

        <Alert severity="info" sx={{ mb: 6 }}>
          Not sure which you need? Our dispatcher will triage and send the right help the first time.
        </Alert>

        <Box sx={{ textAlign: 'center', my: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Ready for fast, professional help?
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button component={RouterLink} to="/request-help#lead-form" variant="contained" color="primary" size="large" sx={{ borderRadius: 999, px: 4 }}>
              Request Help Now
            </Button>
            <Button component="a" href="tel:1-800-TOWING" variant="outlined" size="large" sx={{ borderRadius: 999 }}>
              Call Dispatch
            </Button>
          </Box>
        </Box>
    </BlogLayout>
  );
};

export default WhatToDoWhenCarBreaksDown;
