import React from 'react';
import { PHONE } from '../../config';import { Typography, Button, Divider, Stepper, Step, StepLabel, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { BlogLayout } from '../../components/BlogLayout';

const steps = [
  'Scene Safety',
  'Assessment',
  'Secure & Load',
  'Transport',
  'Next Steps'
];

const AccidentRecoveryWhatToExpect: React.FC = () => {
  return (
    <BlogLayout
      title="Accident Recovery: What To Expect"
      description="Understand the accident recovery process: safety, assessment, loading, transport, and post-incident guidance."
      canonicalPath="/blog/accident-recovery-what-to-expect"
      datePublished="2025-11-08"
      image="/images/tow-snow.webp"
    >
      <Typography variant="overline" sx={{ letterSpacing:1, color:'primary.main' }}>Recovery</Typography>
      <Typography variant="h3" component="h1" sx={{ fontWeight:800, mb:1 }}>Accident Recovery: What To Expect</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb:3 }}>Published Nov 2025 • 6 min read</Typography>
      <Typography variant="h6" color="text.secondary" sx={{ mb:4 }}>
        After a collision, professional recovery protects evidence, safety, and vehicle integrity. Here's the sequence our teams follow.
      </Typography>
        <Divider sx={{ mb:5 }} />
        <Stepper activeStep={4} alternativeLabel sx={{ mb:6 }}>
          {steps.map(label => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Typography paragraph>
          First priority is scene safety—hazards, fluids, traffic flow. We coordinate with any on-site responders.
        </Typography>
        <Typography paragraph>
          Assessment determines equipment: flatbed, winch angle, soft straps vs chains, and if stabilization is needed.
        </Typography>
        <Typography paragraph>
          Securing and loading uses controlled tension and balanced points to avoid secondary damage. Photos may be taken for documentation.
        </Typography>
        <Typography paragraph>
          Transport routes consider clearance, traffic, and destination constraints (shop hours, insurer direction).
        </Typography>
        <Typography paragraph>
          Finally, we advise on insurance contacts, storage, and rapid estimate options.
        </Typography>
        <Box sx={{ textAlign:'center', my:5 }}>
          <Typography variant="h6" sx={{ fontWeight:700, mb:2 }}>Need accident recovery now?</Typography>
          <Box sx={{ display:'flex', gap:2, justifyContent:'center', flexWrap:'wrap' }}>
            <Button component={RouterLink} to="/request-help#lead-form" variant="contained" color="primary" size="large" sx={{ borderRadius:999, px:4 }}>Request Help</Button>
            <Button component="a" href={`tel:${PHONE}`} variant="outlined" size="large" sx={{ borderRadius:999 }}>Call Dispatch</Button>
          </Box>
        </Box>
    </BlogLayout>
  );
};

export default AccidentRecoveryWhatToExpect;
