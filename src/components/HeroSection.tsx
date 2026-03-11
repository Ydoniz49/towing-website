import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { HERO_TITLE, HERO_SUBTITLE, HERO_PHONE } from '../config';
import ResponsivePicture from './ResponsivePicture';

interface TickerContentProps {
  isRepeat?: boolean;
}

const tickerItems = [
  'Fast response',
  'Transparent pricing',
  'Professional service',
  '24/7 availability',
  'Experienced drivers',
  'Quick assistance',
  'Battery service',
  'Lockouts',
  'Flat tire assistance',
  'Accident recovery',
  'Insured operators',
  '24/7 dispatch'
];
import PhoneIcon from '@mui/icons-material/Phone';

const TickerContent: React.FC<TickerContentProps> = ({ isRepeat = false }) => {
  return (
    <>
      {tickerItems.map((item, idx) => (
        <Box 
          key={isRepeat ? `repeat-${idx}` : idx} 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            fontWeight: 600
          }}
        >
          {item}
          <StarIcon 
            sx={{ 
              fontSize: 18, 
              color: '#fff',
              opacity: 0.85,
              ml: 1 
            }} 
          />
        </Box>
      ))}
    </>
  );
};

export const HeroSection: React.FC = () => {
  const handleEmergencyCall = () => {
    window.location.href = `tel:${HERO_PHONE}`;
  };

  return (
    <>
      <Box
        sx={{
          // Hero background now a subtle white-based gradient
          bgcolor: 'transparent',
          pt: { xs: 8, md: 16 }, // reduced top space on mobile to bring content up
          pb: { xs: 6, md: 12 },
          width: '100vw',
          position: 'relative',
          left: '50%',
          right: '50%',
          marginLeft: '-50vw',
          marginRight: '-50vw',
          backgroundImage: 'linear-gradient(180deg, #ffffff 0%, #fafafa 45%, #f6f8fa 100%)',
          backgroundSize: '100% 100%',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'top',
          color: 'text.primary',
          textAlign: 'center',
        }}
      >
        <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 }, pt: { xs: 2, md: 4 }, pb: { xs: 2, md: 4 } }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1.05fr 0.95fr' },
              alignItems: 'center',
              gap: { xs: 3, md: 5, lg: 6 },
            }}
          >
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Typography
                component="h1"
                variant="h2"
                gutterBottom
                sx={{
                  fontWeight: 800,
                  mb: { xs: 2, md: 2.5 },
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem', lg: '3.4rem' },
                  lineHeight: 1.08,
                }}
              >
                {HERO_TITLE}
              </Typography>
              <Typography
                variant="h5"
                paragraph
                sx={{
                  mb: { xs: 3, md: 3.5 },
                  fontSize: { xs: '1rem', sm: '1.15rem', md: '1.2rem' },
                  color: 'text.secondary',
                  maxWidth: { md: 620 },
                }}
              >
                {HERO_SUBTITLE}
              </Typography>
              <Box sx={{ mt: { xs: 2, md: 3 }, display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' }, gap: 2 }}>
                <Button
                  variant="contained"
                  size="large"
                  color="error"
                  startIcon={<PhoneIcon />}
                  onClick={handleEmergencyCall}
                  className="emergency-button"
                  sx={{ fontSize: { xs: '1rem', md: '1.05rem' }, py: 1.35, px: { xs: 3, md: 3.5 }, borderRadius: 999 }}
                >
                  Emergency Towing: {HERO_PHONE}
                </Button>
              </Box>
            </Box>

            <Box
              sx={{
                position: 'relative',
                borderRadius: 6,
                p: { xs: 1, md: 1.25 },
                background: 'linear-gradient(140deg, rgba(255,56,92,0.12), rgba(16,185,129,0.12))',
                boxShadow: '0 20px 48px rgba(2,6,23,0.14)',
              }}
            >
              <ResponsivePicture
                src="/images/tow-snow.webp"
                alt="Tow truck assisting a vehicle on a winter roadside"
                width={1200}
                height={800}
                loading="eager"
                fetchPriority="high"
                sizes="(max-width: 900px) 100vw, 44vw"
                borderRadius={20}
              />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Ticker — doubles as hero bottom border */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          mt: { xs: -4, md: -8 }, // smaller overlap on phones
          mb: 0, 
          position: 'relative', 
          zIndex: 20, 
          width: '100vw', 
          left: '50%', 
          right: '50%', 
          marginLeft: '-50vw', 
          marginRight: '-50vw' 
        }}
      >
        <Box
          className="ticker-shell"
          sx={{
            bgcolor: '#10B981', // A professional green that's easy on the eyes
            borderRadius: 0,
            px: 0,
            py: 1,
            boxShadow: '0 6px 18px rgba(16,24,40,0.1)',
            overflow: 'hidden',
            position: 'relative',
            zIndex: 20,
            width: '100%',
            color: '#FFFFFF', // White text
            '&::before, &::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              bottom: 0,
              width: '100px',
              zIndex: 2,
              pointerEvents: 'none',
            },
            '&::before': {
              left: 0,
              background: 'linear-gradient(90deg, #10B981 0%, rgba(16,185,129,0) 100%)',
            },
            '&::after': {
              right: 0,
              background: 'linear-gradient(270deg, #10B981 0%, rgba(16,185,129,0) 100%)',
            },
          }}
        >
          <Box className="ticker" sx={{ display: 'flex', alignItems: 'center', px: 4 }}>
            <Box 
              className="ticker-track" 
              sx={{ 
                whiteSpace: 'nowrap', 
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: 3 
              }}
            >
              <TickerContent />
              <TickerContent isRepeat />
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};