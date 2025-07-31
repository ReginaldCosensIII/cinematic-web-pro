import React from 'react';
import { Helmet } from 'react-helmet-async';

interface OrganizationData {
  name: string;
  description: string;
  url: string;
  logo: string;
  contactPoint: {
    telephone: string;
    email: string;
    contactType: string;
  };
  sameAs: string[];
}

interface ArticleData {
  headline: string;
  datePublished: string;
  dateModified?: string;
  author: string;
  description: string;
  image?: string;
  url: string;
  wordCount?: number;
  tags?: string[];
}

interface ServiceData {
  name: string;
  description: string;
  provider: {
    name: string;
    url: string;
  };
  areaServed: string;
  serviceType: string;
}

interface ReviewData {
  reviewRating: {
    ratingValue: number;
    bestRating: number;
  };
  reviewBody: string;
  author: {
    name: string;
  };
  datePublished: string;
}

interface LocalBusinessData {
  name: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  telephone: string;
  email: string;
  url: string;
  openingHours: string[];
  priceRange: string;
}

interface BreadcrumbData {
  items: Array<{
    name: string;
    url: string;
  }>;
}

interface FAQData {
  questions: Array<{
    question: string;
    answer: string;
  }>;
}

interface StructuredDataProps {
  type: 'organization' | 'article' | 'service' | 'review' | 'localBusiness' | 'breadcrumb' | 'faq';
  data: OrganizationData | ArticleData | ServiceData | ReviewData | LocalBusinessData | BreadcrumbData | FAQData;
}

const StructuredData: React.FC<StructuredDataProps> = ({ type, data }) => {
  const generateStructuredData = () => {
    const baseContext = 'https://schema.org';
    
    switch (type) {
      case 'organization':
        const orgData = data as OrganizationData;
        return {
          '@context': baseContext,
          '@type': 'Organization',
          name: orgData.name,
          description: orgData.description,
          url: orgData.url,
          logo: orgData.logo,
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: orgData.contactPoint.telephone,
            email: orgData.contactPoint.email,
            contactType: orgData.contactPoint.contactType
          },
          sameAs: orgData.sameAs
        };
        
      case 'article':
        const articleData = data as ArticleData;
        return {
          '@context': baseContext,
          '@type': 'Article',
          headline: articleData.headline,
          datePublished: articleData.datePublished,
          dateModified: articleData.dateModified || articleData.datePublished,
          author: {
            '@type': 'Person',
            name: articleData.author
          },
          description: articleData.description,
          image: articleData.image,
          url: articleData.url,
          wordCount: articleData.wordCount,
          keywords: articleData.tags?.join(', '),
          publisher: {
            '@type': 'Organization',
            name: 'Professional Web Developer',
            logo: 'https://your-domain.com/logo.png'
          }
        };
        
      case 'service':
        const serviceData = data as ServiceData;
        return {
          '@context': baseContext,
          '@type': 'Service',
          name: serviceData.name,
          description: serviceData.description,
          provider: {
            '@type': 'Organization',
            name: serviceData.provider.name,
            url: serviceData.provider.url
          },
          areaServed: serviceData.areaServed,
          serviceType: serviceData.serviceType
        };
        
      case 'review':
        const reviewData = data as ReviewData;
        return {
          '@context': baseContext,
          '@type': 'Review',
          reviewRating: {
            '@type': 'Rating',
            ratingValue: reviewData.reviewRating.ratingValue,
            bestRating: reviewData.reviewRating.bestRating
          },
          reviewBody: reviewData.reviewBody,
          author: {
            '@type': 'Person',
            name: reviewData.author.name
          },
          datePublished: reviewData.datePublished
        };
        
      case 'localBusiness':
        const businessData = data as LocalBusinessData;
        return {
          '@context': baseContext,
          '@type': 'LocalBusiness',
          name: businessData.name,
          address: {
            '@type': 'PostalAddress',
            streetAddress: businessData.address.streetAddress,
            addressLocality: businessData.address.addressLocality,
            addressRegion: businessData.address.addressRegion,
            postalCode: businessData.address.postalCode,
            addressCountry: businessData.address.addressCountry
          },
          telephone: businessData.telephone,
          email: businessData.email,
          url: businessData.url,
          openingHours: businessData.openingHours,
          priceRange: businessData.priceRange
        };
        
      case 'breadcrumb':
        const breadcrumbData = data as BreadcrumbData;
        return {
          '@context': baseContext,
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumbData.items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url
          }))
        };
        
      case 'faq':
        const faqData = data as FAQData;
        return {
          '@context': baseContext,
          '@type': 'FAQPage',
          mainEntity: faqData.questions.map(q => ({
            '@type': 'Question',
            name: q.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: q.answer
            }
          }))
        };
        
      default:
        return null;
    }
  };

  const structuredData = generateStructuredData();
  
  if (!structuredData) return null;

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default StructuredData;