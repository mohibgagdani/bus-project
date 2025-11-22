import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Bus, Clock, MapPin, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getBuses, getBookings } from '@/lib/storage';

const BusResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const date = searchParams.get('date');

  const allBuses = getBuses();
  const bookings = getBookings().filter(b => b.status === 'confirmed');
  
  const filteredBuses = allBuses.filter(bus => 
    bus.from.toLowerCase().includes(from?.toLowerCase() || '') &&
    bus.to.toLowerCase().includes(to?.toLowerCase() || '')
  );

  const getAvailableSeats = (busId: string) => {
    const busBookings = bookings.filter(b => b.busId === busId && b.date === date);
    const bookedSeats = busBookings.flatMap(b => b.seats);
    const bus = allBuses.find(b => b.id === busId);
    return bus ? bus.totalSeats - bookedSeats.length : 0;
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
        <div className="mb-6 animate-fade-in">
          <Button variant="ghost" onClick={() => navigate('/search')} className="mb-4">
            ← Back to Search
          </Button>
          <div className="flex items-center gap-4 text-sm bg-card p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="font-medium">{from}</span>
            </div>
            <div className="text-muted-foreground">→</div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="font-medium">{to}</span>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{date}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredBuses.length === 0 ? (
            <Card className="animate-fade-in">
              <CardContent className="py-12 text-center">
                <Bus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No buses found</h3>
                <p className="text-muted-foreground">Try adjusting your search criteria</p>
              </CardContent>
            </Card>
          ) : (
            filteredBuses.map((bus, index) => {
              const availableSeats = getAvailableSeats(bus.id);
              return (
                <Card key={bus.id} className="animate-scale-in hover:shadow-lg transition-shadow" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">{bus.busName}</h3>
                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Bus className="h-4 w-4" />
                            {bus.busNumber}
                          </span>
                          <span className="px-2 py-1 bg-primary/10 text-primary rounded">
                            {bus.type}
                          </span>
                          <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded">
                            {bus.seatType}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold">{bus.departureTime}</p>
                          <p className="text-xs text-muted-foreground">{bus.from}</p>
                        </div>
                        <div className="text-muted-foreground">→</div>
                        <div className="text-center">
                          <p className="text-2xl font-bold">{bus.arrivalTime}</p>
                          <p className="text-xs text-muted-foreground">{bus.to}</p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">₹{bus.price}</p>
                          <p className="text-xs text-muted-foreground">per seat</p>
                        </div>
                        <p className={`text-sm ${availableSeats > 10 ? 'text-green-500' : 'text-orange-500'}`}>
                          {availableSeats} seats left
                        </p>
                        <Button 
                          onClick={() => navigate(`/seats?busId=${bus.id}&date=${date}`)}
                          disabled={availableSeats === 0}
                        >
                          View Seats
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
};

export default BusResults;
