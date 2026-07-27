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

interface TravelerInfo {
  name: string;
  age: string;
  phone: string;
}

interface NotificationLog {
  id: string;
  type: "whatsapp" | "sms";
  recipient: string;
  recipientName: string;
  sentAt: number;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/**
 * Generate the WhatsApp message text for a booking confirmation
 */
function buildWhatsAppMessage(booking: BookingInfo, travelerName?: string): string {
  const name = travelerName || booking.tourName;
  return `🎉 *Travel Log - Booking Confirmed!*\n` +
    `━━━━━━━━━━━━━━━━━━━━━\n\n` +
    `Hi ${name}! Your trip is confirmed ✅\n\n` +
    `📋 *Booking ID:* #${booking.id.slice(0, 8).toUpperCase()}\n` +
    `📍 *Destination:* ${booking.tourName}\n` +
    `📅 *Start Date:* ${booking.startDate}\n` +
    `👥 *Travelers:* ${booking.travelers}\n` +
    `💰 *Total Paid:* ₹${booking.totalPaid.toLocaleString()}\n` +
    (booking.discount > 0 ? `🏷️ *Discount:* -₹${booking.discount.toLocaleString()} ${booking.coupon ? `(${booking.coupon})` : ''}\n` : '') +
    `📊 *Status:* ${booking.status.toUpperCase()}\n\n` +
    `━━━━━━━━━━━━━━━━━━━━━\n` +
    `Thank you for booking with Travel Log! 🧳✨\n` +
    `Visit travellog.com to view full details.`;
}

/**
 * Send booking confirmation via WhatsApp using wa.me link
 * Opens WhatsApp app/site with pre-filled message
 */
export function sendWhatsAppConfirmation(
  booking: BookingInfo,
  phone: string,
  travelerName?: string
): void {
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  if (!cleanPhone || cleanPhone.length < 10) {
    console.warn("[Notification] Invalid phone number for WhatsApp:", phone);
    return;
  }

  const message = buildWhatsAppMessage(booking, travelerName);
  const waUrl = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(message)}`;
  window.open(waUrl, "_blank");

  // Log notification
  logNotification({
    type: "whatsapp",
    recipient: cleanPhone,
    recipientName: travelerName || "Guest",
    sentAt: Date.now(),
  });
}

/**
 * Send booking confirmation via SMS using sms: protocol
 * Opens default SMS app with pre-filled message
 */
export function sendSMSConfirmation(
  booking: BookingInfo,
  phone: string,
  travelerName?: string
): void {
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  if (!cleanPhone || cleanPhone.length < 10) {
    console.warn("[Notification] Invalid phone number for SMS:", phone);
    return;
  }

  const message = buildWhatsAppMessage(booking, travelerName);
  // sms: protocol with body param
  const smsUrl = `sms:+91${cleanPhone}?body=${encodeURIComponent(message)}`;
  window.open(smsUrl, "_blank");

  // Log notification
  logNotification({
    type: "sms",
    recipient: cleanPhone,
    recipientName: travelerName || "Guest",
    sentAt: Date.now(),
  });
}

/**
 * Send WhatsApp confirmation to all travelers in a booking
 */
export function sendWhatsAppToAllTravelers(
  booking: BookingInfo,
  travelerDetails: TravelerInfo[]
): void {
  if (!travelerDetails || travelerDetails.length === 0) return;

  travelerDetails.forEach((traveler) => {
    if (traveler.phone && traveler.phone.replace(/[^0-9]/g, "").length >= 10) {
      sendWhatsAppConfirmation(booking, traveler.phone, traveler.name);
    }
  });
}

/**
 * Send SMS confirmation to all travelers in a booking
 */
export function sendSMSToAllTravelers(
  booking: BookingInfo,
  travelerDetails: TravelerInfo[]
): void {
  if (!travelerDetails || travelerDetails.length === 0) return;

  travelerDetails.forEach((traveler) => {
    if (traveler.phone && traveler.phone.replace(/[^0-9]/g, "").length >= 10) {
      sendSMSConfirmation(booking, traveler.phone, traveler.name);
    }
  });
}

/**
 * Log notification to localStorage history
 */
function logNotification(entry: Omit<NotificationLog, "id">): void {
  try {
    const key = "travellog_notifications";
    const existing: NotificationLog[] = JSON.parse(localStorage.getItem(key) || "[]");
    existing.unshift({ id: generateId(), ...entry });
    localStorage.setItem(key, JSON.stringify(existing.slice(0, 50)));
  } catch { /* ignore */ }
}

/**
 * Get notification history
 */
export function getNotificationHistory(): NotificationLog[] {
  try {
    return JSON.parse(localStorage.getItem("travellog_notifications") || "[]");
  } catch {
    return [];
  }
}
