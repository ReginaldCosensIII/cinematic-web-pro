import React from 'react';
import { useParams } from 'react-router-dom';
import AISolutionsPage from './AISolutions';
import { localities } from '@/data/aiSolutions';
import NotFound from './NotFound';

const AISolutionsLocality: React.FC = () => {
  const { locality: slug } = useParams<{ locality: string }>();
  const locality = localities.find((l) => l.slug === slug);
  if (!locality) return <NotFound />;
  return <AISolutionsPage locality={locality} />;
};

export default AISolutionsLocality;
