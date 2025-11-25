import { User, Bus, Booking } from '@/types';

const STORAGE_KEYS = {
  USERS: 'bus_app_users',
  BUSES: 'bus_app_buses',
  BOOKINGS: 'bus_app_bookings',
  CURRENT_USER: 'bus_app_current_user',
  THEME: 'bus_app_theme',
  VERIFICATION_CODES: 'bus_app_verification_codes',
  RESET_CODES: 'bus_app_reset_codes',
};

// Initialize default admin and sample data
export const initializeDefaultAdmin = () => {
  const users = getUsers();
  const adminExists = users.some(u => u.email === 'admin@gmail.com');
  
  if (!adminExists) {
    const admin: User = {
      id: 'admin-default-id',
      email: 'admin@gmail.com',
      name: 'Admin',
      role: 'admin',
    };
    users.push(admin);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }
};

// Initialize sample buses
export const initializeSampleData = () => {
  const buses = getBuses();
  
  if (buses.length === 0) {
    const sampleBuses: Bus[] = [
      {
        id: 'bus-1',
        busNumber: 'MH-12-AB-1234',
        busName: 'Volvo Multi-Axle',
        type: 'AC',
        seatType: 'Sleeper',
        from: 'Mumbai',
        to: 'Pune',
        departureTime: '22:00',
        arrivalTime: '02:00',
        price: 800,
        totalSeats: 40,
        seatLayout: {
          rows: 10,
          columns: 4,
          seats: Array.from({ length: 40 }, (_, i) => ({
            id: `seat-${Math.floor(i / 4)}-${i % 4}`,
            number: (i + 1).toString(),
            row: Math.floor(i / 4),
            col: i % 4,
            isEnabled: true,
          })),
        },
      },
      {
        id: 'bus-2',
        busNumber: 'KA-05-CD-5678',
        busName: 'Scania Metrolink',
        type: 'AC',
        seatType: 'Seater',
        from: 'Bangalore',
        to: 'Chennai',
        departureTime: '06:00',
        arrivalTime: '12:00',
        price: 600,
        totalSeats: 45,
        seatLayout: {
          rows: 11,
          columns: 4,
          seats: Array.from({ length: 44 }, (_, i) => ({
            id: `seat-${Math.floor(i / 4)}-${i % 4}`,
            number: (i + 1).toString(),
            row: Math.floor(i / 4),
            col: i % 4,
            isEnabled: true,
          })),
        },
      },
      {
        id: 'bus-3',
        busNumber: 'DL-01-EF-9012',
        busName: 'Ashok Leyland Luxury',
        type: 'Non-AC',
        seatType: 'Seater',
        from: 'Delhi',
        to: 'Jaipur',
        departureTime: '08:00',
        arrivalTime: '13:00',
        price: 400,
        totalSeats: 50,
        seatLayout: {
          rows: 12,
          columns: 4,
          seats: Array.from({ length: 48 }, (_, i) => ({
            id: `seat-${Math.floor(i / 4)}-${i % 4}`,
            number: (i + 1).toString(),
            row: Math.floor(i / 4),
            col: i % 4,
            isEnabled: true,
          })),
        },
      },
      {
        id: 'bus-4',
        busNumber: 'TN-09-GH-3456',
        busName: 'Mercedes Benz Seater',
        type: 'AC',
        seatType: 'Seater',
        from: 'Chennai',
        to: 'Bangalore',
        departureTime: '14:00',
        arrivalTime: '20:00',
        price: 650,
        totalSeats: 42,
        seatLayout: {
          rows: 10,
          columns: 4,
          seats: Array.from({ length: 40 }, (_, i) => ({
            id: `seat-${Math.floor(i / 4)}-${i % 4}`,
            number: (i + 1).toString(),
            row: Math.floor(i / 4),
            col: i % 4,
            isEnabled: true,
          })),
        },
      },
      {
        id: 'bus-5',
        busNumber: 'GJ-01-IJ-7890',
        busName: 'Tata Starbus',
        type: 'Non-AC',
        seatType: 'Seater',
        from: 'Ahmedabad',
        to: 'Mumbai',
        departureTime: '18:00',
        arrivalTime: '06:00',
        price: 500,
        totalSeats: 48,
        seatLayout: {
          rows: 12,
          columns: 4,
          seats: Array.from({ length: 48 }, (_, i) => ({
            id: `seat-${Math.floor(i / 4)}-${i % 4}`,
            number: (i + 1).toString(),
            row: Math.floor(i / 4),
            col: i % 4,
            isEnabled: true,
          })),
        },
      },
      {
        id: 'bus-6',
        busNumber: 'MH-02-KL-2468',
        busName: 'Volvo B11R Sleeper',
        type: 'AC',
        seatType: 'Sleeper',
        from: 'Pune',
        to: 'Goa',
        departureTime: '20:00',
        arrivalTime: '06:00',
        price: 900,
        totalSeats: 36,
        seatLayout: {
          rows: 9,
          columns: 4,
          seats: Array.from({ length: 36 }, (_, i) => ({
            id: `seat-${Math.floor(i / 4)}-${i % 4}`,
            number: (i + 1).toString(),
            row: Math.floor(i / 4),
            col: i % 4,
            isEnabled: true,
          })),
        },
      },
    ];
    
    saveBuses(sampleBuses);
  }
};

