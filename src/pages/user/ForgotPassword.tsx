import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Bus, KeyRound } from 'lucide-react';
import { requestPasswordReset, verifyResetCode, resetPassword } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

const ForgotPassword = () => {
  const [step, setStep] = useState<'email' | 'code' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const resetCode = requestPasswordReset(email);
    
    if (resetCode) {
      toast({
        title: "Reset Code Sent",
        description: `A reset code (${resetCode}) has been sent to your email.`,
      });
      setStep('code');
    } else {
      toast({
        title: "Email Not Found",
        description: "No account found with this email address.",
        variant: "destructive",
      });
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (verifyResetCode(email, code)) {
      setStep('reset');
    } else {
      toast({
        title: "Invalid Code",
        description: "The reset code you entered is invalid or expired.",
        variant: "destructive",
      });
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure both passwords match.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    if (resetPassword(email, code, newPassword)) {
      toast({
        title: "Password Reset Successful",
        description: "You can now login with your new password.",
      });
      navigate('/login');
    } else {
      toast({
        title: "Reset Failed",
        description: "Failed to reset password. Please try again.",
        variant: "destructive",
      });
    }
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
              <KeyRound className="h-6 w-6 text-primary absolute -bottom-1 -right-1 bg-background rounded-full p-1" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">
            {step === 'email' && 'Forgot Password?'}
            {step === 'code' && 'Enter Reset Code'}
            {step === 'reset' && 'Reset Password'}
          </CardTitle>
          <CardDescription className="text-center">
            {step === 'email' && 'Enter your email to receive a reset code'}
            {step === 'code' && 'Enter the code sent to your email'}
            {step === 'reset' && 'Choose a new password'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Send Reset Code
              </Button>
            </form>
          )}

          {step === 'code' && (
            <form onSubmit={handleCodeSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Reset Code</Label>
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
                Verify Code
              </Button>
            </form>
          )}

          {step === 'reset' && (
            <form onSubmit={handleResetSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Reset Password
              </Button>
            </form>
          )}
          
          <div className="mt-4 text-center text-sm">
            <Link to="/login" className="text-primary hover:underline">
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
