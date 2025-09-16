import React, { Suspense } from 'react';

import PaymentSuccessClient from './PaymentSuccessClient';

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600" />
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PaymentSuccessClient />
    </Suspense>
  );
}
