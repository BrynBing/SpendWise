import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [recoveryMethod, setRecoveryMethod] = useState('email');
  
  // For security questions
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [username, setUsername] = useState('');

  // Mock security questions (in a real app, these would come from the backend)
  const securityQuestions = [
    "What was the name of your first pet?",
    "What was the name of the street you grew up on?",
    "What is your mother's maiden name?",
    "In what city were you born?",
    "What was the make of your first car?"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (recoveryMethod === 'email') {
        console.log('Reset password email sent to:', email);
        setSubmitted(true);
      } else {
        console.log('Security question verification attempt:', { 
          username, 
          question: securityQuestion, 
          answer: securityAnswer 
        });
        // In a real app, you'd verify the answer and then either show a password reset form
        // or redirect to a password reset page
        setSubmitted(true);
      }
      setLoading(false);
    }, 1500);
  };

  const toggleRecoveryMethod = () => {
    setRecoveryMethod(recoveryMethod === 'email' ? 'security' : 'email');
    // Reset form state when switching methods
    setSubmitted(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Account Recovery</h1>
          <p className="mt-2 text-gray-600">
            {recoveryMethod === 'email' 
              ? "Enter your email and we'll send you a link to reset your password"
              : "Answer your security question to recover your account"
            }
          </p>
        </div>
        
        {!submitted ? (
          <>
            <div className="flex border border-gray-300 rounded-md overflow-hidden">
              <button 
                className={`flex-1 py-2 px-4 text-center ${recoveryMethod === 'email' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => setRecoveryMethod('email')}
                type="button"
              >
                Email Recovery
              </button>
              <button 
                className={`flex-1 py-2 px-4 text-center ${recoveryMethod === 'security' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => setRecoveryMethod('security')}
                type="button"
              >
                Security Questions
              </button>
            </div>
            
            <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
              {recoveryMethod === 'email' ? (
                <div>
                  <label htmlFor="email" className="sr-only">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="username" className="sr-only">Username</label>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="securityQuestion" className="sr-only">Security Question</label>
                    <select
                      id="securityQuestion"
                      name="securityQuestion"
                      required
                      className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      value={securityQuestion}
                      onChange={(e) => setSecurityQuestion(e.target.value)}
                    >
                      <option value="">Select your security question</option>
                      {securityQuestions.map((question, index) => (
                        <option key={index} value={question}>
                          {question}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="securityAnswer" className="sr-only">Answer</label>
                    <input
                      id="securityAnswer"
                      name="securityAnswer"
                      type="text"
                      required
                      className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Your answer"
                      value={securityAnswer}
                      onChange={(e) => setSecurityAnswer(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full px-4 py-3 text-white bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors cursor-pointer disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {recoveryMethod === 'email' ? 'Sending...' : 'Verifying...'}
                  </span>
                ) : (
                  recoveryMethod === 'email' ? 'Send Reset Link' : 'Continue'
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="mt-6 text-center">
            <div className="flex justify-center">
              <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h2 className="mt-2 text-xl font-bold text-gray-800">
              {recoveryMethod === 'email' 
                ? 'Check your email'
                : 'Verification Successful'
              }
            </h2>
            {recoveryMethod === 'email' ? (
              <>
                <p className="mt-2 text-gray-600">
                  We've sent a password reset link to: <span className="font-medium">{email}</span>
                </p>
                <p className="mt-4 text-sm text-gray-500">
                  If you don't see it, please check your spam folder.
                </p>
              </>
            ) : (
              <p className="mt-2 text-gray-600">
                Your identity has been verified. You can now reset your password.
              </p>
            )}
            <div className="mt-6 space-y-2">
              {recoveryMethod === 'email' && (
                <button 
                  onClick={() => setSubmitted(false)}
                  className="text-sm text-blue-600 hover:text-blue-800 focus:outline-none block w-full"
                >
                  Use a different email address
                </button>
              )}
              <button 
                onClick={toggleRecoveryMethod}
                className="text-sm text-blue-600 hover:text-blue-800 focus:outline-none block w-full"
              >
                {recoveryMethod === 'email' 
                  ? 'Try security questions instead'
                  : 'Try email recovery instead'
                }
              </button>
              {recoveryMethod === 'security' && (
                <button 
                  className="w-full px-4 py-3 mt-4 text-white bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                  onClick={() => navigate('/dashboard')}
                >
                  Go to Dashboard to Reset Password
                </button>
              )}
            </div>
          </div>
        )}

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Remember your password?{" "}
            <Link to="/login" className="text-blue-600 hover:text-blue-800">
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
