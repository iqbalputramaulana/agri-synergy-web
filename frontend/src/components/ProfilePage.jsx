// components/ProfilePage.jsx
import React from 'react';
import '../css/ProfilePage.css';
import { FaUser, FaPhone, FaEnvelope, FaLock } from 'react-icons/fa';

function ProfilePage() {
  return (
    <div className="profile-page">
      <h2 className='dropshipper-page-h2'>Basic Information</h2>
      <div className="profile-section">
        <div className="profile-image-section">
          <img
            src="https://via.placeholder.com/100" // Placeholder untuk foto profil
            alt="Profile"
            className="profile-image"
          />
          <button className="choose-file-button">Choose File</button>
        </div>
        <div className="profile-details-section">
          <div className="input-group">
            <FaUser className="input-icon" />
            <input type="text" placeholder="Nama" />
          </div>
          <div className="input-group">
            <FaPhone className="input-icon" />
            <input type="text" placeholder="Nomor Handphone" />
          </div>
          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input type="email" placeholder="email@gmail.com" />
          </div>
          <button className="update-button">Update</button>
        </div>
      </div>

      <h2 className='dropshipper-page-h2'>Update Password</h2>
      <div className="password-section">
        <div className="input-group">
          <FaLock className="input-icon" />
          <input type="password" placeholder="Current Password" />
        </div>
        <div className="input-group">
          <FaLock className="input-icon" />
          <input type="password" placeholder="New Password" />
        </div>
        <div className="input-group">
          <FaLock className="input-icon" />
          <input type="password" placeholder="Confirm Password" />
        </div>
        <button className="update-button">Update</button>
      </div>
    </div>
  );
}

export default ProfilePage;
