import { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { CreditCard, Sparkles, Check, AlertCircle } from "lucide-react";
import { PayPalButtons, PayPalScriptProvider, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { 
  createRazorpayPayment, 
  paypalConfig, 
  defaultPaymentConfig,
  validatePayPalConfig,
  createPayPalOrderOptions
} from "@/lib/payment";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (credits: number) => void;
}

export function PaymentModal({ isOpen, onClose, onPaymentSuccess }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "paypal">("razorpay");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paypalReady, setPaypalReady] = useState(false);
  
  // Check if API keys are configured
  const isRazorpayConfigured = !!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const isPayPalConfigured = validatePayPalConfig();

  // Set default payment method based on configuration
  useEffect(() => {
    if (isOpen) {
      if (isRazorpayConfigured) {
        setPaymentMethod("razorpay");
      } else if (isPayPalConfigured) {
        setPaymentMethod("paypal");
      }
    }
  }, [isOpen, isRazorpayConfigured, isPayPalConfigured]);
  
  const handleRazorpayPayment = async () => {
    setIsProcessing(true);
    setError(null);
    
    try {
      await createRazorpayPayment(defaultPaymentConfig, (paymentId) => {
        console.log("Payment successful:", paymentId);
        setIsProcessing(false);
        setIsSuccess(true);
        
        // After a short delay, close the modal and trigger success callback
        setTimeout(() => {
          onPaymentSuccess(defaultPaymentConfig.credits);
          onClose();
          setIsSuccess(false);
        }, 2000);
      });
    } catch (error) {
      console.error("Payment failed:", error);
      setIsProcessing(false);
      setError(error instanceof Error ? error.message : "Payment processing failed. Please try again.");
    }
  };

  const handlePayPalApprove = (data: any, actions: any) => {
    setIsProcessing(true);
    return actions.order.capture().then((details: any) => {
      console.log("PayPal payment successful:", details);
      setIsProcessing(false);
      setIsSuccess(true);
      
      // After a short delay, close the modal and trigger success callback
      setTimeout(() => {
        onPaymentSuccess(defaultPaymentConfig.credits);
        onClose();
        setIsSuccess(false);
      }, 2000);
    }).catch((err: any) => {
      console.error("PayPal capture error:", err);
      setIsProcessing(false);
      setError("Failed to complete PayPal payment. Please try again.");
    });
  };

  const handlePayPalError = (err: any) => {
    console.error("PayPal error:", err);
    setIsProcessing(false);
    setError("PayPal payment processing failed. Please try again.");
  };

  const createPayPalOrder = (data: any, actions: any) => {
    setError(null);
    return actions.order.create(createPayPalOrderOptions(defaultPaymentConfig));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
      // Reset states when opening
      if (open) {
        setIsSuccess(false);
        setIsProcessing(false);
        setError(null);
      }
    }}>
      <DialogContent className="sm:max-w-md">
        {isSuccess ? (
          <div className="py-8 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Payment Successful!</h2>
            <p className="text-muted-foreground">
              {defaultPaymentConfig.credits} credits have been added to your account.
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                <span>Get More Credits</span>
              </DialogTitle>
              <DialogDescription>
                Purchase credits to continue generating shitposts.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="rounded-lg border p-4 bg-muted/50 space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Premium Credits Package</h3>
                  <span className="text-green-600 font-bold">${defaultPaymentConfig.amount}</span>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-yellow-500" />
                    <span>{defaultPaymentConfig.credits} generation credits</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-yellow-500" />
                    <span>Advanced tone options</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-yellow-500" />
                    <span>Priority generation</span>
                  </li>
                </ul>
              </div>
              
              <Tabs 
                defaultValue={isRazorpayConfigured ? "razorpay" : "paypal"} 
                value={paymentMethod}
                onValueChange={(value) => setPaymentMethod(value as any)}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="razorpay" disabled={!isRazorpayConfigured}>Razorpay</TabsTrigger>
                  <TabsTrigger value="paypal" disabled={!isPayPalConfigured}>PayPal</TabsTrigger>
                </TabsList>
                <TabsContent value="razorpay" className="py-4">
                  {!isRazorpayConfigured ? (
                    <Alert className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>Razorpay is not configured. Please add your API key to .env.local</AlertDescription>
                    </Alert>
                  ) : (
                    <Button 
                      onClick={handleRazorpayPayment} 
                      className="w-full" 
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <span className="flex items-center">
                          <span className="animate-spin mr-2">◌</span>
                          Processing...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <CreditCard className="mr-2 h-4 w-4" />
                          Pay with Razorpay
                        </span>
                      )}
                    </Button>
                  )}
                </TabsContent>
                <TabsContent value="paypal" className="py-4">
                  {!isPayPalConfigured ? (
                    <Alert className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>PayPal is not configured. Please add your client ID to .env.local</AlertDescription>
                    </Alert>
                  ) : (
                    <PayPalScriptProvider 
                      options={{ 
                        clientId: paypalConfig.clientId,
                        currency: paypalConfig.currency,
                        intent: paypalConfig.intent,
                      }}
                    >
                      <PayPalScriptLoader 
                        setPaypalReady={setPaypalReady}
                        createPayPalOrder={createPayPalOrder}
                        handlePayPalApprove={handlePayPalApprove}
                        handlePayPalError={handlePayPalError}
                        isProcessing={isProcessing}
                      />
                    </PayPalScriptProvider>
                  )}
                </TabsContent>
              </Tabs>
            </div>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Add TypeScript interface for the PayPalScriptLoader props before the function definition
interface PayPalScriptLoaderProps {
  setPaypalReady: (ready: boolean) => void;
  createPayPalOrder: (data: any, actions: any) => Promise<string>;
  handlePayPalApprove: (data: any, actions: any) => Promise<any>;
  handlePayPalError: (err: any) => void;
  isProcessing: boolean;
}

function PayPalScriptLoader({ 
  setPaypalReady, 
  createPayPalOrder, 
  handlePayPalApprove, 
  handlePayPalError, 
  isProcessing 
}: PayPalScriptLoaderProps) {
  const [{ isPending }] = usePayPalScriptReducer();
  
  useEffect(() => {
    if (!isPending) {
      setPaypalReady(true);
    }
  }, [isPending, setPaypalReady]);
  
  return (
    <>
      {isPending ? (
        <div className="text-center py-4">
          <div className="animate-spin inline-block w-6 h-6 border-2 border-current border-t-transparent text-primary rounded-full" />
          <p className="mt-2 text-sm text-muted-foreground">Loading PayPal...</p>
        </div>
      ) : (
        <PayPalButtons 
          style={{ layout: "horizontal" }}
          createOrder={createPayPalOrder}
          onApprove={handlePayPalApprove}
          onError={handlePayPalError}
          disabled={isProcessing}
        />
      )}
    </>
  );
} 