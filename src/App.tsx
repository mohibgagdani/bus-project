import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/user/Login";
import Signup from "./pages/user/Signup";
import SearchBuses from "./pages/user/SearchBuses";
import AdminDashboard from "./pages/admin/Dashboard";
import BusManagement from "./pages/admin/BusManagement";
import BookingManagement from "./pages/admin/BookingManagement";
import CustomerManagement from "./pages/admin/CustomerManagement";
import PaymentManagement from "./pages/admin/PaymentManagement";
import BusResults from "./pages/user/BusResults";
import SeatSelection from "./pages/user/SeatSelection";
import Payment from "./pages/user/Payment";
import MyBookings from "./pages/user/MyBookings";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) => {
  const { user, isAdmin } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (adminOnly && !isAdmin) {
    return <Navigate to="/search" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { user, isAdmin } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={user ? (isAdmin ? <Navigate to="/admin" replace /> : <Navigate to="/search" replace />) : <Login />} />
      <Route path="/signup" element={user ? <Navigate to="/search" replace /> : <Signup />} />
      <Route path="/search" element={<ProtectedRoute><SearchBuses /></ProtectedRoute>} />
      <Route path="/buses" element={<ProtectedRoute><BusResults /></ProtectedRoute>} />
      <Route path="/seats" element={<ProtectedRoute><SeatSelection /></ProtectedRoute>} />
      <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
      <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/buses" element={<ProtectedRoute adminOnly><BusManagement /></ProtectedRoute>} />
      <Route path="/admin/bookings" element={<ProtectedRoute adminOnly><BookingManagement /></ProtectedRoute>} />
      <Route path="/admin/customers" element={<ProtectedRoute adminOnly><CustomerManagement /></ProtectedRoute>} />
      <Route path="/admin/payments" element={<ProtectedRoute adminOnly><PaymentManagement /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
