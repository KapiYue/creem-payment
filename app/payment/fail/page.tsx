'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XIcon, RefreshCwIcon, LoaderIcon } from 'lucide-react';

function PaymentFailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const error =
    searchParams.get('error') || 'Payment was not completed successfully';
  const checkout_id = searchParams.get('checkout_id');
  const reason = searchParams.get('reason');

  const handleContinue = () => {
    router.push('/protected');
  };

  const handleRetry = () => {
    router.push('/protected');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <XIcon className="w-6 h-6 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-600">
            Payment Failed
          </CardTitle>
          <CardDescription>
            Unfortunately, your payment could not be processed.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
            <strong>Error:</strong> {error}
          </div>

          {reason && (
            <div className="text-sm text-muted-foreground bg-gray-50 p-3 rounded">
              <strong>Reason:</strong> {reason}
            </div>
          )}

          {checkout_id && (
            <div className="text-sm text-muted-foreground">
              <strong>Checkout ID:</strong> {checkout_id}
            </div>
          )}

          <div className="space-y-3">
            <h4 className="font-medium text-sm">What you can do:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Check your payment method details</li>
              <li>• Ensure you have sufficient funds</li>
              <li>• Try a different payment method</li>
              <li>• Contact your bank if the issue persists</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 gap-3 pt-4">
            <Button onClick={handleRetry} className="w-full">
              <RefreshCwIcon className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button variant="outline" onClick={handleContinue} className="w-full">
              Continue to Dashboard
            </Button>
          </div>

          <div className="text-center pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              If you continue to experience issues, please contact our support
              team.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function FailPageFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <LoaderIcon className="w-6 h-6 animate-spin text-muted-foreground" />
    </div>
  );
}

export default function PaymentFailPage() {
  return (
    <Suspense fallback={<FailPageFallback />}>
      <PaymentFailContent />
    </Suspense>
  );
}
