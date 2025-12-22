import React, { useEffect, useState } from 'react';
import { 
  Mail, MessageSquare, Star, Lightbulb, 
  Send, CheckCircle, User, Phone, AlertCircle,
  MessageCircle, Award, ThumbsUp, Loader
} from 'lucide-react';
import { useAuth } from '../context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import api from '../util/authApi';

export default function ContactFeedbackPage() {
  const [activeTab, setActiveTab] = useState('contact');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const {user, isLoggedIn} = useAuth();  
  const navigate = useNavigate()
  
  // Contact Form State
  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    phone: '',
    reason: '',
    message: ''
  });

  // Experience Form State
  const [experienceData, setExperienceData] = useState({
    nameOrEmail: '',
    rating: 0,
    message: ''
  });

  // Testimonial Form State
  const [testimonialData, setTestimonialData] = useState({
    name: '',
    role: '',
    organization: '',
    rating: 0,
    testimonial: ''
  });

  // Suggestion Form State
  const [suggestionData, setSuggestionData] = useState({
    name: '',
    email: '',
    category: '',
    suggestion: ''
  });

  useEffect(()=>{
    if(!isLoggedIn){
      navigate("/auth")
    }
  },[])

  const resetForm = () => {
    setContactData({ name: '', email: '', phone: '', reason: '', message: '' });
    setExperienceData({ nameOrEmail: '', rating: 0, message: '' });
    setTestimonialData({ name: '', role: '', organization: '', rating: 0, testimonial: '' });
    setSuggestionData({ name: '', email: '', category: '', suggestion: '' });
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // console.log('Contact Form Data:', {
    //   type: 'contact',
    //   ...contactData,
    //   submittedAt: new Date().toISOString()
    // });

    const res = await api.post("/social/contact",{
      ...contactData
    },{
      "headers":{
        "Authorization":`Bearer ${user.token}`
      }
    })

    console.log("Response:",res)

    // Simulate API call
    // setTimeout(() => {
    //   setIsSubmitting(false);
    //   setSubmitSuccess(true);
    //   resetForm();
    //   setTimeout(() => setSubmitSuccess(false), 3000);
    // }, 1500);
    setIsSubmitting(false)
    if(res.status != 200){
      setSubmitSuccess(false)
    }{
      setSubmitSuccess(true)
      resetForm()
    }

  };

  const handleExperienceSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // console.log('Experience Form Data:', {
    //   type: 'experience',
    //   ...experienceData,
    //   submittedAt: new Date().toISOString()
    // });

    const res = await api.post("/social/experience",{
      ...experienceData
    },{
      "headers":{
        "Authorization":`Bearer ${user.token}`
      }
    })

    console.log("Response:",res)

    // setTimeout(() => {
    //   setIsSubmitting(false);
    //   setSubmitSuccess(true);
    //   resetForm();
    //   setTimeout(() => setSubmitSuccess(false), 3000);
    // }, 1500);

    setIsSubmitting(false)
    if(res.status != 200){
      setSubmitSuccess(false)
    }{
      setSubmitSuccess(true)
      resetForm()
    }
  };

  const handleTestimonialSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // console.log('Testimonial Form Data:', {
    //   type: 'testimonial',
    //   ...testimonialData,
    //   submittedAt: new Date().toISOString()
    // });

    const res = await api.post("/social/testimonial",{
      ...testimonialData
    },{
      "headers":{
        "Authorization":`Bearer ${user.token}`
      }
    })

    console.log("Response:",res)

   // setTimeout(() => {
    //   setIsSubmitting(false);
    //   setSubmitSuccess(true);
    //   resetForm();
    //   setTimeout(() => setSubmitSuccess(false), 3000);
    // }, 1500);

    setIsSubmitting(false)
    if(res.status != 200){
      setSubmitSuccess(false)
    }{
      setSubmitSuccess(true)
      resetForm()
    }
  };

  const handleSuggestionSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // console.log('Suggestion Form Data:', {
    //   type: 'suggestion',
    //   ...suggestionData,
    //   submittedAt: new Date().toISOString()
    // });

    const res = await api.post("/social/suggestion",{
      ...suggestionData
    },{
      "headers":{
        "Authorization":`Bearer ${user.token}`
      }
    })

    console.log("Response:",res)

    // setTimeout(() => {
    //   setIsSubmitting(false);
    //   setSubmitSuccess(true);
    //   resetForm();
    //   setTimeout(() => setSubmitSuccess(false), 3000);
    // }, 1500);

    setIsSubmitting(false)
    if(res.status != 200){
      setSubmitSuccess(false)
    }{
      setSubmitSuccess(true)
      resetForm()
    }
  };

  const StarRating = ({ rating, setRating, label }) => {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">{label} *</label>
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="transition-all duration-200 hover:scale-110"
            >
              <Star
                className={`w-8 h-8 ${
                  star <= rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-600 hover:text-gray-400'
                }`}
              />
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {rating === 0 && 'Select a rating'}
          {rating === 1 && 'Poor'}
          {rating === 2 && 'Fair'}
          {rating === 3 && 'Good'}
          {rating === 4 && 'Very Good'}
          {rating === 5 && 'Excellent'}
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Get in Touch</h1>
          <p className="text-xl text-gray-400">We'd love to hear from you! Choose how you want to reach out.</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-purple-500/20 mb-6 overflow-x-auto">
          <div className="flex min-w-max">
            <button
              onClick={() => setActiveTab('contact')}
              className={`flex-1 py-4 px-6 font-semibold cursor-pointer transition-all flex items-center justify-center space-x-2 ${
                activeTab === 'contact'
                  ? 'text-white border-b-2 border-purple-500 bg-purple-500/10'
                  : 'text-gray-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Mail className="w-5 h-5" />
              <span>Contact Us</span>
            </button>
            
            <button
              onClick={() => setActiveTab('experience')}
              className={`flex-1 py-4 px-6 font-semibold cursor-pointer transition-all flex items-center justify-center space-x-2 ${
                activeTab === 'experience'
                  ? 'text-white border-b-2 border-purple-500 bg-purple-500/10'
                  : 'text-gray-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <MessageCircle className="w-5 h-5" />
              <span>Share Experience</span>
            </button>
            
            <button
              onClick={() => setActiveTab('testimonial')}
              className={`flex-1 py-4 px-6 font-semibold cursor-pointer transition-all flex items-center justify-center space-x-2 ${
                activeTab === 'testimonial'
                  ? 'text-white border-b-2 border-purple-500 bg-purple-500/10'
                  : 'text-gray-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Award className="w-5 h-5" />
              <span>Testimonial</span>
            </button>
            
            <button
              onClick={() => setActiveTab('suggestion')}
              className={`flex-1 py-4 px-6 font-semibold cursor-pointer transition-all flex items-center justify-center space-x-2 ${
                activeTab === 'suggestion'
                  ? 'text-white border-b-2 border-purple-500 bg-purple-500/10'
                  : 'text-gray-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Lightbulb className="w-5 h-5" />
              <span>Suggestions</span>
            </button>
          </div>
        </div>

        {/* Success Message */}
        {submitSuccess && (
          <div className="mb-6 bg-green-500/10 border border-green-500/30 rounded-2xl p-4 flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <p className="text-green-300 font-semibold">Thank you! Your submission has been received successfully.</p>
          </div>
        )}

        {/* Contact Form */}
        {activeTab === 'contact' && (
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-purple-500/20 p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Contact Us</h2>
                <p className="text-gray-400 text-sm">Get in touch with our team</p>
              </div>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Your Name *</label>
                  <input
                    type="text"
                    value={contactData.name}
                    onChange={(e) => setContactData({...contactData, name: e.target.value})}
                    className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email Address *</label>
                  <input
                    type="email"
                    value={contactData.email}
                    onChange={(e) => setContactData({...contactData, email: e.target.value})}
                    className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number (Optional)</label>
                <input
                  type="tel"
                  value={contactData.phone}
                  onChange={(e) => setContactData({...contactData, phone: e.target.value})}
                  className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500"
                  placeholder="+1 234 567 8900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Reason for Contact *</label>
                <select
                  value={contactData.reason}
                  onChange={(e) => setContactData({...contactData, reason: e.target.value})}
                  className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500"
                  required
                >
                  <option value="">Select a reason</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="partnership">Partnership</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Message *</label>
                <textarea
                  value={contactData.message}
                  onChange={(e) => setContactData({...contactData, message: e.target.value})}
                  className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500"
                  placeholder="Tell us more about your inquiry..."
                  rows="5"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r cursor-pointer from-purple-500 to-pink-500 text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Experience Form */}
        {activeTab === 'experience' && (
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-purple-500/20 p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Share Your Experience</h2>
                <p className="text-gray-400 text-sm">Tell us about your experience with QuizMaster</p>
              </div>
            </div>

            <form onSubmit={handleExperienceSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Name or Email *</label>
                <input
                  type="text"
                  value={experienceData.nameOrEmail}
                  onChange={(e) => setExperienceData({...experienceData, nameOrEmail: e.target.value})}
                  className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500"
                  placeholder="Your name or email"
                  required
                />
              </div>

              <StarRating
                rating={experienceData.rating}
                setRating={(rating) => setExperienceData({...experienceData, rating})}
                label="Rate Your Experience"
              />

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Your Experience *</label>
                <textarea
                  value={experienceData.message}
                  onChange={(e) => setExperienceData({...experienceData, message: e.target.value})}
                  className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500"
                  placeholder="Share your experience with QuizMaster..."
                  rows="6"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || experienceData.rating === 0}
                className="w-full bg-gradient-to-r cursor-pointer from-purple-500 to-pink-500 text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <ThumbsUp className="w-5 h-5" />
                    <span>Submit Experience</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Testimonial Form */}
        {activeTab === 'testimonial' && (
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-purple-500/20 p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Write a Testimonial</h2>
                <p className="text-gray-400 text-sm">Help others by sharing your success story</p>
              </div>
            </div>

            <form onSubmit={handleTestimonialSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Your Name *</label>
                  <input
                    type="text"
                    value={testimonialData.name}
                    onChange={(e) => setTestimonialData({...testimonialData, name: e.target.value})}
                    className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Your Role *</label>
                  <input
                    type="text"
                    value={testimonialData.role}
                    onChange={(e) => setTestimonialData({...testimonialData, role: e.target.value})}
                    className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500"
                    placeholder="Teacher, Student, etc."
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Organization/School (Optional)</label>
                <input
                  type="text"
                  value={testimonialData.organization}
                  onChange={(e) => setTestimonialData({...testimonialData, organization: e.target.value})}
                  className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500"
                  placeholder="Your school or organization"
                />
              </div>

              <StarRating
                rating={testimonialData.rating}
                setRating={(rating) => setTestimonialData({...testimonialData, rating})}
                label="Overall Rating"
              />

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Your Testimonial *</label>
                <textarea
                  value={testimonialData.testimonial}
                  onChange={(e) => setTestimonialData({...testimonialData, testimonial: e.target.value})}
                  className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500"
                  placeholder="Write your testimonial here..."
                  rows="6"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Your testimonial may be featured on our website</p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || testimonialData.rating === 0}
                className="w-full bg-gradient-to-r cursor-pointer from-purple-500 to-pink-500 text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Award className="w-5 h-5" />
                    <span>Submit Testimonial</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Suggestion Form */}
        {activeTab === 'suggestion' && (
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-purple-500/20 p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Share Your Suggestions</h2>
                <p className="text-gray-400 text-sm">Help us improve QuizMaster with your ideas</p>
              </div>
            </div>

            <form onSubmit={handleSuggestionSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Your Name *</label>
                  <input
                    type="text"
                    value={suggestionData.name}
                    onChange={(e) => setSuggestionData({...suggestionData, name: e.target.value})}
                    className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email Address *</label>
                  <input
                    type="email"
                    value={suggestionData.email}
                    onChange={(e) => setSuggestionData({...suggestionData, email: e.target.value})}
                    className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category *</label>
                <select
                  value={suggestionData.category}
                  onChange={(e) => setSuggestionData({...suggestionData, category: e.target.value})}
                  className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="feature">New Feature</option>
                  <option value="improvement">Improvement</option>
                  <option value="ui">UI/UX Design</option>
                  <option value="performance">Performance</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Your Suggestion *</label>
                <textarea
                  value={suggestionData.suggestion}
                  onChange={(e) => setSuggestionData({...suggestionData, suggestion: e.target.value})}
                  className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500"
                  placeholder="Describe your suggestion in detail..."
                  rows="6"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r cursor-pointer from-purple-500 to-pink-500 text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Lightbulb className="w-5 h-5" />
                    <span>Submit Suggestion</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}