import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';
import { getBuses } from '@/lib/storage';
import { Bus } from '@/types';
import { MapPin, Clock, IndianRupee, Bus as BusIcon } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const [buses, setBuses] = useState<Bus[]>([]);
  const [routes, setRoutes] = useState<{ from: string; to: string; count: number }[]>([]);

  useEffect(() => {
    const allBuses = getBuses();
    setBuses(allBuses);

    // Get unique routes
    const routeMap = new Map<string, number>();
    allBuses.forEach(bus => {
      const key = `${bus.from}-${bus.to}`;
      routeMap.set(key, (routeMap.get(key) || 0) + 1);
    });

    const uniqueRoutes = Array.from(routeMap.entries()).map(([key, count]) => {
      const [from, to] = key.split('-');
      return { from, to, count };
    });

    setRoutes(uniqueRoutes);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BusIcon className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">BusBooking</h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button onClick={() => navigate('/login')} variant="outline">Login</Button>
            <Button onClick={() => navigate('/signup')}>Sign Up</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Book Your Bus Tickets Online
          </h2>
          <p className="text-xl text-muted-foreground mb-8 animate-fade-in">
            Fast, Safe, and Reliable Bus Booking Platform
          </p>
          <Button size="lg" onClick={() => navigate('/login')} className="animate-scale-in">
            Book Now
          </Button>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold mb-8 text-center">Popular Routes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {routes.slice(0, 6).map((route, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer" onClick={() => navigate('/login')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    {route.from} → {route.to}
                  </CardTitle>
                  <CardDescription>{route.count} buses available</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Available Buses */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold mb-8 text-center">Available Buses</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {buses.slice(0, 6).map((bus) => (
              <Card key={bus.id} className="hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{bus.busName}</span>
                    <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">{bus.type}</span>
                  </CardTitle>
                  <CardDescription>{bus.busNumber}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{bus.from} → {bus.to}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{bus.departureTime} - {bus.arrivalTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-lg font-bold">
                      <IndianRupee className="h-5 w-5" />
                      {bus.price}
                    </div>
                    <Button onClick={() => navigate('/login')}>Book Now</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 BusBooking. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
