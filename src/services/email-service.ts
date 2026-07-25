interface BookingInfo {
  id: string;
  tourName: string;
  location: string;
  startDate: string;
  travelers: number;
  totalPaid: number;
  discount: number;
  coupon: string | null;
  status: string;
}

interface EmailLog {
  id: string;
  type: "booking-confirmation" | "contact" | "newsletter";
  recipient: string;
  subject: string;
  sentAt: number;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/** Send booking confirmation email via mailto */
export function sendBookingConfirmation(booking: BookingInfo, email: string): void {
  const subject = encodeURIComponent(`Booking Confirmed! #${booking.id.slice(0, 8).toUpperCase()} - ${booking.tourName}`);
  const body = encodeURIComponent(
    `🎉 Travel Log - Booking Confirmation\n` +
    `──────────────────────────────\n\n` +
    `Status: ${booking.status.toUpperCase()}\n` +
    `Booking ID: #${booking.id.slice(0, 8).toUpperCase()}\n\n` +
    `Destination: ${booking.tourName}\n` +
    `Location: ${booking.location}\n` +
    `Start Date: ${booking.startDate}\n` +
    `Travelers: ${booking.travelers}\n` +
    `Total Paid: ₹${booking.totalPaid.toLocaleString()}\n` +
    (booking.discount > 0 ? `Discount: -₹${booking.discount.toLocaleString()} (${booking.coupon || ''})\n` : '') +
    `\n──────────────────────────────\n` +
    `Thank you for booking with Travel Log!\n` +
    `Visit your dashboard to view full details.\n\n` +
    `Travel Log — Discover Your Next Adventure`
  );

  window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_blank');

  // Log to localStorage
  logEmail({
    type: "booking-confirmation",
    recipient: email,
    subject: `Booking Confirmed! #${booking.id.slice(0, 8).toUpperCase()} - ${booking.tourName}`,
    sentAt: Date.now(),
  });
}

/** Send contact form message via mailto */
export function sendContactEmail(name: string, email: string, phone: string, message: string): void {
  const subject = encodeURIComponent(`Travel Inquiry from ${name}`);
  const body = encodeURIComponent(
    `👋 New Travel Inquiry\n` +
    `────────────────────\n\n` +
    `From: ${name}\n` +
    `Email: ${email}\n` +
    `Phone: ${phone}\n\n` +
    `Message:\n${message}\n\n` +
    `────────────────────\n` +
    `Sent via Travel Log Contact Form`
  );

  window.open(`mailto:hello@travellog.com?subject=${subject}&body=${body}`, '_blank');

  logEmail({
    type: "contact",
    recipient: "hello@travellog.com",
    subject: `Travel Inquiry from ${name}`,
    sentAt: Date.now(),
  });
}

/** Save newsletter subscription */
export function subscribeNewsletter(email: string): { success: boolean; message: string } {
  const key = "travellog_newsletter";
  const existing = JSON.parse(localStorage.getItem(key) || "[]");
  
  if (existing.includes(email)) {
    return { success: false, message: "You're already subscribed!" };
  }

  existing.unshift(email);
  localStorage.setItem(key, JSON.stringify(existing));

  const sentAt = Date.now();
  logEmail({
    type: "newsletter",
    recipient: email,
    subject: "Welcome to Travel Log Newsletter!",
    sentAt,
  });

  return { success: true, message: "Welcome aboard! You're now subscribed. 🎉" };
}

/** Log email to localStorage history */
function logEmail(entry: Omit<EmailLog, "id">): void {
  const key = "travellog_emails";
  const existing: EmailLog[] = JSON.parse(localStorage.getItem(key) || "[]");
  existing.unshift({ id: generateId(), ...entry });
  localStorage.setItem(key, JSON.stringify(existing.slice(0, 50)));
}

/** Get email history */
export function getEmailHistory(): EmailLog[] {
  try {
    return JSON.parse(localStorage.getItem("travellog_emails") || "[]");
  } catch {
    return [];
  }
}

/** Get newsletter subscribers count */
export function getNewsletterCount(): number {
  try {
    return JSON.parse(localStorage.getItem("travellog_newsletter") || "[]").length;
  } catch {
    return 0;
  }
}
