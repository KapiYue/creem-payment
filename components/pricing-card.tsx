"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PricingCardProps {
  productId: string;
  productName: string;
  price: number;
  type: 'onetime' | 'recurring';
  period?: string;
  description?: string;
  features?: string[];
}

export function PricingCard({
  productId,
  productName,
  price,
  type,
  period,
  description,
  features = []
}: PricingCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePurchase = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          productName,
          amount: price * 100, // Convert to cents
          type,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const data = await response.json();
      
      // Redirect to Creem checkout
      window.location.href = data.checkoutUrl;
    } catch (error) {
      console.error('Purchase error:', error);
      alert('Failed to initiate purchase. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>{productName}</CardTitle>
          {type === 'recurring' && (
            <Badge variant="secondary">Subscription</Badge>
          )}
          {type === 'onetime' && (
            <Badge variant="outline">One-time</Badge>
          )}
        </div>
        {description && (
          <CardDescription>{description}</CardDescription>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="text-3xl font-bold">
          ${price}
          {type === 'recurring' && period && (
            <span className="text-base font-normal text-muted-foreground">
              /{period}
            </span>
          )}
        </div>
        
        {features.length > 0 && (
          <ul className="mt-4 space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center text-sm">
                <svg
                  className="w-4 h-4 mr-2 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handlePurchase}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Processing...' : 'Purchase Now'}
        </Button>
      </CardFooter>
    </Card>
  );
} 