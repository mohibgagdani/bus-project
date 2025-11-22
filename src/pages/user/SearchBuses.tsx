import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Bus, Calendar, MapPin, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const SearchBuses = () => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/buses?from=${from}&to=${to}&date=${date}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-background">
      <header className="border-b border-border bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bus className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">BusBooking</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/my-bookings')}>
              My Bookings
            </Button>
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4" />
              <span>{user?.name}</span>
            </div>
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 animate-fade-in">
            <h2 className="text-4xl font-bold mb-2">Book Your Bus Ticket</h2>
            <p className="text-muted-foreground">Fast, easy, and reliable bus booking</p>
          </div>

          <Card className="animate-scale-in">
            <CardHeader>
              <CardTitle>Search Buses</CardTitle>
              <CardDescription>Find buses for your journey</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="from" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      From
                    </Label>
                    <Input
                      id="from"
                      placeholder="Enter departure city"
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="to" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      To
                    </Label>
                    <Input
                      id="to"
                      placeholder="Enter destination city"
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Date of Journey
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" size="lg">
                  Search Buses
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default SearchBuses;
