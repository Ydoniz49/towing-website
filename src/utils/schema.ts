import type { LocationInfo } from '../data/locations';

/**
 * Generate LocalBusiness JSON-LD structured data for a location page.
 * This helps search engines understand your business and can enable rich snippets.
 * @see https://schema.org/LocalBusiness
 */
export function generateLocalBusinessSchema(location: LocationInfo) {
  const baseUrl = 'https://yourmaindomain.com'; // TODO: replace with actual prod domain
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${baseUrl}/locations/${location.slug}#business`,
    name: location.name,
    description: location.description,
    url: `${baseUrl}/locations/${location.slug}`,
    telephone: location.phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: location.city,
      addressRegion: location.state,
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: location.coords.lat,
      longitude: location.coords.lng,
    },
    areaServed: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: location.coords.lat,
        longitude: location.coords.lng,
      },
      geoRadius: `${location.radiusMiles * 1.60934} km`, // Convert miles to km for schema
    },
    hasMap: `${baseUrl}/locations/${location.slug}#map`,
    priceRange: '$$',
    openingHours: 'Mo-Su 00:00-23:59', // 24/7
    image: 'https://yourmaindomain.com/og-image.png', // TODO: Replace with actual image URL
    ...(location.services && location.services.length > 0 && {
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Towing and Roadside Services',
        itemListElement: location.services.map((service, index) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: service,
          },
          position: index + 1,
        })),
      },
    }),
  };

  // Add extended service area details if available
  const neighborhoods = location.neighborhoods || location.seo?.neighborhoods;
  const zipCodes = location.zipCodes || location.seo?.zipCodes;
  if (neighborhoods && neighborhoods.length) {
    schema.areaServedList = neighborhoods.map(n => ({ '@type': 'Place', name: n }));
  }
  if (zipCodes && zipCodes.length) {
    schema.servicePostalCodes = zipCodes;
  }

  // Offer catalog already present; add makesOffer entries for each service
  if (location.services?.length) {
    schema.makesOffer = location.services.map(s => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: s }
    }));
  }

  return schema;
}

/**
 * Inject JSON-LD schema into the document head.
 * Returns a cleanup function to remove the script when component unmounts.
 */
export function injectSchema(schema: object): () => void {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(schema, null, 2);
  script.id = 'schema-jsonld';
  
  // Remove any existing schema script first
  const existing = document.getElementById('schema-jsonld');
  if (existing) existing.remove();
  
  document.head.appendChild(script);

  // Return cleanup function
  return () => {
    const el = document.getElementById('schema-jsonld');
    if (el) el.remove();
  };
}
