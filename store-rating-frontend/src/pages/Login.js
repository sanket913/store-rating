import React, { useState } from 'react';
import API from '../api';
import './Login.css';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      const role = res.data.user.role;
      if (role === 'admin') window.location.href = '/admin';
      else if (role === 'owner') window.location.href = '/owner';
      else window.location.href = '/user';
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div className="login-page d-flex align-items-center justify-content-center">
      <div className="login-box shadow-lg">
        <h2 className="text-center mb-4 text-primary">🔐 Login to Store Rating</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="form-control mb-3"
            required
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            className="form-control mb-3"
            required
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
        <p className="text-center text-muted mt-3">Don't have an account? <a href="/register">Register</a></p>
      </div>
    </div>
  );
};

export default Login;
