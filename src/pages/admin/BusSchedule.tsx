import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Bus, Calendar, Clock, Edit2 } from 'lucide-react';
import { getBuses, updateBus } from '@/lib/storage';
import { Bus as BusType } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const BusSchedule = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [buses, setBuses] = useState<BusType[]>([]);
  const [selectedBus, setSelectedBus] = useState<BusType | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [scheduleForm, setScheduleForm] = useState({
    departureTime: '',
    arrivalTime: '',
    operatingDays: [] as string[],
    availableDates: [] as string[],
  });

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    loadBuses();
  }, []);

  const loadBuses = () => {
    setBuses(getBuses());
  };

  const handleReschedule = (bus: BusType) => {
    setSelectedBus(bus);
    setScheduleForm({
      departureTime: bus.departureTime,
      arrivalTime: bus.arrivalTime,
      operatingDays: bus.operatingDays || [],
      availableDates: bus.availableDates || [],
    });
    setIsDialogOpen(true);
  };

  const toggleDay = (day: string) => {
    setScheduleForm(prev => ({
      ...prev,
      operatingDays: prev.operatingDays.includes(day)
        ? prev.operatingDays.filter(d => d !== day)
        : [...prev.operatingDays, day]
    }));
  };

  const addAvailableDate = (date: string) => {
    if (date && !scheduleForm.availableDates.includes(date)) {
      setScheduleForm(prev => ({
        ...prev,
        availableDates: [...prev.availableDates, date].sort()
      }));
    }
  };

  const removeDate = (date: string) => {
    setScheduleForm(prev => ({
      ...prev,
      availableDates: prev.availableDates.filter(d => d !== date)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedBus) return;

    const updatedBus: BusType = {
      ...selectedBus,
      departureTime: scheduleForm.departureTime,
      arrivalTime: scheduleForm.arrivalTime,
      operatingDays: scheduleForm.operatingDays,
      availableDates: scheduleForm.availableDates,
    };

    updateBus(selectedBus.id, updatedBus);
    toast({
      title: "Schedule Updated",
      description: "Bus schedule has been updated successfully",
    });
    
    loadBuses();
    setIsDialogOpen(false);
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
          <h2 className="text-3xl font-bold mb-2">Bus Schedule Management</h2>
          <p className="text-muted-foreground">Manage bus schedules, operating days, and available dates</p>
        </div>

        <div className="grid gap-4">
          {buses.map((bus, index) => (
            <Card key={bus.id} className="animate-scale-in" style={{ animationDelay: `${index * 0.05}s` }}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-3">{bus.busName}</h3>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Departure:</span>
                          <span className="font-semibold">{bus.departureTime}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Arrival:</span>
                          <span className="font-semibold">{bus.arrivalTime}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Route:</span>
                          <span className="ml-2 font-semibold">{bus.from} → {bus.to}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <span className="text-muted-foreground block mb-1">Operating Days:</span>
                            <div className="flex flex-wrap gap-1">
                              {bus.operatingDays && bus.operatingDays.length > 0 ? (
                                bus.operatingDays.map(day => (
                                  <Badge key={day} variant="secondary" className="text-xs">
                                    {day.substring(0, 3)}
                                  </Badge>
                                ))
                              ) : (
                                <span className="text-muted-foreground text-xs">All days</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <span className="text-muted-foreground block mb-1">Available Dates:</span>
                            <span className="text-xs">
                              {bus.availableDates && bus.availableDates.length > 0
                                ? `${bus.availableDates.length} dates configured`
                                : 'All dates available'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button onClick={() => handleReschedule(bus)} className="ml-4">
                    <Edit2 className="h-4 w-4 mr-2" />
                    Reschedule
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Reschedule Bus - {selectedBus?.busName}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="departureTime">Departure Time</Label>
                  <Input
                    id="departureTime"
                    type="time"
                    value={scheduleForm.departureTime}
                    onChange={(e) => setScheduleForm({...scheduleForm, departureTime: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="arrivalTime">Arrival Time</Label>
                  <Input
                    id="arrivalTime"
                    type="time"
                    value={scheduleForm.arrivalTime}
                    onChange={(e) => setScheduleForm({...scheduleForm, arrivalTime: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Operating Days (Leave empty for all days)</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {daysOfWeek.map(day => (
                    <Button
                      key={day}
                      type="button"
                      variant={scheduleForm.operatingDays.includes(day) ? "default" : "outline"}
                      onClick={() => toggleDay(day)}
                      className="w-full"
                    >
                      {day.substring(0, 3)}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Specific Available Dates (Optional)</Label>
                <div className="flex gap-2">
                  <Input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => {
                      if (e.target.value) {
                        addAvailableDate(e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {scheduleForm.availableDates.map(date => (
                    <Badge key={date} variant="secondary" className="text-sm">
                      {new Date(date).toLocaleDateString()}
                      <button
                        type="button"
                        onClick={() => removeDate(date)}
                        className="ml-2 hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full">
                Update Schedule
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default BusSchedule;
