import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import "./Dashboard.css";

const categories = [
  { id: "technical", name: "Technical", icon: "💻", color: "#3b82f6" },
  { id: "aptitude", name: "Aptitude", icon: "🧮", color: "#8b5cf6" },
  { id: "logical", name: "Logical", icon: "🧩", color: "#ec4899" },
  {
    id: "General Knowledge",
    name: "General Knowledge",
    icon: "🌍",
    color: "#10b981",
  },
];

const Dashboard = () => {
  const { user } = useAuth();
  const { socket, connected } = useSocket();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searching, setSearching] = useState(false);
  const navigate = useNavigate();

  const handleJoinQueue = (category) => {
    if (!connected) {
      alert("Socket not connected. Please wait...");
      return;
    }

    setSelectedCategory(category);
    setSearching(true);

    socket.emit("joinQueue", {
      category: category.id,
      userId: user._id,
    });

    socket.once("matchFound", (data) => {
      console.log("Match found!", data);
      setSearching(false);
      navigate("/battle", { state: data });
    });
  };

  const cancelSearch = () => {
    setSearching(false);
    setSelectedCategory(null);
  };

  const getRankColor = (rank) => {
    const ranks = {
      Novice: "#94a3b8",
      Intermediate: "#3b82f6",
      Advanced: "#8b5cf6",
      Expert: "#f59e0b",
      Master: "#ef4444",
    };
    return ranks[rank] || "#94a3b8";
  };

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Welcome back, {user?.fullname}!</h1>
          <p>Choose a category to start battling</p>
        </div>

        <div className="stats-overview">
          <div className="stat-card">
            <div className="stat-icon">⚡</div>
            <div className="stat-content">
              <div className="stat-value">{user?.xp || 0}</div>
              <div className="stat-label">Total XP</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🏆</div>
            <div className="stat-content">
              <div className="stat-value">{user?.stats?.wins || 0}</div>
              <div className="stat-label">Wins</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🎮</div>
            <div className="stat-content">
              <div className="stat-value">{user?.stats?.gamesPlayed || 0}</div>
              <div className="stat-label">Games Played</div>
            </div>
          </div>

          <div className="stat-card">
            <div
              className="stat-icon"
              style={{ background: getRankColor(user?.rank) }}
            >
              👑
            </div>
            <div className="stat-content">
              <div className="stat-value">{user?.rank || "Novice"}</div>
              <div className="stat-label">Current Rank</div>
            </div>
          </div>
        </div>

        {user?.badges && user.badges.length > 0 && (
          <div className="badges-section">
            <h2>Your Badges</h2>
            <div className="badges-list">
              {user.badges.map((badge, index) => (
                <span key={index} className="badge badge-primary">
                  {badge}
                </span>
              ))}
            </div>
          </div>
        )}

        {searching ? (
          <div className="searching-overlay">
            <div className="searching-card">
              <div className="spinner-large"></div>
              <h2>Finding opponent...</h2>
              <p>
                Searching for a player in {selectedCategory?.name} category
              </p>
              <button onClick={cancelSearch} className="btn btn-danger">
                Cancel Search
              </button>
            </div>
          </div>
        ) : (
          <div className="categories-grid">
            <h2>Select a Category</h2>
            <div className="grid grid-2">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="category-card-dashboard"
                  style={{ borderColor: category.color }}
                  onClick={() => handleJoinQueue(category)}
                >
                  <div
                    className="category-icon"
                    style={{ background: category.color }}
                  >
                    {category.icon}
                  </div>
                  <h3>{category.name}</h3>
                  <button
                    className="btn btn-primary"
                    style={{ background: category.color }}
                  >
                    Start Battle
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
