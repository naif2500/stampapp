// app/api/create-checkout-session/route.js
import Stripe from 'stripe';
import { NextResponse } from 'next/server';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  const body = await request.json();
  const { businessId, customerId} = body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'dkk',
            product_data: {
              name: 'Stamp Card Access',
              description: `Access for ${businessId}`,
            },
            unit_amount: 1999, // $1.99
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?businessId=${businessId}&customerId=${customerId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
    });

  return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error(error);
    return new Response('Error creating session', { status: 500 });
  }
}
