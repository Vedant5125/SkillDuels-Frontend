import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            SkillDuels
          </Link>

          <div className="navbar-links">
            <Link to="/leaderboard" className="nav-link">
              Leaderboard
            </Link>

            {user ? (
              <>
                <Link to="/dashboard" className="nav-link">
                  Dashboard
                </Link>
                <Link to="/profile" className="nav-link">
                  Profile
                </Link>
                {user.role === "host" && (
                  <Link to="/admin" className="nav-link">
                    Admin
                  </Link>
                )}
                <div className="user-info">
                  <span className="user-name">{user.fullname}</span>
                  <span className="user-xp">{user.xp} XP</span>
                </div>
                <button onClick={handleLogout} className="btn btn-outline">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
