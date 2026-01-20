import { useState } from "react";
import axios from "axios";
import "./Admin.css";

const Admin = () => {
  const [formData, setFormData] = useState({
    category: "technical",
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    difficulty: "medium",
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({
      ...formData,
      options: newOptions,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!formData.options.includes(formData.correctAnswer)) {
      setMessage({
        type: "error",
        text: "Correct answer must match one of the options",
      });
      return;
    }

    if (formData.options.some((opt) => !opt.trim())) {
      setMessage({
        type: "error",
        text: "All options must be filled",
      });
      return;
    }

    setLoading(true);

    try {
      await axios.post("/api/quiz/add", formData);
      setMessage({
        type: "success",
        text: "Question added successfully!",
      });
      setFormData({
        category: "technical",
        question: "",
        options: ["", "", "", ""],
        correctAnswer: "",
        difficulty: "medium",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to add question",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <h1>Admin Panel</h1>
          <p>Add new quiz questions to the database</p>
        </div>

        <div className="admin-card">
          {message.text && (
            <div className={`alert alert-${message.type}`}>{message.text}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="input-group">
                <label>Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="technical">Technical</option>
                  <option value="aptitude">Aptitude</option>
                  <option value="logical">Logical</option>
                  <option value="General Knowledge">General Knowledge</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="input-group">
                <label>Difficulty</label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  required
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            <div className="input-group">
              <label>Question</label>
              <textarea
                name="question"
                value={formData.question}
                onChange={handleChange}
                placeholder="Enter the question"
                rows="3"
                required
              />
            </div>

            <div className="options-section">
              <label>Options</label>
              <div className="options-grid-admin">
                {formData.options.map((option, index) => (
                  <input
                    key={index}
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    required
                  />
                ))}
              </div>
            </div>

            <div className="input-group">
              <label>Correct Answer</label>
              <select
                name="correctAnswer"
                value={formData.correctAnswer}
                onChange={handleChange}
                required
              >
                <option value="">Select the correct answer</option>
                {formData.options.map(
                  (option, index) =>
                    option && (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    )
                )}
              </select>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={loading}
            >
              {loading ? "Adding Question..." : "Add Question"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Admin;
