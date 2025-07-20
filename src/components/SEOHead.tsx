import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  twitterImage?: string;
  noIndex?: boolean;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = "Professional Web Developer | Custom Website Design & Full-Stack Development",
  description = "Expert web developer specializing in custom website design, full-stack development, and AI-powered solutions. Transform your business with responsive, high-performance websites that drive results.",
  keywords = "web developer, custom website design, full-stack development, responsive web design, SEO optimization, website redesign, web applications, AI integration",
  canonicalUrl = "https://your-domain.com/",
  ogImage = "https://your-domain.com/og-image.jpg",
  twitterImage = "https://your-domain.com/twitter-image.jpg",
  noIndex = false
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonicalUrl} />
      
      {/* Twitter */}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={twitterImage} />
    </Helmet>
  );
};

export default SEOHead;