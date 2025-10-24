import React, { useState, useEffect } from 'react';
import {
  Clock, User, CheckCircle, AlertCircle,
  BookOpen, Send, RotateCcw, Timer, Loader
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import api from '../util/authApi';

export default function StudentQuizPage() {
  const [studentName, setStudentName] = useState('');
  const [hasStarted, setHasStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchQuiz = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/student/${id}`);
        console.log("Quiz response:", res.data);
        setQuizData(res.data);

        if (res.data.valid) {
          setTimeLeft(res.data.valid * 60);
        }
      } catch (error) {
        console.error("Error fetching quiz:", error);
      }
      setLoading(false);
    };
    fetchQuiz();
  }, [id]);

  useEffect(() => {
    if (hasStarted && !isSubmitted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [hasStarted, isSubmitted, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timeLeft <= 60) return 'text-red-400';
    if (timeLeft <= 300) return 'text-yellow-400';
    return 'text-green-400';
  };

  const handleStartExam = () => {
    if (studentName.trim()) {
      setHasStarted(true);
    } else {
      alert('Please enter your name to start the exam');
    }
  };

  const handleAnswerSelect = (questionId, answer) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleClearAnswer = (questionId) => {
    setSelectedAnswers(prev => {
      const updated = { ...prev };
      delete updated[questionId];
      return updated;
    });
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all answers?')) {
      setSelectedAnswers({});
    }
  };

  const handleAutoSubmit = () => {
    submitQuiz();
  };

  const handleSubmitClick = () => {
    setShowSubmitConfirm(true);
  };

  const submitQuiz = async () => {
    setIsSubmitted(true);
    setShowSubmitConfirm(false);

    const submissionData = {
      studentName,
      quizName: quizData?.quizName,
      answers: selectedAnswers,
      timeUsed: (quizData?.valid * 60) - timeLeft,
      submittedAt: new Date().toISOString()
    };

    console.log('Quiz Submitted:', submissionData);

    // ✅ (Optional) Send submission to backend
    // try {
    //   await api.post('/student/submit', submissionData);
    // } catch (error) {
    //   console.error('Error submitting quiz:', error);
    // }
  };

  const getAnsweredCount = () => Object.keys(selectedAnswers).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <Loader className="w-10 h-10 animate-spin text-purple-400" />
      </div>
    );
  }

  if (!quizData) {
    return <div className="min-h-screen flex items-center justify-center text-white bg-slate-900">No quiz data found.</div>;
  }

  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="relative w-full max-w-md">
          <div className="flex items-center justify-center space-x-2 mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold text-white">QuizMaster</span>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-500/20 p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">{quizData.quizName}</h2>
              <p className="text-gray-400 mb-4">{quizData.quizDesc}</p>
              <div className="inline-flex items-center space-x-2 bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full border border-purple-500/30">
                <Clock className="w-4 h-4" />
                <span className="font-semibold">Duration: {quizData.valid} min</span>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Your Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    placeholder="Enter your name"
                    onKeyPress={(e) => e.key === 'Enter' && handleStartExam()}
                  />
                </div>
              </div>

              <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700">
                <h3 className="text-white font-semibold mb-2">Instructions:</h3>
                <ul className="space-y-1 text-sm text-gray-400">
                  <li>• Total Questions: {quizData.questions?.length}</li>
                  <li>• Time Limit: {quizData.valid} minutes</li>
                  <li>• Select one answer per question</li>
                  <li>• Quiz auto-submits when time expires</li>
                </ul>
              </div>

              <button
                onClick={handleStartExam}
                disabled={!studentName.trim()}
                className="w-full bg-gradient-to-r cursor-pointer from-purple-500 to-pink-500 text-white font-semibold py-4 rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Start Exam
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="relative w-full max-w-2xl">
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-500/20 p-8 text-center">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Quiz Submitted Successfully!</h2>
            <p className="text-gray-400 mb-6">Thank you, {studentName}</p>

            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <div className="text-gray-400 text-sm mb-1">Answered</div>
                <div className="text-2xl font-bold text-white">{getAnsweredCount()}/{quizData.questions.length}</div>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <div className="text-gray-400 text-sm mb-1">Time Used</div>
                <div className="text-2xl font-bold text-white">{formatTime((quizData.valid * 60) - timeLeft)}</div>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <div className="text-gray-400 text-sm mb-1">Status</div>
                <div className="text-2xl font-bold text-green-400">Submitted</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm">Your results will be shared soon.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="bg-slate-900/80 rounded-2xl shadow-xl border border-purple-500/20 p-6 mb-6 sticky top-4 z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">{quizData.quizName}</h1>
              <p className="text-gray-400 text-sm">Student: {studentName}</p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700">
                <Timer className="w-5 h-5 text-purple-400" />
                <span className="text-gray-400 text-sm">Progress:</span>
                <span className="text-white font-semibold">{getAnsweredCount()}/{quizData.questions.length}</span>
              </div>

              <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl border ${
                timeLeft <= 60 ? 'bg-red-500/20 border-red-500/30' :
                timeLeft <= 300 ? 'bg-yellow-500/20 border-yellow-500/30' :
                'bg-green-500/20 border-green-500/30'
              }`}>
                <Clock className={`w-5 h-5 ${getTimeColor()}`} />
                <span className={`text-xl font-bold ${getTimeColor()}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6 mb-6">
          {quizData.questions.map((question, index) => (
            <div key={question.id} className="bg-slate-900/80 rounded-2xl shadow-xl border border-purple-500/20 p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-white flex-1">
                  <span className="text-purple-400 mr-2">Q{index + 1}.</span>
                  {question.title}
                </h3>
                {selectedAnswers[question.id] && (
                  <button
                    onClick={() => handleClearAnswer(question.id)}
                    className="text-red-400 cursor-pointer hover:text-red-300 text-sm flex items-center space-x-1"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Clear</span>
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {question.options.map((option, optIndex) => {
                  const isSelected = selectedAnswers[question.id] === option;
                  return (
                    <button
                      key={optIndex}
                      onClick={() => handleAnswerSelect(question.id, option)}
                      className={`w-full text-left p-4 cursor-pointer rounded-xl border transition-all duration-300 ${
                        isSelected
                          ? 'bg-purple-500/20 border-purple-500 shadow-lg shadow-purple-500/20'
                          : 'bg-slate-800/50 border-slate-700 hover:border-purple-500/50 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-purple-500 bg-purple-500' : 'border-slate-600'
                        }`}>
                          {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                        </div>
                        <span className={`font-medium ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                          {option}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="bg-slate-900/80 rounded-2xl shadow-xl border border-purple-500/20 p-6 sticky bottom-4">
          <div className="flex flex-col md:flex-row gap-3">
            <button
              onClick={handleClearAll}
              className="flex-1 bg-slate-700 cursor-pointer hover:bg-slate-600 text-white font-semibold py-3 rounded-xl flex items-center justify-center space-x-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Clear All</span>
            </button>

            <button
              onClick={handleSubmitClick}
              className="flex-1 bg-gradient-to-r cursor-pointer from-green-500 to-emerald-500 hover:shadow-lg hover:shadow-green-500/50 text-white font-semibold py-3 rounded-xl flex items-center justify-center space-x-2"
            >
              <Send className="w-5 h-5" />
              <span>Submit Quiz</span>
            </button>
          </div>

          {getAnsweredCount() < quizData.questions.length && (
            <div className="mt-3 flex items-center justify-center space-x-2 text-yellow-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>You have {quizData.questions.length - getAnsweredCount()} unanswered question(s)</span>
            </div>
          )}
        </div>
      </div>

      {/* Confirm Submit Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 rounded-3xl shadow-2xl border border-purple-500/20 p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <Send className="w-8 h-8 text-green-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Submit Quiz?</h3>
              <p className="text-gray-400 mb-4">
                You answered {getAnsweredCount()} of {quizData.questions.length} questions.
              </p>
              {getAnsweredCount() < quizData.questions.length && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3 mb-4">
                  <p className="text-yellow-400 text-sm">
                    Warning: {quizData.questions.length - getAnsweredCount()} unanswered question(s)
                  </p>
                </div>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="flex-1 bg-slate-700 cursor-pointer hover:bg-slate-600 text-white py-3 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={submitQuiz}
                className="flex-1 bg-green-500 cursor-pointer hover:bg-green-600 text-white py-3 rounded-xl"
              >
                Yes, Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
