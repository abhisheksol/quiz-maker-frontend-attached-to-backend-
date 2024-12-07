import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";
import axios from "axios";

const AdminDashboard = () => {
  const { isAuthenticated, user, logout } = useAuth();

  const [quizData, setQuizData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the quiz results from the API
  useEffect(() => {
    const fetchQuizResults = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users/results");
        setQuizData(response.data);
      } catch (err) {
        setError("Failed to fetch quiz data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizResults();
  }, []);

  if (!isAuthenticated) {
    // Redirect to home if not logged in
    return <Navigate to="/" replace />;
  }

  // Calculate stats from the fetched quiz data
  const totalQuizzes = quizData.length;

  // Calculate total unique users
  const uniqueUsers = new Set(quizData.map((quiz) => quiz.user_name)).size;

  // Calculate average score
  const averageScore =
    quizData.length > 0
      ? (quizData.reduce((acc, quiz) => acc + quiz.score, 0) / quizData.length).toFixed(2)
      : 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-medium text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-medium text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold">Total Quizzes</h2>
          <p className="text-3xl font-semibold">{totalQuizzes}</p>
        </div>
        <div className="bg-green-500 text-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold">Total Users</h2>
          <p className="text-3xl font-semibold">{uniqueUsers}</p>
        </div>
        <div className="bg-yellow-500 text-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold">Average Score</h2>
          <p className="text-3xl font-semibold">{averageScore}%</p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="space-y-4">
        <Link
          to="/admin/quizzes"
          className="block bg-blue-600 text-white text-center p-4 rounded-lg hover:bg-blue-500 transition"
        >
          Manage Quizzes
        </Link>
        <Link
          to="/admin/create"
          className="block bg-green-600 text-white text-center p-4 rounded-lg hover:bg-green-500 transition"
        >
          Create New Quiz
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
