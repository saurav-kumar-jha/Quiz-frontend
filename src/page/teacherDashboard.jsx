import React, { useEffect, useState } from 'react';
import { 
  BookOpen, Plus, List, User, LogOut, BarChart, 
  Share2, Copy, CheckCircle, X, Trash2, Edit, 
  Facebook, Twitter, Linkedin, Mail, Clock, Users, 
  Loader,
  CircleOff,
  Circle
} from 'lucide-react';
import { useAuth } from '../context/AuthProvider';
import api from '../util/authApi';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState('profile');
  const [searchParams, setSearchParams] = useSearchParams()
  const [showCreateQuiz, setShowCreateQuiz] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [showCreateQuizOpt, setShowCreateQuizOpt] = useState(true)
  const [userQuizData, setUserQuizData] = useState()
  const {user,setUser,isLoggedIn,setIsLoggedIn, logout, Isloading} = useAuth();  
  const [quizId, setQuizId] = useState('')
  const [quizData, setQuizData] = useState({
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
  const [previousQuizzes, setPreviousQuizzes] = useState([]);
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // console.log(user, isLoggedIn)
  // console.log(userQuizData) 

  useEffect(()=>{
    const tabfromUrl = searchParams.get('tab')
    if(tabfromUrl){
      setActiveTab(tabfromUrl)
      if(tabfromUrl == 'create'){
        setShowCreateQuiz(true);
      }
    }
  },[searchParams])

  useEffect(()=>{
    if(!isLoggedIn){
      navigate("/auth")
    }
  },[])

  useEffect(() => {

    if(Isloading || !user.token){
      return;
    }

    const fetchQuizz = async ()=>{
      try {
        const res = await api.get(`/auth/${user.id}`,{
          headers:{
            "Authorization":`Bearer ${user.token}`
          }
        })
        console.log(res.data[0].quiz)
        const quiz = res.data[0]?.quiz || []
        setPreviousQuizzes(quiz)
        setQuizData(prev => ({
          ...prev,
          questions: quiz.questions && quiz.questions.length > 0 
            ? quiz.questions 
            : prev.questions
        }));
      } catch (error) {
        console.error("Error:",error.message) 
      }
    }
    fetchQuizz()
    
  }, [user, loading])
  
  

  const teacherProfile = {
    name: user.name,
    email: user.email,
    role: user.role,
    subject: '',
    joinDate:  user?.created_at
    ? new Date(user.created_at).toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Unknown",
    totalQuizzes: previousQuizzes.length,
    totalStudents: 350,
    avatar: user?.name?.charAt(0).toUpperCase()
  };

  const addOption = () => {
    if (currentQuestion.options.length < 6) {
      setCurrentQuestion({
        ...currentQuestion,
        options: [...currentQuestion.options, '']
      });
    }
  };

  const removeOption = (index) => {
    if (currentQuestion.options.length > 4) {
      const newOptions = currentQuestion.options.filter((_, i) => i !== index);
      setCurrentQuestion({
        ...currentQuestion,
        options: newOptions,
        correctAnswer: currentQuestion.correctAns >= index ? Math.max(0, currentQuestion.correctAns - 1) : currentQuestion.correctAns
      });
    }
  };

  const updateOption = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion({
      ...currentQuestion,
      options: newOptions
    });
  };

  const addQuestion = () => {
    if (currentQuestion.title && currentQuestion.options.every(opt => opt.trim())) {
      setQuizData({
        ...quizData,
        questions: [...quizData.questions, currentQuestion]
      });
      setCurrentQuestion({
        title: '',
        options: ['', '', '', ''],
        correctAns: ''
      });
    }
  };

  const removeQuestion = (index) => {
    setQuizData({
      ...quizData,
      questions: quizData.questions.filter((_, i) => i !== index)
    });
  };

  const submitQuiz =async () => {
    setLoading(true)
    // console.log("quizId:",quizId,"questions:",quizData.questions)
    if (quizData.questions.length > 0) {
      const res = await api.post(`/quiz/${quizId}/addQuestion`,{
        quizId:quizId,
        questions:quizData.questions
      },{
        headers:{
          "Authorization":`Bearer ${user.token}`
        }
      })

      // console.log("res:",res)

      // setShowShareModal(true);
      setShowCreateQuiz(true);
      
      setPreviousQuizzes([
        {
          id: previousQuizzes.length + 1,
          title: quizData.title,
          date: new Date().toISOString().split('T')[0],
          students: 0,
          avgScore: 0,
          link: ''
        },
        ...previousQuizzes
      ]);
      
      setQuizData({
        title: '',
        description: '',
        duration: '',
        questions: []
      });
    }
    setLoading(false)
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const shareOnSocial = (platform) => {
    const text = `Check out my new quiz!`;
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(generatedLink)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(generatedLink)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(generatedLink)}`,
      email: `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(generatedLink)}`
    };
    window.open(urls[platform], '_blank');
  };

  const handleCreateQuiz =async (e)=>{
    e.preventDefault()
    // console.log("quizData:",quizData.title,quizData.description,quizData.duration)
    
    setLoading(true)
    try {
      const res = await api.post("/quiz/create",{
        name:quizData.title,
        desc:quizData.description,
        validTill:quizData.duration,
        teacherId:user.id
      },{
        headers:{
          "Authorization":`Bearer ${user.token}`
        }
      })
      setActiveTab("quizzes")
      // console.log("res:",res)
      // setUserQuizData(res.data)
      // localStorage.setItem("quizData",JSON.stringify(res.data))
      // setShowAddQuestion(true)
      // setShowCreateQuizOpt(false)
      
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }

  const handleDeleteQuiz = async(id)=>{
    try {
      const res = await api.delete(`/quiz/${id}`,{
        headers:{
          "Authorization": `Bearer ${user.token}`
        }
      })
      console.log(res)
      setPreviousQuizzes((prev)=>prev.filter((quiz)=>quiz.id !== id))
    } catch (error) {
      console.log(error)
    }
  }

  const handleGenerateQuizLink = async(id)=>{
    try {
      const res = await api.get(`/quiz/generate-link/${id}`,{
        headers:{
          "Authorization":`Bearer ${user.token}`
        }
      })
      // console.log(res)
      setGeneratedLink(res.data);
      setShowShareModal(true);
      
    } catch (error) {
      console.log(error)
    }
  }

  const handleAddQuestion = (id)=>{
    setQuizId(id)
    setShowAddQuestion(true)
    setActiveTab('create')
    setShowCreateQuizOpt(false)
    setShowCreateQuiz(true)
  }

  const handleLogout = () => {
    logout()
    navigate("/")
  };

  const handleQuizStatus = async (id)=>{
    try {
      const res = await api.put(`/quiz/${id}/close`,{},{
        headers:{
          "Authorization":`Bearer ${user.token}`,
          "Content-Type":"application/json"
        }
      })
      console.log("close res: ",res)
      setPreviousQuizzes((prev) =>
        prev.map((quiz) =>
          quiz.id === id ? { ...quiz, close: !quiz.close } : quiz
        )
      );
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <nav className="bg-slate-900/95 backdrop-blur-lg shadow-lg border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              {/* <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">QuizMaster</span> */}
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                {/* <div className="text-white font-semibold">{teacherProfile.name}</div>
                <div className="text-gray-400 text-sm">{teacherProfile.role}</div> */}
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold">
                {/* {teacherProfile.avatar} */}
              </div>
              <button className="text-gray-400 hover:text-white transition-colors">
                {/* <LogOut className="w-5 h-5" /> */}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-purple-500/20 p-6 sticky top-8">
              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center cursor-pointer space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    activeTab === 'profile'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'text-gray-400 hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span className="font-semibold">Profile</span>
                </button>
                
                <button
                  onClick={() => {
                    setActiveTab('create');
                    setShowCreateQuiz(true);
                  }}
                  className={`w-full flex items-center cursor-pointer space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    activeTab === 'create'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'text-gray-400 hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  <Plus className="w-5 h-5" />
                  <span className="font-semibold">Create Quiz</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('quizzes')}
                  className={`w-full flex items-center cursor-pointer space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    activeTab === 'quizzes'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'text-gray-400 hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  <List className="w-5 h-5" />
                  <span className="font-semibold">My Quizzes</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('results')}
                  className={`w-full flex items-center cursor-pointer space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    activeTab === 'results'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'text-gray-400 hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  <BarChart className="w-5 h-5" />
                  <span className="font-semibold">Results</span>
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
          {activeTab === 'profile' && (
  <div className="space-y-6">
    <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-purple-500/20 p-8">
      <div className="flex items-center space-x-6 mb-8">
        <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
          {teacherProfile.avatar}
        </div>
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-white mb-2">{teacherProfile.name}</h2>
          <p className="text-gray-400">{teacherProfile.email}</p>
          <div className="flex items-center space-x-4 mt-2">
            <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm">
              {teacherProfile.role}
            </span>
            <span className="text-gray-400 text-sm">Joined {teacherProfile.joinDate}</span>
          </div>
        </div>
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="flex items-center cursor-pointer space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition-all duration-300"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Total Quizzes</span>
            <List className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-white">{teacherProfile.totalQuizzes}</div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Total Students</span>
            <Users className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-white">{teacherProfile.totalStudents}</div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Subject</span>
            <BookOpen className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-lg font-bold text-white">{teacherProfile.subject}</div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold text-white mb-4">Profile Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
            <input
              type="text"
              value={teacherProfile.name}
              className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
            <input
              type="email"
              value={teacherProfile.email}
              className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Role</label>
            <input
              type="text"
              value={teacherProfile.role}
              className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500"
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  </div>
)}

{/* Logout Confirmation Modal */}
{showLogoutConfirm && (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div className="bg-slate-900 rounded-3xl shadow-2xl border border-purple-500/20 p-8 max-w-md w-full">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <LogOut className="w-8 h-8 text-red-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Logout Confirmation</h3>
        <p className="text-gray-400">Are you sure you want to logout from your account?</p>
      </div>

      <div className="flex space-x-3">
        <button
          onClick={() => setShowLogoutConfirm(false)}
          className="flex-1 bg-slate-700 cursor-pointer hover:bg-slate-600 text-white font-semibold py-3 rounded-xl transition-all duration-300"
        >
          Cancel
        </button>
        <button
          onClick={handleLogout}
          className="flex-1 bg-red-500 hover:bg-red-600 cursor-pointer text-white font-semibold py-3 rounded-xl transition-all duration-300"
        >
          Yes, Logout
        </button>
      </div>
    </div>
  </div>
)}

            {activeTab === 'create'  && showCreateQuiz && (
              <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-purple-500/20 p-8">
                <h2 className="text-3xl font-bold text-white mb-6">Create New Quiz</h2>
                {showCreateQuizOpt && (
                  <div className="space-y-4 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Quiz Title *</label>
                    <input
                      type="text"
                      value={quizData.title}
                      onChange={(e) => setQuizData({...quizData, title: e.target.value})}
                      className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                      placeholder="Enter quiz title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                    <textarea
                      value={quizData.description}
                      onChange={(e) => setQuizData({...quizData, description: e.target.value})}
                      className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                      placeholder="Brief description of the quiz"
                      rows="3"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Duration (minutes)</label>
                    <input
                      type="number"
                      value={quizData.duration}
                      onChange={(e) => setQuizData({...quizData, duration: e.target.value})}
                      className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                      placeholder="30"
                    />
                  </div>
                  <button
                  onClick={handleCreateQuiz}
                      className="w-full bg-purple-500 cursor-pointer flex items-center justify-center hover:bg-purple-600 text-white font-semibold py-3 rounded-xl transition-all duration-300"
                    >
                      {
                        loading ? (
                          <>
                            <Loader className="w-5 h-5 text-center animate-spin" />
                          </>
                        ):(
                          'Create Quiz'
                        )
                      }
                    </button>
                </div>
                )}                

                {quizData.questions.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-white mb-4">Added Questions ({quizData.questions.length})</h3>
                    <div className="space-y-3">
                      {quizData.questions.map((q, index) => (
                        <div key={index} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="text-white font-semibold mb-2">Q{index + 1}. {q.title}</div>
                              <div className="text-sm text-gray-400">
                                {q.options.length} options • Correct: {q.correctAns}
                              </div>
                            </div>
                            <button
                              onClick={() => removeQuestion(index)}
                              className="text-red-400 cursor-pointer hover:text-red-300 transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}


                {showAddQuestion && (
                  <>
                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20 mb-6">
                  <h3 className="text-xl font-bold text-white mb-4">Add Question</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Question *</label>
                      <input
                        type="text"
                        value={currentQuestion.title}
                        onChange={(e) => setCurrentQuestion({...currentQuestion, title: e.target.value})}
                        className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500"
                        placeholder="Enter your question"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-300">Options (4-6) *</label>
                        {currentQuestion.options.length < 6 && (
                          <button
                            onClick={addOption}
                            className="text-purple-400 cursor-pointer hover:text-purple-300 text-sm flex items-center space-x-1"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Add Option</span>
                          </button>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        {currentQuestion.options.map((option, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <input
                              type="radio"
                              name="correctAnswer"
                              checked={currentQuestion.correctAns === option}
                              onChange={() => setCurrentQuestion({...currentQuestion, correctAns: option})}
                              className="w-5 h-5 text-purple-500 focus:ring-purple-500"
                            />
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => updateOption(index, e.target.value)}
                              className="flex-1 bg-slate-800/50 border border-slate-700 text-white rounded-xl py-2 px-4 focus:outline-none focus:border-purple-500"
                              placeholder={`Option ${index + 1}`}
                            />
                            {currentQuestion.options.length > 4 && (
                              <button
                                onClick={() => removeOption(index)}
                                className="text-red-400 cursor-pointer hover:text-red-300"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Select the radio button for the correct answer</p>
                    </div>

                    <button
                      onClick={addQuestion}
                      className="w-full bg-purple-500 hover:bg-purple-600 cursor-pointer text-white font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center"
                    >
                      {
                        loading ? (
                          <>
                            <Loader className="w-5 h-5 text-center animate-spin" />
                          </>
                        ):(
                          'Add Question to Quiz'
                        )
                      }
                    </button>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={submitQuiz}
                    disabled={ quizData.questions.length === 0}
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
                  <button
                    onClick={() => {
                      setShowCreateQuiz(false);
                      setActiveTab('profile');
                    }}
                    className="px-6 bg-slate-700 cursor-pointer hover:bg-slate-600 text-white font-semibold py-3 rounded-xl transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
                </>)}
              </div>
            )}

            {activeTab === 'quizzes' && (
              <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-purple-500/20 p-8">
                <h2 className="text-3xl font-bold text-white mb-6">My Quizzes</h2>
                <div className="space-y-4">
                  {
                  previousQuizzes.length == 0 ? (
                    <>
                    <h1 className='text-xl text-center font-bold text-white'>Create Quizz</h1>
                    <p className='text-sm text-center text-gray-300'>Refresh page if you created quiz before..</p>
                    <button
                      onClick={() => {
                        setActiveTab('create');
                        setShowCreateQuiz(true);
                      }}
                      className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 rounded-xl transition-all duration-300"
                    >
                      Create Quizz
                    </button>
                    </>
                  ) : (
                    previousQuizzes.map((quiz) => (
                    <div key={quiz.id} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-purple-500/50 transition-all">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2 hover:underline cursor-pointer hover:text-gray-400" onClick={()=>navigate(`/quiz/${quiz.id}`)}>{quiz.name}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <span className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{new Date(quiz.created_at).toLocaleDateString("en-IN",{
                                day:"2-digit",
                                month:"short",
                                year:"numeric",
                                hour:"2-digit",
                                minute:"2-digit",
                                hour12:true
                              })}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Users className="w-4 h-4" />
                              <span>{quiz.students} students</span>
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-purple-400">{quiz.avgScore}%</div>
                          <div className="text-sm text-gray-400">Avg Score</div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-3">
                        <button
                          onClick={() => {
                            handleGenerateQuizLink(quiz.id)
                          }}
                          className="flex-1 bg-purple-500 hover:bg-purple-600 cursor-pointer text-white font-semibold py-2 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
                        >
                          <Share2 className="w-4 h-4" />
                          <span>Share</span>
                        </button>
                        <button onClick={()=>handleQuizStatus(quiz.id)} className="px-4 bg-slate-700 cursor-pointer hover:bg-slate-600 text-white rounded-lg transition-all duration-300">
                          {
                            quiz.close ? (
                              <>
                                <CircleOff title='Open the Quiz'/>
                              </>
                            ):(
                              <>
                                <Circle title='Close the Quiz' />
                              </>
                            )
                          }
                        </button>
                        <button onClick={()=>{
                          handleDeleteQuiz(quiz.id)
                        }} className="px-4 bg-red-500/20 hover:bg-red-500/30 cursor-pointer text-red-400 rounded-lg transition-all duration-300">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )))}
                </div>
              </div>
            )}

            {activeTab === 'results' && (
              <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-purple-500/20 p-8">
                <h2 className="text-3xl font-bold text-white mb-6">Quiz Results & Analytics</h2>
                <div className="space-y-6">
                  {previousQuizzes.map((quiz) => (
                    <div key={quiz.id} className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 rounded-xl p-6 border border-slate-700">
                      <h3 className="text-xl font-bold text-white mb-4">{quiz.name}</h3>
                      {/* <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
                          <div className="text-gray-400 text-sm mb-1">Total Students</div>
                          <div className="text-2xl font-bold text-white">{quiz.students}</div>
                        </div>
                        <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
                          <div className="text-gray-400 text-sm mb-1">Average Score</div>
                          <div className="text-2xl font-bold text-purple-400">{quiz.avgScore}%</div>
                        </div>
                        <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
                          <div className="text-gray-400 text-sm mb-1">Completion Rate</div>
                          <div className="text-2xl font-bold text-green-400">94%</div>
                        </div>
                      </div> */}
                      <button className="mt-4 w-full cursor-pointer bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 rounded-lg transition-all duration-300" onClick={()=>navigate(`/quiz/${quiz.id}`)} >
                        View Detailed Analytics
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showShareModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 rounded-3xl shadow-2xl border border-purple-500/20 p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Share Quiz</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-white cursor-pointer transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-400 mb-2">Quiz Link</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={generatedLink}
                  readOnly
                  className="flex-1 bg-slate-800/50 border border-slate-700 text-white rounded-xl py-3 px-4 focus:outline-none"
                />
                <button
                  onClick={copyToClipboard}
                  className="bg-purple-500 hover:bg-purple-600 text-white cursor-pointer px-4 rounded-xl transition-all duration-300 flex items-center space-x-2"
                >
                  {copiedLink ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
              {copiedLink && (
                <p className="text-green-400 text-sm mt-2">Link copied to clipboard!</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-3">Share on Social Media</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => shareOnSocial('facebook')}
                  className="bg-[#1877F2] hover:bg-[#166FE5] text-white cursor-pointer font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Facebook className="w-5 h-5" />
                  <span>Facebook</span>
                </button>
                <button
                  onClick={() => shareOnSocial('twitter')}
                  className="bg-[#1DA1F2] hover:bg-[#1A91DA] text-white cursor-pointer font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Twitter className="w-5 h-5" />
                  <span>Twitter</span>
                </button>
                <button
                  onClick={() => shareOnSocial('linkedin')}
                  className="bg-[#0A66C2] hover:bg-[#095196] text-white cursor-pointer font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Linkedin className="w-5 h-5" />
                  <span>LinkedIn</span>
                </button>
                <button
                  onClick={() => shareOnSocial('email')}
                  className="bg-slate-700 hover:bg-slate-600 text-white cursor-pointer font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Mail className="w-5 h-5" />
                  <span>Email</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}