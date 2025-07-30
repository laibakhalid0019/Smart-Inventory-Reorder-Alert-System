import React from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface StripePaymentFormProps {
    clientSecret: string;
    amount: number;
    orderNumber: string;
    onSuccess: () => void;
    onError: (message: string) => void;
}

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
                                                                 clientSecret,
                                                                 amount,
                                                                 orderNumber,
                                                                 onSuccess,
                                                                 onError,
                                                             }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [processing, setProcessing] = React.useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setProcessing(true);

        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement)!,
                billing_details: {
                    name: 'Retailer User', // Optional: Replace with actual user name if available
                },
            },
        });

        if (result.error) {
            onError(result.error.message || 'Payment failed');
        } else if (result.paymentIntent?.status === 'succeeded') {
            onSuccess();
        }

        setProcessing(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-4 border rounded-md bg-background">
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#32325d',
                                '::placeholder': { color: '#aab7c4' },
                            },
                            invalid: { color: '#fa755a' },
                        },
                    }}
                />
            </div>

            <div className="flex justify-between items-center">
                <p className="text-sm">Total: <span className="font-semibold text-primary">${amount.toLocaleString()}</span></p>
                <Button type="submit" disabled={processing || !stripe || !elements} className="brand-gradient text-white">
                    {processing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : 'Pay Now'}
                </Button>
            </div>
        </form>
    );
};

export default StripePaymentForm;
