interface EmailLog {
  id: string;
  type: "contact" | "newsletter";
  recipient: string;
  subject: string;
  sentAt: number;
}

function generateId(): string {
  return (
    Date.now().toString(36) +
    Math.random().toString(36).slice(2, 8)
  );
}

/**
 * Contact form email
 *
 * Currently uses the user's default email application.
 */
export function sendContactEmail(
  name: string,
  email: string,
  phone: string,
  message: string
): void {
  const subjectText = `Travel Inquiry from ${name}`;

  const subject = encodeURIComponent(subjectText);

  const body = encodeURIComponent(
    `Travel Log - New Travel Inquiry\n` +
      `──────────────────────────────\n\n` +
      `Name: ${name}\n` +
      `Email: ${email}\n` +
      `Phone: ${phone}\n\n` +
      `Message:\n${message}\n\n` +
      `──────────────────────────────\n` +
      `Sent via Travel Log Contact Form`
  );

  window.open(
    `mailto:hello@travellog.com?subject=${subject}&body=${body}`,
    "_blank"
  );

  logEmail({
    type: "contact",
    recipient: "hello@travellog.com",
    subject: subjectText,
    sentAt: Date.now(),
  });
}

/**
 * Newsletter subscription
 */
export function subscribeNewsletter(
  email: string
): {
  success: boolean;
  message: string;
} {
  const key = "travellog_newsletter";

  try {
    const existing: string[] = JSON.parse(
      localStorage.getItem(key) || "[]"
    );

    if (existing.includes(email)) {
      return {
        success: false,
        message: "You're already subscribed!",
      };
    }

    existing.unshift(email);

    localStorage.setItem(
      key,
      JSON.stringify(existing)
    );

    logEmail({
      type: "newsletter",
      recipient: email,
      subject: "Welcome to Travel Log Newsletter!",
      sentAt: Date.now(),
    });

    return {
      success: true,
      message: "Welcome aboard! You're now subscribed.",
    };
  } catch (error) {
    console.error(
      "[Newsletter] Subscription error:",
      error
    );

    return {
      success: false,
      message: "Could not subscribe. Please try again.",
    };
  }
}

/**
 * Store email activity locally
 */
function logEmail(
  entry: Omit<EmailLog, "id">
): void {
  const key = "travellog_emails";

  try {
    const existing: EmailLog[] = JSON.parse(
      localStorage.getItem(key) || "[]"
    );

    existing.unshift({
      id: generateId(),
      ...entry,
    });

    localStorage.setItem(
      key,
      JSON.stringify(existing.slice(0, 50))
    );
  } catch (error) {
    console.error(
      "[Email Log] Failed to save:",
      error
    );
  }
}

/**
 * Get email history
 */
export function getEmailHistory(): EmailLog[] {
  try {
    return JSON.parse(
      localStorage.getItem("travellog_emails") || "[]"
    );
  } catch {
    return [];
  }
}

/**
 * Get newsletter subscriber count
 */
export function getNewsletterCount(): number {
  try {
    const subscribers: string[] = JSON.parse(
      localStorage.getItem("travellog_newsletter") || "[]"
    );

    return subscribers.length;
  } catch {
    return 0;
  }
}