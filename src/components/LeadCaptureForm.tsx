import { Box, Button, Container, TextField, Typography, MenuItem, Paper, CircularProgress } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { vehicleApi } from '../services/vehicleApi';
import { executeRecaptcha } from '../utils/recaptcha';
import { track } from '../utils/analytics';
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
        // If "Other" is selected for make, skip API and set model to "Other"
        if (selectedMake === 'Other') {
          setModels(['Other']);
          return;
        }
        
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
    
    // Execute reCAPTCHA v3
    const recaptchaToken = await executeRecaptcha('submit_lead');
    
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
      recaptchaToken,
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
      
      // Track successful lead submission
      track('lead_submit', {
        service: data.serviceNeeded,
        location: data.location,
        vehicle: `${data.vehicleYear} ${data.vehicleMake} ${data.vehicleModel}`.trim(),
        source: window.location.pathname,
      });
      
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
          elevation={6}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 3,
            bgcolor: 'background.paper',
            color: 'text.primary',
            transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
            '&:hover': {
              transform: 'scale(1.03) translateY(-8px)',
              boxShadow: '0 12px 48px rgba(16,24,40,0.18)',
            },
            '& .MuiInputBase-root': {
              bgcolor: 'rgba(255,255,255,0.06)',
              color: 'text.primary',
            },
            '& .MuiInputLabel-root': {
              color: 'text.secondary',
            },
            '& .MuiFormHelperText-root': {
              color: 'text.secondary',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255,255,255,0.2)',
            },
            '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255,56,92,0.45)',
            },
            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#ff385c',
            },
            '& .MuiSelect-icon': {
              color: 'rgba(255,255,255,0.2)',
            },
            '& .MuiInputBase-input': {
              color: 'text.primary',
            },
          }}
        >
          <Typography
            component="h2"
            variant="h4"
            align="center"
            sx={{ color: 'text.primary', mb: 3 }}
            gutterBottom
          >
            Request Assistance
          </Typography>
          <Typography 
            variant="subtitle1" 
            align="center" 
            sx={{ color: 'text.secondary', mb: 3 }}
            paragraph
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
            <MenuItem value="Other">Other</MenuItem>
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
            helperText={errors.vehicleModel?.message || (loading.models ? 'Loading models...' : (models.length === 0 && selectedMake && !loading.models ? 'No models found; select "Other/Unknown"' : ''))}
            defaultValue=""
            disabled={!selectedMake || loading.models}
          >
            <MenuItem value="">Select model</MenuItem>
            {models.map((model) => (
              <MenuItem key={model} value={model}>{model}</MenuItem>
            ))}
            {!loading.models && models.length === 0 && selectedMake && (
              <MenuItem value="Other/Unknown">Other/Unknown</MenuItem>
            )}
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