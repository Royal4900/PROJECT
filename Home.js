import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Sparkles, 
  FileText, 
  Brain, 
  Download, 
  Eye, 
  Save,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Suggestions',
      description: 'Get intelligent recommendations to improve your resume content, formatting, and ATS optimization.'
    },
    {
      icon: FileText,
      title: 'Professional Templates',
      description: 'Choose from multiple modern, industry-standard templates that make your resume stand out.'
    },
    {
      icon: Eye,
      title: 'Real-time Preview',
      description: 'See exactly how your resume will look as you build it with our live preview feature.'
    },
    {
      icon: Download,
      title: 'PDF Export',
      description: 'Download your resume as a professional PDF or print it directly from the browser.'
    },
    {
      icon: Save,
      title: 'Save & Manage',
      description: 'Create multiple resume versions and save them securely in your account.'
    },
    {
      icon: CheckCircle,
      title: 'ATS Optimized',
      description: 'Built with Applicant Tracking Systems in mind to maximize your interview chances.'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Resumes Created' },
    { number: '95%', label: 'ATS Success Rate' },
    { number: '24/7', label: 'AI Assistance' },
    { number: '100%', label: 'Free to Start' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Powered by AI</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Build Your Resume with
              <span className="text-gradient block">AI Intelligence</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Create professional resumes that stand out with AI-powered suggestions, 
              modern templates, and real-time preview. Get hired faster with our 
              intelligent resume builder.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link
                  to="/dashboard"
                  className="btn-primary text-lg px-8 py-3 inline-flex items-center space-x-2"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="btn-primary text-lg px-8 py-3 inline-flex items-center space-x-2"
                  >
                    <span>Get Started Free</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    to="/login"
                    className="btn-outline text-lg px-8 py-3"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Create
              <span className="text-gradient"> Outstanding Resumes</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our AI-powered platform combines cutting-edge technology with proven 
              resume writing principles to help you land your dream job.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card hover:shadow-soft transition-all duration-300 group">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-200 transition-colors duration-200">
                  <feature.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get your professional resume in just three simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fill Your Information</h3>
              <p className="text-gray-600">
                Enter your details using our intuitive forms. We'll guide you through each section.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Get AI Suggestions</h3>
              <p className="text-gray-600">
                Receive intelligent recommendations to improve your content and formatting.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Download & Apply</h3>
              <p className="text-gray-600">
                Export your resume as PDF and start applying to your dream jobs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Build Your Professional Resume?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of job seekers who have already landed their dream jobs 
            with our AI-powered resume builder.
          </p>
          
          {user ? (
            <Link
              to="/dashboard"
              className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg text-lg inline-flex items-center space-x-2 transition-colors duration-200"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          ) : (
            <Link
              to="/register"
              className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg text-lg inline-flex items-center space-x-2 transition-colors duration-200"
            >
              <span>Start Building Now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
