import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { sampleQuizzes } from './quiz_list_sample_data'; // Import sample data

const QuizList = ({ isAdmin }) => {
  const [quizzes, setQuizzes] = useState([]);

  // Instead of fetching from the API, use the sample data for testing
  useEffect(() => {
    setQuizzes(sampleQuizzes);
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Available Quizzes</h1>

      {/* Admin view: Option to manage and create quizzes */}
      {isAdmin && (
        <div className="mb-4">
          <Link to="/admin/create" className="text-blue-500 hover:underline">
            Create New Quiz
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-md"
          >
            <h2 className="text-xl font-semibold">{quiz.title}</h2>
            <p className="text-gray-600">{quiz.description}</p>
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-500">
                {quiz.questionsCount} questions
              </span>
              <span className="text-sm text-gray-500">
                Time Limit: {quiz.timeLimit} min
              </span>
            </div>

            {/* View Details or Manage Quiz */}
            {isAdmin ? (
              <div className="mt-4">
                <Link
                  to={`/admin/quizzes/${quiz.id}`}
                  className="text-blue-500 hover:underline"
                >
                  Manage Quiz
                </Link>
              </div>
            ) : (
              <div className="mt-4">
                <Link
                  to={`/quiz/${quiz.id}`}
                  className="text-blue-500 hover:underline"
                >
                  Take Quiz
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizList;
