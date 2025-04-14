
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container d-flex flex-column justify-content-center align-items-center text-center px-3">
      <div className="content animate__animated animate__fadeIn">
        <h1 className="display-4 fw-bold mb-3 text-white shadow-text">🏪 Store Rating System</h1>
        <p className="lead text-white mb-4 shadow-text">
          Rate, Review and Manage Stores Seamlessly! <br /> Built for Admins, Owners, and Users.
        </p>
        <div>
          <button className="btn btn-primary me-3 px-4 py-2" onClick={() => navigate('/login')}>Login</button>
          <button className="btn btn-outline-light px-4 py-2" onClick={() => navigate('/register')}>Register</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
