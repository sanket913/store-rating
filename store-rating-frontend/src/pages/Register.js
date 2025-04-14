import React, { useState } from 'react';
import './Register.css'; 
import API from '../api'; 

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '', role: 'user' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', form);
      alert('Registered! Now login.');
      window.location.href = '/login';
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h2 className="form-title">Register</h2>

        <div className="input-group">
          <input 
            placeholder="Name" 
            onChange={(e) => setForm({ ...form, name: e.target.value })} 
            className="input-field" 
          />
        </div>

        <div className="input-group">
          <input 
            placeholder="Email" 
            onChange={(e) => setForm({ ...form, email: e.target.value })} 
            className="input-field" 
          />
        </div>

        <div className="input-group">
          <input 
            placeholder="Address" 
            onChange={(e) => setForm({ ...form, address: e.target.value })} 
            className="input-field" 
          />
        </div>

        <div className="input-group">
          <input 
            type="password" 
            placeholder="Password" 
            onChange={(e) => setForm({ ...form, password: e.target.value })} 
            className="input-field" 
          />
        </div>

        <div className="input-group">
          <select 
            onChange={(e) => setForm({ ...form, role: e.target.value })} 
            className="input-field"
          >
            <option value="user">Normal User</option>
            <option value="owner">Store Owner</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button type="submit" className="submit-button">Register</button>

        <p className="text-center text-muted mt-3">Already have an account? <a href="/login">Login</a></p>
      </form>
    </div>
  );
};

export default Register;
