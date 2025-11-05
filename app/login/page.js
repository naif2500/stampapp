import { Suspense } from 'react';
import LoginClient from './LoginClient';
import Spinner from '@/app/components/ui/Spinner';

export default function Page() {
  return (
    <Suspense fallback={<Spinner />}>
      <LoginClient />
    </Suspense>
  );
}
