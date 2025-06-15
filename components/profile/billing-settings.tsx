"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CreditCard, 
  Download, 
  Calendar,
  CheckCircle,
  AlertCircle,
  Crown,
  Zap,
  Star,
  ArrowUpCircle,
  Receipt,
  DollarSign
} from 'lucide-react';

interface BillingSettingsProps {
  user: any;
}

export function BillingSettings({ user }: BillingSettingsProps) {
  const [paymentMethod, setPaymentMethod] = useState({
    cardNumber: '•••• •••• •••• 4242',
    expiryDate: '12/25',
    cardholderName: user.name || '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US'
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Mock billing data
  const currentPlan = {
    name: user.plan || 'Free',
    price: user.plan === 'Pro' ? 29 : user.plan === 'Premium' ? 79 : 0,
    billing: 'monthly',
    nextBilling: '2024-02-15',
    features: user.plan === 'Pro' ? [
      'Unlimited signals',
      'Advanced analytics',
      'Email & Telegram alerts',
      'Priority support'
    ] : user.plan === 'Premium' ? [
      'Everything in Pro',
      'Auto-trading (coming soon)',
      'Custom indicators',
      'API access',
      '1-on-1 coaching session'
    ] : [
      '10 signals per day',
      'Basic analytics',
      'Email alerts only',
      'Community support'
    ]
  };

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      description: 'Perfect for getting started',
      features: [
        '10 signals per day',
        'Basic pattern recognition',
        'Email notifications',
        'Community access',
        'Mobile app access'
      ],
      popular: false
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 29,
      description: 'For serious traders',
      features: [
        'Unlimited signals',
        'Advanced pattern recognition',
        'Real-time alerts',
        'Telegram integration',
        'Priority support',
        'Advanced analytics',
        'Risk management tools'
      ],
      popular: true
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 79,
      description: 'For professional traders',
      features: [
        'Everything in Pro',
        'Auto-trading (coming soon)',
        'Custom indicators',
        'API access',
        'White-label solution',
        '1-on-1 coaching session',
        'Custom alerts'
      ],
      popular: false
    }
  ];

  const invoiceHistory = [
    { id: 'inv-001', date: '2024-01-15', amount: 29, status: 'paid', plan: 'Pro' },
    { id: 'inv-002', date: '2023-12-15', amount: 29, status: 'paid', plan: 'Pro' },
    { id: 'inv-003', date: '2023-11-15', amount: 29, status: 'paid', plan: 'Pro' },
    { id: 'inv-004', date: '2023-10-15', amount: 0, status: 'paid', plan: 'Free' }
  ];

  const handlePlanChange = async (planId: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const selectedPlan = plans.find(p => p.id === planId);
      if (selectedPlan) {
        setMessage({ 
          type: 'success', 
          text: `Successfully upgraded to ${selectedPlan.name} plan!` 
        });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to change plan. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentMethodUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setMessage({ type: 'success', text: 'Payment method updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update payment method.' });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadInvoice = (invoiceId: string) => {
    // Mock invoice download
    const invoice = invoiceHistory.find(inv => inv.id === invoiceId);
    if (invoice) {
      setMessage({ type: 'success', text: `Invoice ${invoiceId} downloaded successfully!` });
    }
  };

  return (
    <div className="space-y-6">
      {/* Success/Error Messages */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Alert className={message.type === 'success' ? 'border-green-500/50 bg-green-500/10' : ''} variant={message.type === 'error' ? 'destructive' : 'default'}>
            {message.type === 'success' ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertDescription className={message.type === 'success' ? 'text-green-700 dark:text-green-400' : ''}>
              {message.text}
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      <Tabs defaultValue="current" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="current">Current Plan</TabsTrigger>
          <TabsTrigger value="plans">Upgrade</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-6">
          {/* Current Plan */}
          <Card className="glassmorphism">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Crown className="w-5 h-5" />
                  <span>Current Plan</span>
                </div>
                <Badge variant="outline" className="text-primary border-primary/30">
                  {currentPlan.name}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {currentPlan.name} Plan
                    </h3>
                    <p className="text-2xl font-bold text-primary">
                      ${currentPlan.price}
                      <span className="text-sm font-normal text-muted-foreground">
                        /{currentPlan.billing}
                      </span>
                    </p>
                  </div>

                  {currentPlan.price > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Next billing:</span>
                        <span className="text-foreground">{currentPlan.nextBilling}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <CreditCard className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Payment method:</span>
                        <span className="text-foreground">{paymentMethod.cardNumber}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-foreground">Plan Features</h4>
                  <ul className="space-y-2">
                    {currentPlan.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {currentPlan.name !== 'Premium' && (
                <div className="pt-4 border-t border-border/50">
                  <Button onClick={() => handlePlanChange('premium')} className="w-full">
                    <ArrowUpCircle className="w-4 h-4 mr-2" />
                    Upgrade Plan
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans" className="space-y-6">
          {/* Plan Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card key={plan.id} className={`glassmorphism relative ${plan.popular ? 'border-primary/50' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center space-x-2">
                    {plan.id === 'free' && <Zap className="w-5 h-5" />}
                    {plan.id === 'pro' && <Star className="w-5 h-5" />}
                    {plan.id === 'premium' && <Crown className="w-5 h-5" />}
                    <span>{plan.name}</span>
                  </CardTitle>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-primary">
                      ${plan.price}
                      <span className="text-sm font-normal text-muted-foreground">/month</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    onClick={() => handlePlanChange(plan.id)}
                    disabled={isLoading || user.plan?.toLowerCase() === plan.id}
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {user.plan?.toLowerCase() === plan.id ? 'Current Plan' : 
                     plan.id === 'free' ? 'Downgrade' : 'Upgrade'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="payment" className="space-y-6">
          {/* Payment Method */}
          <Card className="glassmorphism">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5" />
                <span>Payment Method</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePaymentMethodUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    value={paymentMethod.cardNumber}
                    onChange={(e) => setPaymentMethod(prev => ({ ...prev, cardNumber: e.target.value }))}
                    placeholder="1234 5678 9012 3456"
                    className="bg-muted/50 border-border/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      value={paymentMethod.expiryDate}
                      onChange={(e) => setPaymentMethod(prev => ({ ...prev, expiryDate: e.target.value }))}
                      placeholder="MM/YY"
                      className="bg-muted/50 border-border/50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      className="bg-muted/50 border-border/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardholderName">Cardholder Name</Label>
                  <Input
                    id="cardholderName"
                    value={paymentMethod.cardholderName}
                    onChange={(e) => setPaymentMethod(prev => ({ ...prev, cardholderName: e.target.value }))}
                    className="bg-muted/50 border-border/50"
                  />
                </div>

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Updating...' : 'Update Payment Method'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-6">
          {/* Invoice History */}
          <Card className="glassmorphism">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Receipt className="w-5 h-5" />
                <span>Invoice History</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {invoiceHistory.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm">{invoice.id}</span>
                        <Badge variant={invoice.status === 'paid' ? 'outline' : 'destructive'}>
                          {invoice.status}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>{invoice.date}</span>
                        <span>{invoice.plan} Plan</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="font-medium">${invoice.amount}</div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => downloadInvoice(invoice.id)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}