// NotificationCard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/CalendarStyles.css';

function NotificationCard({id ,title, message, image }) {
  const navigate = useNavigate();

  return (
    <div 
      className="calendar-notif-card" 
      onClick={() => navigate(`/calendarview/${id}`)}
      style={{ cursor: 'pointer' }}
    >
      <div className="calendar-notif-icon">🔔</div>
      <div className="calendar-notif-content">
        <h3>{title}</h3>
        <p>{message}</p>
      </div>
      <div className="calendar-notif-image">
        <img src={image} alt="notification" />
      </div>
    </div>
  );
}

export default NotificationCard;
