import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ThemeToggle';
import { getUsers, getBookings } from '@/lib/storage';
import { User, Booking } from '@/types';
import { Bus, Search } from 'lucide-react';

const CustomerManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allUsers = getUsers().filter(u => u.role === 'user');
    const allBookings = getBookings();
    setUsers(allUsers);
    setBookings(allBookings);
  };

  const getUserBookings = (userId: string) => {
    return bookings.filter(b => b.userId === userId);
  };

  const getUserTotalSpent = (userId: string) => {
    return getUserBookings(userId)
      .filter(b => b.status === 'confirmed')
      .reduce((sum, b) => sum + b.totalAmount, 0);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              Bus Management
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
          <h2 className="text-3xl font-bold mb-2">Customer Management</h2>
          <p className="text-muted-foreground">Manage and view customer information</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>All Customers ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Total Bookings</TableHead>
                    <TableHead>Active Bookings</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => {
                    const userBookings = getUserBookings(user.id);
                    const activeBookings = userBookings.filter(b => b.status === 'confirmed').length;
                    const totalSpent = getUserTotalSpent(user.id);

                    return (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{userBookings.length}</TableCell>
                        <TableCell>{activeBookings}</TableCell>
                        <TableCell>₹{totalSpent.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant={activeBookings > 0 ? "default" : "secondary"}>
                            {activeBookings > 0 ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CustomerManagement;
