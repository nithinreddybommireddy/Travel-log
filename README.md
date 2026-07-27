# 🌍 Travel Log

<p align="center">
  <strong>Discover. Explore. Book. Travel.</strong>
</p>

<p align="center">
  A modern full-stack travel booking application built with
  <strong>React, TypeScript, Convex, and Tailwind CSS</strong>.
</p>

---

## 📖 About the Project

**Travel Log** is a modern travel discovery and booking web application designed to help users explore beautiful destinations across India.

Users can create an account, browse available tours, view detailed itineraries, save their favorite destinations, book trips, apply coupons, and receive booking confirmation emails.

The application is built with a responsive and modern UI to provide a smooth experience across desktop, tablet, and mobile devices.

---

## ✨ Features

### 🏠 Landing Page
- Modern hero section
- Popular tour destinations
- Traveler stories
- Travel inspiration sections
- Contact form
- Responsive navigation

### 🔐 Authentication
- User registration
- User login
- Password-based authentication
- Protected application routes
- Authentication powered by Convex Auth

### 🗺️ Tour Discovery
- Browse available destinations
- Search tours
- Filter tours by difficulty
- View tour pricing
- View trip duration
- Responsive tour cards

### 📍 Tour Details
Each destination contains detailed information such as:

- Tour overview
- Destination information
- Trip duration
- Difficulty level
- Pricing
- Highlights
- Day-by-day itinerary
- Booking option

### ❤️ Saved Tours
Authenticated users can:

- Save favorite tours
- Remove saved tours
- View saved destinations
- Store saved tours using Convex

### 🎫 Tour Booking
Users can book their preferred tour by providing:

- Traveler information
- Travel date
- Number of travelers
- Contact information
- Coupon code
- Booking details

The booking flow calculates the final amount based on the selected tour and applicable discounts.

### 🏷️ Coupon & Discount Support
The booking system supports:

- Coupon codes
- Discount calculation
- Final price calculation
- Booking summary

### 📧 Booking Confirmation Email
After completing a booking, users can receive a confirmation email containing:

- Booking ID
- Traveler name
- Tour name
- Tour location
- Start date
- Number of travelers
- Traveler details
- Coupon
- Discount
- Total amount paid
- Booking status

Email notifications are handled using **EmailJS**.

### 📱 Responsive Design
The application is designed for:

- 💻 Desktop
- 💻 Laptop
- 📱 Tablet
- 📱 Mobile

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Frontend | React 19 |
| Language | TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Backend | Convex |
| Database | Convex Database |
| Authentication | Convex Auth |
| Email Service | EmailJS |
| UI Components | shadcn/ui |
| Icons | Lucide React |

---

## 🗺️ Available Destinations

| Destination | Duration | Difficulty | Price |
|---|---:|---|---:|
| 🏔️ Manali | 7 Days | Medium | ₹20,000 |
| 🏖️ Goa | 6 Days | Easy | ₹15,000 |
| 🌿 Munnar | 7 Days | Easy | ₹20,000 |
| ⛰️ Araku Valley | 5 Days | Easy | ₹10,000 |
| 🌊 Pondicherry | 7 Days | Easy | ₹15,000 |
| 🛕 Kedarnath | 7 Days | Hard | ₹25,000 |

---

## 📂 Project Structure

