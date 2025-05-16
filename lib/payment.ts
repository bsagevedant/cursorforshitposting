// Payment service for handling Razorpay and PayPal payments

// Get API keys from environment variables
const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";
const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "";

export interface PaymentConfig {
  amount: number;
  currency: string;
  credits: number;
  description: string;
}

export const defaultPaymentConfig: PaymentConfig = {
  amount: 9, // $9
  currency: "USD",
  credits: 20,
  description: "20 Shitpost Generation Credits"
};

// Initialize Razorpay
export const initRazorpay = async (): Promise<any> => {
  // Load Razorpay script dynamically
  if (!(window as any).Razorpay) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve((window as any).Razorpay);
      document.body.appendChild(script);
    });
  }
  return (window as any).Razorpay;
};

// Create Razorpay payment
export const createRazorpayPayment = async (
  config: PaymentConfig = defaultPaymentConfig,
  onSuccess: (paymentId: string, orderId: string) => void
): Promise<void> => {
  try {
    if (!RAZORPAY_KEY_ID) {
      throw new Error("Razorpay API key is not configured");
    }
    
    const Razorpay = await initRazorpay();
    
    // In a real app, you would create an order on your server
    // and get the order_id from there
    const options = {
      key: RAZORPAY_KEY_ID,
      amount: config.amount * 100, // Razorpay expects amount in smallest currency unit (cents)
      currency: config.currency,
      name: "Shitpost Generator",
      description: config.description,
      handler: function (response: any) {
        onSuccess(response.razorpay_payment_id, response.razorpay_order_id);
      },
      prefill: {
        name: "User",
        email: "user@example.com"
      },
      theme: {
        color: "#6366F1" // Indigo color
      }
    };

    const razorpayInstance = new Razorpay(options);
    razorpayInstance.open();
  } catch (error) {
    console.error("Razorpay payment error:", error);
    throw error;
  }
};

// PayPal configuration and helpers
export const paypalConfig = {
  clientId: PAYPAL_CLIENT_ID || "",
  currency: "USD",
  intent: "capture"
};

// Validate PayPal configuration
export const validatePayPalConfig = (): boolean => {
  if (!PAYPAL_CLIENT_ID) {
    console.error("PayPal client ID is not configured");
    return false;
  }
  return true;
};

// Create PayPal order options
export const createPayPalOrderOptions = (config: PaymentConfig = defaultPaymentConfig) => {
  return {
    purchase_units: [
      {
        amount: {
          value: config.amount.toString(),
          currency_code: config.currency,
        },
        description: config.description,
      },
    ],
  };
}; 