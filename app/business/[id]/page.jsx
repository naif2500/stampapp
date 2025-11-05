import { Suspense } from 'react';
import BusinessDetailPage from './LoginClient';
import Spinner from '@/app/components/ui/Spinner';

export default function Page() {
  return (
    <Suspense fallback={<Spinner />}>
      <BusinessDetailPage />
    </Suspense>
  );
}
