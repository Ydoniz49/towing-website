import React from 'react';
import { Box } from '@mui/material';

type ResponsivePictureProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes?: string;
  loading?: 'eager' | 'lazy';
  fetchPriority?: 'high' | 'low' | 'auto';
  borderRadius?: number;
};

export const ResponsivePicture: React.FC<ResponsivePictureProps> = ({
  src,
  alt,
  width,
  height,
  sizes = '(max-width: 900px) 100vw, 50vw',
  loading = 'lazy',
  fetchPriority = 'auto',
  borderRadius = 24,
}) => {
  const isWebp = src.toLowerCase().endsWith('.webp');

  return (
    <Box
      component="picture"
      sx={{
        display: 'block',
        width: '100%',
        borderRadius,
        overflow: 'hidden',
      }}
    >
      {isWebp && <source type="image/webp" srcSet={src} sizes={sizes} />}
      <Box
        component="img"
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        decoding="async"
        fetchPriority={fetchPriority}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        }}
      />
    </Box>
  );
};

export default ResponsivePicture;