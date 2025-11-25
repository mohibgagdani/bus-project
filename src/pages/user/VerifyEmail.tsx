import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Bus, Mail } from 'lucide-react';
import { verifyEmailCode, resendVerificationCode } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

const VerifyEmail = () => {
  const [code, setCode] = useState('');
  const [isResending, setIsResending] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate('/signup');
    }
  }, [email, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (verifyEmailCode(email, code)) {
      toast({
        title: "Email Verified",
        description: "Your email has been successfully verified!",
      });
      navigate('/login');
    } else {
      toast({
        title: "Verification Failed",
        description: "Invalid verification code. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleResend = () => {
    setIsResending(true);
    const newCode = resendVerificationCode(email);
    toast({
      title: "Code Resent",
      description: `A new verification code (${newCode}) has been sent to your email.`,
    });
    setTimeout(() => setIsResending(false), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-background p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <Bus className="h-12 w-12 text-primary" />
              <Mail className="h-6 w-6 text-primary absolute -bottom-1 -right-1 bg-background rounded-full p-1" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Verify Your Email</CardTitle>
          <CardDescription className="text-center">
            We've sent a verification code to <strong>{email}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Verification Code</Label>
              <Input
                id="code"
                type="text"
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Verify Email
            </Button>
          </form>
          
          <div className="mt-4 text-center text-sm space-y-2">
            <p className="text-muted-foreground">
              Didn't receive the code?
            </p>
            <Button 
              variant="ghost" 
              onClick={handleResend}
              disabled={isResending}
              className="text-primary hover:text-primary"
            >
              {isResending ? 'Sending...' : 'Resend Code'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;
