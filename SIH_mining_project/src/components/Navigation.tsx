import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Waves } from 'lucide-react';
import { useAuth, UserButton } from '@clerk/clerk-react';

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isSignedIn } = useAuth();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/projects', label: 'Projects' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-600 to-emerald-600 rounded-lg flex items-center justify-center">
              <Waves className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-800">CircularMetals AI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'text-teal-700'
                    : 'text-slate-600 hover:text-teal-700'
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Conditional buttons based on auth state */}
            {isSignedIn ? (
              <>
                <Link
                  to="/new-assessment"
                  className="px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors text-sm font-medium"
                >
                  New Assessment
                </Link>
                <div className="flex items-center space-x-4">
                  {/* User Profile with Photo */}
                  <UserButton 
                    appearance={{
                      elements: {
                        avatarBox: "w-8 h-8 rounded-full border-2 border-teal-200",
                        userButtonAvatarBox: "w-8 h-8",
                        userButtonTrigger: "focus:shadow-none"
                      }
                    }}
                    afterSignOutUrl="/"
                  />
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/sign-in"
                  className="text-slate-600 hover:text-teal-700 transition-colors text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/sign-up"
                  className="px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors text-sm font-medium"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-200">
          <div className="px-4 py-4 space-y-3">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-teal-50 text-teal-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Mobile auth buttons */}
            {isSignedIn ? (
              <>
                <Link
                  to="/new-assessment"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors text-sm font-medium text-center"
                >
                  New Assessment
                </Link>
                <div className="flex justify-center pt-2">
                  <UserButton 
                    appearance={{
                      elements: {
                        avatarBox: "w-10 h-10 rounded-full border-2 border-teal-200",
                        userButtonAvatarBox: "w-10 h-10"
                      }
                    }}
                    afterSignOutUrl="/"
                  />
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/sign-in"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg text-sm font-medium text-center"
                >
                  Sign In
                </Link>
                <Link
                  to="/sign-up"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors text-sm font-medium text-center"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;