interface RazorpayOptions {
  key: string;
  amount: number; // in paise
  currency: string;
  name: string;
  description: string;
  order_id?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  handler: (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => void;
  modal?: {
    ondismiss?: () => void;
  };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open: () => void };
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export interface RazorpayPaymentResult {
  success: boolean;
  paymentId?: string;
  orderId?: string;
  signature?: string;
  error?: string;
}

export async function initiateRazorpayPayment(params: {
  keyId: string;
  amount: number; // in INR (will convert to paise)
  name: string;
  description: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  themeColor?: string;
}): Promise<RazorpayPaymentResult> {
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    return { success: false, error: "Failed to load Razorpay SDK. Please check your internet connection." };
  }

  if (!params.keyId) {
    return { success: false, error: "Razorpay Key ID is not configured. Please set VITE_RAZORPAY_KEY_ID." };
  }

  return new Promise((resolve) => {
    const amountInPaise = Math.round(params.amount * 100);

    const options: RazorpayOptions = {
      key: params.keyId,
      amount: amountInPaise,
      currency: "INR",
      name: params.name,
      description: params.description,
      prefill: {
        name: params.customerName || "",
        email: params.customerEmail || "",
        contact: params.customerPhone || "",
      },
      theme: {
        color: params.themeColor || "#f59e0b",
      },
      handler(response) {
        resolve({
          success: true,
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
          signature: response.razorpay_signature,
        });
      },
      modal: {
        ondismiss() {
          resolve({ success: false, error: "Payment cancelled by user" });
        },
      },
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      resolve({ success: false, error: "Failed to open Razorpay. Please try again." });
    }
  });
}
