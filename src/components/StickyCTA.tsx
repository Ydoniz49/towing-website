import React from 'react';
import { Box, Button } from '@mui/material';
import { PINK_35 } from '../styles/constants';
import { PHONE } from '../config';

export const StickyCTA: React.FC = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        zIndex: (theme) => theme.zIndex.appBar + 20,
        pointerEvents: 'none',
        bottom: { xs: 10, sm: 12, md: 18 },
        left: { xs: 10, sm: 14, md: 'auto' },
        right: { xs: 10, sm: 14, md: 24 },
      }}
    >
      {/* Rigid dock/tab that holds both CTAs */}
      <Box
        sx={{
          pointerEvents: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          p: 1,
          borderRadius: { xs: 2, md: 2.5 },
          bgcolor: 'rgba(20, 25, 34, 0.92)',
          border: '1px solid rgba(255,255,255,0.14)',
          boxShadow: '0 14px 34px rgba(0,0,0,0.46)',
          backdropFilter: 'blur(8px) saturate(120%)',
          width: { xs: '100%', md: 'auto' },
          minWidth: { md: 360 },
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
            borderRadius: 1.5,
            minHeight: 44,
            px: { xs: 2, md: 2.8 },
            boxShadow: `0 10px 30px ${PINK_35}`,
            whiteSpace: 'nowrap',
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
            borderRadius: 1.5,
            minHeight: 44,
            px: { xs: 2, md: 2.8 },
            whiteSpace: 'nowrap',
            borderWidth: 1.5,
            '&:hover': {
              borderWidth: 1.5,
            },
          }}
        >
          Call Now
        </Button>
      </Box>
    </Box>
  );
};
