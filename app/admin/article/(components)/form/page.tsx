// ******** Imports ********
import { Suspense } from 'react';
import ArticleFormClient from '../../../admin-form/article-form/form';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading form...</div>}>
      <ArticleFormClient />
    </Suspense>
  );
}