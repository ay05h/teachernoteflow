
import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Shield } from 'lucide-react';
import Header from '../components/Header';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="pt-24 flex-1">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-3xl md:text-5xl font-bold mb-6 text-balance">
                About <span className="text-gradient">AssignGuard</span>
              </h1>
              
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="lead text-xl text-foreground/80 mb-8">
                  AssignGuard is an innovative academic integrity platform designed to protect 
                  the authenticity of student work while streamlining the assignment submission and 
                  grading process for educational institutions.
                </p>
                
                <h2 className="text-2xl font-bold mt-10 mb-4">Our Mission</h2>
                <p>
                  We're committed to fostering an environment of academic honesty by providing tools 
                  that detect plagiarism and help educational institutions maintain high standards of integrity. 
                  Our platform serves both students and educators by creating a transparent, fair, and 
                  efficient assignment submission system.
                </p>
                
                <h2 className="text-2xl font-bold mt-10 mb-4">Key Features</h2>
                <ul className="space-y-4 mt-6">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                    <span>Advanced plagiarism detection algorithms that analyze submissions for copied content</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                    <span>Secure and straightforward assignment submission system</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                    <span>Real-time notifications for assignment submissions and grading</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                    <span>Intuitive interfaces for both students and teachers</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                    <span>Comprehensive analytics for educators</span>
                  </li>
                </ul>
                
                <h2 className="text-2xl font-bold mt-10 mb-4">Our Technology</h2>
                <p>
                  AssignGuard employs state-of-the-art technology to ensure the highest levels of academic 
                  integrity. Our plagiarism detection engine compares submissions against a vast database 
                  of academic papers, online resources, and previous submissions to identify potential 
                  matches and similarities.
                </p>
                
                <div className="my-12 p-6 bg-primary/5 rounded-lg border subtle-border">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center">
                      <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">Our Commitment to Privacy</h3>
                  </div>
                  <p className="text-foreground/80">
                    We take data privacy seriously. All student submissions are handled with the utmost 
                    confidentiality and are only accessible to authorized educators and administrators. 
                    We comply with educational data privacy regulations to ensure your information 
                    remains secure.
                  </p>
                </div>
                
                <h2 className="text-2xl font-bold mt-10 mb-4">Get Started Today</h2>
                <p>
                  Join the growing community of educational institutions that rely on AssignGuard to 
                  maintain academic integrity. Whether you're a student submitting assignments or an 
                  educator grading them, our platform provides the tools you need for a smooth and 
                  trustworthy academic experience.
                </p>
                
                <div className="mt-8">
                  <Link 
                    to="/register" 
                    className="inline-flex items-center px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
                  >
                    Create Your Free Account
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-secondary/50 py-12">
        <div className="container mx-auto px-6 text-center">
          <p className="text-foreground/70">
            © {new Date().getFullYear()} AssignGuard. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default About;
