import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Bus, Calendar, MapPin, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getBookings, updateBooking } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

const MyBookings = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  
  const bookings = getBookings().filter(b => b.userId === user?.id);

  const handleCancelBooking = (bookingId: string) => {
    updateBooking(bookingId, { status: 'cancelled' });
    toast({
      title: "Booking Cancelled",
      description: "Your booking has been cancelled successfully",
    });
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/search')}>
            <Bus className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">BusBooking</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/search')}>
              Search Buses
            </Button>
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4" />
              <span className="hidden md:inline">{user?.name}</span>
            </div>
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <h2 className="text-3xl font-bold mb-2">My Bookings</h2>
          <p className="text-muted-foreground">View and manage your bus bookings</p>
        </div>

        <div className="space-y-4">
          {bookings.length === 0 ? (
            <Card className="animate-fade-in">
              <CardContent className="py-12 text-center">
                <Bus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
                <p className="text-muted-foreground mb-4">Start booking your bus tickets</p>
                <Button onClick={() => navigate('/search')}>
                  Search Buses
                </Button>
              </CardContent>
            </Card>
          ) : (
            bookings.map((booking, index) => (
              <Card key={booking.id} className="animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          booking.status === 'confirmed' 
                            ? 'bg-green-500/10 text-green-500' 
                            : 'bg-red-500/10 text-red-500'
                        }`}>
                          {booking.status.toUpperCase()}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-2">Booking ID: {booking.bookingId}</h3>
                      <div className="space-y-1 text-sm">
                        <p className="flex items-center gap-2">
                          <Bus className="h-4 w-4 text-muted-foreground" />
                          {booking.busNumber}
                        </p>
                        <p className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          {booking.from} → {booking.to}
                        </p>
                        <p className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {booking.date} at {booking.departureTime}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 md:items-end">
                      <div>
                        <p className="text-sm text-muted-foreground">Seats</p>
                        <p className="font-semibold">{booking.seats.join(', ')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Amount</p>
                        <p className="text-2xl font-bold text-primary">₹{booking.totalAmount}</p>
                      </div>
                      {booking.status === 'confirmed' && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleCancelBooking(booking.id)}
                        >
                          Cancel Booking
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default MyBookings;
