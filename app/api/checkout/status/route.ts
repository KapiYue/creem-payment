import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCheckoutSession } from '@/lib/creem';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const checkoutId = searchParams.get('checkout_id');

    if (!checkoutId) {
      return NextResponse.json(
        { error: 'Missing checkout_id parameter' },
        { status: 400 }
      );
    }

    const checkoutData = await getCheckoutSession(checkoutId);

    return NextResponse.json({
      status: checkoutData.status,
      checkout: checkoutData,
    });
  } catch (error) {
    console.error('Checkout status check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
