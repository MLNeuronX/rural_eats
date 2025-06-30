"use client"

import * as React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, Shield, ArrowLeft } from "lucide-react"
import Link from "next/link"
import {loadStripe} from '@stripe/stripe-js';
import {Elements, CardElement, useStripe, useElements} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);

function StripePaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    if (!stripe || !elements) {
      setError('Stripe has not loaded yet.');
      setIsLoading(false);
      return;
    }

    // TODO: Replace with actual order ID from your app's state/logic
    const orderId = 'test-order-id';

    // 1. Create payment intent on backend
    const res = await fetch('/api/payment/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: orderId }),
      credentials: 'include',
    });
    const data = await res.json();
    if (!res.ok || !data.client_secret) {
      setError(data.error || 'Failed to create payment intent.');
      setIsLoading(false);
      return;
    }

    // 2. Confirm card payment
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError('Card element not found.');
      setIsLoading(false);
      return;
    }
    const result = await stripe.confirmCardPayment(data.client_secret, {
      payment_method: {
        card: cardElement,
      },
    });
    if (result.error) {
      setError(result.error.message || 'Payment failed.');
      setIsLoading(false);
      return;
    }
    if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
      setSuccess(true);
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement options={{hidePostalCode: true}} className="p-2 border rounded"/>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      {success && <div className="text-green-600 text-sm">Payment successful!</div>}
      <Button type="submit" className="w-full" disabled={isLoading || !stripe}>
        {isLoading ? 'Processing...' : 'Pay Now'}
      </Button>
    </form>
  );
}

export default function SetupPaymentPage() {
  return (
    <div className="container max-w-md mx-auto px-4 py-6">
      <Card>
        <CardHeader>
          <div className="flex items-center mb-2">
            <Link href="/buyer">
              <Button variant="ghost" size="icon" className="h-8 w-8 mr-2">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Add Payment Method
            </CardTitle>
          </div>
          <CardDescription>Securely add your payment information to start ordering</CardDescription>
        </CardHeader>
        <CardContent>
          <Elements stripe={stripePromise}>
            <StripePaymentForm />
          </Elements>
        </CardContent>
      </Card>
    </div>
  );
}
