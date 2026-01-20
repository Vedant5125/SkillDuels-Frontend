import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";
import "./Battle.css";

const Battle = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { socket } = useSocket();
  const { user, refreshUser } = useAuth();
  const battleData = location.state;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [answered, setAnswered] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);

  const questions = battleData?.quizData || [];
  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    if (!battleData) {
      navigate("/dashboard");
      return;
    }

    // socket?.on("liveUpdate", (data) => {
    //   setOpponentScore(data.opponentScore);
    // });
    socket?.on("liveUpdate", (data) => {
      // Only update opponentScore if the ID is NOT mine
      if (data.playerId !== user?._id) {
        setOpponentScore(data.score);
      }
    });

    return () => {
      socket?.off("liveUpdate");
    };
  }, [battleData, socket, navigate]);

  useEffect(() => {
    if (!answered && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !answered) {
      handleSubmit(null);
    }
  }, [timeLeft, answered]);

  const handleAnswer = (answer) => {
    if (answered) return;
    setSelectedAnswer(answer);
  };

  useEffect(() => {
    socket?.on("matchEnded", (results) => {
        setGameOver(true);
        // Compare your ID to the winnerId from the server
        if (results.winnerId === user?._id) {
            setWinner("You");
        } else if (results.winnerId === "draw") {
            setWinner("Draw");
        } else {
            setWinner("Opponent");
        }
        
        // Sync final scores from server just in case
        const myData = results.p1.id === user?._id ? results.p1 : results.p2;
        const oppData = results.p1.id === user?._id ? results.p2 : results.p1;
        setScore(myData.score);
        setOpponentScore(oppData.score);
    });

    return () => socket?.off("matchEnded");
}, [socket, user]);

  const handleSubmit = (answer) => {
    setAnswered(true);
    const isCorrect = answer === currentQuestion.correctAnswer;

    if (isCorrect) {
      const speedBonus = Math.max(0, 10 - (15 - timeLeft));
      const points = Math.round(10 + speedBonus);
      setScore(score + points);
    }

    socket?.emit("submitAnswer", {
      matchId: battleData.matchId,
      isCorrect,
      timeTaken: (15 - timeLeft) * 1000,
    });

    setShowResult(true);

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setAnswered(false);
        setShowResult(false);
        setTimeLeft(15);
      } else {
        endBattle();
      }
    }, 2000);
  };

  const endBattle = () => {
    setGameOver(true);
    socket?.emit("endMatch", { matchId: battleData.matchId });
    if (score > opponentScore) {
      setWinner("You");
    } else if (opponentScore > score) {
      setWinner("Opponent");
    } else {
      setWinner("Draw");
    }

    try {
      refreshUser();
    } catch (e) {
      console.error("Failed to refresh user stats", e);
    }
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  if (!battleData || !currentQuestion) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="battle-result">
        <div className="container">
          <div className="result-card">
            <div className="result-icon">
              {winner === "You" ? "🏆" : winner === "Draw" ? "🤝" : "😢"}
            </div>
            <h1>
              {winner === "You"
                ? "Victory!"
                : winner === "Draw"
                ? "It's a Draw!"
                : "Defeat!"}
            </h1>
            <div className="final-scores">
              <div className="final-score">
                <div className="score-label">Your Score</div>
                <div className="score-value">{score}</div>
              </div>
              <div className="vs">VS</div>
              <div className="final-score">
                <div className="score-label">Opponent Score</div>
                <div className="score-value">{opponentScore}</div>
              </div>
            </div>
            {winner === "You" && (
              <div className="xp-earned">
                <p>+50 XP Earned!</p>
              </div>
            )}
            <button
              onClick={handleBackToDashboard}
              className="btn btn-primary btn-large"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="battle">
      <div className="container">
        <div className="battle-header">
          <div className="player-score">
            <div className="player-name">You</div>
            <div className="score-display">{score}</div>
          </div>

          <div className="question-progress">
            Question {currentQuestionIndex + 1} / {questions.length}
          </div>

          <div className="player-score">
            <div className="player-name">Opponent</div>
            <div className="score-display">{opponentScore}</div>
          </div>
        </div>

        <div className="timer-bar">
          <div
            className="timer-fill"
            style={{ width: `${(timeLeft / 15) * 100}%` }}
          ></div>
          <div className="timer-text">{timeLeft}s</div>
        </div>

        <div className="question-card">
          <h2 className="question-text">{currentQuestion.question}</h2>

          <div className="options-grid">
            {currentQuestion.options?.map((option, index) => (
              <button
                key={index}
                className={`option-btn ${
                  selectedAnswer === option ? "selected" : ""
                } ${
                  showResult
                    ? option === currentQuestion.correctAnswer
                      ? "correct"
                      : selectedAnswer === option
                      ? "wrong"
                      : ""
                    : ""
                }`}
                onClick={() => handleAnswer(option)}
                disabled={answered}
              >
                {option}
              </button>
            ))}
          </div>

          {selectedAnswer && !answered && (
            <button
              onClick={() => handleSubmit(selectedAnswer)}
              className="btn btn-primary btn-large submit-btn"
            >
              Submit Answer
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Battle;
