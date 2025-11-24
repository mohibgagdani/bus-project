import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SeatLayoutBuilder } from '@/components/admin/SeatLayoutBuilder';
import { Bus, Edit, Plus, Trash2 } from 'lucide-react';
import { getBuses, addBus, updateBus, deleteBus } from '@/lib/storage';
import { Bus as BusType, SeatLayout } from '@/types';
import { useToast } from '@/hooks/use-toast';

const BusManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [buses, setBuses] = useState(getBuses());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBus, setEditingBus] = useState<BusType | null>(null);
  
  const [formData, setFormData] = useState({
    busNumber: '',
    busName: '',
    type: 'AC' as 'AC' | 'Non-AC',
    seatType: 'Seater' as 'Sleeper' | 'Seater',
    from: '',
    to: '',
    departureTime: '',
    arrivalTime: '',
    price: '',
  });
  
  const [seatLayout, setSeatLayout] = useState<SeatLayout>({
    rows: 10,
    columns: 4,
    seats: [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (seatLayout.seats.length === 0) {
      toast({
        title: "Error",
        description: "Please configure the seat layout",
        variant: "destructive",
      });
      return;
    }

    const totalSeats = seatLayout.seats.filter(s => s.isEnabled).length;
    
    const busData: BusType = {
      id: editingBus?.id || `bus-${Date.now()}`,
      busNumber: formData.busNumber,
      busName: formData.busName,
      type: formData.type,
      seatType: formData.seatType,
      from: formData.from,
      to: formData.to,
      departureTime: formData.departureTime,
      arrivalTime: formData.arrivalTime,
      price: parseFloat(formData.price),
      totalSeats,
      seatLayout,
    };

    if (editingBus) {
      updateBus(editingBus.id, busData);
      toast({ title: "Bus Updated", description: "Bus updated successfully" });
    } else {
      addBus(busData);
      toast({ title: "Bus Added", description: "New bus added successfully" });
    }

    setBuses(getBuses());
    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (bus: BusType) => {
    setEditingBus(bus);
    setFormData({
      busNumber: bus.busNumber,
      busName: bus.busName,
      type: bus.type,
      seatType: bus.seatType,
      from: bus.from,
      to: bus.to,
      departureTime: bus.departureTime,
      arrivalTime: bus.arrivalTime,
      price: bus.price.toString(),
    });
    setSeatLayout(bus.seatLayout);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this bus?')) {
      deleteBus(id);
      setBuses(getBuses());
      toast({ title: "Bus Deleted", description: "Bus deleted successfully" });
    }
  };

  const resetForm = () => {
    setEditingBus(null);
    setFormData({
      busNumber: '',
      busName: '',
      type: 'AC',
      seatType: 'Seater',
      from: '',
      to: '',
      departureTime: '',
      arrivalTime: '',
      price: '',
    });
    setSeatLayout({
      rows: 10,
      columns: 4,
      seats: [],
    });
  };

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
        <div className="mb-6 flex items-center justify-between animate-fade-in">
          <div>
            <h2 className="text-3xl font-bold mb-2">Bus Management</h2>
            <p className="text-muted-foreground">Manage your bus fleet</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Bus
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingBus ? 'Edit Bus' : 'Add New Bus'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="busNumber">Bus Number</Label>
                    <Input
                      id="busNumber"
                      value={formData.busNumber}
                      onChange={(e) => setFormData({...formData, busNumber: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="busName">Bus Name</Label>
                    <Input
                      id="busName"
                      value={formData.busName}
                      onChange={(e) => setFormData({...formData, busName: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select value={formData.type} onValueChange={(value: 'AC' | 'Non-AC') => setFormData({...formData, type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AC">AC</SelectItem>
                        <SelectItem value="Non-AC">Non-AC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="seatType">Seat Type</Label>
                    <Select value={formData.seatType} onValueChange={(value: 'Sleeper' | 'Seater') => setFormData({...formData, seatType: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Seater">Seater</SelectItem>
                        <SelectItem value="Sleeper">Sleeper</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="from">From</Label>
                    <Input
                      id="from"
                      value={formData.from}
                      onChange={(e) => setFormData({...formData, from: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="to">To</Label>
                    <Input
                      id="to"
                      value={formData.to}
                      onChange={(e) => setFormData({...formData, to: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="departureTime">Departure Time</Label>
                    <Input
                      id="departureTime"
                      type="time"
                      value={formData.departureTime}
                      onChange={(e) => setFormData({...formData, departureTime: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="arrivalTime">Arrival Time</Label>
                    <Input
                      id="arrivalTime"
                      type="time"
                      value={formData.arrivalTime}
                      onChange={(e) => setFormData({...formData, arrivalTime: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price per Seat</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Seat Layout</Label>
                  <SeatLayoutBuilder layout={seatLayout} onChange={setSeatLayout} />
                </div>

                <Button type="submit" className="w-full">
                  {editingBus ? 'Update Bus' : 'Add Bus'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {buses.length === 0 ? (
            <Card className="animate-fade-in">
              <CardContent className="py-12 text-center">
                <Bus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No buses yet</h3>
                <p className="text-muted-foreground">Add your first bus to get started</p>
              </CardContent>
            </Card>
          ) : (
            buses.map((bus, index) => (
              <Card key={bus.id} className="animate-scale-in" style={{ animationDelay: `${index * 0.05}s` }}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{bus.busName}</h3>
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                        <span>Bus: {bus.busNumber}</span>
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded">{bus.type}</span>
                        <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded">{bus.seatType}</span>
                        <span>Route: {bus.from} → {bus.to}</span>
                        <span>Seats: {bus.totalSeats}</span>
                        <span className="font-semibold text-primary">₹{bus.price}/seat</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleEdit(bus)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDelete(bus.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
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

export default BusManagement;
