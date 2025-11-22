import { User, Bus, Booking } from '@/types';

const STORAGE_KEYS = {
  USERS: 'bus_app_users',
  BUSES: 'bus_app_buses',
  BOOKINGS: 'bus_app_bookings',
  CURRENT_USER: 'bus_app_current_user',
  THEME: 'bus_app_theme',
};

// Initialize default admin
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
