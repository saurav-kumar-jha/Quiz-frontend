import React, { useState, useEffect } from 'react';
import { 
  Users, Award, TrendingUp, Calendar, Mail, 
  User, Hash, Star, Download, Filter, Search,
  ArrowLeft, Clock, CheckCircle, Loader
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import api from '../util/authApi';

export default function QuizResultsDetailPage() {
  // Simulating useParams - Replace with actual
  const { id } = useParams()
  const [mockResponse, setMockResponse] = useState(null)
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date'); // date, score, name

  useEffect(() => {
    fetchResults();
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
          {/* <button
            onClick={() => window.history.back()}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Quiz</span>
          </button> */}
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Quiz Results</h1>
              <p className="text-gray-400">Detailed submission report</p>
            </div>
            
            <button
              onClick={exportToCSV}
              className="flex items-center cursor-pointer space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl transition-all duration-300"
            >
              <Download className="w-5 h-5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

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
    </div>
  );
}