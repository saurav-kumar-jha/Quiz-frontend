import React, { useState, useEffect } from 'react';
import { 
  Users, Award, TrendingUp, Calendar, Mail, 
  User, Hash, Star, Download, Filter, Search,
  ArrowLeft, Clock, CheckCircle, Loader, Plus, X, Trash2, Send
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import api from '../util/authApi';
import { useAuth } from '../context/AuthProvider';

export default function QuizResultsDetailPage() {
  const { id } = useParams()
  const [mockResponse, setMockResponse] = useState(null)
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {user,setUser,isLoggedIn,setIsLoggedIn, logout, Isloading} = useAuth();  
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: ''
  });
  const [quizQuestions, setQuizQuestions] = useState([])
  const [quizDetails, setQuizDetails] = useState()

  useEffect(() => {
    if(Isloading || !user?.token){
      return;
    }
    fetchResults();
    fetchQuizDetails()
    fetchStudentResult()
  }, [id]);

  const fetchResults = async () => {
    setLoading(true);
    try {
        const res = await api.get(`/student${id}/all`)
        setMockResponse(res.data)

      setResults(mockResponse.List);
      setFilteredResults(mockResponse.List);
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [searchQuery, results]);

  const fetchStudentResult = async ()=>{
    const res = await api.get(`/quiz/${id}/students`,{
      "headers":{
        "Authorization": `Bearer ${user.token}`
      }
    })
    // console.log("Student Result:",res)
    setFilteredResults(res?.data)
  }

  const fetchQuizDetails = async()=>{
    const res = await api.get(`quiz/${id}`,{
      "headers":{
        "Authorization": `Bearer ${user.token}`
      }
    })
    console.log(res)
    setQuizDetails(res.data)
    if(res.data?.questions){
      setQuizQuestions(res.data?.questions)
    }
  }

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredResults(results);
      return;
    }

    const filtered = results.filter(student => 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.roll.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredResults(filtered);
  };

  const handleSort = (sortType) => {
    setSortBy(sortType);
    let sorted = [...filteredResults];

    switch(sortType) {
      case 'score-high':
        sorted.sort((a, b) => b.score - a.score);
        break;
      case 'score-low':
        sorted.sort((a, b) => a.score - b.score);
        break;
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'date':
        sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      default:
        break;
    }

    setFilteredResults(sorted);
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
        correctAnswer: ''
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
    if (newQuestion.question && newQuestion.options.every(opt => opt.trim()) && newQuestion.correctAnswer) {
      setQuestions([
        ...questions,
        {
          id: Date.now(),
          ...newQuestion
        }
      ]);
      setNewQuestion({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: ''
      });
      setShowAddQuestion(false);
    }
  };

  const deleteQuestion = (questionId) => {
    setQuestions(questions.filter(q => q.id !== questionId));
  };

  const handleSubmitQuestions = async () => {

    if (questions.length === 0) {
      alert("❗ Please add at least one question before submitting.");
      return;
    }
  
    // Validate questions before sending
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
  
      if (!q.question || q.options.length < 2 || !q.correctAnswer) {
        alert(`❗ Question ${i + 1} is incomplete. Please fill all fields.`);
        return;
      }
  
      if (!q.options.includes(q.correctAnswer)) {
        alert(`❗ Correct answer must be one of the options (Question ${i + 1}).`);
        return;
      }
    }
  
    setIsSubmitting(true);
  
    const submissionData = {
      questions: questions.map(q => ({
        question: q.question,          // 👈 backend expects "title"
        options: q.options,
        correctAnswer: q.correctAnswer // 👈 backend expects "correctAns"
      }))
    };
  
    try {
      const res = await api.post(
        `/quiz/${id}/addQuestion`,
        submissionData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );
  
      alert(`✅ ${questions.length} question(s) added successfully!`);
      setQuestions([]);
  
    } catch (error) {
  
      // Backend responded with error
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || "Something went wrong";
  
        if (status === 400) {
          alert(`⚠️ ${message}`);
        }
        else if (status === 401) {
          alert("🔐 Session expired. Please login again.");
        }
        else if (status === 403) {
          alert("🚫 You are not authorized to add questions.");
        }
        else if (status === 404) {
          alert("❓ Quiz not found.");
        }
        else {
          alert(`❌ Server error: ${message}`);
        }
  
      } 
      // Network error
      else if (error.request) {
        alert("🌐 Network error. Please check your internet connection.");
      } 
      // Unknown error
      else {
        alert("❌ Unexpected error occurred.");
      }
  
      console.error("Submit Question Error:", error);
  
    } finally {
      setIsSubmitting(false);
    }
  };
  

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBadgeColor = (score) => {
    if (score >= 80) return 'bg-green-500/20 text-green-300 border-green-500/30';
    if (score >= 60) return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    return 'bg-red-500/20 text-red-300 border-red-500/30';
  };

  const calculateStats = () => {
    if (results.length === 0) return { avg: 0, highest: 0, lowest: 0, passed: 0 };
    
    const scores = results.map(r => r.score);
    const avg = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2);
    const highest = Math.max(...scores);
    const lowest = Math.min(...scores);
    const passed = results.filter(r => r.score >= 60).length;

    return { avg, highest, lowest, passed };
  };

  const deleteQuizQuestion = async (questionId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this question?"
    );
  
    if (!confirmDelete) return;
  
    try {
      const res = await api.delete(
        `/quiz/${id}/delete/${questionId}`,
        {
          "headers": {
            "Authorization": `Bearer ${user.token}`
          }
        }
      );
  
      // Update UI instantly
      setQuizQuestions(prev =>
        prev.filter(q => q.id !== questionId)
      );
  
      alert("✅ Question deleted successfully");
  
      console.log("Delete Response:", res);
  
    } catch (error) {
      console.error("Delete Error:", error);
  
      if (error.response) {
        const status = error.response.status;
        const message =
          error.response.data?.message || "Something went wrong";
  
        if (status === 401) {
          alert("🔐 Session expired. Please login again.");
        } else if (status === 403) {
          alert("🚫 You are not allowed to delete this question.");
        } else if (status === 404) {
          alert("❓ Question not found.");
        } else {
          alert(`❌ ${message}`);
        }
      } else {
        alert("🌐 Network error. Please try again.");
      }
    }
  };  

  const stats = calculateStats();

  const exportToCSV = () => {
    const headers = ['S.No', 'Name', 'Roll Number', 'Email', 'Score', 'Submitted At'];
    const csvData = filteredResults.map((student, index) => [
      index + 1,
      student.name,
      student.roll,
      student.email,
      student.score,
      formatDate(student.created_at)
    ]);

    const csv = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quiz-results-${id}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              {/* <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Quiz Management</h1>
              <p className="text-gray-400">View results and manage questions</p> */}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddQuestion(true)}
                className="flex items-center cursor-pointer space-x-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-xl transition-all duration-300"
              >
                <Plus className="w-5 h-5" />
                <span>Add Question</span>
              </button>
              <button
                onClick={exportToCSV}
                className="flex items-center cursor-pointer space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl transition-all duration-300"
              >
                <Download className="w-5 h-5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>
        </div>

        {/* Add Question Modal */}
        {showAddQuestion && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 rounded-3xl shadow-2xl border border-purple-500/20 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">Add New Question</h3>
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
                          checked={newQuestion.correctAnswer === option}
                          onChange={() => setNewQuestion({...newQuestion, correctAnswer: option})}
                          className="w-5 h-5 text-purple-500 focus:ring-purple-500"
                          disabled={!option.trim()}
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
                  <p className="text-xs text-gray-500 mt-2">Fill in all options first, then select the correct answer</p>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={addQuestion}
                    disabled={!newQuestion.question || !newQuestion.options.every(opt => opt.trim()) || !newQuestion.correctAnswer}
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
          </div>
        )}

        {/* Questions List with Submit Button */}
        {questions.length > 0 && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">Added Questions ({questions.length})</h2>
              <button
                onClick={handleSubmitQuestions}
                disabled={isSubmitting}
                className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-lg hover:shadow-green-500/50 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Submit All Questions</span>
                  </>
                )}
              </button>
            </div>
            <div className="space-y-4">
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
                              option === q.correctAnswer
                                ? 'bg-green-500/10 border border-green-500/30'
                                : 'bg-slate-800/50 border border-slate-700'
                            }`}
                          >
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                              option === q.correctAnswer ? 'bg-green-500' : 'bg-slate-700'
                            }`}>
                              {option === q.correctAnswer && <CheckCircle className="w-4 h-4 text-white" />}
                            </div>
                            <span className={`${
                              option === q.correctAnswer ? 'text-green-300 font-semibold' : 'text-gray-300'
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
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-purple-500/20 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Total Students</span>
              <Users className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-3xl font-bold text-white">{results.length}</div>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-purple-500/20 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Average Score</span>
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-3xl font-bold text-white">{stats.avg}%</div>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-purple-500/20 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Highest Score</span>
              <Award className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-green-400">{stats.highest}%</div>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-purple-500/20 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Pass Rate</span>
              <CheckCircle className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-3xl font-bold text-white">{((stats.passed / results.length) * 100).toFixed(0)}%</div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-purple-500/20 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, or roll number..."
                className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => handleSort(e.target.value)}
                className="bg-slate-800/50 border border-slate-700 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500"
              >
                <option value="date">Sort by Date</option>
                <option value="score-high">Score: High to Low</option>
                <option value="score-low">Score: Low to High</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-purple-500/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50 border-b border-slate-700">
                <tr>
                  <th className="text-left text-gray-400 font-semibold p-4 text-sm">S.No</th>
                  <th className="text-left text-gray-400 font-semibold p-4 text-sm">Name</th>
                  <th className="text-left text-gray-400 font-semibold p-4 text-sm">Roll Number</th>
                  <th className="text-left text-gray-400 font-semibold p-4 text-sm">Email</th>
                  <th className="text-left text-gray-400 font-semibold p-4 text-sm">Score</th>
                  <th className="text-left text-gray-400 font-semibold p-4 text-sm">Submitted At</th>
                  <th className="text-left text-gray-400 font-semibold p-4 text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredResults.length > 0 ? (
                  filteredResults.map((student, index) => (
                    <tr 
                      key={student.id} 
                      className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="p-4">
                        <span className="text-white font-medium">{index + 1}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                            {student.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-white font-medium">{student.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Hash className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-300">{student.roll}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-300">{student.email}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Star className={`w-4 h-4 ${getScoreColor(student.score)}`} />
                          <span className={`text-2xl font-bold ${getScoreColor(student.score)}`}>
                            {student.score}%
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2 text-gray-400 text-sm">
                          <Clock className="w-4 h-4" />
                          <span>{formatDate(student.created_at)}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getScoreBadgeColor(student.score)}`}>
                          {student.score >= 60 ? 'Passed' : 'Failed'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="p-12 text-center">
                      <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400 text-lg">No results found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        {filteredResults.length > 0 && (
          <div className="mt-6 bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-purple-500/20 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-400">
              <span>Showing {filteredResults.length} of {results.length} results</span>
              <span>
                Pass Rate: <strong className="text-white">{((stats.passed / results.length) * 100).toFixed(1)}%</strong> 
                ({stats.passed} out of {results.length} students)
              </span>
            </div>
          </div>
        )}
      </div>
      
      {/* Questions  */}
      <div className='mb-6 mt-4 px-4 py-6 text-gray-400 bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-purple-500/20 overflow-hidden'>

          <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">{quizDetails?.name}</h1>
          <p className="text-gray-400">{quizDetails?.desc}</p>
          <p className="text-sm text-gray-500 mt-1">
            Duration: {quizDetails?.valid_till} mins • Created at: {new Date(quizDetails?.created_at).toLocaleDateString()}
          </p>
        </div>
        {
          quizQuestions.length == 0 ? (
            <>
              <p className='text-lg text-center'>No Questions</p>
              <button onClick={() => setShowAddQuestion(true)}
                className="flex items-center  cursor-pointer space-x-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-xl transition-all duration-300" >Add Questions</button>
            </>
          ):(
            <div className="space-y-4">
  {quizQuestions.map((q, index) => (
    <div
      key={q.id}
      className="bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-purple-500/20 p-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <p className="text-lg font-bold text-white">
          Q{index + 1}. {q.title}
        </p>

        <button
          onClick={() => deleteQuizQuestion(q.id)}
          className="text-red-400 hover:text-red-300 transition-colors cursor-pointer"
          title="Delete question"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Options */}
      <div className="space-y-2">
        {q.options.map((option, optIndex) => (
          <div
            key={optIndex}
            className={`flex items-center p-3 rounded-lg ${
              option === q.correctAnswer
                ? "bg-green-500/10 border border-green-500/30"
                : "bg-slate-800/50 border border-slate-700"
            }`}
          >
            <p
              className={`${
                option === q.correctAnswer
                  ? "text-green-300 font-semibold"
                  : "text-gray-300"
              }`}
            >
              {option}
            </p>
          </div>
        ))}
      </div>
    </div>
  ))}
</div>

          )
        }
      </div>
    </div>
  );
}