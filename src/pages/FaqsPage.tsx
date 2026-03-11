import React from 'react';
import { Box, Container, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const faqs = [
  { q: 'How fast can you arrive?', a: 'Our average response time is 30 minutes or less depending on traffic and location.' },
  { q: 'Are you available 24/7?', a: 'Yes, our dispatch runs around the clock including weekends and holidays.' },
  { q: 'What areas do you cover?', a: 'Our coverage area includes the entire Chicagoland suburbs.' },
  { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, cash, and contactless payments.' },
  { q: 'Is your team insured?', a: 'All operators are licensed and insured for your safety and peace of mind.' }
];

export const FaqsPage: React.FC = () => {
  return (
    <Box sx={{ width: '100%', bgcolor: 'background.default', pt: { xs: 12, md: 16 }, pb: { xs: 8, md: 12 } }}>
      <Container maxWidth="md" sx={{ mb: { xs: 4, md: 6 } }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 700, textAlign: 'center', mb: 2 }}>
          Frequently Asked Questions
        </Typography>
        <Typography variant="h6" color="text.secondary" align="center">
          Answers to common questions about our towing and roadside services.
        </Typography>
      </Container>
      <Container maxWidth="md" sx={{ px: { xs: 2, sm: 4 }, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {faqs.map((item, i) => (
          <Accordion key={i} elevation={1} sx={{ borderRadius: 2, '&:before': { display: 'none' } }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{item.q}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1" color="text.secondary">{item.a}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Container>
    </Box>
  );
};

export default FaqsPage;
