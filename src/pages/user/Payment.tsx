import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { addBooking } from '@/lib/storage';
import { Booking } from '@/types';
import { CheckCircle, Download } from 'lucide-react';
import QRCode from 'qrcode';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [qrCode, setQrCode] = useState('');

  const bookingData = location.state as {
    busId: string;
    busNumber: string;
    from: string;
    to: string;
    date: string;
    departureTime: string;
    seats: string[];
    totalAmount: number;
  };

  useEffect(() => {
    if (!bookingData || !user) {
      navigate('/search');
    }
  }, [bookingData, user, navigate]);

  const handlePayment = async () => {
    const bookingId = `BK${Date.now().toString().slice(-8)}`;
    const transactionId = `TXN${Date.now().toString().slice(-10)}`;
    
    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      bookingId,
      transactionId,
      userId: user!.id,
      busId: bookingData.busId,
      busNumber: bookingData.busNumber,
      seats: bookingData.seats,
      totalAmount: bookingData.totalAmount,
      from: bookingData.from,
      to: bookingData.to,
      date: bookingData.date,
      departureTime: bookingData.departureTime,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    addBooking(newBooking);
    setBooking(newBooking);
    
    // Generate QR Code
    const qrData = JSON.stringify({
      bookingId: newBooking.bookingId,
      transactionId: newBooking.transactionId,
      bus: newBooking.busNumber,
      seats: newBooking.seats.join(', '),
      amount: newBooking.totalAmount,
    });
    
    const qr = await QRCode.toDataURL(qrData);
    setQrCode(qr);
    setPaymentSuccess(true);
  };

  const handleDownload = () => {
    if (!booking) return;
    
    const ticketContent = `
Bus Booking Ticket
==================
Booking ID: ${booking.bookingId}
Transaction ID: ${booking.transactionId}
Bus Number: ${booking.busNumber}
Route: ${booking.from} → ${booking.to}
Date: ${booking.date}
Departure: ${booking.departureTime}
Seats: ${booking.seats.join(', ')}
Total Amount: ₹${booking.totalAmount}
Status: ${booking.status}
`;
    
    const blob = new Blob([ticketContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ticket-${booking.bookingId}.txt`;
    a.click();
  };

  if (!bookingData || !user) {
    return null;
  }

  if (paymentSuccess && booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 to-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full animate-scale-in">
          <CardHeader className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <CardTitle className="text-2xl text-green-500">Payment Successful!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Booking ID</p>
              <p className="text-xl font-bold">{booking.bookingId}</p>
            </div>
            
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Transaction ID</p>
              <p className="text-lg font-semibold">{booking.transactionId}</p>
            </div>

            {qrCode && (
              <div className="flex justify-center p-4 bg-white rounded-lg">
                <img src={qrCode} alt="Booking QR Code" className="w-48 h-48" />
              </div>
            )}

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bus</span>
                <span className="font-medium">{booking.busNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Route</span>
                <span className="font-medium">{booking.from} → {booking.to}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Seats</span>
                <span className="font-medium">{booking.seats.join(', ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-bold text-primary">₹{booking.totalAmount}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Button onClick={handleDownload} className="w-full" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download Ticket
              </Button>
              <Button onClick={() => navigate('/my-bookings')} className="w-full">
                View My Bookings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full animate-fade-in">
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Bus</span>
              <span className="font-medium">{bookingData.busNumber}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Route</span>
              <span className="font-medium">{bookingData.from} → {bookingData.to}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Date</span>
              <span className="font-medium">{bookingData.date}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Seats</span>
              <span className="font-medium">{bookingData.seats.join(', ')}</span>
            </div>
            <div className="pt-4 border-t border-border flex justify-between">
              <span className="font-semibold">Total Amount</span>
              <span className="text-2xl font-bold text-primary">₹{bookingData.totalAmount}</span>
            </div>
          </div>

          <Button onClick={handlePayment} className="w-full" size="lg">
            Pay Now
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Payment;
