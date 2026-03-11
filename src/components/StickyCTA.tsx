import React from 'react';
import { Box, Button } from '@mui/material';
import { PINK_35 } from '../styles/constants';
import { PHONE } from '../config';

export const StickyCTA: React.FC = () => {
  return (
    <>
      {/* Mobile bottom bar */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 16,
          left: 16,
          right: 16,
          display: { xs: 'flex', md: 'none' },
          justifyContent: 'center',
          zIndex: (theme) => theme.zIndex.appBar + 20,
          pointerEvents: 'none',
          gap: 1,
        }}
      >
        <Button
          component="a"
          href="/request-help#lead-form"
          variant="contained"
          color="primary"
          size="large"
          sx={{
            flex: 1,
            borderRadius: 999,
            py: 1.25,
            boxShadow: `0 10px 30px ${PINK_35}`,
            pointerEvents: 'auto',
          }}
        >
          Request Help
        </Button>
        <Button
          component="a"
          href={`tel:${PHONE}`}
          variant="outlined"
          size="large"
          sx={{
            borderRadius: 999,
            px: 2,
            pointerEvents: 'auto',
            display: { xs: 'inline-flex', sm: 'inline-flex' }
          }}
        >
          Call
        </Button>
      </Box>

      {/* Desktop floating box */}
      <Box
        sx={{
          position: 'fixed',
          right: 24,
          bottom: 24,
          display: { xs: 'none', md: 'flex' },
          gap: 1,
          zIndex: (theme) => theme.zIndex.appBar + 20,
        }}
      >
        <Button component="a" href="/request-help#lead-form" variant="contained" color="primary" size="large" sx={{ borderRadius: 999, px: 3 }}>
          Request Help
        </Button>
        <Button component="a" href={`tel:${PHONE}`} variant="outlined" size="large" sx={{ borderRadius: 999 }}>
          Call Now
        </Button>
      </Box>
    </>
  );
};
