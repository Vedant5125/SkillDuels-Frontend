import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import "./Profile.css";

const Profile = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get("/api/battles/history");
      setHistory(response.data.data);
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setLoading(false);
    }
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

  const getWinRate = () => {
    if (!user?.stats?.gamesPlayed) return 0;
    return ((user.stats.wins / user.stats.gamesPlayed) * 100).toFixed(1);
  };

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <div className="profile-avatar">
            {user?.fullname.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <h1>{user?.fullname}</h1>
            <p>{user?.email}</p>
            <div
              className="profile-rank"
              style={{ background: getRankColor(user?.rank) }}
            >
              {user?.rank || "Novice"}
            </div>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card-profile">
            <div className="stat-icon">⚡</div>
            <div className="stat-content">
              <div className="stat-value">{user?.xp || 0}</div>
              <div className="stat-label">Total XP</div>
            </div>
          </div>

          <div className="stat-card-profile">
            <div className="stat-icon">🎮</div>
            <div className="stat-content">
              <div className="stat-value">{user?.stats?.gamesPlayed || 0}</div>
              <div className="stat-label">Games Played</div>
            </div>
          </div>

          <div className="stat-card-profile">
            <div className="stat-icon">🏆</div>
            <div className="stat-content">
              <div className="stat-value">{user?.stats?.wins || 0}</div>
              <div className="stat-label">Wins</div>
            </div>
          </div>

          <div className="stat-card-profile">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-value">{getWinRate()}%</div>
              <div className="stat-label">Win Rate</div>
            </div>
          </div>
        </div>

        {user?.badges && user.badges.length > 0 && (
          <div className="profile-section">
            <h2>Badges</h2>
            <div className="badges-grid">
              {user.badges.map((badge, index) => (
                <div key={index} className="badge-card">
                  <div className="badge-icon">🏅</div>
                  <div className="badge-name">{badge}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="profile-section">
          <h2>Battle History</h2>
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          ) : history.length > 0 ? (
            <div className="history-list">
              {history.map((battle) => {
                const myData = battle.players.find(
                  (p) => p.user._id === user._id
                );
                const opponentData = battle.players.find(
                  (p) => p.user._id !== user._id
                );
                const isWinner = battle.winner?._id === user._id;

                return (
                  <div
                    key={battle._id}
                    className={`history-card ${isWinner ? "won" : "lost"}`}
                  >
                    <div className="history-result">
                      {isWinner ? "🏆 Victory" : "😢 Defeat"}
                    </div>
                    <div className="history-details">
                      <div className="history-category">{battle.category}</div>
                      <div className="history-scores">
                        <span className="my-score">{myData?.score || 0}</span>
                        <span className="vs">vs</span>
                        <span className="opponent-score">
                          {opponentData?.score || 0}
                        </span>
                      </div>
                      <div className="history-opponent">
                        vs {opponentData?.user?.fullname || "Unknown"}
                      </div>
                      <div className="history-date">
                        {new Date(battle.playedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="no-data">
              <p>No battle history yet. Start playing to see your history!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
