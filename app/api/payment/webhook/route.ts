import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { db } from '@/lib/db';
import { checkoutSessions, orders } from '@/lib/db/schema';
import { verifyCreemWebhookSignature } from '@/lib/creem';

interface CheckoutCompletedEvent {
  id: string;
  eventType: string;
  object: {
    id: string;
    status: string;
    order: {
      id: string;
      status: string;
      type: 'onetime' | 'recurring';
      amount: number;
      currency: string;
    };
    customer: {
      id: string;
    };
    subscription?: {
      id: string;
    };
    product: {
      id: string;
      name: string;
    };
  };
}

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('creem-signature');
    if (!signature) {
      console.error('Missing creem-signature header');
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    const payload = await request.text();

    const webhookSecret = process.env.CREEM_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('Missing CREEM_WEBHOOK_SECRET environment variable');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    if (!verifyCreemWebhookSignature(payload, signature, webhookSecret)) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(payload) as CheckoutCompletedEvent;
    const { eventType, object: eventObject } = event;

    console.log(`Received webhook event: ${eventType}`);

    if (eventType === 'checkout.completed') {
      const checkout = eventObject;
      const { order, customer, subscription, product } = checkout;

      const [checkoutSession] = await db
        .select()
        .from(checkoutSessions)
        .where(eq(checkoutSessions.id, checkout.id))
        .limit(1);

      await db
        .update(checkoutSessions)
        .set({
          status: 'completed',
          updatedAt: new Date(),
        })
        .where(eq(checkoutSessions.id, checkout.id));

      const [existingOrder] = await db
        .select()
        .from(orders)
        .where(eq(orders.orderId, order.id))
        .limit(1);

      if (!existingOrder) {
        await db.insert(orders).values({
          id: `order_${nanoid()}`,
          checkoutSessionId: checkout.id,
          userId: checkoutSession?.userId ?? '',
          customerId: customer.id,
          productId: product.id,
          productName: product.name,
          orderId: order.id,
          subscriptionId: subscription?.id ?? null,
          status: order.status === 'paid' ? 'paid' : 'pending',
          type: order.type,
          amount: order.amount,
          currency: order.currency,
        });

        console.log(`Order ${order.id} created successfully`);
      } else {
        console.log(`Order ${order.id} already exists, skipping insertion`);
      }
    } else if (eventType === 'subscription.paid') {
      const subscription = eventObject as { id: string };

      await db
        .update(orders)
        .set({
          status: 'paid',
          updatedAt: new Date(),
        })
        .where(eq(orders.subscriptionId, subscription.id));
    } else if (eventType === 'refund.created') {
      const refund = eventObject as { order: { id: string } };

      await db
        .update(orders)
        .set({
          status: 'refunded',
          updatedAt: new Date(),
        })
        .where(eq(orders.orderId, refund.order.id));
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
