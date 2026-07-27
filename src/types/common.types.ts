export interface User {
  id: string;
  name: string;
  email: string;
}

export interface TravelerInfo {
  name: string;
  age: string;
  phone: string;
}

export interface Booking {
  id: string;
  tourId: string;
  tourName: string;
  travelers: number;
  startDate: string;
  totalPaid: number;
  discount: number;
  coupon: string | null;
  bookedAt: number;
  status: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  travelerDetails?: TravelerInfo[];
}

export type Theme = "dark" | "light";
