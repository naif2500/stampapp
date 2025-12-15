import { Suspense } from 'react';
import LoginPage from './LoginClient';
import Spinner from '@/app/components/ui/Spinner';

export default function Page() {
  return (
    <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-screen">
              <Spinner />
            </div>
          }
        >
      <LoginPage />
    </Suspense>
  );
}
