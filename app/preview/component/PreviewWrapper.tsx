'use client';

// ******** Imports ********
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Import component to variable
const PreviewComponent = dynamic(() => import('./preview'));

// ******** Component Declaration ********
export default function PreviewWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PreviewComponent />
    </Suspense>
  );
}