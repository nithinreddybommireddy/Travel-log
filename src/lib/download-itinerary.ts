interface BookingData {
  id: string;
  tourName: string;
  travelers: number;
  startDate: string;
  totalPaid: number;
  discount: number;
  coupon: string | null;
  bookedAt: number;
  status: string;
}

interface TourData {
  name: string;
  subtitle: string;
  description: string;
  longDescription: string;
  image: string;
  location: string;
  duration: string;
  price: number;
  difficulty: string;
  maxPeople: number;
  accommodation: string;
  highlights: string[];
  itinerary: { day: string; description: string }[];
  rating: number;
  reviews: number;
  bestSeason: string;
  coordinates: { lat: number; lng: number };
  nearestAirport: string;
  languages: string[];
  currency: string;
  timeZone: string;
  knownFor: string[];
}

export function downloadItinerary(booking: BookingData, tour: TourData): void {
  const bookingDate = new Date(booking.bookedAt).toLocaleDateString("en-IN", {
    year: "numeric", month: "long", day: "numeric",
  });
  const bookingTime = new Date(booking.bookedAt).toLocaleTimeString("en-IN", {
    hour: "2-digit", minute: "2-digit",
  });

  const highlightItems = tour.highlights.map((h) => `<li>${h}</li>`).join("\n");

  const itineraryItems = tour.itinerary.map((item, i) => `
    <div style="display:flex;gap:16px;margin-bottom:16px;padding:12px 16px;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;">
      <div style="display:flex;flex-direction:column;align-items:center;min-width:40px;">
        <div style="width:12px;height:12px;border-radius:50%;background:#f59e0b;flex-shrink:0;"></div>
        ${i < tour.itinerary.length - 1 ? '<div style="width:1px;flex:1;background:#e2e8f0;"></div>' : ""}
      </div>
      <div>
        <div style="font-weight:600;font-size:14px;color:#f59e0b;margin-bottom:4px;">${item.day}</div>
        <div style="font-size:13px;color:#64748b;">${item.description}</div>
      </div>
    </div>
  `).join("\n");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${tour.name} Itinerary - Travel Log</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Playfair+Display:wght@600;700;800&display=swap');
    * { margin:0; padding:0; box-sizing:border-box; }
    body {
      font-family: 'Inter', -apple-system, sans-serif;
      color: #1e293b;
      background: #ffffff;
      line-height: 1.6;
      padding: 0;
    }
    .container { max-width: 800px; margin: 0 auto; padding: 40px 32px; }

    /* Header */
    .header {
      text-align: center;
      padding-bottom: 32px;
      border-bottom: 2px solid #f59e0b;
      margin-bottom: 32px;
    }
    .header h1 {
      font-family: 'Playfair Display', serif;
      font-size: 36px;
      font-weight: 800;
      color: #1e293b;
      margin-bottom: 4px;
    }
    .header .subtitle {
      font-size: 16px;
      color: #64748b;
      margin-bottom: 16px;
    }
    .header .booking-id {
      display: inline-block;
      background: #f59e0b;
      color: white;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.5px;
    }

    /* Status Bar */
    .status-bar {
      display: flex;
      justify-content: center;
      gap: 32px;
      padding: 20px;
      background: #f8fafc;
      border-radius: 12px;
      margin-bottom: 32px;
      border: 1px solid #e2e8f0;
      flex-wrap: wrap;
    }
    .status-item { text-align: center; }
    .status-item .label { font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; }
    .status-item .value { font-size: 16px; font-weight: 600; color: #1e293b; margin-top: 2px; }

    /* Section Headers */
    .section-title {
      font-family: 'Playfair Display', serif;
      font-size: 22px;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid #e2e8f0;
    }

    /* Description */
    .description {
      font-size: 14px;
      color: #475569;
      line-height: 1.8;
      margin-bottom: 32px;
    }

    /* Highlights */
    .highlights {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-bottom: 32px;
      list-style: none;
    }
    .highlights li {
      padding: 10px 14px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 13px;
      color: #475569;
    }
    .highlights li::before { content: "✓ "; color: #f59e0b; font-weight: 700; }

    /* Itinerary */
    .itinerary { margin-bottom: 32px; }

    /* Info Grid */
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 32px;
    }
    .info-item {
      padding: 12px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
    }
    .info-item .label { font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; }
    .info-item .value { font-size: 14px; font-weight: 500; color: #1e293b; margin-top: 2px; }

    /* Known For */
    .known-for {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-bottom: 32px;
    }
    .known-for span {
      padding: 6px 14px;
      background: #fef3c7;
      color: #92400e;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
    }

    /* Price Box */
    .price-box {
      text-align: center;
      padding: 24px;
      background: linear-gradient(135deg, #fef3c7, #fde68a);
      border-radius: 12px;
      margin-bottom: 32px;
    }
    .price-box .amount { font-size: 28px; font-weight: 800; color: #1e293b; }
    .price-box .label { font-size: 13px; color: #92400e; margin-top: 2px; }
    .price-box .discount { font-size: 13px; color: #059669; margin-top: 4px; font-weight: 500; }

    /* Footer */
    .footer {
      text-align: center;
      padding-top: 24px;
      border-top: 1px solid #e2e8f0;
      font-size: 12px;
      color: #94a3b8;
    }
    .footer .brand { font-weight: 700; color: #f59e0b; }

    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .no-print { display: none !important; }
      @page { margin: 20mm 15mm; }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>${tour.name}</h1>
      <div class="subtitle">${tour.subtitle} — ${tour.location}</div>
      <div class="booking-id">BOOKING #${booking.id.slice(0, 8).toUpperCase()}</div>
    </div>

    <!-- Status Bar -->
    <div class="status-bar">
      <div class="status-item">
        <div class="label">Status</div>
        <div class="value" style="color:#059669;">${booking.status.toUpperCase()}</div>
      </div>
      <div class="status-item">
        <div class="label">Start Date</div>
        <div class="value">${booking.startDate}</div>
      </div>
      <div class="status-item">
        <div class="label">Travelers</div>
        <div class="value">${booking.travelers}</div>
      </div>
      <div class="status-item">
        <div class="label">Duration</div>
        <div class="value">${tour.duration}</div>
      </div>
      <div class="status-item">
        <div class="label">Booked On</div>
        <div class="value">${bookingDate}</div>
      </div>
    </div>

    <!-- Price Box -->
    <div class="price-box">
      <div class="amount">₹${booking.totalPaid.toLocaleString()}</div>
      <div class="label">Total Amount Paid</div>
      ${booking.discount > 0 ? `<div class="discount">✓ Saved ₹${booking.discount.toLocaleString()}${booking.coupon ? " with code " + booking.coupon : ""}</div>` : ""}
    </div>

    <!-- Description -->
    <h2 class="section-title">About This Journey</h2>
    <p class="description">${tour.longDescription}</p>

    <!-- Highlights -->
    <h2 class="section-title">Tour Highlights</h2>
    <ul class="highlights">${highlightItems}</ul>

    <!-- Itinerary -->
    <h2 class="section-title">Full Itinerary — ${tour.duration}</h2>
    <div class="itinerary">${itineraryItems}</div>

    <!-- Location Details -->
    <h2 class="section-title">Location Information</h2>
    <div class="info-grid">
      <div class="info-item">
        <div class="label">Location</div>
        <div class="value">${tour.location}</div>
      </div>
      <div class="info-item">
        <div class="label">Difficulty</div>
        <div class="value" style="text-transform:capitalize">${tour.difficulty}</div>
      </div>
      <div class="info-item">
        <div class="label">Accommodation</div>
        <div class="value">${tour.accommodation}</div>
      </div>
      <div class="info-item">
        <div class="label">Best Season</div>
        <div class="value">${tour.bestSeason}</div>
      </div>
      <div class="info-item">
        <div class="label">Nearest Airport</div>
        <div class="value">${tour.nearestAirport}</div>
      </div>
      <div class="info-item">
        <div class="label">Languages</div>
        <div class="value">${tour.languages.join(", ")}</div>
      </div>
      <div class="info-item">
        <div class="label">Currency</div>
        <div class="value">${tour.currency}</div>
      </div>
      <div class="info-item">
        <div class="label">Time Zone</div>
        <div class="value">${tour.timeZone}</div>
      </div>
    </div>

    <!-- Known For -->
    <h2 class="section-title">Known For</h2>
    <div class="known-for">
      ${tour.knownFor.map((k) => `<span>${k}</span>`).join("\n")}
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>Generated by <span class="brand">Travel Log</span> — ${bookingDate} at ${bookingTime}</p>
      <p style="margin-top:4px;">Booking ID: #${booking.id.slice(0, 8).toUpperCase()} | ${tour.location}</p>
    </div>
  </div>
</body>
</html>`;

  // Create blob and download
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${tour.name.replace(/\s+/g, "_")}_Itinerary.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
