import { BookOpen, Menu, X, User } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

function Nav() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate()
    const {user, isLoggedIn, setIsLoggedIn} = useAuth();  

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-slate-900/95 backdrop-blur-lg shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">QuizMaster</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-white hover:text-purple-400 transition-colors font-medium">Home</Link>
              <Link to="/teacher/dashboard" className="text-white hover:text-purple-400 transition-colors font-medium">Create Quiz</Link>
              <Link to="#contact" className="text-white hover:text-purple-400 transition-colors font-medium">Contact</Link>
              
              {isLoggedIn ? (
                <button 
                  onClick={() => navigate("/teacher/dashboard")} 
                  className="w-10 h-10 bg-gradient-to-r cursor-pointer from-purple-500 to-pink-500 rounded-full flex items-center justify-center hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
                  title="Go to Profile"
                >
                  <User className="w-5 h-5 text-white" />
                </button>
              ) : (
                <button 
                  onClick={() => navigate("/auth")} 
                  className="bg-gradient-to-r cursor-pointer from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 font-semibold"
                >
                  Get Started
                </button>
              )}
            </div>

            <button 
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */} 
        {isMenuOpen && (
          <div className="md:hidden bg-slate-900/98 backdrop-blur-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link to="/" className="block px-3 py-2 text-white hover:bg-purple-500/20 rounded-md">Home</Link>
              <Link to="/teacher/dashboard" className="block px-3 py-2 text-white hover:bg-purple-500/20 rounded-md">Create Quiz</Link>
              <Link to="#contact" className="block px-3 py-2 text-white hover:bg-purple-500/20 rounded-md">Contact</Link>
              
              {isLoggedIn ? (
                <button 
                  onClick={() => navigate("/teacher/dashboard")} 
                  className="w-full flex items-center space-x-2 px-3 py-2 text-white hover:bg-purple-500/20 rounded-md"
                >
                  <User className="w-5 h-5" />
                  <span>Profile</span>
                </button>
              ) : (
                <button 
                  onClick={() => navigate("/auth")} 
                  className="w-full text-left px-3 py-2 text-white hover:bg-purple-500/20 rounded-md font-semibold"
                >
                  Get Started
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
  )
}

export default Nav