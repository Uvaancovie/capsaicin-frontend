import React, { Suspense } from 'react'

const OrderProcessingClient = React.lazy(() => import('@/components/order-processing-client'))

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      {/* Client component handles useSearchParams and all browser-only logic */}
      <OrderProcessingClient />
    </Suspense>
  )
}
