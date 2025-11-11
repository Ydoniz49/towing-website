export type LocationInfo = {
  slug: string;
  name: string;
  city: string;
  state: string;
  phone: string; // tel: compatible
  coords: { lat: number; lng: number };
  radiusMiles: number;
  description?: string;
  services?: string[];
  seo?: {
    eta?: string;
    highways?: string[];
    neighborhoods?: string[];
    zipCodes?: string[];
  };
  neighborhoods?: string[]; // extended service area list override
  zipCodes?: string[]; // list of zip codes explicitly served
  ctaPhone?: string; // optional location-specific dispatch phone for CTA
};

export const LOCATIONS: LocationInfo[] = [
  {
    slug: 'plainfield-il',
    name: '24/7 Towing — Plainfield, IL',
    city: 'Plainfield',
    state: 'IL',
    phone: '1-800-TOWING',
    coords: { lat: 41.6322, lng: -88.2120 },
    radiusMiles: 25,
    description: 'Fast, reliable towing and roadside assistance throughout Plainfield and surrounding communities.',
    services: ['Emergency Towing', 'Roadside Assistance', 'Battery Service', 'Accident Recovery']
    ,seo: {
      eta: 'Typical ETA in Plainfield: 30–45 minutes (traffic and weather may vary).',
      highways: ['I-55', 'US-30', 'IL-59'],
      neighborhoods: ['Downtown Plainfield', 'Grande Park', 'Heritage Meadows']
    }
  },
  {
    slug: 'lemont-il',
    name: '24/7 Towing — Lemont, IL',
    city: 'Lemont',
    state: 'IL',
    phone: '1-800-TOWING',
    coords: { lat: 41.6736, lng: -88.0017 },
    radiusMiles: 25,
    description: 'Reliable towing and roadside assistance throughout Lemont and nearby areas.',
    services: ['Emergency Towing', 'Roadside Assistance', 'Battery Service', 'Accident Recovery'],
    seo: {
      eta: 'Typical ETA in Lemont: 25–40 minutes via I‑355 and Archer Ave.',
      highways: ['I-355', 'IL-171 (Archer Ave)', 'IL-83'],
      neighborhoods: ['Downtown Lemont', 'Keepataw', 'Heritage Quarries']
    }
  },
  {
    slug: 'lockport-il',
    name: '24/7 Towing — Lockport, IL',
    city: 'Lockport',
    state: 'IL',
    phone: '1-800-TOWING',
    coords: { lat: 41.5890, lng: -88.0578 },
    radiusMiles: 25,
    description: 'Fast, professional towing and roadside help across Lockport.',
    services: ['Emergency Towing', 'Roadside Assistance', 'Battery Service', 'Accident Recovery'],
    seo: {
      eta: 'Typical ETA in Lockport: 25–40 minutes with quick access to I‑355 and IL‑7.',
      highways: ['I-355', 'IL-7', '159th St'],
      neighborhoods: ['Downtown Lockport', 'Kelvin Grove', 'Victoria Crossings']
    }
  },
  {
    slug: 'new-lenox-il',
    name: '24/7 Towing — New Lenox, IL',
    city: 'New Lenox',
    state: 'IL',
    phone: '1-800-TOWING',
    coords: { lat: 41.5111, lng: -87.9656 },
    radiusMiles: 25,
    description: 'Trusted towing and on‑the‑spot roadside service in New Lenox.',
    services: ['Emergency Towing', 'Roadside Assistance', 'Battery Service', 'Accident Recovery'],
    seo: {
      eta: 'Typical ETA in New Lenox: 25–45 minutes via I‑80 and US‑30.',
      highways: ['I-80', 'US-30 (Lincoln Hwy)', 'Cedar Rd'],
      neighborhoods: ['Downtown New Lenox', 'Prairie Ridge', 'Bristol Park']
    }
  },
  {
    slug: 'frankfort-il',
    name: '24/7 Towing — Frankfort, IL',
    city: 'Frankfort',
    state: 'IL',
    phone: '1-800-TOWING',
    coords: { lat: 41.4959, lng: -87.8487 },
    radiusMiles: 25,
    description: 'Dependable towing and roadside assistance throughout Frankfort.',
    services: ['Emergency Towing', 'Roadside Assistance', 'Battery Service', 'Accident Recovery'],
    seo: {
      eta: 'Typical ETA in Frankfort: 30–45 minutes along US‑30 and I‑80 corridors.',
      highways: ['US-30 (Lincoln Hwy)', 'I-80', 'US-45 (La Grange Rd)'],
      neighborhoods: ['Historic Downtown', 'Lakeview Estates', 'Butternut Creek']
    }
  },
  {
    slug: 'manhattan-il',
    name: '24/7 Towing — Manhattan, IL',
    city: 'Manhattan',
    state: 'IL',
    phone: '1-800-TOWING',
    coords: { lat: 41.4223, lng: -87.9859 },
    radiusMiles: 25,
    description: 'Local, reliable towing and roadside help serving Manhattan and surrounding townships.',
    services: ['Emergency Towing', 'Roadside Assistance', 'Battery Service', 'Accident Recovery'],
    seo: {
      eta: 'Typical ETA in Manhattan: 30–45 minutes with access to US‑52 and I‑80.',
      highways: ['US-52', 'Cedar Rd', 'Manhattan-Monee Rd'],
      neighborhoods: ['Downtown Manhattan', 'Brookstone Springs', 'Leighlinbridge']
    }
  },
  {
    slug: 'naperville-il',
    name: '24/7 Towing — Naperville, IL',
    city: 'Naperville',
    state: 'IL',
    phone: '1-800-TOWING',
    coords: { lat: 41.7508, lng: -88.1535 },
    radiusMiles: 25,
    description: 'Trusted towing and roadside service across Naperville and nearby suburbs.',
    services: ['Emergency Towing', 'Roadside Assistance', 'Battery Service', 'Accident Recovery'],
    seo: {
      eta: 'Typical ETA in Naperville: 30–45 minutes depending on I‑88 conditions.',
      highways: ['I-88', 'IL-59', 'Naper Blvd'],
      neighborhoods: ['Downtown Naperville', 'South Naperville', 'Tall Grass']
    }
  },
  {
    slug: 'bolingbrook-il',
    name: '24/7 Towing — Bolingbrook, IL',
    city: 'Bolingbrook',
    state: 'IL',
    phone: '1-800-TOWING',
    coords: { lat: 41.6986, lng: -88.0684 },
    radiusMiles: 25,
    description: 'Local operators serving Bolingbrook with quick ETAs and transparent pricing.',
    services: ['Emergency Towing', 'Roadside Assistance', 'Battery Service', 'Accident Recovery'],
    seo: {
      eta: 'Typical ETA in Bolingbrook: 25–40 minutes with quick access to I‑55.',
      highways: ['I-55', 'Boughton Rd', 'Weber Rd'],
      neighborhoods: ['Bolingbrook Promenade area', 'Indian Oaks', 'Augusta Village']
    }
  },
  {
    slug: 'aurora-il',
    name: '24/7 Towing — Aurora, IL',
    city: 'Aurora',
    state: 'IL',
    phone: '1-800-TOWING',
    ctaPhone: '1-800-TOWING',
    coords: { lat: 41.7606, lng: -88.3201 },
    radiusMiles: 25,
    description: 'Reliable towing & roadside assistance across Aurora from trained, insured operators.',
    services: ['Emergency Towing', 'Roadside Assistance', 'Battery Service', 'Accident Recovery'],
    seo: {
      eta: 'Typical ETA in Aurora: 30–45 minutes including river crossings and I‑88 access.',
      highways: ['I-88', 'Eola Rd', 'US-34 (Ogden Ave)'],
      neighborhoods: ['Downtown Aurora', 'Fox Valley', 'Near West Side'],
      zipCodes: ['60502','60503','60504','60505','60506']
    }
  },
  {
    slug: 'joliet-il',
    name: '24/7 Towing — Joliet, IL',
    city: 'Joliet',
    state: 'IL',
    phone: '1-800-TOWING',
    coords: { lat: 41.5250, lng: -88.0817 },
    radiusMiles: 25,
    description: 'Prompt response times and transparent pricing serving Joliet motorists.',
    services: ['Emergency Towing', 'Roadside Assistance', 'Battery Service', 'Accident Recovery'],
    seo: {
      eta: 'Typical ETA in Joliet: 30–45 minutes with I‑55 and I‑80 coverage.',
      highways: ['I-80', 'I-55', 'US-6'],
      neighborhoods: ['Cathedral Area', 'Marycrest', 'Rockdale']
    }
  },
  {
    slug: 'oswego-il',
    name: '24/7 Towing — Oswego, IL',
    city: 'Oswego',
    state: 'IL',
    phone: '1-800-TOWING',
    coords: { lat: 41.6828, lng: -88.3515 },
    radiusMiles: 25,
    description: 'Dependable towing and on‑the‑spot roadside service throughout Oswego.',
    services: ['Emergency Towing', 'Roadside Assistance', 'Battery Service', 'Accident Recovery'],
    seo: {
      eta: 'Typical ETA in Oswego: 30–45 minutes along US‑34 and IL‑71 corridors.',
      highways: ['US-34 (Ogden Ave)', 'IL-71', 'Orchard Rd'],
      neighborhoods: ['Downtown Oswego', 'Fox Chase', 'Deerpath Creek']
    }
  },
  {
    slug: 'romeoville-il',
    name: '24/7 Towing — Romeoville, IL',
    city: 'Romeoville',
    state: 'IL',
    phone: '1-800-TOWING',
    ctaPhone: '1-800-TOWING',
    coords: { lat: 41.6475, lng: -88.0895 },
    radiusMiles: 25,
    description: 'Roadside assistance and towing for Romeoville drivers—fast dispatch, professional handling.',
    services: ['Emergency Towing', 'Roadside Assistance', 'Battery Service', 'Accident Recovery'],
    seo: {
      eta: 'Typical ETA in Romeoville: 25–40 minutes via I‑55 and IL‑53.',
      highways: ['I-55', 'IL-53', 'Weber Rd'],
      neighborhoods: ['Hampton Park', 'Wesglen', 'Lakewood Falls'],
      zipCodes: ['60446','60441']
    }
  },
  {
    slug: 'morris-il',
    name: '24/7 Towing — Morris, IL',
    city: 'Morris',
    state: 'IL',
    phone: '1-800-TOWING',
    coords: { lat: 41.3572, lng: -88.4201 },
    radiusMiles: 25,
    description: 'Trusted towing and roadside service for Morris drivers—available 24/7.',
    services: ['Emergency Towing', 'Roadside Assistance', 'Battery Service', 'Accident Recovery'],
    seo: {
      eta: 'Typical ETA in Morris: 35–50 minutes along I‑80 corridor.',
      highways: ['I-80', 'US-6', 'IL-47'],
      neighborhoods: ['Downtown Morris', 'Nettle Creek', 'Saratoga']
    }
  },
  {
    slug: 'yorkville-il',
    name: '24/7 Towing — Yorkville, IL',
    city: 'Yorkville',
    state: 'IL',
    phone: '1-800-TOWING',
    coords: { lat: 41.6411, lng: -88.4473 },
    radiusMiles: 25,
    description: 'Professional towing and roadside assistance throughout Yorkville and nearby communities.',
    services: ['Emergency Towing', 'Roadside Assistance', 'Battery Service', 'Accident Recovery'],
    seo: {
      eta: 'Typical ETA in Yorkville: 30–45 minutes via US‑34 and IL‑47.',
      highways: ['US-34 (Ogden Ave)', 'IL-47', 'IL-71'],
      neighborhoods: ['Downtown Yorkville', 'Grande Reserve', 'Bristol Bay']
    }
  },
  {
    slug: 'homer-glen-il',
    name: '24/7 Towing — Homer Glen, IL',
    city: 'Homer Glen',
    state: 'IL',
    phone: '1-800-TOWING',
    coords: { lat: 41.6000, lng: -87.9375 },
    radiusMiles: 25,
    description: 'Local towing and roadside service for Homer Glen—fast response and transparent pricing.',
    services: ['Emergency Towing', 'Roadside Assistance', 'Battery Service', 'Accident Recovery'],
    seo: {
      eta: 'Typical ETA in Homer Glen: 30–45 minutes along I‑355 and 159th St.',
      highways: ['I-355', '159th St', 'Bell Rd'],
      neighborhoods: ['Heritage Woods', 'Homer Woods', 'Churchill Lakes']
    }
  },
  {
    slug: 'darien-il',
    name: '24/7 Towing — Darien, IL',
    city: 'Darien',
    state: 'IL',
    phone: '1-800-TOWING',
    coords: { lat: 41.7514, lng: -87.9739 },
    radiusMiles: 25,
    description: 'Reliable towing and roadside help serving Darien and the surrounding western suburbs.',
    services: ['Emergency Towing', 'Roadside Assistance', 'Battery Service', 'Accident Recovery'],
    seo: {
      eta: 'Typical ETA in Darien: 25–40 minutes via I‑55 and Cass Ave.',
      highways: ['I-55', 'Cass Ave', '75th St'],
      neighborhoods: ['Downtown Darien', 'Hinsdale Oaks', 'Indian Head Park']
    }
  },
  {
    slug: 'wilmington-il',
    name: '24/7 Towing — Wilmington, IL',
    city: 'Wilmington',
    state: 'IL',
    phone: '1-800-TOWING',
    coords: { lat: 41.3086, lng: -88.1467 },
    radiusMiles: 25,
    description: 'Dependable towing and roadside assistance for Wilmington and the surrounding townships.',
    services: ['Emergency Towing', 'Roadside Assistance', 'Battery Service', 'Accident Recovery'],
    seo: {
      eta: 'Typical ETA in Wilmington: 35–50 minutes along I‑55.',
      highways: ['I-55', 'US-52', 'IL-113'],
      neighborhoods: ['Downtown Wilmington', 'Island City', 'South Wilmington']
    }
  }
];

export const LOCATION_BY_SLUG: Record<string, LocationInfo> = Object.fromEntries(
  LOCATIONS.map(l => [l.slug, l])
);
