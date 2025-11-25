export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  emailVerified?: boolean;
  password?: string;
}

export interface Bus {
  id: string;
  busNumber: string;
  busName: string;
  type: 'AC' | 'Non-AC';
  seatType: 'Sleeper' | 'Seater';
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  totalSeats: number;
  seatLayout: SeatLayout;
  operatingDays?: string[];
  availableDates?: string[];
}

export interface SeatLayout {
  rows: number;
  columns: number;
  seats: Seat[];
}

export interface Seat {
  id: string;
  number: string;
  row: number;
  col: number;
  isEnabled: boolean;
}

export interface Booking {
  id: string;
  bookingId: string;
  transactionId: string;
  userId: string;
  busId: string;
  busNumber: string;
  seats: string[];
  totalAmount: number;
  from: string;
  to: string;
  date: string;
  departureTime: string;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface SearchParams {
  from: string;
  to: string;
  date: string;
}
