import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navigation from './components/Navigation';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import NewAssessment from './pages/NewAssessment';
import Results from './pages/Results';
import Projects from './pages/Projects';
import SignInPage from './pages/auth/SignIn';
import SignUpPage from './pages/auth/SignUp';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import ProtectedRoute from './pages/auth/ProtectedRoute';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-slate-50">
          <Navigation />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/sign-in/*" element={<SignInPage />} />
            <Route path="/sign-up/*" element={<SignUpPage />} />
            
            {/* SSO Callback Route - IMPORTANT */}
            <Route
              path="/sign-in/sso-callback"
              element={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
                    <p className="mt-4 text-slate-600">Completing sign in...</p>
                  </div>
                </div>
              }
            />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/new-assessment" element={
              <ProtectedRoute>
                <NewAssessment />
              </ProtectedRoute>
            } />
            <Route path="/results/:id" element={
              <ProtectedRoute>
                <Results />
              </ProtectedRoute>
            } />
            <Route path="/projects" element={
              <ProtectedRoute>
                <Projects />
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />

            {/* Catch all route */}
            <Route path="*" element={<Landing />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;