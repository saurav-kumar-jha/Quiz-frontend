import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from '../context/AuthProvider';
import api from '../util/authApi';

const QuizDetail = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const {user,setUser,isLoggedIn,setIsLoggedIn, logout} = useAuth();  

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await api.get(`/quiz/${quizId}`,{
            headers:{
              "Authorization":`Bearer ${user.token}`
            }
          })
        setQuiz(res.data);
      } catch (error) {
        console.error("Error fetching quiz:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold text-blue-500">
        Loading quiz details...
      </div>
    );

  if (!quiz)
    return (
      <div className="flex justify-center items-center h-screen text-red-500 font-semibold">
        Quiz not found!
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white py-10 px-5 md:px-20">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-2xl shadow-2xl p-8 transition transform hover:scale-[1.01]">
        <h1 className="text-3xl font-bold text-blue-400 mb-3">{quiz.name}</h1>
        <p className="text-gray-300 mb-2">{quiz.desc}</p>
        <div className="flex flex-wrap justify-between text-gray-400 text-sm mb-6">
          <span>🕒 Duration: {quiz.valid_till} mins</span>
          <span>📅 Created At: {new Date(quiz.created_at).toLocaleString()}</span>
        </div>

        <hr className="border-gray-600 mb-6" />

        <h2 className="text-2xl font-semibold text-blue-300 mb-4">
          Questions ({quiz.questions?.length})
        </h2>

        {quiz.questions && quiz.questions.length > 0 ? (
          quiz.questions.map((q, index) => (
            <div
              key={q.id}
              className="bg-gray-700 p-5 mb-5 rounded-xl shadow-md hover:bg-gray-600 transition duration-200"
            >
              <h3 className="text-lg font-semibold mb-3">
                {index + 1}. {q.title}
              </h3>
              <ul className="space-y-2">
                {q.options.map((opt, i) => (
                  <li
                    key={i}
                    className={`p-3 rounded-lg border ${
                      q.correctAnswer === (i + 1).toString()
                        ? "border-green-400 bg-green-900/30"
                        : "border-gray-600"
                    }`}
                  >
                    <span className="font-medium text-gray-200">
                      {String.fromCharCode(65 + i)}.
                    </span>{" "}
                    {opt}
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p className="text-gray-400 italic">No questions found.</p>
        )}
      </div>
    </div>
  );
};

export default QuizDetail;
