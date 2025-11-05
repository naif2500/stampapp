import { Suspense } from 'react';
import SignupPage from './SignupClient';
import Spinner from '@/app/components/ui/Spinner';

export default function Page() {
  return (
    <Suspense fallback={<Spinner />}>
      <SignupPage />
    </Suspense>
  );
}

