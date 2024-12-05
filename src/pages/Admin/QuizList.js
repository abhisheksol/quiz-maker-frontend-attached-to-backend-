import React, { useState } from 'react';
import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

const AdminCreateQuiz = () => {
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    timeLimit: '',
    questions: [
      { questionText: '', type: 'multiple-choice', options: ['', '', '', ''], correctAnswer: '' }
    ],
  });
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuizData({
      ...quizData,
      [name]: value,
    });
  };

  const handleQuestionChange = (index, e) => {
    const { name, value } = e.target;
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[index][name] = value;
    setQuizData({
      ...quizData,
      questions: updatedQuestions,
    });
  };

  const handleOptionChange = (questionIndex, optionIndex, e) => {
    const { value } = e.target;
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuizData({
      ...quizData,
      questions: updatedQuestions,
    });
  };

  const addQuestion = () => {
    setQuizData({
      ...quizData,
      questions: [
        ...quizData.questions,
        { questionText: '', type: 'multiple-choice', options: ['', '', '', ''], correctAnswer: '' },
      ],
    });
  };

  const { isAuthenticated, user, logout } = useAuth();
  console.log("this is ",isAuthenticated);
 
   if (!isAuthenticated) {
     // Redirect to home if not logged in
     return <Navigate to="/" replace />;
   }
  const handleSubmit = (e) => {
    e.preventDefault();

    // Mock API call
    const response = mockCreateQuiz(quizData);
    if (response.status === 'success') {
      setSuccessMessage(response.message);
    }
  };

  // Mock API function for creating a quiz
  const mockCreateQuiz = (quizData) => {
    // In reality, this would be a POST request to the server
    console.log('Quiz Data Submitted:', quizData);
    return {
      status: 'success',
      message: 'Quiz created successfully!',
      quizId: '3', // Assume the new quiz ID is 3
    };
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create a New Quiz</h1>

      <form onSubmit={handleSubmit}>
        {/* Quiz Title */}
        <div className="mb-4">
          <label htmlFor="title" className="block text-lg font-semibold">
            Quiz Title:
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={quizData.title}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        {/* Quiz Description */}
        <div className="mb-4">
          <label htmlFor="description" className="block text-lg font-semibold">
            Quiz Description:
          </label>
          <textarea
            id="description"
            name="description"
            value={quizData.description}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            rows="4"
            required
          />
        </div>

        {/* Quiz Start Date */}
        <div className="mb-4">
          <label htmlFor="startDate" className="block text-lg font-semibold">
            Start Date:
          </label>
          <input
            type="datetime-local"
            id="startDate"
            name="startDate"
            value={quizData.startDate}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        {/* Quiz End Date */}
        <div className="mb-4">
          <label htmlFor="endDate" className="block text-lg font-semibold">
            End Date:
          </label>
          <input
            type="datetime-local"
            id="endDate"
            name="endDate"
            value={quizData.endDate}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        {/* Time Limit */}
        <div className="mb-4">
          <label htmlFor="timeLimit" className="block text-lg font-semibold">
            Time Limit (in minutes):
          </label>
          <input
            type="number"
            id="timeLimit"
            name="timeLimit"
            value={quizData.timeLimit}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        {/* Questions */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Questions</h2>
          {quizData.questions.map((question, index) => (
            <div key={index} className="mb-4">
              {/* Question Text */}
              <div>
                <label htmlFor={`questionText-${index}`} className="block text-lg font-semibold">
                  Question {index + 1} Text:
                </label>
                <input
                  type="text"
                  id={`questionText-${index}`}
                  name="questionText"
                  value={question.questionText}
                  onChange={(e) => handleQuestionChange(index, e)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              {/* Question Type */}
              <div className="mt-2">
                <label htmlFor={`questionType-${index}`} className="block text-lg font-semibold">
                  Question Type:
                </label>
                <select
                  id={`questionType-${index}`}
                  name="type"
                  value={question.type}
                  onChange={(e) => handleQuestionChange(index, e)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="multiple-choice">Multiple Choice</option>
                  <option value="true-false">True/False</option>
                  <option value="fill-in-the-blank">Fill in the Blank</option>
                </select>
              </div>

              {/* Options (for multiple-choice questions) */}
              {question.type === 'multiple-choice' && (
                <div>
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center mb-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(index, optionIndex, e)}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        placeholder={`Option ${optionIndex + 1}`}
                        required
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Correct Answer */}
              <div>
                <label htmlFor={`correctAnswer-${index}`} className="block text-lg font-semibold">
                  Correct Answer:
                </label>
                <input
                  type="text"
                  id={`correctAnswer-${index}`}
                  name="correctAnswer"
                  value={question.correctAnswer}
                  onChange={(e) => handleQuestionChange(index, e)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addQuestion}
            className="bg-blue-500 text-white p-2 rounded-lg mt-4"
          >
            Add Another Question
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-700"
        >
          Create Quiz
        </button>
      </form>

      {/* Success Message */}
      {successMessage && (
        <div className="mt-6 p-4 bg-green-100 border border-green-300 rounded-md">
          <p>{successMessage}</p>
        </div>
      )}
    </div>
  );
};

export default AdminCreateQuiz;
