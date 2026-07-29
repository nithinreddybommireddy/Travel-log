import emailjs from "@emailjs/browser";

export interface BookingEmailParams {
  to_name: string;
  to_email: string;
  tour_name: string;
  tour_location: string;
  start_date: string;
  travelers: number;
  total_paid: string;
  discount: string;
  coupon: string;
  booking_id: string;
  status: string;
  traveler_details: string;
}

export async function sendBookingConfirmationEmail(
  params: BookingEmailParams
): Promise<{ success: boolean; message: string }> {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  console.log("[EmailJS] Preparing booking email...");
  console.log("[EmailJS] Recipient:", params.to_email);
  console.log("[EmailJS] Booking:", params.booking_id);

  if (!serviceId || !templateId || !publicKey) {
    console.error("[EmailJS] Missing environment variables.");

    return {
      success: false,
      message: "EmailJS configuration is missing.",
    };
  }

  if (!params.to_email) {
    console.error("[EmailJS] Customer email is missing.");

    return {
      success: false,
      message: "Customer email is missing.",
    };
  }

  const templateParams = {
    to_name: params.to_name,
    to_email: params.to_email,

    tour_name: params.tour_name,
    tour_location: params.tour_location,
    start_date: params.start_date,

    travelers: String(params.travelers),

    total_paid: params.total_paid,
    discount: params.discount,
    coupon: params.coupon,

    booking_id: params.booking_id,
    status: params.status,

    traveler_details: params.traveler_details,

    from_name: "Travel Log",
    reply_to: params.to_email,
  };

  console.log("[EmailJS] Template params:", templateParams);

  try {
    const response = await emailjs.send(
      serviceId,
      templateId,
      templateParams,
      {
        publicKey,
      }
    );

    console.log("[EmailJS] Response:", response);

    if (response.status === 200) {
      console.log("[EmailJS] Booking confirmation sent successfully.");

      return {
        success: true,
        message: "Booking confirmation email sent!",
      };
    }

    return {
      success: false,
      message: "Email service returned an unexpected response.",
    };
  } catch (error: any) {
  console.error("[EmailJS] FULL ERROR:", error);
  console.error("[EmailJS] STATUS:", error?.status);
  console.error("[EmailJS] TEXT:", error?.text);

  return {
    success: false,
    message:
      error?.text ||
      "Could not send booking confirmation email.",
  };
}
}