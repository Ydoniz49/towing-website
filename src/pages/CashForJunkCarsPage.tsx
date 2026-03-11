import React, { useEffect, useState } from 'react';
import { PHONE } from '../config';
import { Box, Button, Chip, Container, Divider, Paper, Stack, Typography, TextField, MenuItem, CircularProgress } from '@mui/material';
import { useForm } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import { executeRecaptcha } from '../utils/recaptcha';
import { track } from '../utils/analytics';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import BoltIcon from '@mui/icons-material/Bolt';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { LOCATIONS } from '../data/locations';
import { vehicleApi } from '../services/vehicleApi';

const SectionCard: React.FC<{ children: React.ReactNode }>
  = ({ children }) => (
  <Paper
    elevation={6}
    sx={{
      p: { xs: 2.5, md: 4 },
      bgcolor: 'background.paper',
      color: 'text.primary',
      borderRadius: 3,
      transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
      '&:hover': {
        transform: 'scale(1.03) translateY(-8px)',
        boxShadow: '0 12px 48px rgba(16,24,40,0.18)',
      },
      '& .MuiTypography-root': {
        color: 'text.primary',
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
    {children}
  </Paper>
);

type QuoteFormData = {
  name: string;
  phone: string;
  city?: string;
  year?: string;
  make?: string;
  model?: string;
  titleStatus?: 'clean' | 'lost' | 'salvage' | 'other';
  condition?: 'runs' | 'no-start' | 'wrecked' | 'mechanical';
  notes?: string;
};

const CashForJunkCarsPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Sell Your Junk Car | Cash Offers + Free Tow';
    const desc = 'Sell your junk car in Chicagoland. Fast cash offers, free towing, and same-day pickup in many cases.';
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', desc);
  }, []);

  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<QuoteFormData>();
  const [makes, setMakes] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [loading, setLoading] = useState({ makes: false, models: false });

  const selectedYear = watch('year');
  const selectedMake = watch('make');

  // years list similar to main lead form
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1939 }, (_, i) => String(currentYear - i));

  useEffect(() => {
    async function fetchMakes() {
      if (selectedYear) {
        setLoading(prev => ({ ...prev, makes: true }));
        const fetched = await vehicleApi.getMakes(selectedYear);
        setMakes(fetched);
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
        const fetched = await vehicleApi.getModels(selectedYear, selectedMake);
        setModels(fetched);
        setLoading(prev => ({ ...prev, models: false }));
      }
    }
    fetchModels();
  }, [selectedYear, selectedMake]);
  const [ab, setAb] = useState<'A' | 'B'>('A');
  // A/B variant persistence only (geolocation removed)
  useEffect(() => {
    const saved = localStorage.getItem('junkHeroAB');
    if (saved === 'A' || saved === 'B') {
      setAb(saved);
    } else {
      const v: 'A' | 'B' = Math.random() < 0.5 ? 'A' : 'B';
      setAb(v);
      localStorage.setItem('junkHeroAB', v);
    }
  }, []);
  const [submitting, setSubmitting] = useState(false);
  const onSubmit = async (data: QuoteFormData) => {
    const normalizedPhone = (data.phone || '').replace(/\D/g,'');
    if (normalizedPhone.length !== 10) {
      alert('Please enter a valid 10-digit phone number.');
      return;
    }
    const honeypot = (document.getElementById('company') as HTMLInputElement | null)?.value || '';
    
    // Execute reCAPTCHA v3
    const recaptchaToken = await executeRecaptcha('submit_junk_car');
    
    const payload = {
      name: data.name,
      phone: normalizedPhone,
      service: 'junk-car',
      vehicleYear: data.year,
      vehicleMake: data.make,
      vehicleModel: data.model,
      locationSlug: data.city,
      notes: data.notes,
      source: window.location.pathname,
      timestamp: new Date().toISOString(),
      company: honeypot,
      recaptchaToken,
    };
    const enableApi = import.meta.env.VITE_ENABLE_API === 'true';
    if (!enableApi) {
      alert('Thanks! We\'ll text/call you with an offer shortly.');
      reset();
      return;
    }
    try {
      setSubmitting(true);
      const res = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) throw new Error(json.error || 'Submission failed');
      
      // Track successful junk car submission
      track('lead_submit', {
        service: 'junk-car',
        location: data.city || 'unknown',
        vehicle: `${data.year} ${data.make} ${data.model}`.trim(),
        variant: ab,
        source: window.location.pathname,
      });
      
      alert('Thanks! We\'ll text/call you with an offer shortly.');
      reset();
    } catch (e: any) {
      alert(`Unable to submit right now. Please call us directly.\n\nDetails: ${e?.message || 'Unknown error'}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.default', pt: { xs: 12, md: 16 }, pb: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        {/* Hero */}
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 800, mb: 1 }}>
            {ab === 'B' ? 'Get An Instant Offer for Your Junk Car' : 'Sell Your Junk Car in Chicagoland'}
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 780, mx: 'auto' }}>
            {ab === 'B' ? 'No haggling. Free tow. On-the-spot payment.' : 'Get an offer range based on condition, completeness, and market demand. Free tow, on-the-spot payment.'}
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" sx={{ mt: 3 }}>
            {ab === 'B' ? (
              <Button variant="contained" color="primary" size="large" startIcon={<LocalOfferIcon />} onClick={() => {
                const el = document.getElementById('junk-quote-form');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }} sx={{ borderRadius: 999, px: 3 }}>
                Get An Instant Offer
              </Button>
            ) : (
              <Button variant="contained" color="primary" size="large" startIcon={<LocalOfferIcon />} href={`tel:${PHONE}`} sx={{ borderRadius: 999, px: 3 }}>
                Get Cash Now
              </Button>
            )}
            <Button variant="outlined" size="large" component={RouterLink} to="/contact" sx={{ borderRadius: 999, px: 3 }}>
              Request a Quote
            </Button>
          </Stack>
        </Box>

  <Divider sx={{ my: { xs: 3, md: 5 }, borderColor: 'rgba(255,255,255,0.12)' }} />

        {/* How it works */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: { xs: 2, md: 3 }
        }}>
          <SectionCard>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <BoltIcon color="primary" />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>How It Works</Typography>
              </Stack>
              <Stack spacing={1.5}>
                <Typography>1. Tell us about your vehicle (year, make, model, condition).</Typography>
                <Typography>2. Get a guaranteed offer and pickup window.</Typography>
                <Typography>3. We arrive, pay you on the spot, and tow it away for free.</Typography>
              </Stack>
            </Stack>
          </SectionCard>

          <SectionCard>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <DirectionsCarIcon color="primary" />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>What We Buy</Typography>
              </Stack>
              <Stack spacing={1}>
                <Typography>• Cars, trucks, vans, and SUVs</Typography>
                <Typography>• No-start, accident damage, mechanical issues</Typography>
                <Typography>• High-mileage or older vehicles</Typography>
                <Typography>• Title in hand preferred — title issues? We can often help</Typography>
              </Stack>
            </Stack>
          </SectionCard>
        </Box>

        <Divider sx={{ my: { xs: 3, md: 5 }, borderColor: 'rgba(255,255,255,0.12)' }} />

        {/* Get a Quote - mini form */}
        <SectionCard>
          <Stack spacing={2}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>Get a Quote</Typography>
            <Typography color="text.secondary">Share a few details and we\'ll send a fast cash offer.</Typography>
            {/* Removed automatic location detection */}
            <Box id="junk-quote-form" component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
              <TextField
                label="Your Name"
                fullWidth
                {...register('name', { required: 'Name is required' })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
              <TextField
                label="Phone"
                fullWidth
                placeholder="(555) 123-4567"
                {...register('phone', { 
                  required: 'Phone is required',
                  validate: v => v && v.replace(/\D/g,'').length === 10 || 'Enter 10 digits'
                })}
                error={!!errors.phone}
                helperText={errors.phone?.message || 'Digits only or any format'}
              />
              <TextField label="City" fullWidth {...register('city')} />

              {/* Year select to drive dynamic make/model lists */}
              <TextField
                select
                fullWidth
                label="Year"
                defaultValue=""
                {...register('year')}
              >
                <MenuItem value="">Select year</MenuItem>
                {years.map(y => (
                  <MenuItem key={y} value={y}>{y}</MenuItem>
                ))}
              </TextField>

              {/* Make select mirrors main form and depends on year */}
              <TextField
                select
                fullWidth
                label="Make"
                defaultValue=""
                disabled={!selectedYear || loading.makes}
                helperText={loading.makes ? 'Loading makes…' : undefined}
                {...register('make')}
              >
                <MenuItem value="">Select make</MenuItem>
                {makes.map(m => (
                  <MenuItem key={m} value={m}>{m}</MenuItem>
                ))}
                <MenuItem value="Other">Other</MenuItem>
                {loading.makes && (
                  <MenuItem disabled>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={20} /> Loading…
                    </Box>
                  </MenuItem>
                )}
              </TextField>

              {/* Model select mirrors main form and depends on make */}
              <TextField
                select
                fullWidth
                label="Model"
                defaultValue=""
                disabled={!selectedMake || loading.models}
                helperText={loading.models ? 'Loading models…' : (models.length === 0 && selectedMake && !loading.models ? 'No models found; select "Other/Unknown"' : undefined)}
                {...register('model')}
              >
                <MenuItem value="">Select model</MenuItem>
                {models.map(md => (
                  <MenuItem key={md} value={md}>{md}</MenuItem>
                ))}
                {!loading.models && models.length === 0 && selectedMake && (
                  <MenuItem value="Other/Unknown">Other/Unknown</MenuItem>
                )}
                {loading.models && (
                  <MenuItem disabled>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={20} /> Loading…
                    </Box>
                  </MenuItem>
                )}
              </TextField>
              <TextField
                select
                label="Title Status"
                fullWidth
                defaultValue=""
                {...register('titleStatus')}
              >
                <MenuItem value="">Select</MenuItem>
                <MenuItem value="clean">Clean</MenuItem>
                <MenuItem value="lost">Lost</MenuItem>
                <MenuItem value="salvage">Salvage</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </TextField>
              <TextField
                select
                label="Condition"
                fullWidth
                defaultValue=""
                {...register('condition')}
              >
                <MenuItem value="">Select</MenuItem>
                <MenuItem value="runs">Runs/Drives</MenuItem>
                <MenuItem value="no-start">No-Start</MenuItem>
                <MenuItem value="wrecked">Wrecked/Body Damage</MenuItem>
                <MenuItem value="mechanical">Mechanical Issues</MenuItem>
              </TextField>
              <TextField
                label="Notes (optional)"
                fullWidth
                multiline
                minRows={3}
                placeholder="Ex: Missing catalytic converter, flat tires, interior stripped"
                sx={{ gridColumn: { xs: '1', sm: '1 / span 2' } }}
                {...register('notes')}
              />
              <input type="text" id="company" name="company" autoComplete="off" tabIndex={-1} style={{ position: 'absolute', left: '-10000px', opacity: 0 }} aria-hidden="true" />
              <Box sx={{ gridColumn: { xs: '1', sm: '1 / span 2' } }}>
                <Button type="submit" variant="contained" color="primary" disabled={submitting} sx={{ borderRadius: 999, px: 3 }}>
                  {submitting ? 'Submitting…' : 'Get My Offer'}
                </Button>
              </Box>
            </Box>
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                We pay more for: complete vehicles, clean titles, popular late-model trucks & SUVs, and catalytic converters intact.
              </Typography>
            </Box>
          </Stack>
        </SectionCard>

        <Divider sx={{ my: { xs: 3, md: 5 }, borderColor: 'rgba(255,255,255,0.12)' }} />

        {/* FAQs for sellers */}
        <SectionCard>
          <Stack spacing={2}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>FAQs</Typography>
            <Stack spacing={1.5}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Do you tow for free?</Typography>
                <Typography color="text.secondary">Yes. Towing is included with every junk car purchase.</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>How fast can you pick up?</Typography>
                <Typography color="text.secondary">Often same-day, depending on your location and schedule.</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Do I need a title?</Typography>
                <Typography color="text.secondary">A title is preferred. If it\'s lost, we can often advise next steps.</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>How do I get paid?</Typography>
                <Typography color="text.secondary">We pay on the spot at pickup.</Typography>
              </Box>
            </Stack>
          </Stack>
        </SectionCard>

        <Divider sx={{ my: { xs: 3, md: 5 }, borderColor: 'rgba(255,255,255,0.12)' }} />

        {/* Service areas */}
        <SectionCard>
          <Stack spacing={2}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <DoneAllIcon color="primary" />
              <Typography variant="h5" sx={{ fontWeight: 700 }}>Service Areas</Typography>
            </Stack>
            <Typography color="text.secondary">
              We buy junk cars across our Chicagoland service area. Find your city below:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {LOCATIONS
                .slice()
                .sort((a, b) => a.city.localeCompare(b.city))
                .map(loc => (
                  <Chip
                    key={loc.slug}
                    label={`${loc.city}, ${loc.state}`}
                    component={RouterLink}
                    to={`/locations/${loc.slug}`}
                    clickable
                    sx={{
                      borderRadius: 999,
                      bgcolor: 'rgba(255,255,255,0.08)',
                      color: 'text.primary',
                      border: '1px solid rgba(255,255,255,0.16)',
                    }}
                  />
                ))}
            </Box>
          </Stack>
        </SectionCard>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" sx={{ mt: 4 }}>
          <Button variant="contained" color="primary" size="large" startIcon={<LocalOfferIcon />} href={`tel:${PHONE}`} sx={{ borderRadius: 999, px: 3 }}>
            Call For An Offer
          </Button>
          <Button variant="outlined" size="large" component={RouterLink} to="/contact" sx={{ borderRadius: 999, px: 3 }}>
            Message Us
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};

export default CashForJunkCarsPage;
