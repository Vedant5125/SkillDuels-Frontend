import { useState, useEffect } from "react";
import axios from "axios";
import "./Leaderboard.css";

const Leaderboard = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get("/api/battles/leaderboard");
      setPlayers(response.data.data);
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const getMedalIcon = (position) => {
    if (position === 0) return "🥇";
    if (position === 1) return "🥈";
    if (position === 2) return "🥉";
    return null;
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

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="leaderboard-page">
      <div className="container">
        <div className="leaderboard-header">
          <h1>Global Leaderboard</h1>
          <p>Top players competing worldwide</p>
        </div>

        <div className="leaderboard-card">
          <div className="leaderboard-table">
            <div className="table-header">
              <div className="col-rank">Rank</div>
              <div className="col-player">Player</div>
              <div className="col-stats">XP</div>
              <div className="col-stats">Wins</div>
              <div className="col-stats">Rank</div>
            </div>

            {players.map((player, index) => (
              <div key={player._id} className="table-row">
                <div className="col-rank">
                  {getMedalIcon(index) || (
                    <span className="rank-number">#{index + 1}</span>
                  )}
                </div>
                <div className="col-player">
                  <div className="player-info">
                    <div className="player-avatar">
                      {player.fullname.charAt(0).toUpperCase()}
                    </div>
                    <div className="player-name">{player.fullname}</div>
                  </div>
                </div>
                <div className="col-stats">
                  <span className="xp-badge">{player.xp} XP</span>
                </div>
                <div className="col-stats">
                  <span className="wins-badge">{player.stats?.wins || 0}</span>
                </div>
                <div className="col-stats">
                  <span
                    className="rank-badge"
                    style={{ background: getRankColor(player.rank) }}
                  >
                    {player.rank}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {players.length === 0 && (
            <div className="no-data">
              <p>No players on the leaderboard yet. Be the first!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
