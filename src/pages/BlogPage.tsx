import React, { useEffect } from 'react';
import { Box, Container, Typography, Paper, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export const BlogPage: React.FC = () => {
  const posts = [
    { 
      title: 'Emergency Towing Guide',
      excerpt: 'Know when to request an emergency tow, what info dispatchers need, and how to stay safe while waiting.',
      to: '/blog/emergency-towing-guide',
      date: 'Nov 2025',
      readTime: '5 min'
    },
    { 
      title: 'Roadside Assistance Checklist',
      excerpt: 'Quick safety and prep steps for lockouts, flat tires, battery issues, and minor breakdowns.',
      to: '/blog/roadside-assistance-checklist',
      date: 'Nov 2025',
      readTime: '4 min'
    },
    { 
      title: 'Battery: Jump-Start vs Replacement',
      excerpt: 'Symptoms to watch, simple indicators, and deciding between a professional jump or a tow for replacement.',
      to: '/blog/battery-jumpstart-vs-replacement',
      date: 'Nov 2025',
      readTime: '4 min'
    },
    { 
      title: 'Towing Safety Tips for 2026',
      excerpt: 'Modern advice for staying safe when you need a tow in 2026 — location links, visibility, and communication.',
      to: '/blog/towing-safety-tips-2026',
      date: 'Mar 2026',
      readTime: '5 min'
    },
    { 
      title: 'Accident Recovery: What To Expect',
      excerpt: 'Understand the safe sequence: scene protection, assessment, secure load, transport, and next steps.',
      to: '/blog/accident-recovery-what-to-expect',
      date: 'Nov 2025',
      readTime: '6 min'
    },
    { 
      title: 'What To Do When Your Car Breaks Down', 
      excerpt: 'A clear, calm checklist to keep you safe, reduce stress, and get professional help quickly.',
      to: '/blog/what-to-do-when-your-car-breaks-down',
      date: 'Nov 2025',
      readTime: '6 min'
    },
  ];

  // sort the posts array newest first by parsing the `date` strings
  posts.sort((a, b) => {
    const parse = (d: string) => {
      // months abbreviated to first three letters
      return new Date(d.replace(/(\w{3}) (\d{4})/, '$1 1, $2'));
    };
    return parse(b.date).getTime() - parse(a.date).getTime();
  });

  useEffect(() => {
    const prev = document.title;
    document.title = 'Towing & Roadside Tips | 24/7 Towing Blog';
    return () => { document.title = prev; };
  }, []);

  return (
    <Box sx={{ width: '100%', bgcolor: '#f6f8fa', pt: { xs: 12, md: 16 }, pb: { xs: 8, md: 12 } }}>
      <Container maxWidth="md" sx={{ mb: { xs: 4, md: 6 } }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 700, textAlign: 'center', mb: 2 }}>
          Blog
        </Typography>
        <Typography variant="h6" color="text.secondary" align="center">
          Tips, guides, and updates from our team.
        </Typography>
      </Container>
      <Container maxWidth="md" sx={{ display: 'grid', gap: 3 }}>
        {posts.map((p, i) => (
          <Paper key={i} elevation={2} sx={{ p: 3, borderRadius: 3, display: 'grid', gap: 1 }}>
            <Typography variant="overline" sx={{ letterSpacing: 1 }}>{p.date} • {p.readTime}</Typography>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>{p.title}</Typography>
            <Typography variant="body1" color="text.secondary">{p.excerpt}</Typography>
            <Box>
              <Button component={RouterLink} to={p.to} variant="contained" color="primary" size="small" sx={{ mt: 1, borderRadius: 999 }}>
                Read article
              </Button>
            </Box>
          </Paper>
        ))}
      </Container>
    </Box>
  );
};

export default BlogPage;
