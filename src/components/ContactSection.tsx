import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';

export const ContactSection = () => {
  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'transparent' }}>
      <Container maxWidth="lg">
        <Typography
          component="h2"
          variant="h3"
          align="center"
          color="text.primary"
          gutterBottom
          sx={{ mb: 3 }}
        >
          Contact Us
        </Typography>
        <Typography 
          variant="h6" 
          align="center" 
          color="text.secondary" 
          paragraph
          sx={{ mb: 6 }}
        >
          We're available 24/7 to help you
        </Typography>
        
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: { xs: 4, md: 6 },
          mt: 4,
          px: { xs: 2, md: 4 }
        }}>
          <Box>
            <Paper 
              elevation={6}
              sx={{ 
                p: 3, 
                height: '100%', 
                textAlign: 'center', 
                borderRadius: 3,
                transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                '&:hover': {
                  transform: 'scale(1.03) translateY(-8px)',
                  boxShadow: '0 12px 48px rgba(16,24,40,0.18)',
                }
              }}
            >
              <Box sx={{ 
                width: 72, 
                height: 72, 
                display: 'grid', 
                placeItems: 'center', 
                borderRadius: '16px', 
                bgcolor: 'rgba(255, 56, 92, 0.1)', 
                color: 'primary.main',
                mx: 'auto',
                mb: 2
              }}>
                <PhoneIcon sx={{ fontSize: 40 }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }} gutterBottom>
                Phone
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Available 24/7 for emergencies
              </Typography>
              <Button
                variant="outlined"
                size="small"
                fullWidth
                href="tel:1-800-TOWING"
                sx={{ mt: 2, borderRadius: 999 }}
              >
                1-800-TOWING
              </Button>
            </Paper>
          </Box>
          
          <Box>
            <Paper 
              elevation={6}
              sx={{ 
                p: 3, 
                height: '100%', 
                textAlign: 'center', 
                borderRadius: 3,
                transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                '&:hover': {
                  transform: 'scale(1.03) translateY(-8px)',
                  boxShadow: '0 12px 48px rgba(16,24,40,0.18)',
                }
              }}
            >
              <Box sx={{ 
                width: 72, 
                height: 72, 
                display: 'grid', 
                placeItems: 'center', 
                borderRadius: '16px', 
                bgcolor: 'rgba(255, 56, 92, 0.1)', 
                color: 'primary.main',
                mx: 'auto',
                mb: 2
              }}>
                <EmailIcon sx={{ fontSize: 40 }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }} gutterBottom>
                Email
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Send us a message anytime
              </Typography>
              <Button
                variant="outlined"
                size="small"
                fullWidth
                href="mailto:help@towingservice.com"
                sx={{ mt: 2, borderRadius: 999 }}
              >
                Email Us
              </Button>
            </Paper>
          </Box>
          
          <Box>
            <Paper 
              elevation={6}
              sx={{ 
                p: 3, 
                height: '100%', 
                textAlign: 'center', 
                borderRadius: 3,
                transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                '&:hover': {
                  transform: 'scale(1.03) translateY(-8px)',
                  boxShadow: '0 12px 48px rgba(16,24,40,0.18)',
                }
              }}
            >
              <Box sx={{ 
                width: 72, 
                height: 72, 
                display: 'grid', 
                placeItems: 'center', 
                borderRadius: '16px', 
                bgcolor: 'rgba(255, 56, 92, 0.1)', 
                color: 'primary.main',
                mx: 'auto',
                mb: 2
              }}>
                <LocationOnIcon sx={{ fontSize: 40 }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }} gutterBottom>
                Location
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Serving the greater metropolitan area
              </Typography>
              <Button
                variant="outlined"
                size="small"
                fullWidth
                href="https://maps.google.com"
                target="_blank"
                sx={{ mt: 2, borderRadius: 999 }}
              >
                View Service Area
              </Button>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};