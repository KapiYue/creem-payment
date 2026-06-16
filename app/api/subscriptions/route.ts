import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { orders } from '@/lib/db/schema';
import { eq, and, isNotNull } from 'drizzle-orm';
import {
  getSubscription,
  isActiveSubscription,
  type SubscriptionWithOrder,
} from '@/lib/creem';

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userOrders = await db
      .select()
      .from(orders)
      .where(
        and(
          eq(orders.userId, user.id),
          eq(orders.type, 'recurring'),
          isNotNull(orders.subscriptionId)
        )
      );

    if (userOrders.length === 0) {
      return NextResponse.json({ isSubscribed: false, subscriptions: [] });
    }

    const subscriptionDetails = await Promise.all(
      userOrders.map(async (order) => {
        if (!order.subscriptionId) {
          return null;
        }

        try {
          const subscriptionData = await getSubscription(order.subscriptionId);
          return {
            ...subscriptionData,
            localOrder: order,
          } satisfies SubscriptionWithOrder;
        } catch (error) {
          console.error(
            `Error fetching subscription ${order.subscriptionId}:`,
            error
          );
          return null;
        }
      })
    );

    const subscriptions = subscriptionDetails.filter(
      (sub): sub is SubscriptionWithOrder => sub !== null
    );

    const isSubscribed = subscriptions.some(isActiveSubscription);

    return NextResponse.json({ isSubscribed, subscriptions });
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
