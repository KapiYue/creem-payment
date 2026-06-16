import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { checkoutSessions } from '@/lib/db/schema';
import { CREEM_API_BASE } from '@/lib/creem';
import { nanoid } from 'nanoid';

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { productId, productName, amount, type } = body;

    if (!productId || !productName || !amount || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: productId, productName, amount, type' },
        { status: 400 }
      );
    }

    // Generate unique request ID
    const requestId = `req_${nanoid()}`;
    
    // Create checkout session with Creem API
    const creemResponse = await fetch(`${CREEM_API_BASE}/v1/checkouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.CREEM_API_KEY!,
      },
      body: JSON.stringify({
        product_id: productId,
        request_id: requestId,
        success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/success`,
        customer: {
          email: user.email,
        },
      }),
    });

    if (!creemResponse.ok) {
      const errorData = await creemResponse.text();
      console.error('Creem API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to create checkout session' },
        { status: 500 }
      );
    }

    const creemData = await creemResponse.json();

    // Store checkout session in database
    await db.insert(checkoutSessions).values({
      id: creemData.id,
      userId: user.id,
      productId,
      productName,
      requestId,
      checkoutUrl: creemData.checkout_url,
      successUrl: creemData.success_url,
      amount,
      currency: 'USD',
      status: 'pending',
    });

    return NextResponse.json({
      checkoutUrl: creemData.checkout_url,
      sessionId: creemData.id,
    });

  } catch (error) {
    console.error('Checkout creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 