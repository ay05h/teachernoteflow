
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Shield, Award, Clock, FileText, UserCheck } from 'lucide-react';
import Header from '../components/Header';

const features = [
  {
    title: 'Plagiarism Detection',
    description: 'Advanced algorithms to detect copied content across submissions',
    icon: Shield,
  },
  {
    title: 'Real-time Notification',
    description: 'Get instant alerts when assignments are submitted or graded',
    icon: Clock,
  },
  {
    title: 'Secure File Handling',
    description: 'Secure upload and storage of assignment files',
    icon: FileText,
  },
  {
    title: 'Role-based Access',
    description: 'Separate interfaces for teachers and students with appropriate permissions',
    icon: UserCheck,
  },
];

const benefits = [
  'Reduces academic dishonesty by up to 60%',
  'Saves educators 5+ hours per week on grading',
  'Provides students with immediate feedback',
  'Creates transparent evaluation processes',
  'Maintains academic integrity across institutions',
];

const Index = () => {
  // Refs for animation triggers
  const heroRef = useRef<HTMLDivElement>(null);
  const featureRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -10% 0px',
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    // Observe elements with animation classes
    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observer.observe(el);
    });
    
    return () => observer.disconnect();
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="hero-gradient pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="container mx-auto px-6" ref={heroRef}>
          <div className="max-w-4xl mx-auto text-center animate-on-scroll opacity-0">
            <div className="inline-block mb-4 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              Academic Integrity Platform
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
              Secure Assignment Submission with <span className="text-gradient">Fraud Detection</span>
            </h1>
            <p className="text-xl text-foreground/80 mb-8 max-w-3xl mx-auto text-balance">
              Protect academic integrity with our intelligent plagiarism detection system. 
              Create, assign, and evaluate assignments seamlessly while maintaining high standards of honesty.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/register" 
                className="px-8 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium text-lg flex items-center justify-center"
              >
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                to="/about" 
                className="px-8 py-3 rounded-lg border subtle-border hover:bg-secondary/50 transition-colors font-medium text-lg"
              >
                Learn More
              </Link>
            </div>
          </div>
          
          <div className="mt-20 glass-card p-1 sm:p-2 max-w-5xl mx-auto overflow-hidden animate-on-scroll opacity-0" style={{ animationDelay: '0.2s' }}>
            <div className="w-full aspect-video-custom bg-black/10 dark:bg-white/5 rounded-lg flex items-center justify-center">
              <div className="text-center p-8">
                <div className="h-16 w-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-primary animate-pulse" />
                </div>
                <h3 className="text-xl font-medium mb-2">Dashboard Preview</h3>
                <p className="text-foreground/70 text-sm">Interactive visualization coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-secondary/30" ref={featureRef}>
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-on-scroll opacity-0">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Advanced Features for Academic Integrity
            </h2>
            <p className="text-lg text-foreground/70">
              Our platform provides comprehensive tools to maintain academic honesty and streamline the assignment process.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="glass-card p-8 animate-on-scroll opacity-0"
                style={{ animationDelay: `${0.1 * (index + 1)}s` }}
              >
                <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center mb-6">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-foreground/70">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-12">
              <div className="lg:w-1/2 animate-on-scroll opacity-0">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Why Choose AssignGuard?
                </h2>
                <p className="text-lg text-foreground/70 mb-8">
                  Our platform is designed with both educators and students in mind, 
                  creating a fair environment for academic assessment while reducing the 
                  administrative burden on teaching staff.
                </p>
                
                <ul className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <li 
                      key={index} 
                      className="flex items-start gap-3 animate-on-scroll opacity-0"
                      style={{ animationDelay: `${0.1 * (index + 1)}s` }}
                    >
                      <CheckCircle className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                      <span className="text-foreground/90">{benefit}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-10 animate-on-scroll opacity-0" style={{ animationDelay: '0.6s' }}>
                  <Link 
                    to="/register" 
                    className="inline-flex items-center px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
                  >
                    Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </div>
              </div>
              
              <div className="lg:w-1/2 flex items-center justify-center animate-on-scroll opacity-0" style={{ animationDelay: '0.3s' }}>
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-2xl -rotate-6 transform-gpu"></div>
                  <div className="glass-card p-6 relative z-10">
                    <div className="overflow-hidden rounded-lg">
                      <div className="h-64 bg-black/10 dark:bg-white/5 rounded-lg flex items-center justify-center">
                        <Award className="h-16 w-16 text-primary/50" />
                      </div>
                    </div>
                    <div className="mt-6 text-center">
                      <h3 className="text-xl font-semibold mb-2">Trusted by Educators</h3>
                      <p className="text-foreground/70">
                        Join thousands of institutions maintaining academic standards with our platform
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto text-center animate-on-scroll opacity-0">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Safeguard Academic Integrity?
            </h2>
            <p className="text-lg text-foreground/70 mb-10 max-w-3xl mx-auto">
              Join educators and students who trust AssignGuard to maintain high standards of academic honesty 
              while streamlining the assignment process.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/register" 
                className="px-8 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium text-lg"
              >
                Create Account
              </Link>
              <Link 
                to="/login" 
                className="px-8 py-3 rounded-lg border subtle-border hover:bg-secondary/50 transition-colors font-medium text-lg"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-secondary/50 py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between gap-8">
              <div className="md:w-1/3">
                <Link to="/" className="text-2xl font-display font-bold text-gradient">
                  AssignGuard
                </Link>
                <p className="mt-4 text-foreground/70">
                  Protecting academic integrity through intelligent assignment management and fraud detection.
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                <div>
                  <h4 className="font-semibold mb-4">Product</h4>
                  <ul className="space-y-3">
                    <li><Link to="/features" className="text-foreground/70 hover:text-foreground">Features</Link></li>
                    <li><Link to="/pricing" className="text-foreground/70 hover:text-foreground">Pricing</Link></li>
                    <li><Link to="/about" className="text-foreground/70 hover:text-foreground">About Us</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Support</h4>
                  <ul className="space-y-3">
                    <li><Link to="/contact" className="text-foreground/70 hover:text-foreground">Contact</Link></li>
                    <li><Link to="/help" className="text-foreground/70 hover:text-foreground">Documentation</Link></li>
                    <li><Link to="/faq" className="text-foreground/70 hover:text-foreground">FAQ</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Legal</h4>
                  <ul className="space-y-3">
                    <li><Link to="/privacy" className="text-foreground/70 hover:text-foreground">Privacy</Link></li>
                    <li><Link to="/terms" className="text-foreground/70 hover:text-foreground">Terms</Link></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="border-t subtle-border mt-12 pt-8 text-center text-foreground/60 text-sm">
              © {new Date().getFullYear()} AssignGuard. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
