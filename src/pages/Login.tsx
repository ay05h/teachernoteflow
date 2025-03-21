
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, LogIn } from 'lucide-react';
import Header from '../components/Header';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student', // Default role
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Login attempt:', formData);
      setIsLoading(false);
      
      // Redirect based on role (in a real app, this would happen after successful authentication)
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
              <h1 className="text-2xl font-bold">Welcome Back</h1>
              <p className="text-foreground/70 mt-2">Sign in to your account</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
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
                <div className="mt-2 text-right">
                  <Link to="/forgot-password" className="text-sm text-primary hover:text-primary/80 transition-colors">
                    Forgot password?
                  </Link>
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
                    Sign In <LogIn className="ml-2 h-5 w-5" />
                  </>
                )}
              </button>
            </form>
            
            <div className="mt-8 text-center">
              <p className="text-foreground/70">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary hover:text-primary/80 transition-colors font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
