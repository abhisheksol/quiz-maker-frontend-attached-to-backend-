import React, { useState, useEffect } from "react";
import { useParams, useLocation, Navigate } from "react-router-dom";
import axios from "axios";
import { RiAiGenerate } from "react-icons/ri";
import { useAuth } from "../../context/AuthContext";

const QuizTakerPage = () => {
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [error, setError] = useState(null);
  const [explanations, setExplanations] = useState({});
  const [timeLeft, setTimeLeft] = useState(null); // Timer state
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const { timer } = location.state || {}; // Timer duration from route state

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/quizzes/${id}`)
      .then((response) => {
        const formattedQuiz = formatQuizData(response.data);
        setQuiz(formattedQuiz);
        setTimeLeft(timer || 300); // Set timer (default: 5 minutes)
      })
      .catch(() => {
        setError("Failed to fetch quiz data.");
      });
  }, [id, timer]);

  // Timer logic
  useEffect(() => {
    if (timeLeft === 0) {
      handleSubmit(); // Automatically submit when time is up
    }

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [timeLeft]);

  if (!isAuthenticated) {
    // Redirect to home if not logged in
    return <Navigate to="/" replace />;
  }

  const formatQuizData = (data) => {
    return data.reduce((acc, question) => {
      const { quiz_id, title, description, ...rest } = question;
      if (!acc) {
        acc = {
          title,
          description,
          questions: [],
        };
      }
      acc.questions.push(rest);
      return acc;
    }, null);
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: value,
    }));
  };

  const handleAiExplanation = async (questionId, questionText) => {
    try {
      const response = await axios({
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=YOUR_API_KEY",
        method: "post",
        data: {
          contents: [
            {
              parts: [
                {
                  text: `Explain this question: "${questionText}" in 2 lines.`,
                },
              ],
            },
          ],
        },
      });

      const explanation =
        response.data?.candidates[0]?.content.parts[0]?.text || "Explanation not available.";

      setExplanations((prevExplanations) => ({
        ...prevExplanations,
        [questionId]: explanation,
      }));
    } catch (error) {
      console.error("Error fetching AI explanation:", error);
    }
  };

  const handleSubmit = () => {
    let calculatedScore = 0;
    quiz.questions.forEach((question) => {
      const userAnswer = answers[question.question_id];
      if (userAnswer === question.correct_answer) {
        calculatedScore += 1;
      }
    });

    setScore(calculatedScore);

    const submissionData = {
      userId: user.id,
      quizId: parseInt(id, 10),
      score: calculatedScore,
      totalQuestions: quiz.questions.length,
    };

    axios
      .post("http://localhost:5000/api/quizzes/submit", submissionData)
      .then((response) => {
        console.log("Score submitted successfully:", response.data);
      })
      .catch((err) => {
        console.error("Error submitting score:", err);
      });
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!quiz) {
    return <div>Loading quiz...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{quiz.title}</h1>
      <p className="text-lg mb-4">{quiz.description}</p>
      <p className="text-lg font-bold text-red-500">Time Left: {formatTime(timeLeft)}</p>

      <div className="space-y-6 text-black">
        {quiz.questions.map((question) => (
          <div
            key={question.question_id}
            className="bg-slate-100 p-4 border border-gray-200 rounded-lg shadow-md relative"
          >
            <div className="absolute top-4 right-4 group">
              <button
                className="bg-yellow-200 text-white p-2 rounded-full shadow hover:bg-blue-600"
                onClick={() => handleAiExplanation(question.question_id, question.question_text)}
              >
                <RiAiGenerate color="black" />
              </button>
              <div className="absolute top-12 right-0 bg-gray-800 text-white text-sm px-3 py-2 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Explain the question with AI
              </div>
            </div>

            <h2 className="text-xl font-semibold">{question.question_text}</h2>
            {explanations[question.question_id] && (
              <p className="mt-4 text-sm text-gray-700 italic">
                {explanations[question.question_id]}
              </p>
            )}

            {question.type === "multiple-choice" && (
              <div className="mt-4">
                {question.options.map((option, idx) => (
                  <div key={idx} className="flex items-center mb-2">
                    <input
                      type="radio"
                      id={`${question.question_id}-option-${idx}`}
                      name={question.question_id}
                      value={option}
                      onChange={() => handleAnswerChange(question.question_id, option)}
                      className="mr-2"
                    />
                    <label htmlFor={`${question.question_id}-option-${idx}`}>{option}</label>
                  </div>
                ))}
              </div>
            )}

            {question.type === "true-false" && (
              <div className="mt-4">
                <div className="flex items-center mb-2">
                  <input
                    type="radio"
                    id={`${question.question_id}-true`}
                    name={question.question_id}
                    value="True"
                    onChange={() => handleAnswerChange(question.question_id, "True")}
                    className="mr-2"
                  />
                  <label htmlFor={`${question.question_id}-true`}>True</label>
                </div>
                <div className="flex items-center mb-2">
                  <input
                    type="radio"
                    id={`${question.question_id}-false`}
                    name={question.question_id}
                    value="False"
                    onChange={() => handleAnswerChange(question.question_id, "False")}
                    className="mr-2"
                  />
                  <label htmlFor={`${question.question_id}-false`}>False</label>
                </div>
              </div>
            )}

            {question.type === "fill-in-the-blank" && (
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Your answer..."
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  onChange={(e) => handleAnswerChange(question.question_id, e.target.value)}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6">
        <button
          className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-700"
          onClick={handleSubmit}
        >
          Submit Quiz
        </button>
      </div>

      {score !== null && (
        <div className="mt-6 p-4 bg-green-100 border border-green-300 rounded-md">
          <p>Quiz submitted successfully!</p>
          <p>
            Score: {score} / {quiz.questions.length}
          </p>
        </div>
      )}
    </div>
  );
};

export default QuizTakerPage;

