import React, { useEffect, useState } from 'react';
import { 
  Edit, Save, X, Plus, Trash2, Clock, Calendar, 
  Users, BarChart, CheckCircle, Lock, Unlock, 
  AlertCircle, TrendingUp, Award,
  Loader,
  BluetoothConnectedIcon
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import api from '../util/authApi';
import { useAuth } from '../context/AuthProvider';

export default function QuizDetailPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const {id} = useParams()
  const [quizDetail, setquizDetail] = useState([])
  const {user,isLoggedIn} = useAuth();
  const [loading, setLoading] = useState(false)
  const [quesData, setQuesData] = useState({
    title: '',
    description: '',
    duration: '',
    questions: []
  });
  const [currentQuestion, setCurrentQuestion] = useState({
    title: '',
    options: ['', '', '', ''],
    correctAns: ''
  });

  useEffect(() => {
    const fetchDetail = async ()=>{
        const res = await api.get(`/quiz/${id}`,{
            headers:{
                "Authorization":`Bearer ${user.token}`
            }
        })
        // console.log(res)
        setquizDetail(res.data)
    }
    fetchDetail()    
  }, [id])
  
  
  const [quizData, setQuizData] = useState({
    id: id,
    title: quizDetail.name,
    description: quizDetail.desc,
    duration: quizDetail.valid_till,
    isActive: quizDetail.close,
    createdDate: quizDetail.created_at,
    totalAttempts: 0,
    avgScore: 0
  });

  const [questions, setQuestions] = useState([]);

  const [results, setResults] = useState([]);

  const [newQuestion, setNewQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0
  });

  const [editingData, setEditingData] = useState({
    title: quizData.title,
    description: quizData.description,
    duration: quizData.duration
  });

  const handleEditClick = () => {
    setIsEditing(true);
    setEditingData({
      title: quizData.title,
      description: quizData.description,
      duration: quizData.duration
    });
  };

  const handleSaveEdit = () => {
    setQuizData({
      ...quizData,
      ...editingData
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingData({
      title: quizData.title,
      description: quizData.description,
      duration: quizData.duration
    });
  };

  const toggleQuizStatus = () => {
    setQuizData({
      ...quizData,
      isActive: !quizData.isActive
    });
  };

  const addOption = () => {
    if (newQuestion.options.length < 6) {
      setNewQuestion({
        ...newQuestion,
        options: [...newQuestion.options, '']
      });
    }
  };

  const removeOption = (index) => {
    if (newQuestion.options.length > 4) {
      const newOptions = newQuestion.options.filter((_, i) => i !== index);
      setNewQuestion({
        ...newQuestion,
        options: newOptions,
        correctAnswer: newQuestion.correctAnswer >= index ? Math.max(0, newQuestion.correctAnswer - 1) : newQuestion.correctAnswer
      });
    }
  };

  const updateOption = (index, value) => {
    const newOptions = [...newQuestion.options];
    newOptions[index] = value;
    setNewQuestion({
      ...newQuestion,
      options: newOptions
    });
  };

  const addQuestion = () => {
    if (newQuestion.question && newQuestion.options.every(opt => opt.trim())) {
      setQuestions([
        ...questions,
        {
          id: questions.length + 1,
          ...newQuestion
        }
      ]);
      setNewQuestion({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0
      });
      setShowAddQuestion(false);
    }
  };

  const deleteQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleSubmit = (e)=>{
    e.preventDefault()
    console.log(questions)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-500/20 p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editingData.title}
                    onChange={(e) => setEditingData({...editingData, title: e.target.value})}
                    className="w-full bg-slate-800/50 border border-slate-700 text-white text-2xl font-bold rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500"
                    placeholder="Quiz Title"
                  />
                  <textarea
                    value={editingData.description}
                    onChange={(e) => setEditingData({...editingData, description: e.target.value})}
                    className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500"
                    placeholder="Quiz Description"
                    rows="2"
                  />
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <label className="block text-sm text-gray-400 mb-2">Duration (minutes)</label>
                      <input
                        type="number"
                        value={editingData.duration}
                        onChange={(e) => setEditingData({...editingData, duration: e.target.value})}
                        className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl py-2 px-4 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{quizData.title}</h1>
                  <p className="text-gray-400 mb-4">{quizData.description}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <span className="flex items-center space-x-2 text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>{quizData.duration} minutes</span>
                    </span>
                    <span className="flex items-center space-x-2 text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>Created: {quizData.createdDate}</span>
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      quizData.isActive 
                        ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                        : 'bg-red-500/20 text-red-300 border border-red-500/30'
                    }`}>
                      {quizData.isActive ? 'Active' : 'Closed'}
                    </span>
                  </div>
                </>
              )}
            </div>
            
            <div className="flex flex-wrap gap-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSaveEdit}
                    className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl transition-all duration-300"
                  >
                    <Save className="w-5 h-5" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex items-center space-x-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-xl transition-all duration-300"
                  >
                    <X className="w-5 h-5" />
                    <span>Cancel</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleEditClick}
                    className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-xl transition-all duration-300"
                  >
                    <Edit className="w-5 h-5" />
                    <span>Edit Quiz</span>
                  </button>
                  <button
                    onClick={toggleQuizStatus}
                    className={`flex items-center space-x-2 ${
                      quizData.isActive 
                        ? 'bg-red-500 hover:bg-red-600' 
                        : 'bg-green-500 hover:bg-green-600'
                    } text-white px-4 py-2 rounded-xl transition-all duration-300`}
                  >
                    {quizData.isActive ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
                    <span>{quizData.isActive ? 'Close Quiz' : 'Open Quiz'}</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-purple-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Total Questions</span>
                <BarChart className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white">{questions.length}</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-purple-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Total Attempts</span>
                <Users className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white">{quizData.totalAttempts}</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-purple-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Average Score</span>
                <TrendingUp className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white">{quizData.avgScore}%</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-purple-500/20 mb-6">
          <div className="flex border-b border-slate-700">
            <button
              onClick={() => setActiveTab('details')}
              className={`flex-1 py-4 px-6 font-semibold transition-all ${
                activeTab === 'details'
                  ? 'text-white border-b-2 border-purple-500 bg-purple-500/10'
                  : 'text-gray-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Questions
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`flex-1 py-4 px-6 font-semibold transition-all ${
                activeTab === 'results'
                  ? 'text-white border-b-2 border-purple-500 bg-purple-500/10'
                  : 'text-gray-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Results ({results.length})
            </button>
          </div>
        </div>

        {/* Questions Tab */}
        {activeTab === 'details' && (
          <div className="space-y-4">
            {/* Add Question Button */}
            {!showAddQuestion && (
              <button
                onClick={() => setShowAddQuestion(true)}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg hover:shadow-purple-500/50 text-white font-semibold py-4 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Add New Question</span>
              </button>
            )}

            {/* Add Question Form */}
            {showAddQuestion && (
              <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-purple-500/20 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-white">Add New Question</h3>
                  <button
                    onClick={() => setShowAddQuestion(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Question *</label>
                    <input
                      type="text"
                      value={newQuestion.question}
                      onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})}
                      className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500"
                      placeholder="Enter your question"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-300">Options (4-6) *</label>
                      {newQuestion.options.length < 6 && (
                        <button
                          onClick={addOption}
                          className="text-purple-400 hover:text-purple-300 text-sm flex items-center space-x-1"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Option</span>
                        </button>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      {newQuestion.options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <input
                            type="radio"
                            name="correctAnswer"
                            checked={newQuestion.correctAnswer === index}
                            onChange={() => setNewQuestion({...newQuestion, correctAnswer: index})}
                            className="w-5 h-5 text-purple-500 focus:ring-purple-500"
                          />
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => updateOption(index, e.target.value)}
                            className="flex-1 bg-slate-800/50 border border-slate-700 text-white rounded-xl py-2 px-4 focus:outline-none focus:border-purple-500"
                            placeholder={`Option ${index + 1}`}
                          />
                          {newQuestion.options.length > 4 && (
                            <button
                              onClick={() => removeOption(index)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Select the radio button for the correct answer</p>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={addQuestion}
                      disabled={!newQuestion.question || !newQuestion.options.every(opt => opt.trim())}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add Question
                    </button>
                    <button
                      onClick={() => setShowAddQuestion(false)}
                      className="px-6 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-xl transition-all duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
                  

            {/* Questions List */}
            {questions.map((q, index) => (
              <div key={q.id} className="bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-purple-500/20 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-3">
                      Q{index + 1}. {q.question}
                    </h3>
                    <div className="space-y-2">
                      {q.options.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          className={`flex items-center space-x-3 p-3 rounded-lg ${
                            optIndex === q.correctAnswer
                              ? 'bg-green-500/10 border border-green-500/30'
                              : 'bg-slate-800/50 border border-slate-700'
                          }`}
                        >
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            optIndex === q.correctAnswer ? 'bg-green-500' : 'bg-slate-700'
                          }`}>
                            {optIndex === q.correctAnswer && <CheckCircle className="w-4 h-4 text-white" />}
                          </div>
                          <span className={`${
                            optIndex === q.correctAnswer ? 'text-green-300 font-semibold' : 'text-gray-300'
                          }`}>
                            {option}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteQuestion(q.id)}
                    className="ml-4 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}

            {questions.length === 0 && !showAddQuestion && (
              <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-purple-500/20 p-12 text-center">
                <AlertCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No questions added yet. Click "Add New Question" to get started.</p>
              </div>
            )}
            <div className="flex space-x-4">
                  <button
                    onClick={handleSubmit}
                    // disabled={quizData.questions.length === 0}
                    className="flex-1 items-center justify-center bg-gradient-to-r cursor-pointer from-purple-500 to-pink-500 text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {
                        loading ? (
                          <>
                            <Loader className="w-5 h-5 text-center animate-spin" />
                          </>
                        ):(
                          'Submit Quiz & Get Link'
                        )
                      }
                  </button>
                </div>
          </div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && (
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-purple-500/20 p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Quiz Results</h2>
            
            {results.length > 0 ? (
              <div className="space-y-4">
                {results.map((result) => (
                  <div key={result.id} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-purple-500/50 transition-all">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-2">{result.studentName}</h3>
                        <p className="text-gray-400 text-sm mb-2">{result.email}</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{result.completedDate}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{result.duration} min</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <CheckCircle className="w-4 h-4" />
                            <span>{result.correct}/{result.attempted} correct</span>
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className={`text-3xl font-bold ${
                            result.score >= 80 ? 'text-green-400' :
                            result.score >= 60 ? 'text-yellow-400' :
                            'text-red-400'
                          }`}>
                            {result.score}%
                          </div>
                          <div className="text-sm text-gray-400">Score</div>
                        </div>
                        <Award className={`w-8 h-8 ${
                          result.score >= 80 ? 'text-green-400' :
                          result.score >= 60 ? 'text-yellow-400' :
                          'text-red-400'
                        }`} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No one has taken this quiz yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}