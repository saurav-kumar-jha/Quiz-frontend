import React, { useState, useEffect } from 'react';
import { Menu, X, CheckCircle, Users, Zap, Shield, ArrowRight, Star, BookOpen, Award, Clock, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthProvider';
import api from '../util/authApi';

export default function QuizMasterHomepage() {
  const {user,setUser,isLoggedIn,setisLoggedIn} = useAuth()
  // console.log("User:",user,"islogin:",isLoggedIn);
  const [testimonial, setTestimonial] = useState([])

  useEffect(()=>{
    fetchTestimonials()
  },[])
  
  const fetchTestimonials = async ()=>{
    const res = await api.get("/social/testimonial",{
      "headers":{
        "Authorization":`Bearer ${user.token}`
      }
    })

    setTestimonial(res?.data)

    console.log("Response:", res)
  }

  const getAvatar = (name = "")=>{
    if(!name) return "?";

    const words = name.trim().split(/\s+/);

    if(words.length === 1){
      return words[0][0].toUpperCase();
    }

    return (
      words[0][0].toUpperCase()+
      words[words.length-1][0].toUpperCase()
    )
  }

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Create and deploy quizzes in minutes, not hours"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Reliable",
      description: "Your data is encrypted and safely stored"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Unlimited Students",
      description: "Share with as many students as you need"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Instant Results",
      description: "Real-time grading and detailed analytics"
    }
  ];

  const usedBy = [
    "Schools & Colleges",
    "Online Tutors",
    "Corporate Training",
    "Educational Institutions",
    "Coaching Centers",
    "Self-Learners"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-block">
                <span className="bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full text-sm font-semibold border border-purple-500/30">
                  100% Free Forever
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
                Create Quizzes.
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Share Instantly.</span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Empower education with our completely free quiz platform. Designed by educators, for educators. Create engaging assessments, share them with a simple link, and track student progress—all without spending a penny.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 flex items-center justify-center group">
                  Start Creating Free
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="border-2 border-purple-400 text-purple-400 px-8 py-4 rounded-full font-semibold text-lg hover:bg-purple-400/10 transition-all duration-300">
                  Watch Demo
                </button>
              </div>
              <div className="flex items-center space-x-8 pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">50K+</div>
                  <div className="text-gray-400 text-sm">Active Teachers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">2M+</div>
                  <div className="text-gray-400 text-sm">Quizzes Created</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">10M+</div>
                  <div className="text-gray-400 text-sm">Students Served</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur-3xl opacity-20 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-3xl border border-purple-500/20 shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop" 
                  alt="Students collaborating" 
                  className="rounded-2xl w-full h-auto shadow-lg"
                />
                <div className="absolute -bottom-6 -right-6 bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-2xl shadow-2xl">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-8 h-8 text-white" />
                    <div>
                      <div className="text-2xl font-bold text-white">98%</div>
                      <div className="text-sm text-purple-100">Satisfaction Rate</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why Choose QuizMaster?
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Built with passion to make education accessible and assessment effortless for everyone
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:-translate-y-2 group"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Simple, Fast, Effective
            </h2>
            <p className="text-xl text-gray-400">Create your first quiz in under 5 minutes</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto text-2xl font-bold text-white">
                1
              </div>
              <h3 className="text-2xl font-bold text-white">Create Quiz</h3>
              <p className="text-gray-400">Add questions with our intuitive editor. Multiple choice, true/false, or short answer—you choose!</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto text-2xl font-bold text-white">
                2
              </div>
              <h3 className="text-2xl font-bold text-white">Share Link</h3>
              <p className="text-gray-400">Get a unique link and share it with your students via email, messaging apps, or your LMS.</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto text-2xl font-bold text-white">
                3
              </div>
              <h3 className="text-2xl font-bold text-white">Track Results</h3>
              <p className="text-gray-400">View instant results, analyze performance, and identify areas where students need help.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Used By Section */}
      <section className="py-20 px-4 bg-slate-900/50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Trusted By Educators Worldwide
          </h2>
          <p className="text-xl text-gray-400 mb-12">Our platform is used across diverse educational settings</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {usedBy.map((user, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300"
              >
                <p className="text-white font-semibold">{user}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              What Educators Say
            </h2>
            <p className="text-xl text-gray-400">Join thousands of satisfied teachers worldwide</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonial.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 space-y-4"
              >
                <div className="flex space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 italic">"{testimonial.testimonial}"</p>
                <div className="flex items-center space-x-3 pt-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                    {getAvatar(testimonial.name)}
                  </div>
                  <div>
                    <div className="text-white font-semibold">{testimonial.name}</div>
                    <div className="text-gray-400 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-12 rounded-3xl shadow-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Teaching?
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              Join thousands of educators who are already creating amazing quizzes for free
            </p>
            <button className="bg-white text-purple-600 px-10 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
              Create Your First Quiz Now
            </button>
          </div>
        </div>
      </section>
      
    </div>
  );
}