import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import axios from "axios";

const Leaderboard = () => {
  const { isAuthenticated } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/users/results");
        
        // Group results by user_name and accumulate total score
        const groupedResults = response.data.reduce((acc, result) => {
          if (!acc[result.user_name]) {
            acc[result.user_name] = { score: 0, quizzes: [] };
          }
          acc[result.user_name].score += result.score;
          acc[result.user_name].quizzes.push({
            quizTitle: result.quiz_title,
            score: result.score,
            dateTaken: result.date_taken,
          });
          return acc;
        }, {});

        // Convert to array, sort by total score in descending order
        const sortedLeaderboard = Object.keys(groupedResults).map((userName) => ({
          name: userName,
          score: groupedResults[userName].score,
          quizzes: groupedResults[userName].quizzes,
        })).sort((a, b) => b.score - a.score);

        setLeaderboard(sortedLeaderboard);
      } catch (err) {
        setError("Failed to fetch leaderboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (!isAuthenticated) {
    // Redirect to home if not logged in
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-medium text-gray-500">Loading leaderboard...</p>
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
      <h1 className="text-3xl font-bold mb-6 text-center">Leaderboard</h1>
      {leaderboard.length > 0 ? (
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Rank</th>
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Score</th>
              <th className="border border-gray-300 p-2">Quizzes</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="border border-gray-300 p-2 text-center">{index + 1}</td>
                <td className="border border-gray-300 p-2 text-center">{entry.name}</td>
                <td className="border border-gray-300 p-2 text-center">{entry.score}</td>
                <td className="border border-gray-300 p-2">
                  <ul>
                    {entry.quizzes.map((quiz, quizIndex) => (
                      <li key={quizIndex}>
                        <strong>{quiz.quizTitle}</strong> - Score: {quiz.score}, Date: {new Date(quiz.dateTaken).toLocaleString()}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500 text-center">No leaderboard data available.</p>
      )}
    </div>
  );
};

export default Leaderboard;
