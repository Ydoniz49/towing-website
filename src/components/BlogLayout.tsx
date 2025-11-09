import React, { useEffect } from 'react';
import type { ReactNode } from 'react';
import { Box, Container } from '@mui/material';
import { track } from '../utils/analytics';

interface BlogLayoutProps {
  /** Page title for document.title and schema headline */
  title: string;
  /** Meta description for SEO */
  description: string;
  /** Canonical URL path (e.g., '/blog/emergency-towing-guide') */
  canonicalPath: string;
  /** ISO 8601 date published */
  datePublished: string;
  /** Reading time estimate (e.g., '5 min') */
  readTime?: string;
  /** Article image URL (absolute or relative) */
  image?: string;
  /** Child content (article body) */
  children: ReactNode;
}

const SITE_URL = 'https://24-7towing.com'; // Replace with actual production domain
const AUTHOR_NAME = '24/7 Towing Team';
const PUBLISHER_NAME = '24/7 Towing Services';
const PUBLISHER_LOGO = 'https://24-7towing.com/logo.png'; // Replace with actual logo URL

export const BlogLayout: React.FC<BlogLayoutProps> = ({
  title,
  description,
  canonicalPath,
  datePublished,
  image,
  children,
}) => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = `${title} | 24/7 Towing Blog`;

    // Set meta description
    let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // Canonical link
    let linkCanonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', `${SITE_URL}${canonicalPath}`);

    // Article structured data (JSON-LD)
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: title,
      description: description,
      image: image ? `${SITE_URL}${image}` : undefined,
      datePublished: datePublished,
      dateModified: datePublished, // Can be updated separately if needed
      author: {
        '@type': 'Person',
        name: AUTHOR_NAME,
      },
      publisher: {
        '@type': 'Organization',
        name: PUBLISHER_NAME,
        logo: {
          '@type': 'ImageObject',
          url: PUBLISHER_LOGO,
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${SITE_URL}${canonicalPath}`,
      },
    };

    const scriptId = 'article-schema';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(schema);

    // Track blog page view
    track('blog_read', {
      title,
      slug: canonicalPath,
      category: 'blog',
    });

    return () => {
      document.title = prevTitle;
      if (linkCanonical && linkCanonical.parentNode) {
        linkCanonical.parentNode.removeChild(linkCanonical);
      }
      if (scriptTag && scriptTag.parentNode) {
        scriptTag.parentNode.removeChild(scriptTag);
      }
    };
  }, [title, description, canonicalPath, datePublished, image]);

  return (
    <Box sx={{ width: '100%', bgcolor: '#f6f8fa', pt: { xs: 12, md: 16 }, pb: { xs: 10, md: 14 } }}>
      <Container maxWidth="md">{children}</Container>
    </Box>
  );
};
