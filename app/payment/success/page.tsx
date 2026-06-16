'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckIcon, LoaderIcon } from 'lucide-react';

const MAX_RETRIES = 5;
const RETRY_INTERVAL_MS = 2000;

function LoadingCard() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <LoaderIcon className="w-6 h-6 text-blue-600 animate-spin" />
          </div>
          <CardTitle className="text-2xl font-bold text-blue-600">
            Processing Payment...
          </CardTitle>
          <CardDescription>
            Please wait while we verify your payment.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground">
            This may take a few moments.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function PaymentSuccessContent() {
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<
    'loading' | 'success' | 'failed'
  >('loading');
  const [checkoutData, setCheckoutData] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const checkout_id = searchParams.get('checkout_id');
  const order_id = searchParams.get('order_id');
  const customer_id = searchParams.get('customer_id');
  const subscription_id = searchParams.get('subscription_id');
  const product_id = searchParams.get('product_id');
  const request_id = searchParams.get('request_id');

  useEffect(() => {
    let cancelled = false;

    const checkPaymentStatus = async () => {
      if (!checkout_id) {
        setError('Missing checkout ID');
        setPaymentStatus('failed');
        setLoading(false);
        return;
      }

      for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        if (cancelled) return;

        try {
          const response = await fetch(
            `/api/checkout/status?checkout_id=${checkout_id}`
          );

          if (!response.ok) {
            throw new Error('Failed to check payment status');
          }

          const data = await response.json();
          setCheckoutData(data.checkout);

          const orderStatus = data.checkout?.order?.status;
          const checkoutStatus = data.status;

          if (
            checkoutStatus === 'completed' &&
            (orderStatus === 'paid' || orderStatus === 'pending')
          ) {
            setPaymentStatus('success');
            setLoading(false);
            return;
          }

          if (checkoutStatus === 'expired' || checkoutStatus === 'canceled') {
            setError(`Checkout session ${checkoutStatus}`);
            setPaymentStatus('failed');
            setLoading(false);
            return;
          }
        } catch (err) {
          console.error('Error checking payment status:', err);
          setError(
            err instanceof Error ? err.message : 'Unknown error occurred'
          );
          setPaymentStatus('failed');
          setLoading(false);
          return;
        }

        if (attempt < MAX_RETRIES - 1) {
          await new Promise((resolve) =>
            setTimeout(resolve, RETRY_INTERVAL_MS)
          );
        }
      }

      setError('Payment was not completed successfully');
      setPaymentStatus('failed');
      setLoading(false);
    };

    checkPaymentStatus();

    return () => {
      cancelled = true;
    };
  }, [checkout_id]);

  useEffect(() => {
    if (paymentStatus === 'failed' && !loading) {
      const params = new URLSearchParams();
      if (error) params.set('error', error);
      if (checkout_id) params.set('checkout_id', checkout_id);
      router.replace(`/payment/fail?${params.toString()}`);
    }
  }, [paymentStatus, loading, error, checkout_id, router]);

  const handleContinue = () => {
    router.push('/protected');
  };

  if (loading || paymentStatus === 'loading') {
    return <LoadingCard />;
  }

  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckIcon className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-600">
              Payment Successful!
            </CardTitle>
            <CardDescription>
              Thank you for your purchase. Your payment has been processed
              successfully.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground space-y-2">
              {checkout_id && (
                <p>
                  <strong>Checkout ID:</strong> {checkout_id}
                </p>
              )}
              {order_id && (
                <p>
                  <strong>Order ID:</strong> {order_id}
                </p>
              )}
              {customer_id && (
                <p>
                  <strong>Customer ID:</strong> {customer_id}
                </p>
              )}
              {subscription_id && (
                <p>
                  <strong>Subscription ID:</strong> {subscription_id}
                </p>
              )}
              {product_id && (
                <p>
                  <strong>Product ID:</strong> {product_id}
                </p>
              )}
              {request_id && (
                <p>
                  <strong>Request ID:</strong> {request_id}
                </p>
              )}
              {(() => {
                const order = checkoutData?.order;
                if (
                  order &&
                  typeof order === 'object' &&
                  'amount' in order &&
                  'currency' in order
                ) {
                  const { amount, currency } = order as {
                    amount: number;
                    currency: string;
                  };
                  return (
                    <p>
                      <strong>Amount:</strong> ${(amount / 100).toFixed(2)}{' '}
                      {currency}
                    </p>
                  );
                }
                return null;
              })()}
            </div>

            <div className="pt-4 border-t">
              <Button onClick={handleContinue} className="w-full">
                Continue to Dashboard
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                You will receive a confirmation email shortly.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <LoadingCard />;
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<LoadingCard />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
