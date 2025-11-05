import { Suspense } from 'react';
import LoginPage from './LoginClient';
import Spinner from '@/app/components/ui/Spinner';

export default function Page() {
  return (
    <Suspense fallback={<Spinner />}>
      <LoginPage />
    </Suspense>
  );
}
