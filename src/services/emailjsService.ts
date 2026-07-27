import emailjs from "@emailjs/browser";

interface BookingEmailParams {
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
  from_name: string;
  reply_to: string;
}

/**
 * Send booking confirmation email via EmailJS
 * Requires VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY
 * in .env.local file
 */
export async function sendBookingConfirmationEmail(
  params: BookingEmailParams
): Promise<{ success: boolean; message: string }> {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) {
    console.warn("[EmailJS] Missing configuration — using mailto fallback");
    return { success: false, message: "EmailJS not configured. Using mailto fallback." };
  }

  try {
    const response = await emailjs.send(
      serviceId,
      templateId,
      {
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
        reply_to: "bookings@travellog.com",
      },
      publicKey
    );

    if (response.status === 200) {
      console.log("[EmailJS] Booking confirmation sent successfully");
      return { success: true, message: "Booking confirmation email sent!" };
    }

    return { success: false, message: "Failed to send email. Please try again." };
  } catch (error) {
    console.error("[EmailJS] Error sending email:", error);
    return { success: false, message: "Could not send email. Check your EmailJS configuration." };
  }
}
