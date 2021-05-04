import React from 'react';
import Error from '@/components/Error';

export default function Page({ statusCode }) {
  return <Error error={statusCode} />;
}
