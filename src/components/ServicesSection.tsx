import React from 'react';
import { Box, Container, Card, CardContent, Typography, Button } from '@mui/material';
import { track } from '../utils/analytics';
import { PHONE } from '../config';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import BuildIcon from '@mui/icons-material/Build';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

const services = [
  {
    title: 'Emergency Towing',
    desc: 'Fast, 24/7 towing to get you and your vehicle safe — local and long-distance.',
    icon: <LocalShippingIcon />,
    href: '/blog/emergency-towing-guide',
  },
  {
    title: 'Roadside Assistance',
    desc: 'Lockouts, flat tires, fuel delivery, and on-the-spot help to get you moving.',
    icon: <BuildIcon />,
    href: '/blog/roadside-assistance-checklist',
  },
  {
    title: 'Battery Service',
    desc: "Jump starts and battery replacements so minor issues don't turn into big ones.",
    icon: <BatteryChargingFullIcon />,
    href: '/blog/battery-jumpstart-vs-replacement',
  },
  {
    title: 'Accident Recovery',
    desc: 'Careful vehicle recovery and transport after collisions with insured operators.',
    icon: <DirectionsCarIcon />,
    href: '/blog/accident-recovery-what-to-expect',
  },
  {
    title: 'Cash for Junk Cars',
    desc: 'Get instant cash offers and free towing for junk or damaged vehicles — any condition.',
    icon: <LocalOfferIcon />,
    href: '/cash-for-junk-cars',
    cta: 'Sell your car',
  },
];

export type ServicesSectionProps = {
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
};

export const ServicesSection: React.FC<ServicesSectionProps> = ({ maxWidth = 'xl' }) => {
  return (
    <Box id="services" component="section" sx={{ py: { xs: 6, md: 10 }, background: 'transparent' }}>
      <Container maxWidth={maxWidth}>
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 700, mb: 1 }}>
            Our Towing & Roadside Services
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Fast response, safe handling, and transparent pricing — trusted by drivers in your area.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              // Use auto-fit + minmax so cards grow wider on large screens instead of staying narrow at 5 fixed columns.
              md: 'repeat(auto-fit, minmax(260px, 1fr))'
            },
            alignItems: 'stretch',
            justifyContent: 'center'
          }}
        >
          {services.map((s: any, i) => (
            <Box key={i}>
              <Card
                elevation={6}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  p: 2,
                  borderRadius: 3,
                  transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  '&:hover': {
                    transform: 'scale(1.03) translateY(-8px)',
                    boxShadow: '0 12px 48px rgba(16,24,40,0.18)',
                  },
                }}
              >
                <>
                  <CardContent sx={{ pb: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 2, mb: 2 }}>
                      <Box
                        sx={{
                          width: 72,
                          height: 72,
                          display: 'grid',
                          placeItems: 'center',
                          borderRadius: '16px',
                          bgcolor: 'rgba(255, 56, 92, 0.1)',
                          color: 'primary.main',
                        }}
                      >
                        {s.icon && React.cloneElement(s.icon, { sx: { fontSize: 40 } })}
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {s.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                      {s.desc}
                    </Typography>
                  </CardContent>
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      fullWidth 
                      href={s.href}
                      onClick={() => track('service_card_click', { service: s.title, href: s.href })}
                    >
                      {s.cta || 'Learn more'}
                    </Button>
                  </Box>
                </>
              </Card>
            </Box>
          ))}
        </Box>

        {/* Inline funnel CTA */}
        <Box sx={{ textAlign: 'center', mt: { xs: 5, md: 6 } }}>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Stuck right now?
          </Typography>
          <Box sx={{ display: 'inline-flex', gap: 1.5, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button href="/request-help#lead-form" variant="contained" color="primary" size="large" sx={{ borderRadius: 999, px: 4 }}>
              Request Help Now
            </Button>
            <Button href={`tel:${PHONE}`} variant="outlined" size="large" sx={{ borderRadius: 999, px: 3 }}>
              Call Now
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};