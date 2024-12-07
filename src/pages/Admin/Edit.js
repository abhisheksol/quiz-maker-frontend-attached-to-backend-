import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditQuiz = () => {
    const [quiz, setQuiz] = useState({
        title: '',
        description: '',
        timeLimit: 0,
        startDate: '',
        endDate: '',
        isActive: false,
    });
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch quiz details based on the ID passed in the URL
        const fetchQuiz = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/quizzes/${id}`);
                const data = await response.json();
                setQuiz(data);
            } catch (error) {
                console.error('Error fetching quiz:', error);
            }
        };

        fetchQuiz();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setQuiz({
            ...quiz,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/api/quizzes/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(quiz),
            });

            if (response.ok) {
                navigate('/admin/quizzes'); // Navigate to the quizzes management page
            } else {
                console.error('Failed to update the quiz');
            }
        } catch (error) {
            console.error('Error updating quiz:', error);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Edit Quiz</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block font-semibold">Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={quiz.title}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block font-semibold">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={quiz.description}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div>
                    <label htmlFor="timeLimit" className="block font-semibold">Time Limit (minutes)</label>
                    <input
                        type="number"
                        id="timeLimit"
                        name="timeLimit"
                        value={quiz.timeLimit}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div>
                    <label htmlFor="startDate" className="block font-semibold">Start Date</label>
                    <input
                        type="datetime-local"
                        id="startDate"
                        name="startDate"
                        value={quiz.startDate}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div>
                    <label htmlFor="endDate" className="block font-semibold">End Date</label>
                    <input
                        type="datetime-local"
                        id="endDate"
                        name="endDate"
                        value={quiz.endDate}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div>
                    <label htmlFor="isActive" className="block font-semibold">Active</label>
                    <input
                        type="checkbox"
                        id="isActive"
                        name="isActive"
                        checked={quiz.isActive}
                        onChange={handleChange}
                        className="p-2"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Update Quiz
                </button>
            </form>
        </div>
    );
};

export default EditQuiz;
