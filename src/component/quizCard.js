import React from "react";

const QuizCard = ({ quiz }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition duration-300">
      {/* Quiz Title */}
      <h2 className="text-xl font-semibold text-gray-800">{quiz.title}</h2>

      {/* Quiz Description */}
      <p className="text-gray-600 mt-2 text-sm">{quiz.description}</p>

      {/* Quiz Metadata */}
      <div className="flex items-center justify-between mt-4 text-gray-500 text-sm">
        <span>Questions: {quiz.totalQuestions}</span>
        <span>Time: {quiz.timeLimit} mins</span>
      </div>

      {/* Start Button */}
      <div className="mt-4">
        <button
          onClick={() => alert(`Starting Quiz: ${quiz.title}`)}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition duration-300"
        >
          Start Quiz
        </button>
      </div>
    </div>
  );
};

export default QuizCard;
