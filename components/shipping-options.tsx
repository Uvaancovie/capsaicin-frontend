'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Truck, Clock, MapPin, Gift } from 'lucide-react';
import { shippingOptions, ShippingOption, formatZAR } from '@/lib/currency';

interface ShippingOptionsProps {
  selectedShipping: string;
  onShippingChange: (shippingId: string) => void;
  cartTotal: number;
  className?: string;
}

const ShippingIcon = ({ optionId }: { optionId: string }) => {
  switch (optionId) {
    case 'express':
      return <Truck className="h-5 w-5 text-blue-500" />;
    case 'collection':
      return <MapPin className="h-5 w-5 text-green-500" />;
    case 'free':
      return <Gift className="h-5 w-5 text-purple-500" />;
    default:
      return <Clock className="h-5 w-5 text-orange-500" />;
  }
};

export function ShippingOptions({ 
  selectedShipping, 
  onShippingChange, 
  cartTotal,
  className = "" 
}: ShippingOptionsProps) {
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);

  // Filter available shipping options based on cart total
  const availableOptions = shippingOptions.filter(option => {
    if (option.id === 'free') {
      return cartTotal >= 500; // Only show free shipping if eligible
    }
    return true;
  });

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Shipping Options
        </CardTitle>
        <CardDescription>
          Choose your preferred delivery method
          {cartTotal >= 500 && (
            <Badge variant="secondary" className="ml-2">
              Free shipping eligible!
            </Badge>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup 
          value={selectedShipping} 
          onValueChange={onShippingChange}
          className="space-y-4"
        >
          {availableOptions.map((option: ShippingOption) => (
            <div
              key={option.id}
              className={`relative rounded-lg border p-4 transition-all duration-200 ${
                selectedShipping === option.id 
                  ? 'border-primary bg-primary/5 ring-1 ring-primary' 
                  : hoveredOption === option.id
                  ? 'border-gray-300 bg-gray-50'
                  : 'border-gray-200'
              }`}
              onMouseEnter={() => setHoveredOption(option.id)}
              onMouseLeave={() => setHoveredOption(null)}
            >
              <div className="flex items-start space-x-3">
                <RadioGroupItem 
                  value={option.id} 
                  id={option.id}
                  className="mt-1" 
                />
                <div className="flex-1 min-w-0">
                  <Label 
                    htmlFor={option.id} 
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <ShippingIcon optionId={option.id} />
                      <div>
                        <div className="font-medium text-gray-900">
                          {option.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {option.description}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        {option.price === 0 ? 'FREE' : formatZAR(option.price)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {option.estimatedDays}
                      </div>
                    </div>
                  </Label>
                  
                  {option.trackingAvailable && (
                    <div className="mt-2">
                      <Badge variant="outline" className="text-xs">
                        ✓ Tracking included
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </RadioGroup>

        {cartTotal < 500 && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-sm text-blue-800">
              💡 <strong>Free shipping</strong> on orders over {formatZAR(500)}
              <div className="text-xs text-blue-600 mt-1">
                Add {formatZAR(500 - cartTotal)} more to qualify
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
