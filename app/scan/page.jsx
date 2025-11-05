import { Suspense } from 'react';
import ScanRedirectPage from './ScanClient';
import Spinner from '@/app/components/ui/Spinner';

export default function Page() {
  return (
    <Suspense fallback={<Spinner />}>
      <ScanRedirectPage />
    </Suspense>
  );
}