```text
Travel-log/
│
├── public/
│   └── tours/
│
├── src/
│   │
│   ├── components/
│   │   ├── landing/
│   │   ├── layout/
│   │   └── ui/
│   │
│   ├── data/
│   │   └── tours.ts
│   │
│   ├── pages/
│   │
│   ├── services/
│   │   └── emailjsService.ts
│   │
│   ├── lib/
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── convex/
│   ├── auth.ts
│   ├── auth.config.ts
│   ├── schema.ts
│   └── savedTours.ts
│
├── .env.local
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Before running the project, make sure you have installed:

- Node.js 18+ or Bun
- Git
- A Convex account
- An EmailJS account

---

## 📥 Installation

### 1. Clone the Repository

```bash
git clone <your-repository-url>
```

Move into the project:

```bash
cd Travel-log
```

---

### 2. Install Dependencies

Using Bun:

```bash
bun install
```

Or using npm:

```bash
npm install
```

---

### 3. Configure Convex

Start the Convex development environment:

```bash
bunx convex dev
```

Or:

```bash
npx convex dev
```

Convex will configure the development deployment and generate the required environment information.

---

## 🔐 Environment Variables

Create a `.env.local` file in the project root:

```text
Travel-log/
├── .env.local
├── package.json
├── vite.config.ts
└── src/
```

Add the following variables:

```env
VITE_CONVEX_URL=your_convex_url

VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

> ⚠️ Never commit `.env.local` to GitHub.

Make sure your `.gitignore` contains:

```gitignore
.env
.env.local
.env.*.local
```

---

## 📧 EmailJS Configuration

Travel Log uses EmailJS to send booking confirmation emails.

The booking confirmation template can contain variables such as:

```text
{{to_email}}
{{to_name}}
{{tour_name}}
{{tour_location}}
{{start_date}}
{{travelers}}
{{total_paid}}
{{discount}}
{{coupon}}
{{booking_id}}
{{status}}
{{traveler_details}}
```

These values are dynamically populated when a user completes a booking.

---

## ▶️ Run the Application

Start the Convex backend:

```bash
bunx convex dev
```

Then start the Vite development server:

```bash
bun run dev
```

Or with npm:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

---

## 🏗️ Production Build

Create an optimized production build:

```bash
bun run build
```

Or:

```bash
npm run build
```

The production files will be generated inside:

```text
dist/
```

---

## 🔄 Application Flow

```text
Landing Page
      │
      ▼
Sign Up / Sign In
      │
      ▼
Tours Dashboard
      │
      ├──────────────► Save Tour
      │                    │
      │                    ▼
      │               Saved Tours
      │
      ▼
Tour Details
      │
      ▼
Book Tour
      │
      ▼
Traveler Details
      │
      ▼
Apply Coupon
      │
      ▼
Booking Summary
      │
      ▼
Confirm Booking
      │
      ├──────────────► Store Booking
      │
      └──────────────► EmailJS
                            │
                            ▼
                  Booking Confirmation
```

---

## 🔒 Security

Sensitive configuration should be stored using environment variables.

Do not commit files containing credentials or environment-specific configuration.

```gitignore
.env
.env.local
.env.*.local
```

> Note: Variables prefixed with `VITE_` are available to client-side code. Never place true server-side secrets in `VITE_*` variables.

---

## 🔮 Future Enhancements

Planned improvements include:

- 💳 Online payment integration
- 📜 User booking history
- ❌ Booking cancellation
- ⭐ Tour ratings and reviews
- 👤 User profile management
- 🧾 Downloadable booking invoice
- 🔔 Booking notifications
- 🗺️ Interactive maps
- 🌦️ Destination weather information
- 🤖 AI-based travel recommendations
- 📊 Admin dashboard
- ➕ Dynamic tour management

---

## 🎯 Project Goals

Travel Log was developed to demonstrate practical full-stack development concepts including:

- Component-based React architecture
- Type-safe development with TypeScript
- Responsive UI development
- Authentication and protected routes
- Database integration
- Serverless backend development
- State management
- Third-party service integration
- Email notifications
- Real-world booking workflows

---

## 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

1. Fork the repository
2. Create a new branch

```bash
git checkout -b feature/your-feature
```

3. Commit your changes

```bash
git commit -m "Add new feature"
```

4. Push your branch

```bash
git push origin feature/your-feature
```

5. Create a Pull Request

---

## 📄 License

This project is intended for educational and portfolio purposes.

---

<p align="center">
  Made with ❤️ using React, TypeScript, Convex & Tailwind CSS
</p>

<p align="center">
  🌍 <strong>Travel Log — Discover Your Next Adventure</strong>
</p>
