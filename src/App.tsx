import { AppBar, Box, Button, Container, CssBaseline, ThemeProvider, Toolbar, Typography, createTheme, Menu, MenuItem, CircularProgress, Drawer, List, ListItemButton, ListItemText, Divider, Collapse, IconButton } from '@mui/material';
import { SITE_NAME, PHONE } from './config';
import PhoneIcon from '@mui/icons-material/Phone';
import React, { Suspense, lazy, useEffect } from 'react';
import './App.css';
import { StickyCTA } from './components/StickyCTA';
import { Link as RouterLink, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import { LOCATIONS } from './data/locations';
import { initAnalytics, track } from './utils/analytics';

// Lazy load all page components for code splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const FaqsPage = lazy(() => import('./pages/FaqsPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const CashForJunkCarsPage = lazy(() => import('./pages/CashForJunkCarsPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const RequestHelpPage = lazy(() => import('./pages/RequestHelpPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const WhatToDoWhenCarBreaksDown = lazy(() => import('./pages/blog/WhatToDoWhenCarBreaksDown'));
const EmergencyTowingGuide = lazy(() => import('./pages/blog/EmergencyTowingGuide'));
const RoadsideAssistanceChecklist = lazy(() => import('./pages/blog/RoadsideAssistanceChecklist'));
const BatteryJumpstartVsReplacement = lazy(() => import('./pages/blog/BatteryJumpstartVsReplacement'));
const AccidentRecoveryWhatToExpect = lazy(() => import('./pages/blog/AccidentRecoveryWhatToExpect'));
const TowingSafetyTips2026 = lazy(() => import('./pages/blog/TowingSafetyTips2026'));
const LocationsIndexPage = lazy(() => import('./pages/LocationsIndexPage'));
const LocationPage = lazy(() => import('./pages/LocationPage'));

const theme = createTheme({
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { fontWeight: 600 },
  },
  palette: {
    // global accent color used primarily for buttons and icons
    primary: {
      main: '#ff385c',
      contrastText: '#ffffff',
    },
    // secondary kept for other accents
    secondary: {
      main: '#1976d2',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  },
});

export default function App() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleLocClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);
  // Mobile drawer state
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [drawerLocOpen, setDrawerLocOpen] = React.useState(false);
  const toggleDrawer = (next: boolean) => () => setDrawerOpen(next);

  // Initialize analytics if configured
  useEffect(() => {
    initAnalytics();
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
        <Box sx={{ 
          flexGrow: 1, 
          minHeight: '100vh', 
          display: 'flex', 
          flexDirection: 'column',
          margin: 0,
          padding: 0,
          width: '100%',
          // allow horizontal overflow so header buttons aren't clipped
          overflowX: 'visible',
          bgcolor: '#f6f8fa' // unified background
        }}>
        {/* Header - pill shaped, floating overlay */}
        <AppBar
          position="fixed"
          color="transparent"
          elevation={0}
          sx={{
            top: 0,
            left: 0,
            right: 0,
            py: 2,
            background: 'transparent',
            boxShadow: 'none',
            zIndex: (theme) => theme.zIndex.appBar + 10,
            overflowX: 'visible', // allow child to spill
          }}
        >
          <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 4, md: 8, lg: 16, xl: 32 } }}>
            <Toolbar disableGutters sx={{ justifyContent: 'center' }}>
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 2,
                  bgcolor: 'rgba(255,255,255,0.86)',
                  backdropFilter: 'saturate(120%) blur(6px)',
                  pl: { xs: 2, md: 4 },
                  pr: { xs: 3, md: 6, lg: 12, xl: 20 },
                  py: { xs: 0.5, md: 0.75 },
                  borderRadius: 999,
                  boxShadow: '0 8px 28px rgba(2,6,23,0.12)',
                  mb: { xs: 1, md: 2 },
                  overflow: 'visible'
                }}
              >
                <Typography
                  variant="h6"
                  component={RouterLink}
                  to="/"
                  sx={{
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    textDecoration: 'none',
                    color: 'inherit',
                    '&:hover': { opacity: 0.8 },
                    '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', borderRadius: 1, outlineOffset: 4 }
                  }}
                >
                  {SITE_NAME}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  {/* Mobile hamburger (xs/sm) */}
                  <IconButton
                    aria-label="Open menu"
                    onClick={toggleDrawer(true)}
                    sx={{ display: { xs: 'inline-flex', md: 'none' }, mr: 0.5, order: { xs: 2, md: 1 }, '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', borderRadius: 2, outlineOffset: 2 } }}
                  >
                    {/* Simple hamburger without icons package */}
                    <Box sx={{ width: 22, height: 2, bgcolor: 'text.primary', position: 'relative', borderRadius: 1,
                      '&::before': { content: '""', position: 'absolute', left: 0, right: 0, height: 2, bgcolor: 'text.primary', top: -6, borderRadius: 1 },
                      '&::after': { content: '""', position: 'absolute', left: 0, right: 0, height: 2, bgcolor: 'text.primary', top: 6, borderRadius: 1 },
                    }} />
                  </IconButton>

                  <Box component="nav" sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center', gap: { xs: 0.5, sm: 1, md: 1.25, lg: 2 }, flex: 1, minWidth: 0, flexWrap: 'nowrap', order: 2, overflowX: 'auto' }}>
                    <Button
                      size="small"
                      component={RouterLink}
                      to="/cash-for-junk-cars"
                      aria-label="Sell your junk car"
                      sx={{ whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: 0.5,
                        fontSize: { xs: '0.65rem', sm: '0.68rem', md: '0.72rem', lg: '0.75rem' },
                        px: { xs: 0.5, sm: 1, md: 1, lg: 1.25 },
                        flexShrink: 1,
                        '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', borderRadius: 999, outlineOffset: 2 } }}
                    >
                      Sell Junk Car
                    </Button>
                    <Button size="small" component={RouterLink} to="/services" sx={{ whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: 0.5,
                        fontSize: { xs: '0.65rem', sm: '0.68rem', md: '0.72rem', lg: '0.75rem' },
                        px: { xs: 0.5, sm: 1, md: 1, lg: 1.25 },
                        flexShrink: 1,
                        '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', borderRadius: 999, outlineOffset: 2 } }}>Services</Button>
                    <Button
                      size="small"
                      id="locations-button"
                      aria-haspopup="true"
                      aria-expanded={open ? 'true' : undefined}
                      aria-controls={open ? 'locations-menu' : undefined}
                      onClick={handleLocClick}
                      sx={{ whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: 0.5,
                        fontSize: { xs: '0.65rem', sm: '0.68rem', md: '0.72rem', lg: '0.75rem' },
                        px: { xs: 0.5, sm: 1, md: 1, lg: 1.25 },
                        flexShrink: 1,
                        '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', borderRadius: 999, outlineOffset: 2 } }}
                    >
                      Locations
                    </Button>
                    <Button size="small" component={RouterLink} to="/faqs" sx={{ whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: 0.5,
                        fontSize: { xs: '0.65rem', sm: '0.68rem', md: '0.72rem', lg: '0.75rem' },
                        px: { xs: 0.5, sm: 1, md: 1, lg: 1.25 },
                        flexShrink: 1,
                        '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', borderRadius: 999, outlineOffset: 2 } }}>FAQs</Button>
                    <Button size="small" component={RouterLink} to="/blog" sx={{ whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: 0.5,
                        fontSize: { xs: '0.65rem', sm: '0.68rem', md: '0.72rem', lg: '0.75rem' },
                        px: { xs: 0.5, sm: 1, md: 1, lg: 1.25 },
                        flexShrink: 1,
                        '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', borderRadius: 999, outlineOffset: 2 } }}>Blog</Button>
                    <Button size="small" component={RouterLink} to="/contact" sx={{ whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: 0.5,
                        fontSize: { xs: '0.65rem', sm: '0.68rem', md: '0.72rem', lg: '0.75rem' },
                        px: { xs: 0.5, sm: 1, md: 1, lg: 1.25 },
                        flexShrink: 1,
                        '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', borderRadius: 999, outlineOffset: 2 } }}>Contact</Button>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 0.75, alignItems: 'center', flexShrink: 0, order: { xs: 1, md: 3 } }}>
                    {/* Use primary (accent) color for the main CTA button */}
                    <Button size="small" variant="contained" color="primary" component={RouterLink} to="/request-help#lead-form" sx={{ borderRadius: 999, px: { xs: 1.75, sm: 2, md: 2.25 }, minHeight: 34, '&:focus-visible': { outline: '3px solid', outlineColor: 'rgba(255,56,92,0.4)', outlineOffset: 2 } }}>
                      Request Help
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      component="a"
                      href={`tel:${PHONE}`}
                      aria-label="Call (877) GET-JROP"
                      title="Call (877) GET-JROP"
                      sx={{
                        display: { xs: 'none', md: 'inline-flex' },
                        borderRadius: 999,
                        px: 1.1,
                        minHeight: 34,
                        gap: 0.5,
                        whiteSpace: 'nowrap',
                        mr: 1,
                        '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 }
                      }}
                      onClick={() => track('phone_click', { placement: 'header' })}
                    >
                      <PhoneIcon fontSize="small" />
                      <Box component="span">Call</Box>
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>

        {/* Mobile Drawer Navigation */}
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={toggleDrawer(false)}
          PaperProps={{ sx: { width: 320, pt: 1 } }}
          aria-label="Site navigation"
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1 }}>
            <Typography component={RouterLink} to="/" onClick={toggleDrawer(false)} sx={{ textDecoration: 'none', color: 'text.primary', fontWeight: 700 }}>
              24/7 Towing
            </Typography>
            <IconButton aria-label="Close menu" onClick={toggleDrawer(false)}>
              <Box sx={{ position: 'relative', width: 18, height: 18 }}>
                <Box sx={{ position: 'absolute', left: 0, right: 0, top: 8, height: 2, bgcolor: 'text.primary', transform: 'rotate(45deg)', borderRadius: 1 }} />
                <Box sx={{ position: 'absolute', left: 0, right: 0, top: 8, height: 2, bgcolor: 'text.primary', transform: 'rotate(-45deg)', borderRadius: 1 }} />
              </Box>
            </IconButton>
          </Box>
          <Divider />
          <Box sx={{ px: 2, py: 1 }}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              component={RouterLink}
              to="/request-help#lead-form"
              onClick={toggleDrawer(false)}
              sx={{ borderRadius: 999 }}
            >
              Request Help
            </Button>
          </Box>
          <Divider />
          <List component="nav" aria-label="primary navigation">
            <ListItemButton component={RouterLink} to="/cash-for-junk-cars" onClick={toggleDrawer(false)}>
              <ListItemText primary="Sell Your Junk Car" />
            </ListItemButton>
            <ListItemButton component={RouterLink} to="/services" onClick={toggleDrawer(false)}>
              <ListItemText primary="Services" />
            </ListItemButton>
            <ListItemButton onClick={() => setDrawerLocOpen(v => !v)} aria-expanded={drawerLocOpen} aria-controls="drawer-locations">
              <ListItemText primary="Locations" />
              <Box component="span" aria-hidden sx={{ ml: 1, transform: drawerLocOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▾</Box>
            </ListItemButton>
            <Collapse in={drawerLocOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding id="drawer-locations" sx={{ maxHeight: 320, overflowY: 'auto' }}>
                <ListItemButton sx={{ pl: 4 }} component={RouterLink} to="/locations" onClick={toggleDrawer(false)}>
                  <ListItemText primary="All Service Areas" />
                </ListItemButton>
                {LOCATIONS.slice().sort((a, b) => a.city.localeCompare(b.city)).map(loc => (
                  <ListItemButton key={loc.slug} sx={{ pl: 4 }} component={RouterLink} to={`/locations/${loc.slug}`} onClick={toggleDrawer(false)}>
                    <ListItemText primary={`${loc.city}, ${loc.state}`} />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
            <Divider sx={{ my: 0.5 }} />
            <ListItemButton component={RouterLink} to="/faqs" onClick={toggleDrawer(false)}>
              <ListItemText primary="FAQs" />
            </ListItemButton>
            <ListItemButton component={RouterLink} to="/blog" onClick={toggleDrawer(false)}>
              <ListItemText primary="Blog" />
            </ListItemButton>
            <ListItemButton component={RouterLink} to="/contact" onClick={toggleDrawer(false)}>
              <ListItemText primary="Contact" />
            </ListItemButton>
            <Divider sx={{ my: 0.5 }} />
            <ListItemButton component="a" href="tel:1-800-TOWING" onClick={toggleDrawer(false)}>
              <ListItemText primary="Call (877) GET-JROP" />
            </ListItemButton>
          </List>
        </Drawer>

        {/* Locations Dropdown Menu */}
        <Menu
          id="locations-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{ 'aria-labelledby': 'locations-button' }}
          PaperProps={{
            sx: {
              maxHeight: 360,
              overflowY: 'auto',
            }
          }}
        >
          <MenuItem component={RouterLink} to="/locations" onClick={handleClose}>All Service Areas</MenuItem>
          {LOCATIONS
            .slice() // copy before sort
            .sort((a, b) => a.city.localeCompare(b.city))
            .map(loc => (
              <MenuItem
                key={loc.slug}
                component={RouterLink}
                to={`/locations/${loc.slug}`}
                onClick={handleClose}
              >
                {loc.city}, {loc.state}
              </MenuItem>
            ))}
        </Menu>

        {/* Routed Content */}
        <ScrollToTop />
        <Box component="main" sx={{ flex: 1, width: '100%', maxWidth: '100vw', overflowX: 'hidden', bgcolor: '#f6f8fa', px: 0 }}>
          <Suspense fallback={
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
              <CircularProgress size={48} />
            </Box>
          }>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/cash-for-junk-cars" element={<CashForJunkCarsPage />} />
              <Route path="/locations" element={<LocationsIndexPage />} />
              <Route path="/locations/:slug" element={<LocationPage />} />
              <Route path="/faqs" element={<FaqsPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/what-to-do-when-your-car-breaks-down" element={<WhatToDoWhenCarBreaksDown />} />
              <Route path="/blog/emergency-towing-guide" element={<EmergencyTowingGuide />} />
              <Route path="/blog/roadside-assistance-checklist" element={<RoadsideAssistanceChecklist />} />
              <Route path="/blog/battery-jumpstart-vs-replacement" element={<BatteryJumpstartVsReplacement />} />
              <Route path="/blog/accident-recovery-what-to-expect" element={<AccidentRecoveryWhatToExpect />} />
              <Route path="/blog/towing-safety-tips-2026" element={<TowingSafetyTips2026 />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/request-help" element={<RequestHelpPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </Box>

        {/* Footer */}
        <Box component="footer" sx={{ py: 3, px: 0, backgroundColor: '#f6f8fa', color: 'primary.main', width: '100%' }}>
          <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 4, md: 8, lg: 16, xl: 32 } }}>
            <Typography variant="body1" align="center">
              © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
            </Typography>
          </Container>
        </Box>
        {/* Sticky bottom CTA for mobile to funnel users */}
        <StickyCTA />
      </Box>
    </ThemeProvider>
  );
}
