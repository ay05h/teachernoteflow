
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, UserPlus } from 'lucide-react';
import Header from '../components/Header';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    
    setError('');
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Registration data:', formData);
      setIsLoading(false);
      
      // Redirect based on role (in a real app, this would happen after successful registration)
      if (formData.role === 'teacher') {
        navigate('/teacher/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    }, 1500);
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-secondary/30">
      <Header />
      
      <div className="flex-1 flex items-center justify-center px-6 pt-16 pb-10">
        <div className="w-full max-w-md animate-scale">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center text-foreground/70 hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
            </Link>
          </div>
          
          <div className="glass-card p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold">Create Your Account</h1>
              <p className="text-foreground/70 mt-2">Join our academic integrity platform</p>
            </div>
            
            {error && (
              <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-center">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium mb-2">
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border subtle-border bg-background/50 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border subtle-border bg-background/50 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                  placeholder="you@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border subtle-border bg-background/50 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground/50 hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border subtle-border bg-background/50 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground/50 hover:text-foreground"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              
              <div>
                <label htmlFor="role" className="block text-sm font-medium mb-2">
                  I am a
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border subtle-border bg-background/50 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                </select>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium transition-all hover:bg-primary/90 flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="h-5 w-5 border-2 border-t-transparent border-white/80 rounded-full animate-spin"></div>
                ) : (
                  <>
                    Create Account <UserPlus className="ml-2 h-5 w-5" />
                  </>
                )}
              </button>
            </form>
            
            <div className="mt-8 text-center">
              <p className="text-foreground/70">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:text-primary/80 transition-colors font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