export const getUsers = (): User[] => {
  const data = localStorage.getItem(STORAGE_KEYS.USERS);
  return data ? JSON.parse(data) : [];
};

export const addUser = (user: User): void => {
  const users = getUsers();
  users.push(user);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const getCurrentUser = (): User | null => {
  const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return data ? JSON.parse(data) : null;
};

export const setCurrentUser = (user: User | null): void => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};

export const getBuses = (): Bus[] => {
  const data = localStorage.getItem(STORAGE_KEYS.BUSES);
  return data ? JSON.parse(data) : [];
};

export const saveBuses = (buses: Bus[]): void => {
  localStorage.setItem(STORAGE_KEYS.BUSES, JSON.stringify(buses));
};

export const addBus = (bus: Bus): void => {
  const buses = getBuses();
  buses.push(bus);
  saveBuses(buses);
};

export const updateBus = (id: string, updatedBus: Bus): void => {
  const buses = getBuses();
  const index = buses.findIndex(b => b.id === id);
  if (index !== -1) {
    buses[index] = updatedBus;
    saveBuses(buses);
  }
};

export const deleteBus = (id: string): void => {
  const buses = getBuses().filter(b => b.id !== id);
  saveBuses(buses);
};

export const getBookings = (): Booking[] => {
  const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
  return data ? JSON.parse(data) : [];
};

export const saveBookings = (bookings: Booking[]): void => {
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
};

export const addBooking = (booking: Booking): void => {
  const bookings = getBookings();
  bookings.push(booking);
  saveBookings(bookings);
};

export const updateBooking = (id: string, updatedBooking: Partial<Booking>): void => {
  const bookings = getBookings();
  const index = bookings.findIndex(b => b.id === id);
  if (index !== -1) {
    bookings[index] = { ...bookings[index], ...updatedBooking };
    saveBookings(bookings);
  }
};

export const getTheme = (): string => {
  return localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
};

export const setTheme = (theme: string): void => {
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
};

// Email Verification Functions
interface VerificationCode {
  email: string;
  code: string;
  timestamp: number;
}

const generateCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const createVerificationCode = (email: string): string => {
  const codes: VerificationCode[] = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.VERIFICATION_CODES) || '[]'
  );
  
  const code = generateCode();
  const newCode: VerificationCode = {
    email,
    code,
    timestamp: Date.now(),
  };
  
  // Remove existing codes for this email
  const filteredCodes = codes.filter(c => c.email !== email);
  filteredCodes.push(newCode);
  
  localStorage.setItem(STORAGE_KEYS.VERIFICATION_CODES, JSON.stringify(filteredCodes));
  return code;
};

export const verifyEmailCode = (email: string, code: string): boolean => {
  const codes: VerificationCode[] = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.VERIFICATION_CODES) || '[]'
  );
  
  const userCode = codes.find(c => c.email === email && c.code === code);
  if (!userCode) return false;
  
  // Code expires after 10 minutes
  const isExpired = Date.now() - userCode.timestamp > 10 * 60 * 1000;
  if (isExpired) return false;
  
  // Mark user as verified
  const users = getUsers();
  const user = users.find(u => u.email === email);
  if (user) {
    user.emailVerified = true;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }
  
  // Remove the used code
  const filteredCodes = codes.filter(c => c.email !== email);
  localStorage.setItem(STORAGE_KEYS.VERIFICATION_CODES, JSON.stringify(filteredCodes));
  
  return true;
};

export const resendVerificationCode = (email: string): string => {
  return createVerificationCode(email);
};

// Password Reset Functions
interface ResetCode {
  email: string;
  code: string;
  timestamp: number;
}

export const requestPasswordReset = (email: string): string | null => {
  const users = getUsers();
  const user = users.find(u => u.email === email);
  
  if (!user) return null;
  
  const codes: ResetCode[] = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.RESET_CODES) || '[]'
  );
  
  const code = generateCode();
  const newCode: ResetCode = {
    email,
    code,
    timestamp: Date.now(),
  };
  
  // Remove existing codes for this email
  const filteredCodes = codes.filter(c => c.email !== email);
  filteredCodes.push(newCode);
  
  localStorage.setItem(STORAGE_KEYS.RESET_CODES, JSON.stringify(filteredCodes));
  return code;
};

export const verifyResetCode = (email: string, code: string): boolean => {
  const codes: ResetCode[] = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.RESET_CODES) || '[]'
  );
  
  const resetCode = codes.find(c => c.email === email && c.code === code);
  if (!resetCode) return false;
  
  // Code expires after 10 minutes
  const isExpired = Date.now() - resetCode.timestamp > 10 * 60 * 1000;
  return !isExpired;
};

export const resetPassword = (email: string, code: string, newPassword: string): boolean => {
  if (!verifyResetCode(email, code)) return false;
  
  const users = getUsers();
  const user = users.find(u => u.email === email);
  
  if (!user) return false;
  
  // In a real app, hash the password
  user.password = newPassword;
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  
  // Remove the used code
  const codes: ResetCode[] = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.RESET_CODES) || '[]'
  );
  const filteredCodes = codes.filter(c => c.email !== email);
  localStorage.setItem(STORAGE_KEYS.RESET_CODES, JSON.stringify(filteredCodes));
  
  return true;
};
