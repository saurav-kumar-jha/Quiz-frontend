import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Loader, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../util/authApi';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate email
    if (!email || !email.includes('@')) {
      setMessage('Please enter a valid email address');
      setMessageType('error');
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      // Simulating API call - Replace with your actual API endpoint
      const response = await api.post("/auth/forgot-password",{
        email:email
      })
      console.log(response);
      

      // Handle response
      if (response.status == 200) {
        setMessageType('success');
        setMessage(response.data || 'Password reset link has been sent to your email!');
        setEmail('');
      } else {
        setMessageType('error');
        setMessage('Failed to send reset link. Please try again.');
      }
    } catch (error) {
      // For demo purposes, showing success message
      // Remove this in production and handle actual errors
      setMessageType('success');
      setMessage('Password reset link has been sent to your email. Please check your inbox and spam folder.');
      setEmail('');
      
      // Uncomment below for actual error handling
      // setMessageType('error');
      // setMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          <div className="w-12 h-12  rounded-xl flex items-center justify-center">
            {/* <BookOpen className="w-7 h-7 text-white" /> */}
          </div>
          {/* <span className="text-3xl font-bold text-white">QuizMaster</span> */}
        </div>

        {/* Forgot Password Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-500/20 p-8">
          {/* Back Button */}
          <button
            onClick={()=>navigate(-1)}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Login</span>
          </button>

          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Forgot Password?</h2>
            <p className="text-gray-400">
              No worries! Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {/* Message Display */}
          {message && (
            <div
              className={`mb-6 p-4 rounded-xl border ${
                messageType === 'success'
                  ? 'bg-green-500/10 border-green-500/30'
                  : 'bg-red-500/10 border-red-500/30'
              } flex items-start space-x-3`}
            >
              {messageType === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              )}
              <p
                className={`text-sm ${
                  messageType === 'success' ? 'text-green-300' : 'text-red-300'
                }`}
              >
                {message}
              </p>
            </div>
          )}

          {/* Email Input Form */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  placeholder="Enter your email"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading || !email}
              className="w-full bg-gradient-to-r cursor-pointer from-purple-500 to-pink-500 text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <span>Send Reset Link</span>
              )}
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Remember your password?{' '}
              <button
                onClick={()=>navigate(-1)}
                className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
              >
                Login here
              </button>
            </p>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            If you don't receive an email within 5 minutes, check your spam folder or{' '}
            <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
              contact support
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}