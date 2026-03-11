import React from 'react';
import { Box, Container, Card, CardContent, Typography, Button } from '@mui/material';
import type { SvgIconProps } from '@mui/material/SvgIcon';
import { track } from '../utils/analytics';
import { PHONE } from '../config';
import { ICON_BOX, HOVER_EFFECT, FEATURED_SERVICE_GRADIENT, PINK_35, SECTION_MAX_WIDTH } from '../styles/constants';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import BuildIcon from '@mui/icons-material/Build';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

type ServiceItem = {
  title: string;
  desc: string;
  icon: React.ReactElement<SvgIconProps>;
  href: string;
  cta?: string;
  featured?: boolean;
};

const services: ServiceItem[] = [
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
    featured: true,
  },
];

export type ServicesSectionProps = {
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  /**
   * Render a denser 4-up card grid at md+ widths. Useful when the section is
   * intentionally constrained inside a narrower container like location pages.
   */
  compactCards?: boolean;
  /**
   * Hide the built-in header/title area. Useful when the parent page
   * already renders its own heading (e.g. ServicesPage).
   */
  hideHeader?: boolean;
  /**
   * Optional override for the section heading text.
   * Defaults to `Our Towing & Roadside Services`.
   */
  headerTitle?: string;
  /**
   * Optional override for the section subtitle text.
   * Defaults to `Fast response, safe handling, and transparent pricing — trusted by drivers in your area.`
   */
  headerSubtitle?: string;
};

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  maxWidth = SECTION_MAX_WIDTH,
  compactCards = false,
  hideHeader = false,
  headerTitle,
  headerSubtitle,
}) => {
  const featuredService = services.find((s) => s.featured);
  const coreServices = services.filter((s) => !s.featured);

  return (
    <Box id="services" component="section" sx={{ py: { xs: 6, md: 10 }, background: 'transparent' }}>
      <Container maxWidth={maxWidth}>
        {!hideHeader && (
          <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
            <Typography variant="h4" component="h2" sx={{ fontWeight: 700, mb: 1 }}>
              {headerTitle ?? 'Our Towing & Roadside Services'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {headerSubtitle ??
                'Fast response, safe handling, and transparent pricing — trusted by drivers in your area.'}
            </Typography>
          </Box>
        )}

        <Box
          sx={{
            display: 'grid',
            gap: compactCards ? 2 : 3,
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              // In compact mode we force 4-up cards even inside md containers.
              md: compactCards ? 'repeat(4, minmax(0, 1fr))' : 'repeat(auto-fit, minmax(260px, 1fr))'
            },
            alignItems: 'stretch',
            justifyContent: 'center'
          }}
        >
          {coreServices.map((s) => (
            <Box key={s.title}>
              <Card
                elevation={6}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  p: compactCards ? 1.5 : 2,
                  transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  '&:hover': HOVER_EFFECT,
                }}
              >
                <>
                  <CardContent sx={{ pb: compactCards ? 1.5 : 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: compactCards ? 1.5 : 2, mb: compactCards ? 1.5 : 2 }}>
                      <Box
                        sx={{
                          width: compactCards ? 60 : ICON_BOX.size,
                          height: compactCards ? 60 : ICON_BOX.size,
                          display: 'grid',
                          placeItems: 'center',
                          borderRadius: ICON_BOX.radius,
                          bgcolor: ICON_BOX.bg,
                          color: ICON_BOX.color,
                        }}
                      >
                        {s.icon && React.cloneElement(s.icon, { sx: { fontSize: compactCards ? 32 : 40 } })}
                      </Box>
                      <Typography variant={compactCards ? 'subtitle1' : 'h6'} sx={{ fontWeight: 700, lineHeight: 1.25 }}>
                        {s.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', fontSize: compactCards ? '0.92rem' : undefined }}>
                      {s.desc}
                    </Typography>
                  </CardContent>
                  <Box sx={{ p: compactCards ? 1.5 : 2, pt: 0 }}>
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

        {featuredService && (
          <Card
            elevation={6}
            sx={{
              mt: 3,
              p: { xs: 2.5, md: 3 },
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'auto 1fr auto' },
              alignItems: 'center',
              gap: { xs: 2, md: 3 },
              background: FEATURED_SERVICE_GRADIENT,
              border: `1px solid ${PINK_35}`,
              transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
              '&:hover': {
                transform: 'scale(1.01) translateY(-6px)',
                boxShadow: '0 16px 52px rgba(16,24,40,0.24)',
              },
            }}
          >
            <Box
              sx={{
                width: 72,
                height: 72,
                display: 'grid',
                placeItems: 'center',
                borderRadius: '16px',
                bgcolor: 'rgba(255, 56, 92, 0.16)',
                color: 'primary.main',
                mx: { xs: 'auto', md: 0 },
              }}
            >
              {featuredService.icon && React.cloneElement(featuredService.icon, { sx: { fontSize: 40 } })}
            </Box>

            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Typography variant="overline" sx={{ color: 'primary.main', letterSpacing: 1, fontWeight: 700 }}>
                Featured Service
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.75 }}>
                {featuredService.title}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 860 }}>
                {featuredService.desc}
              </Typography>
            </Box>

            <Button
              variant="contained"
              color="primary"
              size="large"
              href={featuredService.href}
              onClick={() => track('service_card_click', { service: featuredService.title, href: featuredService.href, featured: true })}
              sx={{
                borderRadius: 999,
                px: 3.5,
                whiteSpace: 'nowrap',
                justifySelf: { xs: 'center', md: 'end' },
                minWidth: { xs: 220, md: 'auto' },
              }}
            >
              {featuredService.cta || 'Learn more'}
            </Button>
          </Card>
        )}

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