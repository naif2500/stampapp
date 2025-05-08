'use client';

import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export const AddCardButton = ({ businessId,  customerId }) => {
  const handleClick = async () => {
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ businessId,  customerId}),
    });

    const { sessionId } = await res.json();
    const stripe = await stripePromise;

    await stripe.redirectToCheckout({ sessionId });
  };

  return (
    <button
      onClick={handleClick}
      className="bg-[#6774CA] cursor-pointer text-white px-4 py-2 rounded shadow"
    >
      Pay & Add Card
    </button>
  );
};
