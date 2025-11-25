import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Bus, DollarSign, LayoutDashboard, Receipt } from 'lucide-react';
import { getBuses, getBookings } from '@/lib/storage';

const Dashboard = () => {
  const navigate = useNavigate();
  const buses = getBuses();
  const bookings = getBookings().filter(b => b.status === 'confirmed');
  const totalRevenue = bookings.reduce((sum, b) => sum + b.totalAmount, 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bus className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">Admin Panel</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/admin')}>
              Dashboard
            </Button>
            <Button variant="ghost" onClick={() => navigate('/admin/buses')}>
              Buses
            </Button>
            <Button variant="ghost" onClick={() => navigate('/admin/schedule')}>
              Schedule
            </Button>
            <Button variant="ghost" onClick={() => navigate('/admin/bookings')}>
              Bookings
            </Button>
            <Button variant="ghost" onClick={() => navigate('/admin/customers')}>
              Customers
            </Button>
            <Button variant="ghost" onClick={() => navigate('/admin/payments')}>
              Payments
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
          <p className="text-muted-foreground">Overview of your bus booking system</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="animate-scale-in">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Buses</CardTitle>
              <Bus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{buses.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Active buses in system</p>
            </CardContent>
          </Card>

          <Card className="animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookings.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Confirmed bookings</p>
            </CardContent>
          </Card>

          <Card className="animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Total earnings</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate('/admin/buses')}
              >
                <Bus className="h-4 w-4 mr-2" />
                Manage Buses
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate('/admin/schedule')}
              >
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Bus Schedules
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate('/admin/bookings')}
              >
                <Receipt className="h-4 w-4 mr-2" />
                View Bookings
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate('/admin/customers')}
              >
                <Bus className="h-4 w-4 mr-2" />
                Manage Customers
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate('/admin/payments')}
              >
                <Receipt className="h-4 w-4 mr-2" />
                View Payments
              </Button>
            </CardContent>
          </Card>

          <Card className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {bookings.slice(0, 5).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium">{booking.bookingId}</p>
                      <p className="text-muted-foreground text-xs">{booking.busNumber}</p>
                    </div>
                    <span className="text-primary font-medium">₹{booking.totalAmount}</span>
                  </div>
                ))}
                {bookings.length === 0 && (
                  <p className="text-muted-foreground text-sm text-center py-4">
                    No bookings yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
