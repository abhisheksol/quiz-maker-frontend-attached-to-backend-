import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { quizDetails } from './quiz_details_sample_data'; // Import sample data
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from 'axios';
import { RiAiGenerate } from "react-icons/ri";

const QuizTakerPage = () => {
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [error, setError] = useState(null);
  const { id } = useParams();
   console.warn(id);

   const { isAuthenticated, user, logout } = useAuth();
  console.warn(user.id ," this is user id ");
   
  useEffect(() => {
    // Fetch quiz data from the server
    axios
      .get(`http://localhost:5000/api/quizzes/${id}`)
      .then((response) => {
        // Transform the quiz data into a more usable format
        const formattedQuiz = formatQuizData(response.data);
        setQuiz(formattedQuiz);
        console.log(quiz);
        
      })
      .catch((err) => {
        setError("Failed to fetch quiz data.");
      });
  }, []);

  // Format the data to group questions
  const formatQuizData = (data) => {
    const groupedQuestions = data.reduce((acc, question) => {
      const { quiz_id, title, description, ...rest } = question;
      if (!acc) {
        acc = {
          title: title,
          description: description,
          questions: [],
        };
      }
      acc.questions.push(rest);
      return acc;
    }, null);

    return groupedQuestions;
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: value,
    }));
  };

  const handleSubmit = () => {
    // Calculate score based on answers
    let calculatedScore = 0;
    quiz.questions.forEach((question) => {
      const userAnswer = answers[question.question_id];
      if (userAnswer === question.correct_answer) {
        calculatedScore += 1;
      }
    });
    setScore(calculatedScore);
  
    // Prepare the data for submission
    const submissionData = {
      userId: user.id, // Replace with actual user ID
      quizId: parseInt(id, 10), // Ensure id is parsed as a number
      score: calculatedScore,
      totalQuestions: quiz.questions.length,
    };
  
    // Make the POST request
    axios
      .post("http://localhost:5000/api/quizzes/submit", submissionData)
      .then((response) => {
        console.log("Score submitted successfully:", response.data);
      })
      .catch((err) => {
        console.error("Error submitting score:", err);
      });
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

      <div className="space-y-6 text-black">
        {quiz.questions.map((question) => (
          <div key={question.question_id} className="bg-slate-500 p-4 border border-gray-200 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">{question.question_text}</h2>

            {/* Render question options based on type */}
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

      {/* Submit Button */}
      <div className="mt-6">
        <button
          className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-700"
          onClick={handleSubmit}
        >
          Submit Quiz
        </button>
      </div>

      {/* Show score */}
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



// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { quizDetails } from './quiz_details_sample_data'; // Import sample data
// import { Navigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import axios from 'axios';
// import { RiAiGenerate } from "react-icons/ri";

// const QuizDetails = () => {
//   const { id } = useParams(); // Get quiz ID from URL parameters
//   const [quiz, setQuiz] = useState(null);
//   const [answers, setAnswers] = useState({});
//   const [submissionStatus, setSubmissionStatus] = useState(null);
//   const [explanations, setExplanations] = useState({}); // State to store AI explanations per question

//   const { isAuthenticated, user, logout } = useAuth();

//   const handleAiExplanation = async (questionId, questionText) => {
//     console.log(questionText);
//     console.log("loading..................");

//     const response = await axios({
//       url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyCVPgDqL2UWciZUqdl_GyE6cSjsc3CNjiA",
//       method: "post",
//       data: {
//         "contents": [
//           {
//             "parts": [
//               {
//                 text: `Explain this question donot give me answer: "${questionText}" generate 2 lines only.`,
//               }
//             ]
//           }
//         ]
//       }
//     });

//     console.log(response.data.candidates[0].content.parts[0].text);

//     // Store the AI-generated explanation for the question
//     setExplanations((prevExplanations) => ({
//       ...prevExplanations,
//       [questionId]: response.data.candidates[0].content.parts[0].text,
//     }));
//   };

//   const fetchQuizzes = async () => {
//     try {
//       const response = await axios.get(`http://localhost:5000/api/quizzes/${id}`);
//       console.log(response.data);
//       setQuiz(response.data); // Update quiz state with the response data
//     } catch (err) {
//       console.error(err.message);
//     }
//   };
  
//   useEffect(() => {
//     // For now, we directly use the mock data based on the quiz ID
//     if (id === quizDetails.id) {
//       setQuiz(quizDetails);
//     }
//   }, [id]);

//   if (!isAuthenticated) {
//     // Redirect to home if not logged in
//     return <Navigate to="/" replace />;
//   }

//   const handleAnswerChange = (questionId, value) => {
//     setAnswers((prevAnswers) => ({
//       ...prevAnswers,
//       [questionId]: value,
//     }));
//   };

//   const handleSubmit = () => {
//     // Prepare the data to be sent to the backend
//     const userAnswers = Object.keys(answers).map((questionId) => ({
//       questionId,
//       answer: answers[questionId],
//     }));

//     // Simulate the POST request (mock API call)
//     const response = mockSubmitQuiz(id, userAnswers); // Mock function
//     setSubmissionStatus(response);
//   };

//   // Mock API function for submission
//   const mockSubmitQuiz = (quizId, userAnswers) => {
//     // Simulate score calculation based on the answers
//     let score = 0;
//     userAnswers.forEach((answer) => {
//       const question = quiz.questions.find((q) => q.id === answer.questionId);
//       if (question.correctAnswer === answer.answer) {
//         score += 1;
//       }
//     });

//     // Mock response
//     return {
//       status: "success",
//       message: "Quiz submitted successfully!",
//       score,
//       totalQuestions: quiz.questions.length,
//     };
//   };

//   if (!quiz) return <p>Loading quiz details...</p>;

//   return (
//     <div className="container mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-6">{quiz.title}</h1>
//       <p className="text-lg mb-4">{quiz.description}</p>

//       {/* Displaying Questions */}
//       <div className="space-y-6">
//         {quiz.questions.map((question) => (
//           <div
//             key={question.id}
//             className="relative bg-slate-50 p-4 border border-gray-200 rounded-lg shadow-md"
//           >
//             {/* AI Button with Tooltip */}
//             <div className="relative group">
//               <button
//                 className="absolute top-4 right-4 bg-yellow-200 text-white p-2 rounded-full shadow hover:bg-blue-600"
//                 onClick={() => handleAiExplanation(question.id, question.questionText)}
//               >
//                 <RiAiGenerate color='black' />
//               </button>
//               {/* Tooltip */}
//               <div className="absolute top-12 right-0 bg-gray-800 text-white text-sm px-3 py-2 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                 Explain the question with AI
//               </div>
//             </div>

//             {/* Question Text */}
//             <h2 className="text-xl font-semibold">{question.questionText}</h2>

//             {/* Display the AI Explanation below the question */}
//             {explanations[question.id] && (
//               <p className="mt-4 text-sm text-gray-700 italic">{explanations[question.id]}</p>
//             )}

//             {/* Multiple Choice Questions */}
//             {question.type === "multiple-choice" && (
//               <div className="mt-4">
//                 {question.options.map((option, idx) => (
//                   <div key={idx} className="flex items-center mb-2">
//                     <input
//                       type="radio"
//                       id={`${question.id}-option-${idx}`}
//                       name={question.id}
//                       value={option}
//                       onChange={() => handleAnswerChange(question.id, option)}
//                       className="mr-2"
//                     />
//                     <label htmlFor={`${question.id}-option-${idx}`}>{option}</label>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* True/False Questions */}
//             {question.type === "true-false" && (
//               <div className="mt-4">
//                 <div className="flex items-center mb-2">
//                   <input
//                     type="radio"
//                     id={`${question.id}-true`}
//                     name={question.id}
//                     value="True"
//                     onChange={() => handleAnswerChange(question.id, "True")}
//                     className="mr-2"
//                   />
//                   <label htmlFor={`${question.id}-true`}>True</label>
//                 </div>
//                 <div className="flex items-center mb-2">
//                   <input
//                     type="radio"
//                     id={`${question.id}-false`}
//                     name={question.id}
//                     value="False"
//                     onChange={() => handleAnswerChange(question.id, "False")}
//                     className="mr-2"
//                   />
//                   <label htmlFor={`${question.id}-false`}>False</label>
//                 </div>
//               </div>
//             )}

//             {/* Fill-in-the-Blank Questions */}
//             {question.type === "fill-in-the-blank" && (
//               <div className="mt-4">
//                 <input
//                   type="text"
//                   placeholder="Your answer..."
//                   className="w-full p-2 border border-gray-300 rounded-lg"
//                   onChange={(e) => handleAnswerChange(question.id, e.target.value)}
//                 />
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Submit Button */}
//       <div className="mt-6">
//         <button
//           className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-700"
//           onClick={handleSubmit}
//         >
//           Submit Quiz
//         </button>
//       </div>

//       {/* Show submission result */}
//       {submissionStatus && (
//         <div className="mt-6 p-4 bg-green-100 border border-green-300 rounded-md">
//           <p>{submissionStatus.message}</p>
//           <p>
//             Score: {submissionStatus.score} / {submissionStatus.totalQuestions}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default QuizDetails;
