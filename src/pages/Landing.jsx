import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Landing.css";

const Landing = () => {
  const { user } = useAuth();

  return (
    <div className="landing">
      <div className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Welcome to <span className="gradient-text">SkillDuels</span>
            </h1>
            <p className="hero-subtitle">
              Challenge your peers in real-time quiz battles. Earn XP, climb the
              leaderboard, and become the ultimate champion!
            </p>
            <div className="hero-actions">
              {user ? (
                <Link to="/dashboard" className="btn btn-primary btn-large">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary btn-large">
                    Get Started
                  </Link>
                  <Link to="/login" className="btn btn-outline btn-large">
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="features">
        <div className="container">
          <h2 className="section-title">Why SkillDuels?</h2>
          <div className="grid grid-3">
            <div className="feature-card">
              <div className="feature-icon">⚔️</div>
              <h3>Real-Time Battles</h3>
              <p>
                Compete against players worldwide in thrilling 1v1 quiz matches
                with live score updates.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏆</div>
              <h3>Earn Rewards</h3>
              <p>
                Gain XP, unlock badges, and climb ranks as you win more battles
                and improve your skills.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Track Progress</h3>
              <p>
                Monitor your stats, view battle history, and see how you rank
                against others on the leaderboard.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="categories">
        <div className="container">
          <h2 className="section-title">Quiz Categories</h2>
          <div className="grid grid-2">
            <div className="category-card">
              <h3>Technical</h3>
              <p>Programming, algorithms, data structures, and more</p>
            </div>
            <div className="category-card">
              <h3>Aptitude</h3>
              <p>Logical reasoning, quantitative ability, and problem solving</p>
            </div>
            <div className="category-card">
              <h3>General Knowledge</h3>
              <p>History, geography, current affairs, and general awareness</p>
            </div>
            <div className="category-card">
              <h3>Logical</h3>
              <p>Puzzles, patterns, and critical thinking challenges</p>
            </div>
          </div>
        </div>
      </div>

      <div className="cta">
        <div className="container">
          <h2>Ready to Start Your Journey?</h2>
          {!user && (
            <Link to="/register" className="btn btn-primary btn-large">
              Join SkillDuels Now
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Landing;
