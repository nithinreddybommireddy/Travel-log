export interface OfferCode {
  code: string;
  discountPercent: number;
  maxDiscount: number;
  minAmount: number;
  description: string;
  valid: boolean;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
}

export const offerCodes: OfferCode[] = [
  {
    code: "WELCOME50",
    discountPercent: 50,
    maxDiscount: 5000,
    minAmount: 5000,
    description: "50% off up to ₹5,000 on your first booking",
    valid: true,
    expiryDate: "2027-12-31",
    usageLimit: 10000,
    usedCount: 2341,
  },
  {
    code: "TRAVEL20",
    discountPercent: 20,
    maxDiscount: 3000,
    minAmount: 3000,
    description: "Flat 20% off up to ₹3,000 on any booking",
    valid: true,
    expiryDate: "2027-06-30",
    usageLimit: 5000,
    usedCount: 1567,
  },
  {
    code: "SUMMER25",
    discountPercent: 25,
    maxDiscount: 4000,
    minAmount: 8000,
    description: "Summer special — 25% off up to ₹4,000 on premium tours",
    valid: true,
    expiryDate: "2026-09-30",
    usageLimit: 3000,
    usedCount: 892,
  },
  {
    code: "GROUP10",
    discountPercent: 10,
    maxDiscount: 2000,
    minAmount: 10000,
    description: "Group booking discount — 10% off for 3+ travelers (up to ₹2,000)",
    valid: true,
    expiryDate: "2027-12-31",
    usageLimit: 2000,
    usedCount: 445,
  },
  {
    code: "HIMALAYA",
    discountPercent: 15,
    maxDiscount: 2500,
    minAmount: 15000,
    description: "Mountain explorer discount — 15% off on hill station tours",
    valid: true,
    expiryDate: "2026-12-31",
    usageLimit: 1500,
    usedCount: 678,
  },
  {
    code: "BEACH30",
    discountPercent: 30,
    maxDiscount: 6000,
    minAmount: 25000,
    description: "Beach paradise — 30% off up to ₹6,000 on international beach tours",
    valid: true,
    expiryDate: "2026-11-30",
    usageLimit: 1000,
    usedCount: 234,
  },
  {
    code: "FLAT1000",
    discountPercent: 0,
    maxDiscount: 1000,
    minAmount: 2000,
    description: "₹1,000 flat off on any booking above ₹2,000",
    valid: true,
    expiryDate: "2027-03-31",
    usageLimit: 5000,
    usedCount: 1234,
    // Special: this one gives a flat ₹1000 instead of percentage
  },
];

export const specialOffers = [
  {
    id: "early-bird",
    title: "Early Bird Discount",
    description: "Book 30+ days in advance and get 10% off automatically",
    icon: "🐦",
  },
  {
    id: "first-time",
    title: "First Time Traveler",
    description: "New to Travel Log? Use code WELCOME50 for 50% off up to ₹5,000",
    icon: "🎉",
  },
  {
    id: "referral",
    title: "Refer & Earn",
    description: "Refer a friend — both get ₹1,000 off on next booking",
    icon: "🤝",
  },
  {
    id: "festival",
    title: "Festive Season Offer",
    description: "Diwali, Holi & Christmas specials — up to 40% off on select tours",
    icon: "🎊",
  },
];

export function validateOfferCode(code: string, amount: number): { valid: boolean; discount: number; message: string; offer?: OfferCode } {
  const upperCode = code.toUpperCase().trim();
  const offer = offerCodes.find((o) => o.code === upperCode);

  if (!offer) {
    return { valid: false, discount: 0, message: "Invalid coupon code. Please try again." };
  }

  if (!offer.valid) {
    return { valid: false, discount: 0, message: "This coupon code has expired." };
  }

  const expiry = new Date(offer.expiryDate);
  if (expiry < new Date()) {
    return { valid: false, discount: 0, message: "This coupon code has expired." };
  }

  if (offer.usedCount >= offer.usageLimit) {
    return { valid: false, discount: 0, message: "This coupon code has reached its usage limit." };
  }

  if (amount < offer.minAmount) {
    return {
      valid: false, discount: 0,
      message: `Minimum order amount for this code is ₹${offer.minAmount.toLocaleString()}. Add ₹${(offer.minAmount - amount).toLocaleString()} more.`,
    };
  }

  let discount = 0;
  if (offer.code === "FLAT1000") {
    discount = Math.min(offer.maxDiscount, amount);
  } else {
    discount = Math.min(Math.round(amount * offer.discountPercent / 100), offer.maxDiscount);
  }

  return {
    valid: true,
    discount,
    message: `🎉 Coupon applied! You save ₹${discount.toLocaleString()}`,
    offer,
  };
}
