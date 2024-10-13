import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/UserPointPage.css";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti";

const UserPointPage: React.FC = () => {
  const [points, setPoints] = useState<number | null>(null);
  const [level, setLevel] = useState<number>(1);
  const [dollars, setDollars] = useState<number>(0); 
  const [error, setError] = useState<string | null>(null);
  const [nextReward, setNextReward] = useState<number>(100); 
  const [isLevelUp, setIsLevelUp] = useState<boolean>(false); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserPoints = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          setError("User not authenticated");
          return;
        }

        const response = await axios.get("http://localhost:3009/users/points", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userPoints = response.data.points;
        setPoints(userPoints);

        const calculatedLevel = Math.floor(userPoints / 100) + 1;
        setLevel(calculatedLevel);
        setNextReward(calculatedLevel * 100);
        setDollars((calculatedLevel - 1) * 10); 
      } catch (err) {
        setError("Error fetching user points");
      }
    };

    fetchUserPoints();
  }, []);

  const progressPercentage = points ? points % 100 : 0;

  useEffect(() => {
    if (points && points >= nextReward) {
      setIsLevelUp(true);
      setTimeout(() => setIsLevelUp(false), 5000); 
    }
  }, [points, nextReward]);

  return (
    <div className="points-page">
      {isLevelUp && (
        <Confetti width={window.innerWidth} height={window.innerHeight} />
      )}
      <div>
        <h1>Your Points and Rewards</h1>
        {error && <p className="error">{error}</p>}
        {points !== null ? (
          <div>
            <p className="dollars">Total Dollars Earned: ${dollars}</p>
            <p className="points">Your Points: {points}</p>
            <p className="level">Level: {level}</p>
            <p className="next-reward">Next reward at {nextReward} points!</p>
            <div className="progress-bar">
              <div
                className="progress"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            {isLevelUp && <p className="level-up-message">🎉 Level Up! 🎉</p>}
          </div>
        ) : (
          <p className="loading">Loading...</p>
        )}
      </div>
    </div>
  );
};

export default UserPointPage;
