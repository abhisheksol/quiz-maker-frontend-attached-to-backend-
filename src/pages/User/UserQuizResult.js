import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const UserQuizResult = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, user } = useAuth(); // Get user from context

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/users/results");
        // Filter results to include only those matching the user ID from context
        const filteredResults = response.data.filter((result) => result.user_id === user.id);
        setResults(filteredResults);
      } catch (err) {
        setError("Failed to fetch quiz results. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user) {
      fetchResults();
    } else {
      setError("You need to be logged in to view quiz results.");
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-medium text-gray-500">Loading quiz results...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-medium text-red-500">{error}</p>
      </div>
    );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">User Quiz Results</h2>
      {results.length > 0 ? (
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2 text-left">Quiz Title</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Score</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Total Questions</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Date Taken</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr key={result.quiz_id} className="hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">{result.quiz_title}</td>
                <td className="border border-gray-300 px-4 py-2">{result.score}</td>
                <td className="border border-gray-300 px-4 py-2">{result.total_questions}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(result.date_taken).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500">No quiz results available for this user.</p>
      )}
    </div>
  );
};

export default UserQuizResult;
