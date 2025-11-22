import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Bus, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getBuses, getBookings } from '@/lib/storage';
import { cn } from '@/lib/utils';

const SeatSelection = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const busId = searchParams.get('busId');
  const date = searchParams.get('date');
  
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const bus = getBuses().find(b => b.id === busId);
  const bookings = getBookings().filter(b => b.status === 'confirmed');
  const bookedSeats = bookings
    .filter(b => b.busId === busId && b.date === date)
    .flatMap(b => b.seats);

  if (!bus) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Bus not found</p>
      </div>
    );
  }

  const handleSeatClick = (seatNumber: string) => {
    if (bookedSeats.includes(seatNumber)) return;
    
    setSelectedSeats(prev => 
      prev.includes(seatNumber)
        ? prev.filter(s => s !== seatNumber)
        : [...prev, seatNumber]
    );
  };

  const totalAmount = selectedSeats.length * bus.price;

  const handleProceedToPay = () => {
    if (selectedSeats.length === 0) return;
    
    const bookingData = {
      busId: bus.id,
      busNumber: bus.busNumber,
      from: bus.from,
      to: bus.to,
      date: date || '',
      departureTime: bus.departureTime,
      seats: selectedSeats,
      totalAmount,
    };
    
    navigate('/payment', { state: bookingData });
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
            <Button variant="ghost" onClick={() => navigate('/my-bookings')}>
              My Bookings
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
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          ← Back
        </Button>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Select Your Seats</CardTitle>
                <div className="text-sm text-muted-foreground">
                  {bus.busName} - {bus.busNumber}
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-6 flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 border-2 border-border rounded"></div>
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded"></div>
                    <span>Selected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-muted rounded"></div>
                    <span>Booked</span>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-4 p-8 bg-gradient-to-b from-muted/50 to-background rounded-lg">
                  <div className="text-sm font-medium mb-4">Driver</div>
                  <div className="grid gap-3" style={{ 
                    gridTemplateColumns: `repeat(${bus.seatLayout.columns}, 1fr)` 
                  }}>
                    {bus.seatLayout.seats.map((seat) => {
                      if (!seat.isEnabled) {
                        return <div key={seat.id} className="w-12 h-12" />;
                      }
                      
                      const isBooked = bookedSeats.includes(seat.number);
                      const isSelected = selectedSeats.includes(seat.number);
                      
                      return (
                        <button
                          key={seat.id}
                          onClick={() => handleSeatClick(seat.number)}
                          disabled={isBooked}
                          className={cn(
                            "w-12 h-12 rounded transition-all hover:scale-110",
                            isBooked && "bg-muted cursor-not-allowed",
                            isSelected && "bg-primary text-primary-foreground scale-110",
                            !isBooked && !isSelected && "border-2 border-border hover:border-primary"
                          )}
                        >
                          {seat.number}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="animate-scale-in sticky top-24">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Selected Seats</p>
                  <p className="text-lg font-semibold">
                    {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Seats</p>
                  <p className="text-lg font-semibold">{selectedSeats.length}</p>
                </div>
                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-2xl font-bold text-primary">₹{totalAmount}</p>
                </div>
                <Button 
                  onClick={handleProceedToPay}
                  disabled={selectedSeats.length === 0}
                  className="w-full"
                  size="lg"
                >
                  Proceed to Pay
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SeatSelection;
