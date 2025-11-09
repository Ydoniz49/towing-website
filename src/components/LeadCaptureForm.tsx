import { Box, Button, Container, TextField, Typography, MenuItem, Paper, CircularProgress } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { vehicleApi } from '../services/vehicleApi';
import StarIcon from '@mui/icons-material/Star';
import VerifiedIcon from '@mui/icons-material/Verified';
import SecurityIcon from '@mui/icons-material/Security';

type FormData = {
  firstName: string;
  lastName: string;
  phone: string;
  location: string;
  serviceNeeded: string;
  vehicleYear: string;
  vehicleMake: string;
  vehicleModel: string;
};

export const LeadCaptureForm = () => {
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<FormData>();
  const [makes, setMakes] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [loading, setLoading] = useState({
    makes: false,
    models: false
  });
  const [submitting, setSubmitting] = useState(false);

  const selectedYear = watch('vehicleYear');
  const selectedMake = watch('vehicleMake');

  // Generate years from current year to 1940
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1939 }, (_, i) => String(currentYear - i));

  useEffect(() => {
    async function fetchMakes() {
      if (selectedYear) {
        setLoading(prev => ({ ...prev, makes: true }));
        const fetchedMakes = await vehicleApi.getMakes(selectedYear);
  setMakes(fetchedMakes);
  setModels([]);
        setLoading(prev => ({ ...prev, makes: false }));
      }
    }
    fetchMakes();
  }, [selectedYear]);

  useEffect(() => {
    async function fetchModels() {
      if (selectedYear && selectedMake) {
        setLoading(prev => ({ ...prev, models: true }));
        const fetchedModels = await vehicleApi.getModels(selectedYear, selectedMake);
        setModels(fetchedModels);
        setLoading(prev => ({ ...prev, models: false }));
      }
    }
    fetchModels();
  }, [selectedYear, selectedMake]);

  const onSubmit = async (data: FormData) => {
    // Honeypot support (hidden field added below). If filled, pretend success.
    const honeypot = (document.getElementById('company') as HTMLInputElement | null)?.value || '';
    const payload = {
      name: `${data.firstName} ${data.lastName}`.trim(),
      phone: (data.phone || '').replace(/\D/g, ''),
      locationSlug: data.location,
      service: data.serviceNeeded,
      vehicleYear: data.vehicleYear,
      vehicleMake: data.vehicleMake,
      vehicleModel: data.vehicleModel,
      source: window.location.pathname,
      timestamp: new Date().toISOString(),
      company: honeypot,
    };
    const enableApi = import.meta.env.VITE_ENABLE_API === 'true';
    if (!enableApi) {
      // Fallback: local success without network
      alert('Thank you! We will contact you shortly.');
      reset();
      return;
    }
    try {
      setSubmitting(true);
      const res = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) throw new Error(json.error || 'Submission failed');
      alert('Thanks! Our dispatcher will text/call you shortly.');
      reset();
    } catch (e: any) {
      alert(`Sorry, something went wrong submitting your request. Please call us directly.\n\nDetails: ${e?.message || 'Unknown error'}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box id="lead-form" sx={{ py: { xs: 6, md: 10 }, bgcolor: 'transparent' }}>
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            background: 'linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0.98))',
            backdropFilter: 'saturate(120%) blur(2px)',
            border: '1px solid rgba(2,6,23,0.06)',
            boxShadow: '0 8px 24px rgba(2,6,23,0.08)'
          }}
        >
          <Typography
            component="h2"
            variant="h4"
            align="center"
            color="text.primary"
            gutterBottom
            sx={{ mb: 3 }}
          >
            Request Assistance
          </Typography>
          <Typography 
            variant="subtitle1" 
            align="center" 
            color="text.secondary" 
            paragraph
            sx={{ mb: 3 }}
          >
            Fill out this form and we'll contact you right away
          </Typography>

          {/* Trust badges row */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: { xs: 2, md: 4 },
            flexWrap: 'wrap',
            mb: 2,
            color: 'text.secondary'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <StarIcon sx={{ color: '#f59e0b' }} />
              <Typography variant="body2">4.8/5 rating</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <VerifiedIcon color="primary" sx={{ opacity: 0.9 }} />
              <Typography variant="body2">Licensed & Insured</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <SecurityIcon color="success" sx={{ opacity: 0.9 }} />
              <Typography variant="body2">Background-checked drivers</Typography>
            </Box>
          </Box>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <TextField
              fullWidth
              label="First Name"
              margin="normal"
              {...register('firstName', { required: 'First name is required' })}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            />
            <TextField
              fullWidth
              label="Last Name"
              margin="normal"
              {...register('lastName', { required: 'Last name is required' })}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />
          </Box>

          <TextField
            fullWidth
            label="Phone Number"
            margin="normal"
            {...register('phone', { 
              required: 'Phone number is required',
              pattern: {
                value: /^\d{10}$/, 
                message: 'Please enter a valid 10-digit phone number'
              }
            })}
            error={!!errors.phone}
            helperText={errors.phone?.message}
          />
          <TextField
            fullWidth
            label="Location"
            margin="normal"
            {...register('location', { required: 'Location is required' })}
            error={!!errors.location}
            helperText={errors.location?.message}
          />
          <TextField
            select
            fullWidth
            label="Service Needed"
            margin="normal"
            {...register('serviceNeeded', { required: 'Please select a service' })}
            error={!!errors.serviceNeeded}
            helperText={errors.serviceNeeded?.message}
            defaultValue=""
          >
            <MenuItem value="">Select a service</MenuItem>
            <MenuItem value="emergency">Emergency Towing</MenuItem>
            <MenuItem value="roadside">Roadside Assistance</MenuItem>
            <MenuItem value="battery">Battery Service</MenuItem>
            <MenuItem value="accident">Accident Recovery</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </TextField>

          <TextField
            select
            fullWidth
            label="Vehicle Year"
            margin="normal"
            {...register('vehicleYear', { required: 'Vehicle year is required' })}
            error={!!errors.vehicleYear}
            helperText={errors.vehicleYear?.message}
            defaultValue=""
          >
            <MenuItem value="">Select year</MenuItem>
            {years.map((year) => (
              <MenuItem key={year} value={year}>{year}</MenuItem>
            ))}
          </TextField>

          <TextField
            select
            fullWidth
            label="Vehicle Make"
            margin="normal"
            {...register('vehicleMake', { required: 'Vehicle make is required' })}
            error={!!errors.vehicleMake}
            helperText={errors.vehicleMake?.message || (loading.makes ? 'Loading makes...' : '')}
            defaultValue=""
            disabled={!selectedYear || loading.makes}
          >
            <MenuItem value="">Select make</MenuItem>
            {makes.map((make) => (
              <MenuItem key={make} value={make}>{make}</MenuItem>
            ))}
            {loading.makes && (
              <MenuItem disabled>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} /> Loading...
                </Box>
              </MenuItem>
            )}
          </TextField>

          <TextField
            select
            fullWidth
            label="Vehicle Model"
            margin="normal"
            {...register('vehicleModel', { required: 'Vehicle model is required' })}
            error={!!errors.vehicleModel}
            helperText={errors.vehicleModel?.message || (loading.models ? 'Loading models...' : '')}
            defaultValue=""
            disabled={!selectedMake || loading.models}
          >
            <MenuItem value="">Select model</MenuItem>
            {models.map((model) => (
              <MenuItem key={model} value={model}>{model}</MenuItem>
            ))}
            {loading.models && (
              <MenuItem disabled>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} /> Loading...
                </Box>
              </MenuItem>
            )}
          </TextField>
          <input type="text" id="company" name="company" autoComplete="off" tabIndex={-1} style={{ position: 'absolute', left: '-10000px', opacity: 0 }} aria-hidden="true" />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={submitting}
            sx={{ mt: 3, mb: 2 }}
          >
            {submitting ? 'Submitting…' : 'Submit Request'}
          </Button>
        </Box>
        </Paper>
      </Container>
    </Box>
  );
};