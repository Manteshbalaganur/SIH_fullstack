import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import './index.css';
import App from './App.tsx';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Add this to handle development warnings
if (!clerkPubKey) {
  console.warn('Clerk publishable key not found. Please check your .env file');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider 
      publishableKey={clerkPubKey}
      appearance={{
        variables: {
          colorPrimary: '#0f766e', // teal-700
        }
      }}
    >
      <App />
    </ClerkProvider>
  </StrictMode>
);