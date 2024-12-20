// components/ExpertSidebar.js
import React from 'react';
import { useNavigate } from "react-router-dom";

const ExpertSidebar = ({ experts }) => {
  const navigate = useNavigate();

  return (
    <div className="chat-container">
      <div className='login-button sidebar-chat'>
        <button className="icon-out" onClick={() => navigate('/login')}>Login</button>
      </div>

      <div className="chat-header sidebar-chat">
        <div className='head-expert'>
          <p>Ahli Agribisnis</p>
          <img src="src/assets/many.png" alt="Ahli Agribisnis" />
        </div>

        <div className="expert-list">
          {experts.map(expert => (
            <div key={expert.id} className="expert">
              <img src={expert.avatar} alt={expert.name} className="avatar" />
              <div className='expert-details'>
                <div>{expert.name}</div>
                <span className='status'>{expert.online ? 'online' : 'offline'}</span>
              </div>
            </div>
          ))}
          <p>see more..</p>
        </div>
      </div>
    </div>
  );
};

export default ExpertSidebar;
