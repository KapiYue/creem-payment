import * as crypto from 'crypto';
import type { SelectOrder } from '@/lib/db/schema';

export const CREEM_API_BASE =
  process.env.CREEM_API_BASE ?? 'https://test-api.creem.io';

export function verifyCreemWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const computedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  if (computedSignature.length !== signature.length) {
    return false;
  }

  return crypto.timingSafeEqual(
    Buffer.from(computedSignature),
    Buffer.from(signature)
  );
}

export async function getCheckoutSession(checkoutId: string) {
  const response = await fetch(
    `${CREEM_API_BASE}/v1/checkouts?checkout_id=${checkoutId}`,
    {
      method: 'GET',
      headers: {
        'x-api-key': process.env.CREEM_API_KEY!,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Failed to fetch checkout session: ${errorData}`);
  }

  return response.json();
}

export type SubscriptionStatus =
  | 'active'
  | 'canceled'
  | 'unpaid'
  | 'paused'
  | 'trialing';

export interface CreemProduct {
  id: string;
  name: string;
  price: number;
  currency: string;
  billing_period: string;
}

export interface CreemSubscription {
  id: string;
  status: SubscriptionStatus;
  product: CreemProduct | string;
  current_period_start_date?: string;
  current_period_end_date?: string;
  next_transaction_date?: string;
  canceled_at?: string | null;
  created_at: string;
  updated_at: string;
}

export type SubscriptionWithOrder = CreemSubscription & {
  localOrder: SelectOrder;
};

function creemHeaders() {
  return {
    'x-api-key': process.env.CREEM_API_KEY!,
  };
}

export async function getSubscription(
  subscriptionId: string
): Promise<CreemSubscription> {
  const response = await fetch(
    `${CREEM_API_BASE}/v1/subscriptions?subscription_id=${subscriptionId}`,
    {
      method: 'GET',
      headers: creemHeaders(),
    }
  );

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Failed to fetch subscription: ${errorData}`);
  }

  return response.json();
}

export async function cancelSubscription(
  subscriptionId: string
): Promise<CreemSubscription> {
  const response = await fetch(
    `${CREEM_API_BASE}/v1/subscriptions/${subscriptionId}/cancel`,
    {
      method: 'POST',
      headers: creemHeaders(),
    }
  );

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Failed to cancel subscription: ${errorData}`);
  }

  return response.json();
}

export function isActiveSubscription(subscription: CreemSubscription): boolean {
  if (subscription.status === 'active' || subscription.status === 'trialing') {
    return true;
  }

  if (
    subscription.status === 'canceled' &&
    subscription.current_period_end_date
  ) {
    return new Date(subscription.current_period_end_date) > new Date();
  }

  return false;
}
