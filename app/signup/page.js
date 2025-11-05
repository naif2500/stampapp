import { Suspense } from 'react';
import SignupClient from './SignupClient';
import Spinner from '@/app/components/ui/Spinner';

export default function Page() {
  return (
    <Suspense fallback={<Spinner />}>
      <SignupClient />
    </Suspense>
  );
}

