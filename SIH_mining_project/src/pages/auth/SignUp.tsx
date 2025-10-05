import { SignUp } from '@clerk/clerk-react';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-slate-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Start your circularity journey today
          </p>
        </div>
        <SignUp 
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          redirectUrl="/dashboard"
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-none border-0",
              headerTitle: "text-slate-900",
              headerSubtitle: "text-slate-600",
              socialButtonsBlockButton: "border-slate-300 hover:bg-slate-50",
              formButtonPrimary: "bg-teal-600 hover:bg-teal-700",
              footerActionLink: "text-teal-600 hover:text-teal-700"
            }
          }}
        />
      </div>
    </div>
  );
}