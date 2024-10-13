import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/NotificationPage.css";

interface Notification {
  bookId: string;
  borrowerId: string;
  message: string;
  borrowedAt: string;
}

const NotificationPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[] | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          setError("User not authenticated");
          return;
        }
        const response = await axios.get(
          "http://localhost:3009/users/notifications",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setNotifications(response.data.notifications);
      } catch (err) {
        console.log("error", err);
        setError("Failed to load notifications. Please try again later.");
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="notifications-page flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="mt-3 text-7xl">Your Community Impact</h1>
        <p className="mt-2 text-xl">
          See how your books are making a difference in the community!
        </p>
        {error && <p className="error mt-4">{error}</p>}
        {notifications && notifications.length > 0 ? (
          <ul className="notification-list mt-4">
            {notifications.map((notification, index) => (
              <li key={index} className="notification-item mb-6 p-4 shadow-lg">
                <p className="text-lg font-bold mb-2">
                  "{notification.message}"
                </p>
                <p className="text-sm">
                  Borrowed by User ID: {notification.borrowerId}
                </p>
                <p className="text-sm">
                  Borrowed on:{" "}
                  {new Date(notification.borrowedAt).toLocaleString()}
                </p>
                <p className="mt-2 italic text-green-600">
                  Your book is helping others learn and grow. Thank you for
                  being a vital part of our community!
                </p>
                <hr className="my-4" />
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-notifications mt-6 text-xl">
            No contributions yet. Start sharing books and see the difference you
            make!
          </p>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
